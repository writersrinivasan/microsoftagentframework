"""Exercise 5 — Specialised agents + a coordinator that delegates (Module 5)."""

import asyncio

from agent_framework import Agent
from common import make_client

client = make_client()

research = Agent(
    client=client,
    name="ResearchAgent",
    description="Collects relevant facts, market context and data points for a business question.",
    instructions="You gather facts. Return 5-7 bullet points of evidence. No recommendations.",
)

analysis = Agent(
    client=client,
    name="AnalysisAgent",
    description="Evaluates evidence and extracts key insights, risks and opportunities.",
    instructions="You analyse evidence. Output: Key insights (3), Risks (2), Opportunities (2).",
)

recommendation = Agent(
    client=client,
    name="RecommendationAgent",
    description="Turns insights into prioritised, actionable business recommendations.",
    instructions="You write 3 prioritised recommendations, each with owner, KPI and 30/60/90-day step.",
)

# Agent-to-agent: wrap specialists as tools the coordinator can call (delegation)
coordinator = Agent(
    client=client,
    name="Coordinator",
    instructions=(
        "You coordinate a team. For any business request: "
        "1) call ResearchAgent, 2) pass its output to AnalysisAgent, "
        "3) pass the insights to RecommendationAgent, then 4) consolidate a final brief "
        "with sections: Summary, Insights, Recommendations."
    ),
    tools=[research.as_tool(), analysis.as_tool(), recommendation.as_tool()],
)


async def main() -> None:
    request = "Our SaaS churn rose from 3% to 5% this quarter. What should we do?"
    result = await coordinator.run(request)
    print(result.text)


if __name__ == "__main__":
    asyncio.run(main())
