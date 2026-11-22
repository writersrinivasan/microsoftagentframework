"""Exercise 5 — Specialised agents + coordinator."""
import asyncio

from agent_framework import Agent
from common import make_client

client = make_client()

# TODO 1: create ResearchAgent, AnalysisAgent and RecommendationAgent
#         (give each a name, a one-line description and focused instructions)
research = ...
analysis = ...
recommendation = ...

# TODO 2: create a Coordinator whose tools are the specialists wrapped with .as_tool()
coordinator = ...


async def main() -> None:
    result = await coordinator.run("Our SaaS churn rose from 3% to 5%. What should we do?")
    print(result.text)


if __name__ == "__main__":
    asyncio.run(main())
