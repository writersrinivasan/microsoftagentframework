/**
 * Grounding for the AI tutor / code reviewer. Verified against agent-framework-core 1.26.0.
 * LLMs often suggest the 2025 preview API (ChatAgent, create_agent, get_new_thread, run_stream,
 * @ai_function). This sheet keeps answers on the current API.
 */
export const MAF_CHEATSHEET = `
MICROSOFT AGENT FRAMEWORK (Python) — CURRENT API (agent-framework-core 1.26)
pip install agent-framework-core agent-framework-openai agent-framework-orchestrations

CLIENTS
from agent_framework.openai import OpenAIChatCompletionClient   # Chat Completions (Groq, Ollama, Azure OpenAI)
from agent_framework.openai import OpenAIChatClient             # OpenAI *Responses* API
client = OpenAIChatCompletionClient(model="llama-3.3-70b-versatile", api_key=KEY, base_url="https://api.groq.com/openai/v1")
Azure: OpenAIChatCompletionClient(model=deployment, azure_endpoint=..., credential=AzureCliCredential())
Other provider packages: agent_framework.foundry, .azure, .anthropic, .ollama, .gemini, .mistral, .amazon

AGENTS
from agent_framework import Agent
agent = Agent(client=client, name="X", instructions="...", tools=[...], context_providers=[...], middleware=[...], default_options={"temperature":0.2})
agent = client.as_agent(name=..., instructions=..., tools=...)        # shortcut
resp = await agent.run("question")          -> AgentResponse; resp.text, resp.messages
async for upd in agent.run("q", stream=True): print(upd.text, end="")

TOOLS
from agent_framework import tool
@tool
def f(x: Annotated[float, Field(description="...")]) -> str: """docstring = tool description"""
@tool(approval_mode="always_require")  # human approval for risky tools
agent.as_tool()  -> wrap an agent as a tool for another agent (agent-to-agent delegation)

SESSIONS & MEMORY
session = agent.create_session(); await agent.run("...", session=session)   # multi-turn; InMemoryHistoryProvider auto-added
session.to_dict() / AgentSession.from_dict(d)    # persist & resume
class MyProvider(ContextProvider):  # from agent_framework import ContextProvider, SessionContext
    def __init__(self): super().__init__(source_id="mine")
    async def before_run(self, *, agent, session, context, state): context.extend_instructions(self.source_id, "...")
    async def after_run(self, *, agent, session, context, state): ...   # learn / store memories in state
Built-ins: InMemoryHistoryProvider, FileHistoryProvider, MemoryContextProvider, VectorCollectionContextProvider, agent_framework.redis, agent_framework.mem0

WORKFLOWS
from agent_framework.orchestrations import SequentialBuilder, ConcurrentBuilder, HandoffBuilder, GroupChatBuilder, MagenticBuilder
wf = SequentialBuilder(participants=[a, b, c], output_from="all").build(); result = await wf.run("task"); result.get_outputs()
wf = ConcurrentBuilder(participants=[a, b, c]).build()           # fan-out / fan-in
from agent_framework import WorkflowBuilder, executor, WorkflowContext, AgentExecutorResponse
wf = WorkflowBuilder(start_executor=a).add_edge(a, b).add_fan_out_edges(b, [c, d]).add_fan_in_edges([c, d], e).build()
@executor(id="x") async def x(msg: AgentExecutorResponse, ctx: WorkflowContext[None, str]): await ctx.yield_output("...")
async for event in wf.run("task", stream=True): event.type in {"executor_invoked","output","request_info",...}
Functional: from agent_framework import workflow, step, RunContext
@workflow async def wf(inp: str, ctx: RunContext): ...; note = await ctx.request_info({"q": "approve?"}, response_type=str, request_id="approve")
instance = wf.build(); r = await instance.run("x"); ev = r.get_request_info_events()[0]; r = await instance.run(responses={ev.request_id: "ok"})

MIDDLEWARE & OBSERVABILITY
from agent_framework import agent_middleware, function_middleware, chat_middleware, AgentContext, FunctionInvocationContext
@agent_middleware async def mw(context: AgentContext, call_next): ...; await call_next(); ...
Short-circuit: set context.result = AgentResponse(messages=[Message("assistant", ["blocked"])]) and return without call_next()
from agent_framework.observability import configure_otel_providers; configure_otel_providers(enable_console_exporters=True)
Testing: call tool.func(...) directly for deterministic unit tests; pytest-asyncio for agent runs.

Microsoft Agent Framework is the successor that unifies Semantic Kernel (enterprise features: telemetry, filters, connectors)
and AutoGen (multi-agent orchestration patterns).
`.trim();
