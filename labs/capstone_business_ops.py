"""Capstone — Multi-Agent Business Operations Assistant.

Flow (matches the workshop architecture):
  User request -> Coordinator (plan) -> Research -> Analysis -> Recommendation
               -> HUMAN APPROVAL (human-in-the-loop) -> Coordinator (consolidate) -> Final brief

Built with the *functional* workflow API: plain async Python + @step for
caching/checkpointing + ctx.request_info() for human approval.
"""

import asyncio

from agent_framework import Agent, RunContext, step, workflow
from common import make_client

client = make_client()

coordinator = Agent(
    client=client,
    name="Coordinator",
    instructions=(
        "You are the coordinator of a business operations team. "
        "When PLANNING: restate the goal and list 3 research questions. "
        "When CONSOLIDATING: write an executive brief with Summary, Key Insights, "
        "Recommendations and Next Steps. Max 250 words."
    ),
)
research = Agent(client=client, name="Research", instructions="Answer the research questions with concise, factual bullets.")
analysis = Agent(client=client, name="Analysis", instructions="Identify 3 insights, 2 risks and 2 opportunities from the research.")
recommender = Agent(client=client, name="Recommendation", instructions="Produce 3 prioritised, actionable recommendations with a KPI each.")


@step
async def plan(request: str) -> str:
    return (await coordinator.run(f"PLANNING. Request: {request}")).text


@step
async def do_research(plan_text: str) -> str:
    return (await research.run(plan_text)).text


@step
async def do_analysis(findings: str) -> str:
    return (await analysis.run(findings)).text


@step
async def do_recommend(insights: str) -> str:
    return (await recommender.run(insights)).text


@step
async def consolidate(request: str, insights: str, recs: str, reviewer_note: str) -> str:
    prompt = (
        f"CONSOLIDATING. Original request: {request}\n\nInsights:\n{insights}\n\n"
        f"Recommendations:\n{recs}\n\nReviewer note: {reviewer_note}"
    )
    return (await coordinator.run(prompt)).text


@workflow(name="business_ops_assistant")
async def business_ops(request: str, ctx: RunContext) -> str:
    plan_text = await plan(request)
    findings = await do_research(plan_text)
    insights = await do_analysis(findings)
    recs = await do_recommend(insights)

    # Human-in-the-loop: pause and ask a manager to approve / annotate
    note = await ctx.request_info(
        {"question": "Approve these recommendations? Add a note or type 'approve'.", "draft": recs},
        response_type=str,
        request_id="manager_approval",
    )
    return await consolidate(request, insights, recs, note)


async def main() -> None:
    request = input("Business request: ") or "Reduce customer onboarding time by 30% next quarter."
    wf = business_ops.build()

    result = await wf.run(request)
    pending = result.get_request_info_events()
    if pending:
        event = pending[0]
        print("\n--- DRAFT FOR REVIEW ---\n", event.data["draft"])
        note = input("\nManager note (or 'approve'): ") or "approve"
        result = await wf.run(responses={event.request_id: note})  # resume; cached steps are not re-run

    print("\n=== FINAL BRIEF ===\n", result.get_outputs()[-1])


if __name__ == "__main__":
    asyncio.run(main())
