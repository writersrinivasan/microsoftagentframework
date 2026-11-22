"""Exercise 7 — Middleware, observability and tests."""
import asyncio

from agent_framework import Agent, AgentContext, FunctionInvocationContext, agent_middleware, function_middleware
from agent_framework.observability import configure_otel_providers
from common import make_client


@agent_middleware
async def timer(context: AgentContext, call_next) -> None:
    # TODO 1: measure and print how long the agent run takes around call_next()
    await call_next()


@function_middleware
async def audit(context: FunctionInvocationContext, call_next) -> None:
    # TODO 2: print the tool name + arguments before, and the result after
    await call_next()


# TODO 3: add a guardrail middleware that blocks prompts containing "password"
#         by setting context.result and returning WITHOUT calling call_next()


# TODO 4: write a pytest test that asserts a tool returns the right value


async def main() -> None:
    configure_otel_providers(enable_console_exporters=True)
    agent = Agent(client=make_client(), instructions="Be helpful.", middleware=[timer, audit])
    print((await agent.run("Hello!")).text)


if __name__ == "__main__":
    asyncio.run(main())
