"""Exercise 4 — Multi-turn sessions, context providers and memory (Module 4)."""

import asyncio
import json
from typing import Any

from agent_framework import Agent, AgentSession, ContextProvider, SessionContext, SupportsAgentRun
from common import make_client


class CustomerProfileProvider(ContextProvider):
    """Injects long-lived facts before every run and learns new ones afterwards."""

    def __init__(self) -> None:
        super().__init__(source_id="customer_profile")

    async def before_run(
        self, *, agent: SupportsAgentRun, session: AgentSession, context: SessionContext, state: dict[str, Any]
    ) -> None:
        profile = state.setdefault("profile", {"company": "Contoso Retail", "tier": "Gold"})
        context.extend_instructions(self.source_id, f"Known customer profile: {json.dumps(profile)}")

    async def after_run(
        self, *, agent: SupportsAgentRun, session: AgentSession, context: SessionContext, state: dict[str, Any]
    ) -> None:
        # Toy "memory extraction": remember the budget if the user mentions one
        for message in context.get_messages():
            text = message.text or ""
            if "budget" in text.lower():
                state["profile"]["budget_note"] = text[:120]


async def main() -> None:
    agent = Agent(
        client=make_client(),
        name="AccountManager",
        instructions="You are a helpful account manager. Use the customer profile when relevant.",
        context_providers=[CustomerProfileProvider()],
    )

    # A session holds conversation state across turns
    session = agent.create_session()

    turns = [
        "Hi! We want to roll out AI Copilot to our support team. Our budget is $40k.",
        "Which plan fits us?",
        "Remind me — what budget did I mention, and what tier are we?",  # follow-up needs memory
    ]
    for turn in turns:
        reply = await agent.run(turn, session=session)
        print(f"\nUSER: {turn}\nAGENT: {reply.text}")

    # Sessions are serialisable -> store in Redis/Cosmos/DB and resume later
    saved = session.to_dict()
    print("\nSession keys:", list(saved.keys()))
    restored = AgentSession.from_dict(saved)
    reply = await agent.run("One-line summary of our chat?", session=restored)
    print("\nRESUMED:", reply.text)


if __name__ == "__main__":
    asyncio.run(main())
