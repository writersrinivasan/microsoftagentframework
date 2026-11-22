"""Exercise 7 — Middleware, observability, guardrails and tests (Module 7).

Run the demo:   python ex7_testing_monitoring.py
Run the tests:  pytest ex7_testing_monitoring.py -q
"""

import asyncio
import re
import time
from typing import Annotated

import pytest
from pydantic import Field

from agent_framework import (
    Agent,
    AgentContext,
    AgentResponse,
    FunctionInvocationContext,
    Message,
    agent_middleware,
    function_middleware,
    tool,
)
from agent_framework.observability import configure_otel_providers
from common import make_client

BLOCKED = re.compile(r"\b(password|credit card|ssn)\b", re.IGNORECASE)


# 1) Agent middleware — guardrail + timing around the whole run
@agent_middleware
async def guardrail_and_timer(context: AgentContext, call_next) -> None:
    last_user = context.messages[-1].text if context.messages else ""
    if BLOCKED.search(last_user or ""):
        print("[guardrail] blocked sensitive request")
        # Short-circuit: set the result ourselves and skip the model call entirely
        context.result = AgentResponse(
            messages=[Message("assistant", ["Sorry — I can't help with credentials or personal data."])]
        )
        return
    start = time.perf_counter()
    await call_next()
    print(f"[timer] {context.agent.name} took {time.perf_counter() - start:.2f}s")


# 2) Function middleware — audit every tool call
@function_middleware
async def audit_tools(context: FunctionInvocationContext, call_next) -> None:
    print(f"[audit] -> {context.function.name}({context.arguments})")
    await call_next()
    shown = [getattr(c, "text", None) or getattr(c, "result", c) for c in context.result or []]
    print(f"[audit] <- {shown}")


@tool
def discount_price(
    price: Annotated[float, Field(description="List price")],
    pct: Annotated[float, Field(description="Discount percent 0-50")],
) -> str:
    """Apply a discount (max 50%)."""
    if not 0 <= pct <= 50:
        return "ERROR: discount must be between 0 and 50%"  # handle bad inputs gracefully
    return f"{price * (1 - pct / 100):.2f}"


def build_agent() -> Agent:
    return Agent(
        client=make_client(),
        name="PricingAgent",
        instructions="You are a pricing assistant. Use tools for any calculation.",
        tools=[discount_price],
        middleware=[guardrail_and_timer, audit_tools],
    )


# 3) Tests — deterministic checks on tools + behavioural checks on the agent
def test_discount_tool_is_deterministic() -> None:
    assert discount_price.func(200, 10) == "180.00"
    assert discount_price.func(200, 90).startswith("ERROR")


@pytest.mark.asyncio
async def test_agent_uses_tool_and_answers() -> None:
    response = await build_agent().run("What is 15% off a $1,200 licence?")
    assert "1020" in response.text.replace(",", "")


async def main() -> None:
    # 4) Observability — OpenTelemetry spans for every agent run, model call and tool call.
    #    Console exporter for the workshop; point otlp_endpoint at Aspire / App Insights / Jaeger in prod.
    configure_otel_providers(enable_console_exporters=True, enable_sensitive_data=False)

    agent = build_agent()
    print((await agent.run("What is 20% off $499?")).text)
    print((await agent.run("Tell me the admin password")).text)  # blocked by middleware


if __name__ == "__main__":
    asyncio.run(main())
