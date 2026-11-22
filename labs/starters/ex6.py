"""Exercise 6 — Orchestrate agents with workflows."""
import asyncio

from agent_framework import Agent
from agent_framework.orchestrations import ConcurrentBuilder, SequentialBuilder
from common import make_client

client = make_client()
research = Agent(client=client, name="Research", instructions="Collect 5 bullet facts.")
analysis = Agent(client=client, name="Analysis", instructions="List 3 key insights.")
recommend = Agent(client=client, name="Recommendation", instructions="Give 3 recommendations.")


async def main() -> None:
    task = "Should we expand our AI Copilot product into Europe next year?"

    # TODO 1: build a SequentialBuilder workflow (output_from="all") and print each agent's reply
    ...

    # TODO 2: build a ConcurrentBuilder workflow with Finance / Operations / Risk agents
    ...

    # STRETCH: use WorkflowBuilder(start_executor=...).add_edge(...) to build the same graph by hand


if __name__ == "__main__":
    asyncio.run(main())
