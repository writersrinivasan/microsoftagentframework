"""Exercise 1 — Create a basic agent (Modules 1 & 2)."""

import asyncio

from agent_framework import Agent
from common import make_client


async def main() -> None:
    # 1. A chat client = the connection to a model provider
    client = make_client()

    # 2. An agent = client + instructions (+ optional name, tools, memory ...)
    agent = Agent(
        client=client,
        name="HelloAgent",
        instructions="You are a friendly assistant. Answer in two sentences or fewer.",
    )

    # 3. Run it — one request in, one AgentResponse out
    response = await agent.run("What is Microsoft Agent Framework in one line?")
    print(response.text)


if __name__ == "__main__":
    asyncio.run(main())
