"""Exercise 6 — Sequential, concurrent and graph workflows (Module 6)."""

import asyncio

from agent_framework import Agent, AgentExecutorResponse, WorkflowBuilder, WorkflowContext, executor
from agent_framework.orchestrations import ConcurrentBuilder, SequentialBuilder
from common import make_client

client = make_client()


def make_agent(name: str, instructions: str) -> Agent:
    return Agent(client=client, name=name, instructions=instructions)


research = make_agent("Research", "Collect 5 bullet facts about the request.")
analysis = make_agent("Analysis", "From the conversation so far, list 3 key insights.")
recommend = make_agent("Recommendation", "Give 3 actionable recommendations based on the insights.")


# --- A) Sequential: Research -> Analysis -> Recommendation -------------------
async def run_sequential(task: str) -> None:
    # output_from="all" -> collect every agent's response, not just the last one
    workflow = SequentialBuilder(participants=[research, analysis, recommend], output_from="all").build()
    result = await workflow.run(task)
    for response in result.get_outputs():  # each agent saw the conversation so far
        for msg in response.messages:
            print(f"[{msg.author_name}] {msg.text[:300]}\n")


# --- B) Concurrent: fan-out to three lenses, fan-in the answers -------------
async def run_concurrent(task: str) -> None:
    finance = make_agent("Finance", "Assess the request from a financial lens in 3 bullets.")
    ops = make_agent("Operations", "Assess the request from an operations lens in 3 bullets.")
    risk = make_agent("Risk", "Assess the request from a risk/compliance lens in 3 bullets.")
    workflow = ConcurrentBuilder(participants=[finance, ops, risk]).build()
    result = await workflow.run(task)
    aggregated = result.get_outputs()[-1]  # default aggregator: one message per agent
    for msg in aggregated.messages:
        print(f"[{msg.author_name}] {msg.text[:300]}\n")


# --- C) Graph workflow: explicit executors + edges --------------------------
@executor(id="publisher")
async def publisher(response: AgentExecutorResponse, ctx: WorkflowContext[None, str]) -> None:
    """A plain-Python node: format the last agent output as the workflow result."""
    await ctx.yield_output(f"FINAL BRIEF\n===========\n{response.agent_response.text}")


async def run_graph(task: str) -> None:
    workflow = (
        WorkflowBuilder(start_executor=research)
        .add_edge(research, analysis)
        .add_edge(analysis, recommend)
        .add_edge(recommend, publisher)
        .build()
    )
    # Stream events to watch each executor fire
    async for event in workflow.run(task, stream=True):
        if event.type == "executor_invoked":
            print(f"  > running {event.executor_id}")
        elif event.type == "output" and isinstance(event.data, str):  # skip token-level agent updates
            print(event.data)


async def main() -> None:
    task = "Should we expand our AI Copilot product into the European market next year?"
    print("=== SEQUENTIAL ===")
    await run_sequential(task)
    print("=== CONCURRENT ===")
    await run_concurrent(task)
    print("=== GRAPH ===")
    await run_graph(task)


if __name__ == "__main__":
    asyncio.run(main())
