export type VisualKey =
  | "evolution"
  | "architecture"
  | "agentVsWorkflow"
  | "useCases"
  | "agentAnatomy"
  | "runLoop"
  | "providers"
  | "toolSequence"
  | "toolAnatomy"
  | "sessionMemory"
  | "memoryTypes"
  | "teamTopology"
  | "seqVsConcurrent"
  | "orchestrationPatterns"
  | "workflowGraph"
  | "hitl"
  | "middlewareOnion"
  | "traceWaterfall"
  | "responsibleAI"
  | "recapWheel"
  | "adoption";

export type Section = {
  id: string;
  kicker: string;
  title: string;
  body: string; // markdown
  visual?: VisualKey;
  code?: string;
  codeTitle?: string;
};

export type Quiz = { q: string; options: string[]; answer: number; why: string };

export type Module = {
  slug: string;
  num: number;
  title: string;
  short: string;
  minutes: number;
  tagline: string;
  icon: "Sparkles" | "Bot" | "Wrench" | "Brain" | "Users" | "Workflow" | "ShieldCheck" | "Trophy";
  gradient: string; // full Tailwind class string (must be literal for the scanner)
  text: string;
  hex: [string, string];
  objectives: string[];
  sections: Section[];
  takeaways: string[];
  quiz: Quiz[];
  activity: { title: string; steps: string[]; lab?: string; sandbox: "playground" | "studio" | "code"; exercise?: number };
};

