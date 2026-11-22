"""Exercise 3 — Python functions as agent tools (Module 3)."""

import asyncio
from pathlib import Path
from typing import Annotated

import pandas as pd
from pydantic import Field

from agent_framework import Agent, tool
from common import make_client

SALES = pd.read_csv(Path(__file__).parent / "data" / "sales.csv")


@tool
def profit_margin(
    revenue: Annotated[float, Field(description="Total revenue")],
    cost: Annotated[float, Field(description="Total cost")],
) -> str:
    """Calculate profit and profit margin percentage."""
    profit = revenue - cost
    margin = (profit / revenue) * 100 if revenue else 0
    return f"profit={profit:,.0f}, margin={margin:.1f}%"


@tool
def sales_summary(
    region: Annotated[str | None, Field(description="North or South; omit for all")] = None,
    product: Annotated[str | None, Field(description="Cloud Suite or AI Copilot; omit for all")] = None,
) -> str:
    """Return monthly revenue, cost and units from the company sales dataset."""
    df = SALES
    if region:
        df = df[df.region.str.lower() == region.lower()]
    if product:
        df = df[df["product"].str.lower() == product.lower()]
    if df.empty:
        return "No rows match that filter."
    return df.groupby("month")[["units", "revenue", "cost"]].sum().to_string()


@tool(approval_mode="never_require")
def growth_rate(
    start: Annotated[float, Field(description="Starting value")],
    end: Annotated[float, Field(description="Ending value")],
) -> str:
    """Percentage growth between two values."""
    return f"{((end - start) / start) * 100:.1f}%"


async def main() -> None:
    agent = Agent(
        client=make_client(),
        name="FinanceAgent",
        instructions=(
            "You are a finance analyst. ALWAYS use tools for numbers — never do mental math. "
            "Show the figures you used."
        ),
        tools=[profit_margin, sales_summary, growth_rate],
    )

    question = "How did AI Copilot revenue grow in the North from Jan to Mar, and what was the Q1 margin?"
    response = await agent.run(question)
    print(response.text)

    # Peek at what happened under the hood: function calls & results are messages too
    for message in response.messages:
        for content in message.contents:
            if content.type == "function_call":
                print(f"  -> call   {content.name}({content.arguments})")
            elif content.type == "function_result":
                print(f"  <- result {content.result}")


if __name__ == "__main__":
    asyncio.run(main())
