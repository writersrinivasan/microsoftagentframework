"""Exercise 3 — Python functions as agent tools."""
import asyncio
from typing import Annotated

from pydantic import Field

from agent_framework import Agent, tool
from common import make_client


# TODO 1: decorate with @tool and add Annotated/Field descriptions
def profit_margin(revenue: float, cost: float) -> str:
    """Calculate profit and profit margin percentage."""
    # TODO 2: return a string like "profit=..., margin=...%"
    ...


# TODO 3: add a second tool, e.g. growth_rate(start, end) or break_even(fixed_cost, price, unit_cost)


async def main() -> None:
    agent = Agent(
        client=make_client(),
        name="FinanceAgent",
        instructions="You are a finance analyst. ALWAYS use tools for numbers.",
        tools=[],  # TODO 4: register your tools
    )
    response = await agent.run("Revenue was 602500 and cost 264250. What is our margin?")
    print(response.text)


if __name__ == "__main__":
    asyncio.run(main())
