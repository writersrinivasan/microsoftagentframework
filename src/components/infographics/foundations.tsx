"use client";

import { motion } from "motion/react";
import {
  Bot,
  Brain,
  Building,
  Cloud,
  Cpu,
  Database,
  FileSearch,
  Headset,
  HeartPulse,
  Layers,
  MessageSquare,
  Network,
  Plug,
  ScrollText,
  Server,
  ShieldCheck,
  ShoppingCart,
  Wrench,
} from "lucide-react";
import { Chip, Frame, Reveal } from "./shared";

/* ── Evolution: SK + AutoGen → MAF ─────────────────────────────── */
export function Evolution() {
  const sk = ["Plugins & connectors", "Filters (middleware)", "Telemetry", "Enterprise support"];
  const ag = ["Simple agent abstraction", "Group chat & teams", "Multi-agent patterns", "Research velocity"];
  const maf = ["Agents + Workflows", "Typed graph orchestration", "Sessions & context providers", "Checkpoints & HITL", "OpenTelemetry built-in", "Python & .NET"];
  return (
    <Frame caption="Two Microsoft agent stacks merged into one framework, built by the same teams.">
      <div className="grid items-center gap-4 md:grid-cols-[1fr_80px_1.2fr]">
        <div className="space-y-4">
          {[
            { name: "Semantic Kernel", sub: "Enterprise foundations", items: sk, c: "#38bdf8" },
            { name: "AutoGen", sub: "Multi-agent research", items: ag, c: "#f472b6" },
          ].map((s, i) => (
            <Reveal key={s.name} delay={i * 0.15}>
              <div className="rounded-xl border p-4" style={{ borderColor: `${s.c}44`, background: `${s.c}10` }}>
                <p className="font-display font-bold" style={{ color: s.c }}>
                  {s.name}
                </p>
                <p className="mb-2 text-xs text-white/50">{s.sub}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.items.map((x) => (
                    <Chip key={x} color={s.c}>
                      {x}
                    </Chip>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <svg viewBox="0 0 80 200" className="mx-auto hidden h-48 md:block">
          <defs>
            <linearGradient id="ev" x1="0" x2="1">
              <stop offset="0" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <path d="M0 45 C40 45 40 100 80 100" stroke="url(#ev)" strokeWidth="3" fill="none" className="flow-line" />
          <path d="M0 155 C40 155 40 100 80 100" stroke="#f472b6" strokeWidth="3" fill="none" className="flow-line" />
        </svg>
        <Reveal delay={0.35}>
          <div className="relative rounded-2xl bg-linear-to-br from-violet-600/40 via-fuchsia-600/30 to-cyan-500/30 p-[1px]">
            <div className="rounded-2xl bg-[#0d0f26] p-5">
              <p className="font-display text-xl font-bold text-gradient">Microsoft Agent Framework</p>
              <p className="mb-3 text-xs text-white/50">Open source · successor to both</p>
              <div className="grid grid-cols-2 gap-2">
                {maf.map((x, i) => (
                  <motion.div
                    key={x}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.07 }}
                    className="rounded-lg bg-white/5 px-2.5 py-2 text-xs"
                  >
                    ✦ {x}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Frame>
  );
}

/* ── Architecture: layered stack ───────────────────────────────── */
export function Architecture() {
  const layers = [
    { name: "Hosting & Observability", items: ["OpenTelemetry", "DevUI", "A2A protocol", "AG-UI", "Azure Functions / Foundry"], c: "#a3e635", icon: Server },
    { name: "Workflows & Orchestration", items: ["WorkflowBuilder", "@workflow / @step", "Sequential", "Concurrent", "Handoff", "Group chat", "Magentic", "Checkpoints", "HITL"], c: "#22d3ee", icon: Network },
    { name: "Agents", items: ["Agent", "instructions", "run() / stream", "as_tool()"], c: "#a78bfa", icon: Bot },
    { name: "Agent capabilities", items: ["@tool functions", "MCP tools", "Sessions", "Context providers", "Middleware", "Skills"], c: "#f472b6", icon: Wrench },
    { name: "Chat clients", items: ["OpenAIChatCompletionClient", "OpenAIChatClient", "Foundry", "Anthropic", "Ollama", "Gemini", "Bedrock"], c: "#fbbf24", icon: Plug },
    { name: "Model providers", items: ["Azure OpenAI", "Microsoft Foundry", "OpenAI", "Groq", "Local models"], c: "#fb923c", icon: Cloud },
  ];
  return (
    <Frame caption="Each layer depends only on the one beneath — swap a provider without touching your agents or workflows.">
      <div className="space-y-2">
        {layers.map((l, i) => (
          <motion.div
            key={l.name}
            initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center"
            style={{ borderColor: `${l.c}40`, background: `linear-gradient(90deg, ${l.c}22, transparent)`, marginInline: `${i * 1.2}%` }}
          >
            <div className="flex w-56 shrink-0 items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg" style={{ background: `${l.c}33` }}>
                <l.icon className="size-4" style={{ color: l.c }} />
              </span>
              <span className="font-display text-sm font-bold">{l.name}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {l.items.map((x) => (
                <Chip key={x} color={l.c}>
                  {x}
                </Chip>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Frame>
  );
}

/* ── Agents vs Workflows ───────────────────────────────────────── */
export function AgentVsWorkflow() {
  const rows = [
    ["Who decides the next step?", "The LLM, at run time", "You, at design time"],
    ["Path", "Dynamic, open-ended", "Explicit graph / code"],
    ["Predictability", "Lower — creative", "High — auditable"],
    ["Best for", "Conversations, research, open tasks", "Business processes, pipelines, approvals"],
    ["State & recovery", "Sessions", "Checkpoints, resume, HITL"],
  ];
  return (
    <Frame>
      <div className="grid gap-4 md:grid-cols-2">
        <Reveal>
          <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 p-4">
            <p className="flex items-center gap-2 font-display font-bold text-violet-300">
              <Bot className="size-5" /> Agent
            </p>
            <svg viewBox="0 0 260 110" className="mt-2 w-full">
              <circle cx="130" cy="55" r="24" fill="#8b5cf6" opacity=".35" stroke="#a78bfa" />
              <text x="130" y="59" textAnchor="middle" fontSize="11" fill="#fff">LLM</text>
              {[
                [40, 20, "tool A"],
                [220, 20, "tool B"],
                [40, 92, "memory"],
                [220, 92, "answer"],
              ].map(([x, y, t], i) => (
                <g key={i}>
                  <line x1="130" y1="55" x2={x as number} y2={y as number} stroke="#a78bfa" strokeWidth="1.5" className="flow-line" />
                  <rect x={(x as number) - 30} y={(y as number) - 11} width="60" height="22" rx="11" fill="#1e1b4b" stroke="#a78bfa" />
                  <text x={x as number} y={(y as number) + 4} textAnchor="middle" fontSize="10" fill="#ddd6fe">{t}</text>
                </g>
              ))}
            </svg>
            <p className="text-xs text-white/60">The model loops: think → call tools → think → answer.</p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-4">
            <p className="flex items-center gap-2 font-display font-bold text-cyan-300">
              <Network className="size-5" /> Workflow
            </p>
            <svg viewBox="0 0 260 110" className="mt-2 w-full">
              {[
                [20, 55, "start"],
                [95, 25, "agent"],
                [95, 85, "func"],
                [170, 55, "human"],
                [240, 55, "end"],
              ].map(([x, y, t], i) => (
                <g key={i}>
                  <rect x={(x as number) - 24} y={(y as number) - 12} width="48" height="24" rx="6" fill="#083344" stroke="#22d3ee" />
                  <text x={x as number} y={(y as number) + 4} textAnchor="middle" fontSize="10" fill="#cffafe">{t}</text>
                </g>
              ))}
              {[
                "M44 50 L71 30",
                "M44 60 L71 80",
                "M119 25 L146 50",
                "M119 85 L146 60",
                "M194 55 L216 55",
              ].map((d) => (
                <path key={d} d={d} stroke="#22d3ee" strokeWidth="1.5" className="flow-line" fill="none" />
              ))}
            </svg>
            <p className="text-xs text-white/60">You define nodes and edges; the runtime executes them.</p>
          </div>
        </Reveal>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <tbody>
            {rows.map(([k, a, w]) => (
              <tr key={k} className="border-b border-white/5 last:border-0">
                <td className="px-3 py-2 text-white/50">{k}</td>
                <td className="px-3 py-2 text-violet-200">{a}</td>
                <td className="px-3 py-2 text-cyan-200">{w}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  );
}

/* ── Use cases ─────────────────────────────────────────────────── */
export function UseCases() {
  const cases = [
    { icon: Headset, t: "Customer support", d: "Triage → specialist handoff → resolution with CRM tools", c: "#38bdf8" },
    { icon: FileSearch, t: "Research & reporting", d: "Gather, analyse and summarise market or competitor data", c: "#a78bfa" },
    { icon: Building, t: "Business operations", d: "KPIs, forecasting and recommendations from live data", c: "#f472b6" },
    { icon: ShoppingCart, t: "Procurement", d: "Compare vendors, draft POs, route for approval (HITL)", c: "#fbbf24" },
    { icon: HeartPulse, t: "Healthcare admin", d: "Summarise notes, prior-auth checks with human review", c: "#34d399" },
    { icon: ScrollText, t: "Compliance & legal", d: "Contract review, policy Q&A with citations and audit", c: "#fb923c" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cases.map((c, i) => (
        <Reveal key={c.t} delay={i * 0.06}>
          <div className="group h-full rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-1 hover:bg-white/[0.06]">
            <span className="mb-3 grid size-10 place-items-center rounded-xl" style={{ background: `${c.c}26` }}>
              <c.icon className="size-5" style={{ color: c.c }} />
            </span>
            <p className="font-display font-bold">{c.t}</p>
            <p className="mt-1 text-sm text-white/60">{c.d}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ── Agent anatomy (radial) ────────────────────────────────────── */
export function AgentAnatomy() {
  const parts = [
    { t: "client", d: "Model provider connection", req: true, c: "#fbbf24", icon: Cpu },
    { t: "instructions", d: "Role, rules, format", c: "#a78bfa", icon: ScrollText },
    { t: "tools", d: "Functions & MCP servers", c: "#fb923c", icon: Wrench },
    { t: "session", d: "Conversation state", c: "#34d399", icon: MessageSquare },
    { t: "context_providers", d: "Memory & knowledge", c: "#22d3ee", icon: Brain },
    { t: "middleware", d: "Guardrails, logging", c: "#f472b6", icon: ShieldCheck },
  ];
  const R = 140;
  return (
    <Frame caption="Agent(client=…, instructions=…, tools=[…], context_providers=[…], middleware=[…]) — only client is required.">
      <div className="relative mx-auto hidden aspect-square max-w-[420px] sm:block">
        <svg viewBox="-210 -210 420 420" className="absolute inset-0">
          {parts.map((p, i) => {
            const a = (i / parts.length) * Math.PI * 2 - Math.PI / 2;
            return <line key={p.t} x1="0" y1="0" x2={Math.cos(a) * R} y2={Math.sin(a) * R} stroke={p.c} strokeOpacity=".5" strokeWidth="2" className="flow-line" />;
          })}
          <circle r="62" fill="url(#core)" />
          <defs>
            <radialGradient id="core">
              <stop offset="0" stopColor="#c026d3" />
              <stop offset="1" stopColor="#4c1d95" />
            </radialGradient>
          </defs>
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <Bot className="mx-auto size-8" />
          <p className="font-display font-bold">Agent</p>
        </div>
        {parts.map((p, i) => {
          const a = (i / parts.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <motion.div
              key={p.t}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="absolute w-32 -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-[#0d0f26] p-2 text-center"
              style={{ left: `${50 + (Math.cos(a) * R * 100) / 420}%`, top: `${50 + (Math.sin(a) * R * 100) / 420}%`, borderColor: `${p.c}66` }}
            >
              <p.icon className="mx-auto size-4" style={{ color: p.c }} />
              <p className="font-mono text-[11px] font-semibold" style={{ color: p.c }}>
                {p.t}
                {p.req && " *"}
              </p>
              <p className="text-[10px] text-white/50">{p.d}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:hidden">
        {parts.map((p) => (
          <div key={p.t} className="rounded-lg border p-2" style={{ borderColor: `${p.c}55` }}>
            <p className="font-mono text-xs" style={{ color: p.c }}>
              {p.t}
            </p>
            <p className="text-[11px] text-white/50">{p.d}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ── Run loop ──────────────────────────────────────────────────── */
export function RunLoop() {
  const steps = [
    { t: "agent.run(msg)", d: "Your request", c: "#a78bfa" },
    { t: "before_run", d: "Context providers add history & knowledge", c: "#22d3ee" },
    { t: "middleware", d: "Agent → chat middleware", c: "#f472b6" },
    { t: "chat client", d: "Send to model provider", c: "#fbbf24" },
    { t: "tool loop", d: "Model calls tools ↺ until done", c: "#fb923c" },
    { t: "after_run", d: "Store history / memories", c: "#34d399" },
    { t: "AgentResponse", d: ".text · .messages · usage", c: "#a3e635" },
  ];
  return (
    <Frame caption="Lifecycle of a single agent.run() call">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
        {steps.map((s, i) => (
          <motion.div
            key={s.t}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative flex-1 rounded-xl border p-3"
            style={{ borderColor: `${s.c}55`, background: `${s.c}12` }}
          >
            <span className="absolute -top-2 left-2 rounded-full px-1.5 text-[10px] font-bold text-black" style={{ background: s.c }}>
              {i + 1}
            </span>
            <p className="font-mono text-xs font-semibold" style={{ color: s.c }}>
              {s.t}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-white/60">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </Frame>
  );
}

/* ── Providers ─────────────────────────────────────────────────── */
export function Providers() {
  const ps = [
    { n: "Groq", cls: "OpenAIChatCompletionClient + base_url", tag: "This workshop · BYOK", c: "#f97316" },
    { n: "Azure OpenAI", cls: "OpenAIChatCompletionClient(azure_endpoint=…)", tag: "Enterprise", c: "#38bdf8" },
    { n: "Microsoft Foundry", cls: "agent_framework.foundry", tag: "Hosted agents", c: "#a78bfa" },
    { n: "OpenAI", cls: "OpenAIChatClient (Responses)", tag: "", c: "#34d399" },
    { n: "Anthropic", cls: "agent_framework.anthropic", tag: "", c: "#fbbf24" },
    { n: "Ollama / local", cls: "agent_framework.ollama", tag: "Offline", c: "#f472b6" },
    { n: "Gemini", cls: "agent_framework.gemini", tag: "", c: "#22d3ee" },
    { n: "Amazon Bedrock", cls: "agent_framework.amazon", tag: "", c: "#a3e635" },
  ];
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {ps.map((p, i) => (
        <Reveal key={p.n} delay={i * 0.05}>
          <div className="h-full rounded-xl border p-3" style={{ borderColor: `${p.c}44`, background: `${p.c}0f` }}>
            <div className="flex items-center justify-between">
              <p className="font-display font-bold" style={{ color: p.c }}>
                {p.n}
              </p>
              {p.tag && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">{p.tag}</span>}
            </div>
            <p className="mt-1 font-mono text-[11px] text-white/60">{p.cls}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ── Tool calling sequence diagram ─────────────────────────────── */
export function ToolSequence() {
  const lanes = ["User", "Agent (MAF)", "LLM", "Python tool"];
  const colors = ["#e2e8f0", "#a78bfa", "#fbbf24", "#fb923c"];
  const msgs: [number, number, string][] = [
    [0, 1, "“Q1 margin for AI Copilot?”"],
    [1, 2, "messages + tool schemas"],
    [2, 1, "function_call sales_summary(product=…)"],
    [1, 3, "invoke sales_summary()"],
    [3, 1, "rows: revenue, cost …"],
    [1, 2, "function_result appended"],
    [2, 1, "function_call profit_margin(…)"],
    [1, 3, "invoke profit_margin()"],
    [3, 1, "margin=56.1%"],
    [1, 2, "function_result appended"],
    [2, 1, "final text answer"],
    [1, 0, "AgentResponse"],
  ];
  const W = 640, lx = (i: number) => 70 + i * 167, top = 40, step = 30;
  return (
    <Frame caption="Function calling loop: the model requests, MAF executes, results flow back until the model answers.">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${top + msgs.length * step + 20}`} className="min-w-[560px]">
          {lanes.map((l, i) => (
            <g key={l}>
              <rect x={lx(i) - 55} y="4" width="110" height="24" rx="12" fill={`${colors[i]}22`} stroke={colors[i]} />
              <text x={lx(i)} y="20" textAnchor="middle" fontSize="11" fill={colors[i]} fontWeight="600">{l}</text>
              <line x1={lx(i)} y1="30" x2={lx(i)} y2={top + msgs.length * step + 10} stroke={colors[i]} strokeOpacity=".25" strokeDasharray="3 4" />
            </g>
          ))}
          {msgs.map(([a, b, t], i) => {
            const y = top + i * step + 10;
            const x1 = lx(a), x2 = lx(b), dir = x2 > x1 ? 1 : -1;
            return (
              <motion.g key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <line x1={x1} y1={y} x2={x2 - dir * 6} y2={y} stroke={colors[a]} strokeWidth="1.6" />
                <path d={`M${x2} ${y} l${-dir * 7} -4 v8 z`} fill={colors[a]} />
                <text x={(x1 + x2) / 2} y={y - 5} textAnchor="middle" fontSize="10" fill="#cbd5e1">{t}</text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </Frame>
  );
}

/* ── Anatomy of a tool ─────────────────────────────────────────── */
export function ToolAnatomy() {
  const parts = [
    { code: "@tool", note: "registers a FunctionTool", c: "#fb923c" },
    { code: "def profit_margin(", note: "name → tool name", c: "#fbbf24" },
    { code: "  revenue: Annotated[float, Field(description=…)]", note: "type + description → JSON schema", c: "#22d3ee" },
    { code: ") -> str:", note: "return text the model can read", c: "#a3e635" },
    { code: '  """Calculate profit and margin."""', note: "docstring → tool description", c: "#f472b6" },
  ];
  return (
    <Frame>
      <div className="space-y-1.5">
        {parts.map((p, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <code className="flex-1 rounded-md border px-3 py-1.5 font-mono text-xs" style={{ borderColor: `${p.c}55`, background: `${p.c}12`, color: p.c }}>
                {p.code}
              </code>
              <span className="hidden text-white/30 sm:inline">→</span>
              <span className="text-xs text-white/70 sm:w-64">{p.note}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </Frame>
  );
}

/* ── Session memory growth ─────────────────────────────────────── */
export function SessionMemory() {
  const turns = [
    { u: "Budget is $40k.", n: 2 },
    { u: "Which plan fits us?", n: 4 },
    { u: "What budget did I mention?", n: 6 },
    { u: "Summarise our chat (resumed)", n: 8 },
  ];
  return (
    <Frame caption="Measured in the lab: messages sent to the model per turn when the same session is reused.">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          {turns.map((t, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-white/70">
                    Turn {i + 1}: <i>“{t.u}”</i>
                  </span>
                  <span className="font-mono text-emerald-300">{t.n} msgs</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: t.n }).map((_, k) => (
                    <motion.span
                      key={k}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 + k * 0.04 }}
                      className={`h-5 flex-1 origin-bottom rounded ${k % 2 ? "bg-teal-400/70" : "bg-violet-400/70"}`}
                    />
                  ))}
                  {Array.from({ length: 8 - t.n }).map((_, k) => (
                    <span key={`e${k}`} className="h-5 flex-1 rounded bg-white/5" />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
          <div className="flex gap-4 pt-1 text-[11px] text-white/50">
            <span className="flex items-center gap-1">
              <i className="size-2.5 rounded bg-violet-400/70" /> user
            </span>
            <span className="flex items-center gap-1">
              <i className="size-2.5 rounded bg-teal-400/70" /> assistant
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
          <p className="mb-3 font-display text-sm font-bold text-emerald-300">Per-run pipeline</p>
          {[
            ["AgentSession", "session_id + state dict", "#34d399"],
            ["before_run()", "history + profile injected", "#22d3ee"],
            ["Model call", "sees the full context", "#fbbf24"],
            ["after_run()", "new messages & memories saved to state", "#f472b6"],
          ].map(([a, b, c], i) => (
            <div key={a} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <span className="size-3 rounded-full" style={{ background: c }} />
                {i < 3 && <span className="h-8 w-px bg-white/15" />}
              </div>
              <div className="-mt-6 pb-2 first:mt-0">
                <p className="font-mono text-xs" style={{ color: c }}>
                  {a}
                </p>
                <p className="text-[11px] text-white/55">{b}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ── Memory types ──────────────────────────────────────────────── */
export function MemoryTypes() {
  const kinds = [
    { t: "Short-term", s: "Conversation history", how: "AgentSession + InMemory / File / Redis history provider", life: "This conversation", c: "#34d399", icon: MessageSquare, fill: 45 },
    { t: "Long-term", s: "Facts & knowledge", how: "ContextProvider, Mem0, vector stores (VectorCollectionContextProvider)", life: "Across sessions", c: "#22d3ee", icon: Database, fill: 90 },
    { t: "Working state", s: "Task variables", how: "session state dict, workflow state & checkpoints", life: "Until the task completes", c: "#a78bfa", icon: Layers, fill: 65 },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {kinds.map((k, i) => (
        <Reveal key={k.t} delay={i * 0.1}>
          <div className="h-full rounded-xl border p-4" style={{ borderColor: `${k.c}44`, background: `${k.c}0d` }}>
            <k.icon className="size-6" style={{ color: k.c }} />
            <p className="mt-2 font-display text-lg font-bold">{k.t}</p>
            <p className="text-xs text-white/50">{k.s}</p>
            <p className="mt-3 text-sm text-white/75">{k.how}</p>
            <p className="mt-3 text-[11px] uppercase tracking-wider text-white/40">Lifetime</p>
            <div className="mt-1 h-2 rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${k.fill}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                className="h-2 rounded-full"
                style={{ background: k.c }}
              />
            </div>
            <p className="mt-1 text-xs" style={{ color: k.c }}>
              {k.life}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
