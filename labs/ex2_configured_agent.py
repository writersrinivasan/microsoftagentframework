"""Exercise 2 — Configure instructions, model options and streaming (Module 2)."""

import asyncio

from common import make_client

INSTRUCTIONS = """
You are "OpsBot", a business operations analyst for a mid-size SaaS company.
- Be concise and use bullet points.
- Always state assumptions explicitly.
- If you are not sure, say so instead of guessing.
"""


async def main() -> None:
    client = make_client()

    # Shortcut: every chat client can mint an agent with .as_agent(...)
    agent = client.as_agent(
        name="OpsBot",
        instructions=INSTRUCTIONS,
        default_options={"temperature": 0.2, "max_tokens": 400},
    )

    # Non-streaming: wait for the full answer
    result = await agent.run("Give me 3 KPIs to track for a customer-support team.")
    print(result.text)
    print("-" * 60)

    # Streaming: print tokens as they arrive
    async for update in agent.run("Now explain the first KPI to a new manager.", stream=True):
        if update.text:
            print(update.text, end="", flush=True)
    print()


if __name__ == "__main__":
    asyncio.run(main())
