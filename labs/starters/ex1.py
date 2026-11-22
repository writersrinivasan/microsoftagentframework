"""Exercise 1 — Create a basic agent. Fill in the TODOs."""
import asyncio

from agent_framework import Agent
from common import make_client


async def main() -> None:
    client = make_client()

    # TODO 1: create an Agent with client, name="HelloAgent" and short instructions
    agent = ...

    # TODO 2: run the agent with a question and print response.text
    ...


if __name__ == "__main__":
    asyncio.run(main())