export const MODULES: Module[] = [
  // ───────────────────────────────────────────────────────────── 1
  {
    slug: "introduction",
    num: 1,
    title: "Introduction to Microsoft Agent Framework",
    short: "Introduction",
    minutes: 5,
    tagline: "One open-source framework for agents and workflows — the successor to Semantic Kernel and AutoGen.",
    icon: "Sparkles",
    gradient: "from-violet-500 to-fuchsia-500",
    text: "text-violet-300",
    hex: ["#8b5cf6", "#d946ef"],
    objectives: [
      "Introduction to Microsoft Agent Framework (MAF)",
      "Evolution from Semantic Kernel and AutoGen",
      "Understanding the architecture of MAF",
      "Key components and capabilities",
      "Understanding agents versus workflows",
      "Practical enterprise use cases",
    ],
    sections: [
      {
        id: "what",
        kicker: "The big idea",
        title: "What is Microsoft Agent Framework?",
        body: `**Microsoft Agent Framework (MAF)** is an open-source SDK for **Python and .NET** to build, orchestrate and deploy AI agents and multi-agent workflows.

It gives you two building blocks:

- **Agents** — an LLM + instructions + tools + memory that *decides* what to do next.
- **Workflows** — typed, graph-based pipelines where *you* decide the execution path, with checkpointing and human-in-the-loop.

Everything else — model providers, middleware, telemetry, hosting — plugs into those two.`,
      },
      {
        id: "evolution",
        kicker: "History",
        title: "Evolution: Semantic Kernel + AutoGen → MAF",
        body: `Microsoft previously had **two** agent stacks:

| | Semantic Kernel | AutoGen | **Agent Framework** |
|---|---|---|---|
| Strength | Enterprise: plugins, filters, telemetry, connectors | Research: multi-agent conversation patterns | **Both, unified** |
| Orchestration | Planners / processes | Group chat, teams | Typed graph workflows + prebuilt patterns |
| State | Kernel memory | Agent messages | Sessions, context providers, checkpoints |

MAF is built by the **same teams**: SK's enterprise foundations + AutoGen's simple agent abstractions and orchestration patterns. Both predecessors now point new projects to MAF.`,
        visual: "evolution",
      },
      {
        id: "architecture",
        kicker: "Architecture",
        title: "The layered architecture",
        body: `Read the stack bottom-up: a **chat client** talks to a model provider; an **agent** wraps that client with instructions, tools, sessions and middleware; **workflows** compose agents and plain Python executors; and **hosting + observability** wrap everything for production.`,
        visual: "architecture",
      },
      {
        id: "agents-vs-workflows",
        kicker: "Mental model",
        title: "Agents vs. workflows — who controls the path?",
        body: `> **Rule of thumb:** if you can write the steps down as a flowchart, use a **workflow**. If the path depends on open-ended reasoning, use an **agent**. Most real systems are *workflows of agents*.`,
        visual: "agentVsWorkflow",
      },
      {
        id: "use-cases",
        kicker: "Why it matters",
        title: "Enterprise use cases",
        body: `Agents shine where work is **language-heavy, multi-step and tool-driven**. The capstone of this workshop — a *Business Operations Assistant* — combines several of these patterns.`,
        visual: "useCases",
      },
      {
        id: "hello",
        kicker: "First contact",
        title: "Your first agent interaction — 6 lines",
        body: `Install the core package plus the OpenAI-compatible connector. We use **Groq** (bring your own key) through its OpenAI-compatible endpoint — swap one line to move to Azure OpenAI or Microsoft Foundry.

\`\`\`bash
pip install agent-framework-core agent-framework-openai python-dotenv
\`\`\``,
        code: `from agent_framework import Agent
from agent_framework.openai import OpenAIChatCompletionClient

client = OpenAIChatCompletionClient(
    model="llama-3.3-70b-versatile",
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)
agent = Agent(client=client, instructions="You are a friendly assistant.")
print((await agent.run("What is Microsoft Agent Framework?")).text)`,
        codeTitle: "hello_maf.py",
      },
    ],
    takeaways: [
      "MAF = Semantic Kernel's enterprise foundations + AutoGen's agent patterns, in one SDK.",
      "Two primitives: Agents (LLM decides) and Workflows (you decide).",
      "Chat clients abstract the model provider — swap providers without rewriting agents.",
      "Python & .NET, open source, OpenTelemetry built in.",
    ],
    quiz: [
      {
        q: "Which two Microsoft projects does Agent Framework unify?",
        options: ["LangChain and LlamaIndex", "Semantic Kernel and AutoGen", "Copilot Studio and Power Automate", "Bot Framework and LUIS"],
        answer: 1,
        why: "MAF is the direct successor of Semantic Kernel (enterprise features) and AutoGen (multi-agent patterns).",
      },
      {
        q: "You need an invoice-approval process with fixed steps and a manager sign-off. Best fit?",
        options: ["A single free-form agent", "A workflow (possibly containing agents)", "A bigger model", "A system prompt"],
        answer: 1,
        why: "Known, auditable steps + human approval = workflow. Agents can still do the language-heavy steps inside it.",
      },
      {
        q: "What does a chat client do in MAF?",
        options: ["Renders the chat UI", "Connects agents to a model provider", "Stores long-term memory", "Schedules workflows"],
        answer: 1,
        why: "Chat clients (OpenAIChatCompletionClient, Foundry, Anthropic…) are the provider abstraction an agent sits on.",
      },
    ],
    activity: {
      title: "Explore the framework and execute a basic AI agent interaction",
      steps: [
        "Add your Groq key using the 🔑 button in the top bar.",
        "Open the Sandbox → Agent Playground and send: “What is Microsoft Agent Framework?”",
        "Open the Execution Trace and find the LLM call, its latency and token usage.",
        "Click “Python equivalent” to see the MAF code for exactly what you just ran.",
      ],
      lab: "ex1_first_agent.py",
      sandbox: "playground",
      exercise: 1,
    },
  },

  // ───────────────────────────────────────────────────────────── 2
  {
    slug: "first-agent",
    num: 2,
    title: "Building Your First AI Agent",
    short: "First Agent",
    minutes: 7,
    tagline: "Client + instructions + run(). Then make it yours with personas, options and streaming.",
    icon: "Bot",
    gradient: "from-sky-500 to-blue-600",
    text: "text-sky-300",
    hex: ["#0ea5e9", "#2563eb"],
    objectives: [
      "Understanding agent architecture and components",
      "Setting up the development environment",
      "Creating an agent using Microsoft Agent Framework",
      "Configuring model providers and agent instructions",
      "Executing an agent and processing user requests",
      "Understanding agent execution and responses",
    ],
    sections: [
      {
        id: "anatomy",
        kicker: "Anatomy",
        title: "What an agent is made of",
        body: `An \`Agent\` is a thin, composable object. Only **client** is required — everything else is optional and additive.`,
        visual: "agentAnatomy",
      },
      {
        id: "setup",
        kicker: "Environment",
        title: "Set up in 90 seconds",
        body: `\`\`\`bash
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt                      # agent-framework-core, -openai, -orchestrations, pandas …
cp .env.example .env                                 # then paste your GROQ_API_KEY
python ex1_first_agent.py
\`\`\`

**Google Colab?** \`!pip install agent-framework-core agent-framework-openai\` and use \`await main()\` directly — notebooks already run an event loop.

All labs share one helper, \`common.make_client()\`, so changing provider is a **one-file change**.`,
        code: `import os
from agent_framework.openai import OpenAIChatCompletionClient

def make_client() -> OpenAIChatCompletionClient:
    return OpenAIChatCompletionClient(
        model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
        api_key=os.environ["GROQ_API_KEY"],
        base_url="https://api.groq.com/openai/v1",
    )`,
        codeTitle: "common.py",
      },
      {
        id: "providers",
        kicker: "Model providers",
        title: "Pick a provider — keep the agent",
        body: `Every provider package exposes a chat client with the same interface. **Groq, Ollama, LM Studio and vLLM** speak the OpenAI Chat Completions protocol, so \`OpenAIChatCompletionClient\` + \`base_url\` covers them.

⚠️ In v1.x, \`OpenAIChatClient\` targets OpenAI's **Responses API**. For Groq use **\`OpenAIChatCompletionClient\`**.`,
        visual: "providers",
      },
      {
        id: "instructions",
        kicker: "Configuration",
        title: "Instructions, options & the as_agent shortcut",
        body: `Good instructions = **role + rules + output format + what to do when unsure**. Model options such as \`temperature\` and \`max_tokens\` go in \`default_options\` (per-agent) or \`options=\` on a single \`run()\`.`,
        code: `agent = client.as_agent(
    name="OpsBot",
    instructions="""You are OpsBot, a business operations analyst.
- Be concise and use bullet points.
- State assumptions explicitly. If unsure, say so.""",
    default_options={"temperature": 0.2, "max_tokens": 400},
)`,
        codeTitle: "ex2_configured_agent.py",
      },
      {
        id: "execution",
        kicker: "Execution",
        title: "What happens inside agent.run()",
        body: `\`run()\` returns an **AgentResponse** (\`.text\`, \`.messages\`, usage). Pass \`stream=True\` to get an async stream of **AgentResponseUpdate** chunks instead — essential for responsive UIs.`,
        visual: "runLoop",
        code: `result = await agent.run("Give me 3 KPIs for a support team.")
print(result.text)

async for update in agent.run("Explain the first KPI.", stream=True):
    print(update.text, end="", flush=True)`,
        codeTitle: "run vs stream",
      },
    ],
    takeaways: [
      "Agent(client=…, instructions=…) is all you need to start.",
      "client.as_agent(...) is a convenient shortcut.",
      "default_options sets temperature / max_tokens for every run.",
      "run() → AgentResponse; run(stream=True) → async updates.",
    ],
    quiz: [
      {
        q: "Which client class should you use with Groq's OpenAI-compatible endpoint in MAF 1.x?",
        options: ["OpenAIChatClient", "OpenAIChatCompletionClient", "GroqAgent", "AzureAIAgentClient"],
        answer: 1,
        why: "OpenAIChatClient uses the Responses API; Groq is consumed via Chat Completions.",
      },
      {
        q: "How do you stream an agent's answer?",
        options: ["agent.run_stream()", "agent.run(..., stream=True)", "agent.stream = True", "client.stream(agent)"],
        answer: 1,
        why: "The current API unifies both modes on run(); stream=True returns an async iterator of updates.",
      },
      {
        q: "Where do you set temperature for every call an agent makes?",
        options: ["In the instructions text", "default_options={'temperature': …}", "Environment variable only", "It cannot be set"],
        answer: 1,
        why: "default_options holds model options for the agent; options= overrides them per run.",
      },
    ],
    activity: {
      title: "Create and execute a basic AI agent using Python",
      steps: [
        "In the Playground, change the agent name and write a persona for ‘OpsBot’.",
        "Drop temperature to 0.1, ask the same question twice — compare. Then try 1.2.",
        "Open Code Lab → Exercise 2 and complete the TODOs (as_agent, default_options, streaming).",
        "Ask the AI reviewer to check your code.",
      ],
      lab: "ex2_configured_agent.py",
      sandbox: "code",
      exercise: 2,
    },
  },

  // ───────────────────────────────────────────────────────────── 3
  {
    slug: "tools",
    num: 3,
    title: "Agent Tools and Function Integration",
    short: "Tools",
    minutes: 8,
    tagline: "Give the model hands: typed Python functions it can call, with results fed back into its reasoning.",
    icon: "Wrench",
    gradient: "from-amber-400 to-orange-600",
    text: "text-amber-300",
    hex: ["#f59e0b", "#ea580c"],
    objectives: [
      "Understanding tools and function calling",
      "Creating custom Python functions",
      "Registering tools with an AI agent",
      "Enabling agents to invoke external functions",
      "Processing tool outputs",
      "Handling tool execution and responses",
    ],
    sections: [
      {
        id: "calling",
        kicker: "Concept",
        title: "How function calling works",
        body: `The model never runs your code. It **asks** to call a function by emitting a structured *function call* (name + JSON args). MAF executes the Python function, appends the *function result* to the conversation, and calls the model again — looping until the model answers in text.`,
        visual: "toolSequence",
      },
      {
        id: "define",
        kicker: "Build",
        title: "Turn a Python function into a tool",
        body: `Use \`@tool\`. MAF builds the JSON schema from **type hints**, **\`Annotated\` + \`Field\` descriptions** and the **docstring** — so those *are* your prompt. Write them for the model.`,
        visual: "toolAnatomy",
        code: `from typing import Annotated
from pydantic import Field
from agent_framework import Agent, tool

@tool
def profit_margin(
    revenue: Annotated[float, Field(description="Total revenue")],
    cost: Annotated[float, Field(description="Total cost")],
) -> str:
    """Calculate profit and profit margin percentage."""
    profit = revenue - cost
    return f"profit={profit:,.0f}, margin={profit / revenue * 100:.1f}%"

agent = Agent(client=client, instructions="ALWAYS use tools for numbers.",
              tools=[profit_margin, sales_summary, growth_rate])`,
        codeTitle: "ex3_tools_agent.py",
      },
      {
        id: "data",
        kicker: "Real data",
        title: "Tools over your data (pandas)",
        body: `Tools are the bridge to **your** systems: databases, CRMs, APIs, files. In the lab, \`sales_summary\` filters a pandas DataFrame so the agent answers with real numbers instead of hallucinated ones.`,
        code: `SALES = pd.read_csv("data/sales.csv")

@tool
def sales_summary(
    region: Annotated[str | None, Field(description="North or South; omit for all")] = None,
    product: Annotated[str | None, Field(description="Cloud Suite or AI Copilot")] = None,
) -> str:
    """Return monthly revenue, cost and units from the company sales dataset."""
    df = SALES
    if region:  df = df[df.region.str.lower() == region.lower()]
    if product: df = df[df["product"].str.lower() == product.lower()]
    return df.groupby("month")[["units", "revenue", "cost"]].sum().to_string()`,
        codeTitle: "pandas-backed tool",
      },
      {
        id: "outputs",
        kicker: "Results",
        title: "Processing & inspecting tool outputs",
        body: `Function calls and results are just **content items** in \`response.messages\`. Inspect them for debugging, auditing or UI ("🔧 called sales_summary").

**Handling failures:** return a clear \`"ERROR: …"\` string instead of raising — the model can read it and recover (ask for valid input, try another tool). For risky actions use \`@tool(approval_mode="always_require")\` to require human approval.`,
        code: `for message in response.messages:
    for content in message.contents:
        if content.type == "function_call":
            print(f"-> call   {content.name}({content.arguments})")
        elif content.type == "function_result":
            print(f"<- result {content.result}")`,
        codeTitle: "inspect the tool loop",
      },
    ],
    takeaways: [
      "The model requests calls; MAF executes them and loops until a text answer.",
      "Type hints + Field descriptions + docstrings become the tool schema — write them well.",
      "Return readable errors so the model can self-correct.",
      "approval_mode='always_require' adds a human gate to risky tools.",
    ],
    quiz: [
      {
        q: "Who actually executes a tool function?",
        options: ["The LLM provider's servers", "Your process, via Agent Framework", "The browser", "Nobody — it's simulated"],
        answer: 1,
        why: "The model only emits a function-call request; MAF invokes your Python function locally.",
      },
      {
        q: "Where does the tool's description shown to the model come from?",
        options: ["The function name only", "Docstring, type hints and Field descriptions", "A separate YAML file", "The agent's name"],
        answer: 1,
        why: "@tool introspects the signature and docstring to build the JSON schema.",
      },
      {
        q: "A tool receives an invalid discount of 90%. Best practice?",
        options: ["Crash the process", "Return a clear ERROR string the model can act on", "Silently clamp and hide it", "Retry forever"],
        answer: 1,
        why: "Readable errors let the model recover gracefully and explain to the user.",
      },
    ],
    activity: {
      title: "Build an agent that uses Python functions for business calculations and data retrieval",
      steps: [
        "Playground: enable profit_margin, sales_summary and growth_rate.",
        "Ask: “How did AI Copilot revenue grow in the North from Jan to Mar, and what was the Q1 margin?”",
        "Watch the trace: how many tool calls? In what order? With which arguments?",
        "Code Lab → Exercise 3: implement profit_margin + a second tool of your own.",
      ],
      lab: "ex3_tools_agent.py",
      sandbox: "playground",
      exercise: 3,
    },
  },

  // ───────────────────────────────────────────────────────────── 4
  {
    slug: "memory",
    num: 4,
    title: "Agent Conversations, Context and Memory",
    short: "Memory",
    minutes: 10,
    tagline: "LLMs are stateless. Sessions and context providers make agents remember.",
    icon: "Brain",
    gradient: "from-emerald-400 to-teal-600",
    text: "text-emerald-300",
    hex: ["#34d399", "#0d9488"],
    objectives: [
      "Understanding multi-turn agent conversations",
      "Managing conversation sessions",
      "Maintaining contextual information across interactions",
      "Introduction to agent memory and context providers",
      "Managing session state",
      "Understanding persistent context and memory management",
    ],
    sections: [
      {
        id: "stateless",
        kicker: "The problem",
        title: "Every model call starts from zero",
        body: `A model only knows what's in the **current request**. “Which plan fits *us*?” is meaningless unless the earlier turns are sent again. An **AgentSession** carries that history for you: each turn appends user + assistant messages, so context grows 2 → 4 → 6 → 8 messages.`,
        visual: "sessionMemory",
        code: `session = agent.create_session()

await agent.run("We want AI Copilot for support. Budget is $40k.", session=session)
await agent.run("Which plan fits us?", session=session)
reply = await agent.run("What budget did I mention?", session=session)   # remembers ✅`,
        codeTitle: "multi-turn with a session",
      },
      {
        id: "providers",
        kicker: "Context providers",
        title: "Inject knowledge before — learn after",
        body: `A **ContextProvider** hooks into every run:

- \`before_run\` → add instructions, messages or tools (profile, retrieved docs, policies)
- \`after_run\` → inspect the exchange and **store memories** in session \`state\`

When you pass a session and no history provider, MAF auto-adds an **InMemoryHistoryProvider**. Swap in File, Redis, Mem0 or vector-store providers for durability and semantic recall.`,
        code: `class CustomerProfileProvider(ContextProvider):
    def __init__(self) -> None:
        super().__init__(source_id="customer_profile")

    async def before_run(self, *, agent, session, context, state) -> None:
        profile = state.setdefault("profile", {"company": "Contoso Retail", "tier": "Gold"})
        context.extend_instructions(self.source_id, f"Known customer profile: {profile}")

    async def after_run(self, *, agent, session, context, state) -> None:
        for m in context.get_messages():
            if "budget" in (m.text or "").lower():
                state["profile"]["budget_note"] = m.text[:120]

agent = Agent(client=client, instructions="...", context_providers=[CustomerProfileProvider()])`,
        codeTitle: "ex4_sessions_memory.py",
      },
      {
        id: "types",
        kicker: "Taxonomy",
        title: "Three kinds of memory",
        body: `Design memory deliberately — more context is **not** always better (cost, latency, distraction). Compaction strategies (sliding window, summarisation, token budgets) keep long sessions in check.`,
        visual: "memoryTypes",
      },
      {
        id: "persist",
        kicker: "Persistence",
        title: "Serialise, store, resume",
        body: `Sessions are plain data. Persist them per user/conversation in Redis, Cosmos DB or SQL and resume hours later — the agent picks up where it left off.`,
        code: `saved = session.to_dict()            # {'type', 'session_id', 'service_session_id', 'state'}
db.save(user_id, saved)

restored = AgentSession.from_dict(db.load(user_id))
await agent.run("One-line summary of our chat?", session=restored)`,
        codeTitle: "persist & resume",
      },
    ],
    takeaways: [
      "No session = no memory. Pass session=… on every turn.",
      "ContextProvider.before_run injects; after_run learns.",
      "Session state is a dict you control — and it serialises with to_dict().",
      "Short-term (history), long-term (facts/vectors) and working state are different tools.",
    ],
    quiz: [
      {
        q: "What makes a follow-up like “which plan fits us?” work?",
        options: ["A larger model", "Passing the same AgentSession to each run", "Higher temperature", "Adding more tools"],
        answer: 1,
        why: "The session's history provider replays previous turns into the next request.",
      },
      {
        q: "Which hook should retrieve a customer's profile and add it to the prompt?",
        options: ["after_run", "before_run", "__del__", "A tool's docstring"],
        answer: 1,
        why: "before_run runs before the model call and can extend instructions/messages.",
      },
      {
        q: "How do you resume a conversation after a server restart?",
        options: ["You can't", "session.to_dict() → store → AgentSession.from_dict()", "Re-send the system prompt", "Use a global variable"],
        answer: 1,
        why: "Sessions serialise to plain dicts you can persist anywhere.",
      },
    ],
    activity: {
      title: "Extend the agent to maintain context and answer follow-up questions",
      steps: [
        "Playground: turn Session memory OFF. Tell it your budget, then ask “what's my budget?” — it forgets.",
        "Turn Session memory ON and repeat. Watch the message count grow in the Session State panel.",
        "Add a ‘customer profile’ to the Context Provider box and ask a question that needs it.",
        "Code Lab → Exercise 4: implement before_run in CustomerProfileProvider.",
      ],
      lab: "ex4_sessions_memory.py",
      sandbox: "playground",
      exercise: 4,
    },
  },

  // ───────────────────────────────────────────────────────────── 5
  {
    slug: "multi-agent",
    num: 5,
    title: "Building Multi-Agent Applications",
    short: "Multi-Agent",
    minutes: 12,
    tagline: "Small, specialised agents with clear jobs beat one giant prompt.",
    icon: "Users",
    gradient: "from-pink-500 to-rose-600",
    text: "text-pink-300",
    hex: ["#ec4899", "#e11d48"],
    objectives: [
      "Introduction to multi-agent architecture",
      "Understanding agent collaboration and delegation",
      "Designing specialised agents for different responsibilities",
      "Creating multiple agents using Microsoft Agent Framework",
      "Agent-to-agent communication",
      "Understanding sequential and concurrent execution",
      "Introduction to agent orchestration patterns",
    ],
    sections: [
      {
        id: "why",
        kicker: "Architecture",
        title: "Why multiple agents?",
        body: `- **Focus** — short, specific instructions are followed more reliably.
- **Modularity** — test, swap or upgrade one specialist without touching the others.
- **Least privilege** — give each agent only the tools it needs.
- **Parallelism** — independent specialists can run at the same time.

The trade-off: more model calls (cost/latency) and the need to coordinate. That's what orchestration solves.`,
        visual: "teamTopology",
      },
      {
        id: "specialists",
        kicker: "Design",
        title: "Designing specialised agents",
        body: `Give every agent a **name**, a one-line **description** (other agents and orchestrators read it) and **narrow instructions** that say what *not* to do.`,
        code: `research = Agent(client=client, name="ResearchAgent",
    description="Collects relevant facts, market context and data points.",
    instructions="You gather facts. Return 5-7 bullet points of evidence. No recommendations.")

analysis = Agent(client=client, name="AnalysisAgent",
    description="Evaluates evidence and extracts insights, risks and opportunities.",
    instructions="Output: Key insights (3), Risks (2), Opportunities (2).")

recommendation = Agent(client=client, name="RecommendationAgent",
    description="Turns insights into prioritised, actionable recommendations.",
    instructions="Write 3 prioritised recommendations, each with owner, KPI and 30/60/90-day step.")`,
        codeTitle: "ex5_multi_agent.py",
      },
      {
        id: "delegation",
        kicker: "Agent-to-agent",
        title: "Delegation: agents as tools",
        body: `\`agent.as_tool()\` wraps an agent as a function another agent can call. The **Coordinator** decides *when* and *with what input* to call each specialist — the LLM does the routing.`,
        code: `coordinator = Agent(
    client=client,
    name="Coordinator",
    instructions="1) call ResearchAgent, 2) pass its output to AnalysisAgent, "
                 "3) pass insights to RecommendationAgent, 4) consolidate a final brief.",
    tools=[research.as_tool(), analysis.as_tool(), recommendation.as_tool()],
)
print((await coordinator.run("Churn rose from 3% to 5%. What should we do?")).text)`,
        codeTitle: "coordinator delegates",
      },
      {
        id: "seq-conc",
        kicker: "Execution",
        title: "Sequential vs. concurrent",
        body: `**Sequential** — each agent builds on the previous output (Research → Analysis → Recommendation). Total time ≈ sum of steps.

**Concurrent** — independent agents work on the same input at once (Finance ‖ Operations ‖ Risk) and results are aggregated. Total time ≈ slowest agent.`,
        visual: "seqVsConcurrent",
      },
      {
        id: "patterns",
        kicker: "Patterns",
        title: "Orchestration patterns at a glance",
        body: `MAF ships these as builders in \`agent_framework.orchestrations\` — you'll use them in Module 6.`,
        visual: "orchestrationPatterns",
      },
    ],
    takeaways: [
      "One job per agent: name + description + narrow instructions.",
      "agent.as_tool() enables LLM-driven delegation (agent-to-agent).",
      "Sequential for dependent steps, concurrent for independent perspectives.",
      "More agents = more calls: design for cost and latency.",
    ],
    quiz: [
      {
        q: "How does a coordinator agent call a specialist agent in MAF?",
        options: ["HTTP only", "specialist.as_tool() in the coordinator's tools", "Copy-paste outputs", "It can't"],
        answer: 1,
        why: "as_tool() exposes an agent as a function tool for another agent.",
      },
      {
        q: "Finance, Ops and Risk each review the same proposal independently. Best execution mode?",
        options: ["Sequential", "Concurrent", "Single agent", "Handoff"],
        answer: 1,
        why: "Independent perspectives on the same input parallelise naturally.",
      },
      {
        q: "Why give each agent a `description`?",
        options: ["It's required by Python", "Orchestrators and other agents use it to decide who to call", "It changes temperature", "For billing"],
        answer: 1,
        why: "Descriptions advertise capabilities for routing and delegation.",
      },
    ],
    activity: {
      title: "Build a multi-agent business assistant: Research → Analysis → Recommendation",
      steps: [
        "Sandbox → Multi-Agent Studio. Pick the “Churn spike” scenario.",
        "Run in Sequential mode and watch each node light up. Read each agent's output.",
        "Switch to Concurrent mode and compare the timeline chart — which is faster? Which is better?",
        "Edit the Analysis agent's instructions (e.g. add a SWOT) and re-run.",
      ],
      lab: "ex5_multi_agent.py",
      sandbox: "studio",
      exercise: 5,
    },
  },

  // ───────────────────────────────────────────────────────────── 6
  {
    slug: "workflows",
    num: 6,
    title: "Agent Workflows and Orchestration",
    short: "Workflows",
    minutes: 10,
    tagline: "Typed graphs, prebuilt patterns, checkpoints and humans in the loop.",
    icon: "Workflow",
    gradient: "from-indigo-500 to-cyan-500",
    text: "text-cyan-300",
    hex: ["#6366f1", "#06b6d4"],
    objectives: [
      "Introduction to Microsoft Agent Framework workflows",
      "Understanding workflow architecture",
      "Functional and graph-based workflows",
      "Sequential workflow execution",
      "Concurrent execution and parallel processing",
      "Agent handoff and group collaboration patterns",
      "Workflow state management",
      "Human-in-the-loop interactions",
    ],
    sections: [
      {
        id: "arch",
        kicker: "Architecture",
        title: "Executors, edges and supersteps",
        body: `A workflow is a **directed graph**:

- **Executors** — nodes. An agent, or any Python function decorated with \`@executor\`.
- **Edges** — typed message routes: direct, conditional, **fan-out**, **fan-in**, switch-case.
- **Supersteps** — the runtime executes all ready nodes, delivers messages, repeats. Parallel branches in one superstep run concurrently.
- **Events** — \`executor_invoked\`, \`output\`, \`request_info\`… stream them for live UIs.`,
        visual: "workflowGraph",
      },
      {
        id: "prebuilt",
        kicker: "Fast path",
        title: "Prebuilt orchestrations",
        body: `For common patterns, use the builders — one line each.`,
        code: `from agent_framework.orchestrations import SequentialBuilder, ConcurrentBuilder

# Sequential: shared conversation flows through each agent
seq = SequentialBuilder(participants=[research, analysis, recommend], output_from="all").build()
result = await seq.run("Should we expand AI Copilot into Europe?")
for response in result.get_outputs():
    for msg in response.messages:
        print(f"[{msg.author_name}] {msg.text}")

# Concurrent: fan-out to every participant, fan-in their answers
conc = ConcurrentBuilder(participants=[finance, ops, risk]).build()
aggregated = (await conc.run(task)).get_outputs()[-1]`,
        codeTitle: "ex6_workflows.py",
      },
      {
        id: "graph",
        kicker: "Full control",
        title: "Graph workflows with WorkflowBuilder",
        body: `When you need custom logic between agents — validation, formatting, routing — mix agents and plain Python executors.`,
        code: `@executor(id="publisher")
async def publisher(response: AgentExecutorResponse, ctx: WorkflowContext[None, str]) -> None:
    await ctx.yield_output(f"FINAL BRIEF\\n{response.agent_response.text}")

workflow = (
    WorkflowBuilder(start_executor=research)
    .add_edge(research, analysis)
    .add_edge(analysis, recommend)
    .add_edge(recommend, publisher)
    .build()
)
async for event in workflow.run(task, stream=True):
    if event.type == "executor_invoked":
        print("running", event.executor_id)
    elif event.type == "output" and isinstance(event.data, str):
        print(event.data)`,
        codeTitle: "graph workflow",
      },
      {
        id: "functional",
        kicker: "Functional API",
        title: "Functional workflows: just write async Python",
        body: `The **functional** style (\`@workflow\` + \`@step\`) lets you write orchestration as ordinary code — \`if\`, \`for\`, \`asyncio.gather\` — while still getting step caching, checkpoints and human-in-the-loop. *(Marked experimental in 1.26.)*`,
        code: `@step
async def do_research(plan: str) -> str:
    return (await research.run(plan)).text

@workflow(name="business_ops_assistant")
async def business_ops(request: str, ctx: RunContext) -> str:
    findings = await do_research(request)
    insights = await do_analysis(findings)
    recs = await do_recommend(insights)
    note = await ctx.request_info({"draft": recs}, response_type=str, request_id="manager_approval")
    return await consolidate(request, insights, recs, note)`,
        codeTitle: "capstone_business_ops.py",
      },
      {
        id: "handoff",
        kicker: "Collaboration",
        title: "Handoff, group chat and Magentic",
        body: `- **HandoffBuilder** — agents transfer control to each other (triage → billing → tech support), like a call centre.
- **GroupChatBuilder** — a manager selects who speaks next in a shared conversation; \`max_rounds\` bounds it.
- **MagenticBuilder** — a planner agent maintains a task ledger, delegates, tracks progress and re-plans; supports plan review.`,
        visual: "orchestrationPatterns",
      },
      {
        id: "hitl",
        kicker: "Human-in-the-loop",
        title: "Pause, ask a human, resume",
        body: `\`request_info\` suspends the workflow and emits a \`request_info\` event. Your app shows it to a human, then resumes with \`run(responses={request_id: answer})\`. With \`@step\`, completed steps are **cached** — nothing is re-run. Add **checkpoint storage** to survive restarts.`,
        visual: "hitl",
        code: `wf = business_ops.build()
result = await wf.run("Reduce onboarding time by 30%")

event = result.get_request_info_events()[0]         # workflow paused
print(event.data["draft"])
result = await wf.run(responses={event.request_id: "Approve — focus on EU"})
print(result.get_outputs()[-1])                      # final brief`,
        codeTitle: "resume after approval",
      },
    ],
    takeaways: [
      "Workflows = executors + typed edges, run in supersteps, observable via events.",
      "SequentialBuilder / ConcurrentBuilder cover 80% of cases in one line.",
      "WorkflowBuilder for custom graphs; @workflow + @step for code-first orchestration.",
      "request_info + responses={…} = human-in-the-loop; checkpoints make it durable.",
    ],
    quiz: [
      {
        q: "In a graph workflow, what is an executor?",
        options: ["A thread pool", "A node — an agent or a Python function", "The LLM provider", "A logging sink"],
        answer: 1,
        why: "Executors are the processing nodes; edges route messages between them.",
      },
      {
        q: "How do you resume a workflow paused by request_info?",
        options: ["Restart from scratch", "workflow.run(responses={request_id: value})", "agent.resume()", "Edit the checkpoint file"],
        answer: 1,
        why: "Responses are keyed by request_id; cached @step results aren't recomputed.",
      },
      {
        q: "Triage agent routes a customer to Billing or Tech Support, who may route back. Pattern?",
        options: ["Concurrent", "Handoff", "Sequential", "Magentic"],
        answer: 1,
        why: "Handoff lets agents transfer control dynamically.",
      },
    ],
    activity: {
      title: "Connect multiple agents through a coordinated workflow for an end-to-end business task",
      steps: [
        "Multi-Agent Studio → choose Coordinator mode (the capstone flow).",
        "Enable “Human approval before final brief”.",
        "Run a scenario; when it pauses, edit/annotate the draft and approve.",
        "Code Lab → Exercise 6: build Sequential + Concurrent workflows; stretch: WorkflowBuilder.",
      ],
      lab: "ex6_workflows.py",
      sandbox: "studio",
      exercise: 6,
    },
  },

  // ───────────────────────────────────────────────────────────── 7
  {
    slug: "testing",
    num: 7,
    title: "Testing, Monitoring and Responsible AI",
    short: "Testing & RAI",
    minutes: 6,
    tagline: "Middleware for control, OpenTelemetry for visibility, tests and guardrails for trust.",
    icon: "ShieldCheck",
    gradient: "from-lime-400 to-emerald-600",
    text: "text-lime-300",
    hex: ["#a3e635", "#059669"],
    objectives: [
      "Testing agent responses and execution",
      "Debugging agent behaviour",
      "Understanding middleware and execution controls",
      "Introduction to observability and tracing",
      "Monitoring agent and workflow execution",
      "Handling errors and unexpected outputs",
      "Security considerations and responsible AI practices",
    ],
    sections: [
      {
        id: "middleware",
        kicker: "Execution controls",
        title: "Middleware: the onion around every run",
        body: `Three interception layers, each an \`async def mw(context, call_next)\`:

- **Agent middleware** — around the whole \`run()\`: guardrails, timing, caching.
- **Chat middleware** — around each model call: prompt rewriting, token accounting.
- **Function middleware** — around each tool call: auditing, argument validation, approval.

Skip \`call_next()\` and set \`context.result\` to **short-circuit** (e.g. block a request without calling the model).`,
        visual: "middlewareOnion",
        code: `@agent_middleware
async def guardrail_and_timer(context: AgentContext, call_next) -> None:
    if BLOCKED.search(context.messages[-1].text or ""):
        context.result = AgentResponse(
            messages=[Message("assistant", ["Sorry — I can't help with credentials."])])
        return                                   # model never called
    start = time.perf_counter()
    await call_next()
    print(f"[timer] {context.agent.name} took {time.perf_counter() - start:.2f}s")

@function_middleware
async def audit_tools(context: FunctionInvocationContext, call_next) -> None:
    print(f"[audit] -> {context.function.name}({context.arguments})")
    await call_next()`,
        codeTitle: "ex7_testing_monitoring.py",
      },
      {
        id: "otel",
        kicker: "Observability",
        title: "Tracing with OpenTelemetry",
        body: `One call instruments agents, chat clients, tools and workflows with **GenAI semantic-convention** spans and metrics. Send them to the console, **Aspire Dashboard**, Azure **Application Insights**, Jaeger, Grafana…

Keep \`enable_sensitive_data=False\` in production — prompts and outputs can contain PII.`,
        visual: "traceWaterfall",
        code: `from agent_framework.observability import configure_otel_providers

configure_otel_providers(
    enable_console_exporters=True,      # workshop
    # otlp_endpoint="http://localhost:4317",   # Aspire / Jaeger / collector
    enable_sensitive_data=False,
)`,
        codeTitle: "observability",
      },
      {
        id: "testing",
        kicker: "Testing",
        title: "Test pyramid for agents",
        body: `1. **Unit-test tools** deterministically — they're plain functions (\`tool.func(...)\`).
2. **Behavioural tests** — run the agent and assert on *properties* (contains the right number, called the right tool), not exact wording.
3. **Scenario evals** — a dataset of business requests scored by rubric or an LLM judge (\`evaluate_agent\`, \`keyword_check\`, \`tool_called_check\` exist in the package).

Use a low temperature and stable models in CI.`,
        code: `def test_discount_tool_is_deterministic() -> None:
    assert discount_price.func(200, 10) == "180.00"
    assert discount_price.func(200, 90).startswith("ERROR")

@pytest.mark.asyncio
async def test_agent_uses_tool_and_answers() -> None:
    response = await build_agent().run("What is 15% off a $1,200 licence?")
    assert "1020" in response.text.replace(",", "")`,
        codeTitle: "pytest",
      },
      {
        id: "rai",
        kicker: "Responsible AI",
        title: "Security & responsible AI checklist",
        body: `Agents act — so the blast radius is bigger than a chatbot's. Treat every tool as an API exposed to an untrusted caller.`,
        visual: "responsibleAI",
      },
    ],
    takeaways: [
      "Agent / chat / function middleware = interception at three levels.",
      "configure_otel_providers() gives traces for runs, LLM calls and tools.",
      "Unit-test tools; assert properties of agent output; evaluate with scenarios.",
      "Least privilege, approvals, input/output guardrails, no secrets in prompts.",
    ],
    quiz: [
      {
        q: "Which middleware type is right for auditing every tool invocation?",
        options: ["Agent middleware", "Chat middleware", "Function middleware", "CSS middleware"],
        answer: 2,
        why: "Function middleware wraps each tool call with access to name, arguments and result.",
      },
      {
        q: "How can middleware block a request without calling the model?",
        options: ["Raise SystemExit", "Set context.result and return without call_next()", "Set temperature=0", "Delete the agent"],
        answer: 1,
        why: "Not calling call_next() short-circuits the pipeline; context.result becomes the response.",
      },
      {
        q: "What should a behavioural agent test assert?",
        options: ["Exact sentence match", "Properties: key facts, tool usage, format", "Nothing", "Latency only"],
        answer: 1,
        why: "LLM wording varies; assert on robust properties.",
      },
    ],
    activity: {
      title: "Test the multi-agent application with different business scenarios and inspect the execution flow",
      steps: [
        "Playground: enable the Guardrail middleware and ask for “the admin password”.",
        "Enable the Audit middleware and run a tool question — read the audit lines in the trace.",
        "Try a bad input: “apply a 90% discount to $500”. How does the agent recover?",
        "Multi-Agent Studio: run 3 different scenarios and compare the timeline & token usage.",
      ],
      lab: "ex7_testing_monitoring.py",
      sandbox: "playground",
      exercise: 7,
    },
  },

  // ───────────────────────────────────────────────────────────── 8
  {
    slug: "recap",
    num: 8,
    title: "Recap and Key Takeaways",
    short: "Recap",
    minutes: 2,
    tagline: "From a 6-line agent to a governed multi-agent business assistant — in one hour.",
    icon: "Trophy",
    gradient: "from-yellow-400 to-pink-500",
    text: "text-yellow-300",
    hex: ["#facc15", "#ec4899"],
    objectives: [
      "Review of Microsoft Agent Framework capabilities",
      "Demonstration of the completed multi-agent application",
      "Key technical takeaways",
      "Enterprise adoption opportunities",
    ],
    sections: [
      {
        id: "wheel",
        kicker: "Capabilities",
        title: "Everything you covered",
        body: `The 13 framework concepts from the syllabus — each one now has working code in your \`labs/\` folder.`,
        visual: "recapWheel",
      },
      {
        id: "demo",
        kicker: "Demo",
        title: "The completed Business Operations Assistant",
        body: `**User request → Coordinator plans → Research → Analysis → Recommendation → Manager approval → Coordinator consolidates → Executive brief.**

Run it live in the **Multi-Agent Studio** (Coordinator mode + human approval) or locally with \`python capstone_business_ops.py\`. See the **Capstone** page for the full architecture.`,
      },
      {
        id: "takeaways",
        kicker: "Takeaways",
        title: "Seven things to remember",
        body: `1. **Agent = client + instructions** (+ tools, session, providers, middleware).
2. **Tools** are typed Python functions; descriptions are prompts.
3. **Sessions** give memory; **context providers** inject & learn.
4. **Specialise** agents; delegate with \`as_tool()\`.
5. **Workflows** when the path is known; prebuilt builders for common patterns.
6. **Humans in the loop** via \`request_info\`; checkpoints for durability.
7. **Middleware + OpenTelemetry + tests** before production.`,
      },
      {
        id: "adoption",
        kicker: "Next steps",
        title: "Enterprise adoption roadmap",
        body: `Start small with an internal, low-risk, high-volume use case; instrument everything; then scale.`,
        visual: "adoption",
      },
    ],
    takeaways: [
      "You can build, connect, orchestrate and observe agents with one framework.",
      "Provider-agnostic: Groq today, Azure OpenAI / Foundry tomorrow — same code.",
      "Production = workflows + human gates + telemetry + tests.",
    ],
    quiz: [
      {
        q: "Which combination best describes a production-ready agent system?",
        options: [
          "One big prompt with every tool",
          "Specialised agents in a workflow, with human gates, middleware, telemetry and tests",
          "The largest available model",
          "A chatbot with memory",
        ],
        answer: 1,
        why: "Reliability comes from structure, control and visibility — not just model size.",
      },
      {
        q: "To move the workshop code from Groq to Azure OpenAI you change…",
        options: ["Every agent", "The chat client (common.make_client)", "All workflows", "Python version"],
        answer: 1,
        why: "Agents depend on the client abstraction; swapping the client is enough.",
      },
    ],
    activity: {
      title: "Demonstrate the completed multi-agent application",
      steps: [
        "Open the Capstone page and walk through the architecture.",
        "Run the Coordinator flow with human approval in the Multi-Agent Studio.",
        "Download the labs folder and run capstone_business_ops.py locally.",
      ],
      lab: "capstone_business_ops.py",
      sandbox: "studio",
    },
  },
];

export const TOTAL_MINUTES = MODULES.reduce((s, m) => s + m.minutes, 0);

export function getModule(slug: string) {
  return MODULES.find((m) => m.slug === slug);
}
