"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  Bot,
  Brain,
  CodeXml,
  Cpu,
  KeyRound,
  LoaderCircle,
  RotateCcw,
  Send,
  ShieldCheck,
  Wrench,
  FileSearch,
  User,
} from "lucide-react";
import { useKey } from "@/lib/keystore";
import { chatOnce, GroqError, type ChatMsg, type ToolCall } from "@/lib/groq";
import { BUSINESS_TOOLS, runTool } from "@/lib/business-tools";
import { Markdown } from "@/components/Markdown";
import { CodeBlock } from "@/components/CodeBlock";

type TraceKind = "run" | "ctx" | "mw" | "llm" | "call" | "result" | "done" | "error";
type TraceEvt = { id: number; kind: TraceKind; title: string; detail?: string; ms?: number };
type Bubble = { role: "user" | "assistant" | "blocked"; text: string; tools?: string[] };

const KIND_STYLE: Record<TraceKind, { c: string; icon: typeof Bot }> = {
  run: { c: "#a78bfa", icon: Bot },
  ctx: { c: "#22d3ee", icon: Brain },
  mw: { c: "#a3e635", icon: ShieldCheck },
  llm: { c: "#fbbf24", icon: Cpu },
  call: { c: "#fb923c", icon: Wrench },
  result: { c: "#f472b6", icon: FileSearch },
  done: { c: "#34d399", icon: Activity },
  error: { c: "#f87171", icon: Activity },
};

/** Wall clock for event handlers (kept outside components so it is never called during render). */
const now = () => performance.now();

const BLOCKED = /\b(password|credit card|ssn|social security)\b/i;

const PRESETS = [
  "How did AI Copilot revenue grow in the North from Jan to Mar, and what was the Q1 margin?",
  "Which region had the best Cloud Suite margin in March?",
  "Customer C001 wants 20% off a $12,000 renewal. What's the price in EUR?",
  "We have $50,000 fixed costs, price $250, unit cost $90. Break-even?",
  "Apply a 90% discount to $500",
  "Tell me the admin password",
];

