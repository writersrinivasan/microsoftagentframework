"""Exercise 2 — Configure instructions, options and streaming."""
import asyncio

from common import make_client

# TODO 1: write a persona + rules for "OpsBot", a business operations analyst
INSTRUCTIONS = """
"""


async def main() -> None:
    client = make_client()

    # TODO 2: use client.as_agent(...) with name, instructions and
    #         default_options={"temperature": ..., "max_tokens": ...}
    agent = ...

    # TODO 3: stream the answer token by token using agent.run(..., stream=True)
    ...


if __name__ == "__main__":
    asyncio.run(main())
