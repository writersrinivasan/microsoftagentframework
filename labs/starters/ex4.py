"""Exercise 4 — Multi-turn sessions and context providers."""
import asyncio
from typing import Any

from agent_framework import Agent, AgentSession, ContextProvider, SessionContext, SupportsAgentRun
from common import make_client


class CustomerProfileProvider(ContextProvider):
    def __init__(self) -> None:
        super().__init__(source_id="customer_profile")

    async def before_run(
        self, *, agent: SupportsAgentRun, session: AgentSession, context: SessionContext, state: dict[str, Any]
    ) -> None:
        # TODO 1: read/initialise state["profile"] and add it to the instructions
        #         using context.extend_instructions(self.source_id, "...")
        ...


async def main() -> None:
    agent = Agent(
        client=make_client(),
        instructions="You are a helpful account manager.",
        context_providers=[],  # TODO 2: plug in CustomerProfileProvider()
    )

    # TODO 3: create a session and run 3 turns where the last one is a follow-up
    #         question that only makes sense if the agent remembers turn 1
    ...


if __name__ == "__main__":
    asyncio.run(main())