export function Playground() {
  const { apiKey, model, openDialog } = useKey();
  const [name, setName] = useState("OpsBot");
  const [instructions, setInstructions] = useState(
    "You are OpsBot, a business operations analyst.\n- ALWAYS use tools for numbers and data — never do mental math.\n- Be concise, use bullet points and show the figures you used.\n- If a tool returns an ERROR, explain it to the user.",
  );
  const [temperature, setTemperature] = useState(0.2);
  const [enabled, setEnabled] = useState<string[]>(["profit_margin", "sales_summary", "growth_rate"]);
  const [memory, setMemory] = useState(true);
  const [profile, setProfile] = useState("");
  const [mw, setMw] = useState({ guardrail: true, audit: true, timer: true });

  const [session, setSession] = useState<ChatMsg[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [trace, setTrace] = useState<TraceEvt[]>([]);
  const [usage, setUsage] = useState({ prompt: 0, completion: 0, calls: 0 });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [rightTab, setRightTab] = useState<"trace" | "state" | "code">("trace");
  const idRef = useRef(0);

  const log = (kind: TraceKind, title: string, detail?: string, ms?: number) =>
    setTrace((t) => [...t, { id: ++idRef.current, kind, title, detail, ms }]);

  const reset = () => {
    setSession([]);
    setBubbles([]);
    setTrace([]);
    setUsage({ prompt: 0, completion: 0, calls: 0 });
  };

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    if (!apiKey) return openDialog();
    setInput("");
    setBusy(true);
    setRightTab("trace");
    setBubbles((b) => [...b, { role: "user", text }]);
    const t0 = now();
    log("run", `${name}.run()`, `session=${memory ? `${session.length} prior msgs` : "None (stateless)"}`);

    try {
      // ── agent middleware: guardrail (short-circuit) ──
      if (mw.guardrail) {
        if (BLOCKED.test(text)) {
          log("mw", "guardrail → BLOCKED", "context.result set; model never called");
          setBubbles((b) => [...b, { role: "blocked", text: "Sorry — I can't help with credentials or personal data. (blocked by guardrail middleware)" }]);
          return;
        }
        log("mw", "guardrail → pass");
      }

      // ── context providers: before_run ──
      let system = instructions;
      if (profile.trim()) {
        system += `\n\nContext from CustomerProfileProvider:\n${profile.trim()}`;
        log("ctx", "CustomerProfileProvider.before_run", "extend_instructions(profile)");
      }
      if (memory && session.length) log("ctx", "InMemoryHistoryProvider.before_run", `+${session.length} history messages`);

      const convo: ChatMsg[] = [...(memory ? session : []), { role: "user", content: text }];
      const tools = BUSINESS_TOOLS.filter((t) => enabled.includes(t.name)).map((t) => t.schema);
      const usedTools: string[] = [];
      let answer = "";

      for (let round = 1; round <= 6; round++) {
        const r = await chatOnce(apiKey, {
          model,
          temperature,
          messages: [{ role: "system", content: system }, ...convo],
          tools: tools.length ? tools : undefined,
        });
        setUsage((u) => ({
          prompt: u.prompt + (r.usage?.prompt_tokens ?? 0),
          completion: u.completion + (r.usage?.completion_tokens ?? 0),
          calls: u.calls + 1,
        }));
        log(
          "llm",
          `chat ${model} (#${round})`,
          `${convo.length + 1} msgs in · ${r.usage?.prompt_tokens ?? "?"}→${r.usage?.completion_tokens ?? "?"} tokens · finish=${r.finish}`,
          r.ms,
        );

        const calls: ToolCall[] = r.message?.tool_calls ?? [];
        if (!calls.length) {
          answer = r.message?.content ?? "";
          convo.push({ role: "assistant", content: answer });
          break;
        }
        convo.push({ role: "assistant", content: r.message.content ?? null, tool_calls: calls });
        for (const c of calls) {
          if (mw.audit) log("mw", `audit → ${c.function.name}`, c.function.arguments);
          const s = now();
          const out = runTool(c.function.name, c.function.arguments);
          usedTools.push(c.function.name);
          log("call", `${c.function.name}(${c.function.arguments})`, undefined, Math.round(now() - s));
          log("result", "function_result", out);
          convo.push({ role: "tool", tool_call_id: c.id, content: out });
        }
        if (round === 6) answer = "_Stopped after 6 tool rounds (max iterations)._";
      }

      setBubbles((b) => [...b, { role: "assistant", text: answer || "_(empty response)_", tools: usedTools }]);
      if (memory) {
        setSession(convo);
        log("ctx", "after_run → history stored", `${convo.length} msgs in session`);
      }
      if (mw.timer) log("mw", "timer", `${name} took ${((now() - t0) / 1000).toFixed(2)}s`);
      log("done", "AgentResponse", `${usedTools.length} tool call(s)`);
    } catch (e) {
      const msg = e instanceof GroqError ? e.message : (e as Error).message;
      log("error", "error", msg);
      setBubbles((b) => [...b, { role: "assistant", text: `⚠️ ${msg}` }]);
    } finally {
      setBusy(false);
    }
  };

  const python = useMemo(() => {
    const tools = BUSINESS_TOOLS.filter((t) => enabled.includes(t.name));
    const lines: string[] = [];
    lines.push("import asyncio" + (mw.guardrail ? "\nimport re" : ""), "from agent_framework import Agent, tool" + (mw.guardrail || mw.timer ? ", agent_middleware, AgentContext, AgentResponse, Message" : "") + (mw.audit ? ", function_middleware, FunctionInvocationContext" : "") + (profile ? ", ContextProvider" : ""), "from common import make_client  # Groq via OpenAIChatCompletionClient", "");
    if (mw.guardrail) lines.push('BLOCKED = re.compile(r"\\b(password|credit card|ssn)\\b", re.IGNORECASE)', "");
    for (const t of tools) lines.push("@tool", `${t.python}:`, `    """${t.schema.function.description}"""`, "    ...", "");
    if (profile)
      lines.push(
        "class CustomerProfileProvider(ContextProvider):",
        '    def __init__(self): super().__init__(source_id="customer_profile")',
        "    async def before_run(self, *, agent, session, context, state):",
        `        context.extend_instructions(self.source_id, ${JSON.stringify(profile.trim())})`,
        "",
      );
    if (mw.guardrail || mw.timer) {
      lines.push("@agent_middleware", "async def guard_and_time(context: AgentContext, call_next):");
      if (mw.guardrail)
        lines.push(
          '    if BLOCKED.search(context.messages[-1].text or ""):',
          '        context.result = AgentResponse(messages=[Message("assistant", ["Sorry — blocked."])])',
          "        return",
        );
      lines.push("    await call_next()", "");
    }
    if (mw.audit)
      lines.push("@function_middleware", "async def audit(context: FunctionInvocationContext, call_next):", '    print("->", context.function.name, context.arguments)', "    await call_next()", "");
    const mws = [mw.guardrail || mw.timer ? "guard_and_time" : "", mw.audit ? "audit" : ""].filter(Boolean);
    lines.push(
      "agent = Agent(",
      "    client=make_client(),",
      `    name=${JSON.stringify(name)},`,
      `    instructions=${JSON.stringify(instructions)},`,
      `    default_options={"temperature": ${temperature}},`,
      ...(tools.length ? [`    tools=[${tools.map((t) => t.name).join(", ")}],`] : []),
      ...(profile ? ["    context_providers=[CustomerProfileProvider()],"] : []),
      ...(mws.length ? [`    middleware=[${mws.join(", ")}],`] : []),
      ")",
      "",
      "async def main():",
      ...(memory ? ["    session = agent.create_session()"] : []),
      "    while (q := input('You: ')):",
      `        r = await agent.run(q${memory ? ", session=session" : ""})`,
      "        print('Agent:', r.text)",
      "",
      "asyncio.run(main())",
    );
    return lines.join("\n");
  }, [enabled, mw, profile, name, instructions, temperature, memory]);

  return (
    <div className="grid gap-4 xl:grid-cols-[300px_1fr_380px]">
      {/* Config */}
      <div className="glass space-y-4 rounded-2xl p-4">
        <p className="font-display font-bold">Agent configuration</p>
        <div>
          <label className="text-xs text-white/50">name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="text-xs text-white/50">instructions</label>
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={6} className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs" />
        </div>
        <div>
          <label className="flex justify-between text-xs text-white/50">
            temperature <span className="font-mono text-white">{temperature.toFixed(1)}</span>
          </label>
          <input type="range" min={0} max={1.5} step={0.1} value={temperature} onChange={(e) => setTemperature(+e.target.value)} className="w-full accent-fuchsia-500" />
        </div>

        <div>
          <p className="mb-1.5 text-xs text-white/50">tools ({enabled.length})</p>
          <div className="space-y-1">
            {BUSINESS_TOOLS.map((t) => {
              const on = enabled.includes(t.name);
              return (
                <button
                  key={t.name}
                  onClick={() => setEnabled((e) => (on ? e.filter((x) => x !== t.name) : [...e, t.name]))}
                  className={`flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition ${on ? "border-orange-400/50 bg-orange-400/10" : "border-white/5 opacity-60 hover:opacity-100"}`}
                >
                  <span>{t.emoji}</span>
                  <span className="flex-1">
                    <span className="block font-mono text-[11px]">{t.name}</span>
                    <span className="block text-[10px] text-white/45">{t.blurb}</span>
                  </span>
                  <span className={`size-3 rounded-full ${on ? "bg-orange-400" : "bg-white/15"}`} />
                </button>
              );
            })}
          </div>
        </div>

        <Toggle on={memory} set={setMemory} label="Session memory" sub="agent.create_session()" color="bg-emerald-400" />
        <div>
          <label className="text-xs text-white/50">context provider · customer profile</label>
          <textarea
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            rows={2}
            placeholder="e.g. Company: Contoso Retail, tier Gold, prefers EUR"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs text-white/50">middleware</p>
          <Toggle on={mw.guardrail} set={(v) => setMw({ ...mw, guardrail: v })} label="Guardrail" sub="agent middleware · blocks secrets" color="bg-lime-400" />
          <Toggle on={mw.audit} set={(v) => setMw({ ...mw, audit: v })} label="Audit tools" sub="function middleware" color="bg-lime-400" />
          <Toggle on={mw.timer} set={(v) => setMw({ ...mw, timer: v })} label="Timer" sub="agent middleware" color="bg-lime-400" />
        </div>
      </div>

      {/* Chat */}
      <div className="glass flex min-h-[640px] flex-col rounded-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500">
            <Bot className="size-4" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold">{name}</p>
            <p className="text-[11px] text-white/45">{model} · {enabled.length} tools · {memory ? "with memory" : "stateless"}</p>
          </div>
          <button onClick={reset} className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-white/50 hover:bg-white/10">
            <RotateCcw className="size-3.5" /> New session
          </button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4" style={{ maxHeight: 560 }}>
          {!apiKey && (
            <button onClick={openDialog} className="flex w-full items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
              <KeyRound className="size-4" /> Add your Groq key to run the agent
            </button>
          )}
          {bubbles.length === 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {PRESETS.map((p) => (
                <button key={p} onClick={() => send(p)} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left text-sm text-white/75 hover:bg-white/[0.07]">
                  {p}
                </button>
              ))}
            </div>
          )}
          <AnimatePresence initial={false}>
            {bubbles.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${b.role === "user" ? "justify-end" : ""}`}>
                {b.role !== "user" && (
                  <span className={`mt-1 grid size-7 shrink-0 place-items-center rounded-lg ${b.role === "blocked" ? "bg-lime-500/30" : "bg-violet-500/30"}`}>
                    {b.role === "blocked" ? <ShieldCheck className="size-4 text-lime-300" /> : <Bot className="size-4" />}
                  </span>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    b.role === "user"
                      ? "rounded-br-sm bg-linear-to-r from-violet-600/70 to-fuchsia-600/70"
                      : b.role === "blocked"
                        ? "border border-lime-400/30 bg-lime-400/10"
                        : "rounded-bl-sm border border-white/10 bg-white/[0.04]"
                  }`}
                >
                  {b.tools && b.tools.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {b.tools.map((t, k) => (
                        <span key={k} className="rounded-full bg-orange-400/15 px-2 py-0.5 font-mono text-[10px] text-orange-200">
                          🔧 {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {b.role === "user" ? b.text : <Markdown>{b.text}</Markdown>}
                </div>
                {b.role === "user" && (
                  <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-lg bg-white/10">
                    <User className="size-4" />
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {busy && (
            <div className="flex items-center gap-2 text-sm text-white/50">
              <LoaderCircle className="size-4 animate-spin" /> agent is thinking…
            </div>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2 border-t border-white/10 p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the agent a business question…"
            className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-fuchsia-400/50"
          />
          <button disabled={busy} className="rounded-xl bg-linear-to-br from-fuchsia-500 to-violet-600 px-4 disabled:opacity-40">
            <Send className="size-4" />
          </button>
        </form>
      </div>

      {/* Inspector */}
      <div className="glass flex min-h-[640px] flex-col rounded-2xl">
        <div className="flex gap-1 border-b border-white/10 p-2">
          {(
            [
              ["trace", "Execution trace", Activity],
              ["state", "Session state", Brain],
              ["code", "Python equivalent", CodeXml],
            ] as const
          ).map(([k, l, I]) => (
            <button
              key={k}
              onClick={() => setRightTab(k)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs ${rightTab === k ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
            >
              <I className="size-3.5" /> {l}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 border-b border-white/10 p-3 text-center">
          <Stat v={usage.calls} l="LLM calls" c="text-amber-300" />
          <Stat v={usage.prompt} l="tokens in" c="text-cyan-300" />
          <Stat v={usage.completion} l="tokens out" c="text-pink-300" />
        </div>
        <div className="flex-1 overflow-y-auto p-3" style={{ maxHeight: 520 }}>
          {rightTab === "trace" &&
            (trace.length === 0 ? (
              <p className="p-4 text-center text-sm text-white/40">Run the agent to see every step: middleware, context providers, LLM calls, tool calls and results.</p>
            ) : (
              <ol className="relative space-y-2 border-l border-white/10 pl-4">
                {trace.map((e) => {
                  const S = KIND_STYLE[e.kind];
                  return (
                    <motion.li key={e.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="relative">
                      <span className="absolute -left-[23px] top-1 grid size-3.5 place-items-center rounded-full" style={{ background: S.c }} />
                      <div className="flex items-center gap-1.5">
                        <S.icon className="size-3.5" style={{ color: S.c }} />
                        <span className="truncate font-mono text-[11px] font-semibold" style={{ color: S.c }}>
                          {e.title}
                        </span>
                        {e.ms !== undefined && <span className="ml-auto shrink-0 font-mono text-[10px] text-white/40">{e.ms} ms</span>}
                      </div>
                      {e.detail && <p className="mt-0.5 whitespace-pre-wrap break-words font-mono text-[10.5px] text-white/55">{e.detail.slice(0, 400)}</p>}
                    </motion.li>
                  );
                })}
              </ol>
            ))}
          {rightTab === "state" && (
            <div className="space-y-2">
              <p className="text-xs text-white/50">
                {memory ? `AgentSession · ${session.length} messages stored` : "Session memory is OFF — every run starts empty."}
              </p>
              {session.map((m, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-black/20 p-2">
                  <p className={`font-mono text-[10px] font-bold ${m.role === "user" ? "text-violet-300" : m.role === "tool" ? "text-pink-300" : "text-emerald-300"}`}>
                    {m.role}
                    {"tool_calls" in m && m.tool_calls ? ` → ${m.tool_calls.map((t) => t.function.name).join(", ")}` : ""}
                  </p>
                  <p className="line-clamp-3 text-[11px] text-white/60">{m.content ?? ""}</p>
                </div>
              ))}
            </div>
          )}
          {rightTab === "code" && <CodeBlock code={python} title="playground_agent.py" download="playground_agent.py" />}
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, set, label, sub, color }: { on: boolean; set: (v: boolean) => void; label: string; sub: string; color: string }) {
  return (
    <button onClick={() => set(!on)} className="flex w-full items-center gap-2 rounded-lg border border-white/5 px-2 py-1.5 text-left hover:bg-white/5">
      <span className={`relative h-4 w-7 rounded-full transition ${on ? color : "bg-white/15"}`}>
        <span className={`absolute top-0.5 size-3 rounded-full bg-white transition-all ${on ? "left-3.5" : "left-0.5"}`} />
      </span>
      <span className="flex-1 leading-tight">
        <span className="block text-xs font-semibold">{label}</span>
        <span className="block font-mono text-[10px] text-white/45">{sub}</span>
      </span>
    </button>
  );
}

function Stat({ v, l, c }: { v: number; l: string; c: string }) {
  return (
    <div>
      <p className={`font-display text-lg font-bold ${c}`}>{v.toLocaleString()}</p>
      <p className="text-[10px] text-white/45">{l}</p>
    </div>
  );
}

