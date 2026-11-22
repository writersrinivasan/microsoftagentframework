"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { CircleCheck, CodeXml, Hand, KeyRound, LoaderCircle, Play, Settings2, Square } from "lucide-react";
import { useKey } from "@/lib/keystore";
import { chatStream } from "@/lib/groq";
import { Markdown } from "@/components/Markdown";
import { CodeBlock } from "@/components/CodeBlock";

type Mode = "sequential" | "concurrent" | "coordinator";
type Status = "idle" | "running" | "done" | "waiting" | "error";
type AgentDef = { id: string; name: string; color: string; instructions: string };
type Run = { status: Status; output: string; start?: number; end?: number; last?: number };

const AGENTS: Record<string, AgentDef> = {
  plan: { id: "plan", name: "Coordinator · plan", color: "#fbbf24", instructions: "You are the coordinator of a business operations team. Restate the goal in one line and list 3 focused research questions. Be brief." },
  research: { id: "research", name: "Research", color: "#38bdf8", instructions: "You are a research agent. Gather relevant facts, benchmarks and context for the request. Return 5-7 concise evidence bullets. No recommendations." },
  analysis: { id: "analysis", name: "Analysis", color: "#a78bfa", instructions: "You are an analysis agent. From the evidence, output: **Key insights** (3), **Risks** (2), **Opportunities** (2). Be specific." },
  recommend: { id: "recommend", name: "Recommendation", color: "#f472b6", instructions: "You are a recommendation agent. Write 3 prioritised, actionable recommendations, each with an owner, a KPI and a 30/60/90-day step." },
  finance: { id: "finance", name: "Finance", color: "#34d399", instructions: "Assess the request from a FINANCIAL lens (cost, revenue, ROI) in 3-4 bullets." },
  ops: { id: "ops", name: "Operations", color: "#fb923c", instructions: "Assess the request from an OPERATIONS lens (people, process, tooling) in 3-4 bullets." },
  risk: { id: "risk", name: "Risk", color: "#f87171", instructions: "Assess the request from a RISK & COMPLIANCE lens in 3-4 bullets." },
  consolidate: { id: "consolidate", name: "Coordinator · brief", color: "#facc15", instructions: "You are the coordinator. Consolidate the team's work into an executive brief with sections: Summary, Key Insights, Recommendations, Next Steps. Respect the reviewer note. Max 250 words." },
};

const PIPELINES: Record<Mode, string[][]> = {
  // each inner array = one superstep (agents in the same step run concurrently)
  sequential: [["research"], ["analysis"], ["recommend"]],
  concurrent: [["finance", "ops", "risk"]],
  coordinator: [["plan"], ["research"], ["analysis"], ["recommend"], ["consolidate"]],
};

const now = () => performance.now();

const SCENARIOS = [
  { t: "Churn spike", q: "Our B2B SaaS monthly churn rose from 3% to 5% this quarter, mostly among SMB customers. What should we do?" },
  { t: "EU expansion", q: "Should we expand our AI Copilot product into the European market next year?" },
  { t: "Onboarding", q: "Reduce customer onboarding time by 30% next quarter without adding headcount." },
  { t: "Supply delay", q: "A key supplier announced a 6-week delay on components for our best-selling device. How do we respond?" },
  { t: "Support costs", q: "Customer support costs grew 40% YoY while ticket volume grew 15%. Diagnose and recommend." },
];

export function Studio() {
  const { apiKey, model, openDialog } = useKey();
  const [mode, setMode] = useState<Mode>("sequential");
  const [request, setRequest] = useState(SCENARIOS[0].q);
  const [defs, setDefs] = useState(AGENTS);
  const [hitl, setHitl] = useState(true);
  const [runs, setRuns] = useState<Record<string, Run>>({});
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [approval, setApproval] = useState<{ draft: string } | null>(null);
  const [note, setNote] = useState("approve");
  const resolver = useRef<((v: string) => void) | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const t0 = useRef(0);
  const current = useRef<string | null>(null);

  const steps = PIPELINES[mode];
  const ids = steps.flat();

  const patch = (id: string, p: Partial<Run>) => setRuns((r) => ({ ...r, [id]: { ...(r[id] ?? { status: "idle", output: "" }), ...p } }));

  const runAgent = async (id: string, input: string, signal: AbortSignal) => {
    const a = defs[id];
    patch(id, { status: "running", output: "", start: now() - t0.current });
    current.current = id;
    let out = "";
    for await (const d of chatStream(
      apiKey,
      { model, temperature: 0.4, max_tokens: 700, messages: [{ role: "system", content: a.instructions }, { role: "user", content: input }] },
      signal,
    )) {
      out += d;
      patch(id, { output: out, last: now() - t0.current });
    }
    patch(id, { status: "done", end: now() - t0.current });
    return out;
  };

  const start = async () => {
    if (!apiKey) return openDialog();
    setBusy(true);
    setRuns({});
    setApproval(null);
    t0.current = now();
    const ac = new AbortController();
    abortRef.current = ac;
    const outputs: Record<string, string> = {};
    try {
      if (mode === "concurrent") {
        const res = await Promise.all(steps[0].map((id) => runAgent(id, request, ac.signal)));
        steps[0].forEach((id, i) => (outputs[id] = res[i]));
      } else if (mode === "sequential") {
        // Like SequentialBuilder: each agent sees the request + all previous outputs
        let convo = `User request: ${request}`;
        for (const [id] of steps) {
          outputs[id] = await runAgent(id, convo, ac.signal);
          convo += `\n\n[${defs[id].name}]\n${outputs[id]}`;
        }
      } else {
        outputs.plan = await runAgent("plan", `PLANNING. Request: ${request}`, ac.signal);
        outputs.research = await runAgent("research", outputs.plan, ac.signal);
        outputs.analysis = await runAgent("analysis", outputs.research, ac.signal);
        outputs.recommend = await runAgent("recommend", outputs.analysis, ac.signal);
        let reviewer = "approve";
        if (hitl) {
          patch("consolidate", { status: "waiting" });
          setApproval({ draft: outputs.recommend });
          reviewer = await new Promise<string>((res) => (resolver.current = res));
          setApproval(null);
        }
        outputs.consolidate = await runAgent(
          "consolidate",
          `Original request: ${request}\n\nInsights:\n${outputs.analysis}\n\nRecommendations:\n${outputs.recommend}\n\nReviewer note: ${reviewer}`,
          ac.signal,
        );
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        const id = current.current ?? ids[0];
        patch(id, { status: "error", output: `⚠️ ${(e as Error).message}` });
      }
    } finally {
      setBusy(false);
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    resolver.current?.("approve");
    setBusy(false);
  };

  const total = Math.max(1, ...Object.values(runs).map((r) => r.end ?? r.last ?? 0));
  const finalId = mode === "coordinator" ? "consolidate" : null;

  const python = useMemo(() => {
    const agentLines = ids
      .filter((id) => !["plan", "consolidate"].includes(id))
      .map((id) => `${id} = Agent(client=client, name="${defs[id].name}", instructions=${JSON.stringify(defs[id].instructions)})`);
    if (mode === "sequential")
      return [
        "from agent_framework import Agent",
        "from agent_framework.orchestrations import SequentialBuilder",
        "from common import make_client",
        "",
        "client = make_client()",
        ...agentLines,
        "",
        `workflow = SequentialBuilder(participants=[${ids.join(", ")}], output_from="all").build()`,
        `result = await workflow.run(${JSON.stringify(request)})`,
        "for response in result.get_outputs():",
        "    for msg in response.messages:",
        '        print(f"[{msg.author_name}] {msg.text}")',
      ].join("\n");
    if (mode === "concurrent")
      return [
        "from agent_framework import Agent",
        "from agent_framework.orchestrations import ConcurrentBuilder",
        "from common import make_client",
        "",
        "client = make_client()",
        ...agentLines,
        "",
        `workflow = ConcurrentBuilder(participants=[${ids.join(", ")}]).build()`,
        `aggregated = (await workflow.run(${JSON.stringify(request)})).get_outputs()[-1]`,
        "for msg in aggregated.messages:",
        '    print(f"[{msg.author_name}] {msg.text}")',
      ].join("\n");
    return "# Coordinator mode = labs/capstone_business_ops.py (functional workflow + human approval)\n# See the Capstone page or download it from Module 8.";
  }, [mode, ids, defs, request]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="glass rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          {(["sequential", "concurrent", "coordinator"] as Mode[]).map((m) => (
            <button
              key={m}
              disabled={busy}
              onClick={() => {
                setMode(m);
                setRuns({});
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${
                mode === m ? "bg-linear-to-r from-pink-500 to-violet-600 shadow-lg shadow-pink-500/20" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {m}
            </button>
          ))}
          {mode === "coordinator" && (
            <label className="ml-2 flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={hitl} onChange={(e) => setHitl(e.target.checked)} className="accent-amber-400" />
              <Hand className="size-4 text-amber-300" /> Human approval before final brief
            </label>
          )}
          <button onClick={() => setShowCode(!showCode)} className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-white/60 hover:bg-white/10">
            <CodeXml className="size-4" /> {showCode ? "Hide" : "Show"} Python
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SCENARIOS.map((s) => (
            <button key={s.t} onClick={() => setRequest(s.q)} className={`rounded-full border px-3 py-1 text-xs ${request === s.q ? "border-pink-400/60 bg-pink-400/15" : "border-white/10 text-white/60 hover:bg-white/5"}`}>
              {s.t}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <textarea value={request} onChange={(e) => setRequest(e.target.value)} rows={2} className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm" />
          {busy ? (
            <button onClick={stop} className="flex items-center gap-2 rounded-xl bg-rose-500/80 px-5 font-semibold">
              <Square className="size-4" /> Stop
            </button>
          ) : (
            <button onClick={start} className="flex items-center gap-2 rounded-xl bg-linear-to-r from-pink-500 to-violet-600 px-5 font-semibold">
              {apiKey ? <Play className="size-4" /> : <KeyRound className="size-4" />} Run
            </button>
          )}
        </div>
      </div>

      {showCode && <CodeBlock code={python} title={`${mode}_workflow.py`} />}

      {/* Graph */}
      <div className="glass overflow-x-auto rounded-2xl p-5">
        <div className="flex min-w-max items-center gap-3">
          <Node label="User request" color="#e2e8f0" status={busy || Object.keys(runs).length ? "done" : "idle"} />
          {steps.map((group, gi) => (
            <div key={gi} className="flex items-center gap-3">
              <Edge active={group.some((id) => runs[id]?.status === "running")} />
              <div className="flex flex-col gap-2">
                {mode === "coordinator" && group[0] === "consolidate" && hitl && (
                  <Node label="👤 Manager approval" color="#fbbf24" status={approval ? "waiting" : runs.consolidate ? "done" : "idle"} small />
                )}
                {group.map((id) => (
                  <Node
                    key={id}
                    label={defs[id].name}
                    color={defs[id].color}
                    status={runs[id]?.status ?? "idle"}
                    onEdit={busy ? undefined : () => setEditing(editing === id ? null : id)}
                  />
                ))}
              </div>
            </div>
          ))}
          <Edge active={false} />
          <Node label={mode === "concurrent" ? "Aggregate" : "Output"} color="#34d399" status={!busy && Object.values(runs).some((r) => r.status === "done") ? "done" : "idle"} />
        </div>
        {editing && (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
            <p className="mb-1 text-xs text-white/50">instructions · {defs[editing].name}</p>
            <textarea
              value={defs[editing].instructions}
              onChange={(e) => setDefs({ ...defs, [editing]: { ...defs[editing], instructions: e.target.value } })}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
            />
          </div>
        )}
      </div>

      {/* Human approval */}
      {approval && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 border-amber-400/60 bg-amber-400/10 p-5">
          <p className="flex items-center gap-2 font-display font-bold text-amber-200">
            <Hand className="size-5" /> Workflow paused — ctx.request_info(request_id=&quot;manager_approval&quot;)
          </p>
          <div className="mt-3 max-h-64 overflow-y-auto rounded-xl bg-black/30 p-3">
            <Markdown>{approval.draft}</Markdown>
          </div>
          <div className="mt-3 flex gap-2">
            <input value={note} onChange={(e) => setNote(e.target.value)} className="flex-1 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm" placeholder="approve, or add guidance…" />
            <button onClick={() => resolver.current?.(note || "approve")} className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 font-semibold text-black">
              <CircleCheck className="size-4" /> Resume
            </button>
          </div>
          <p className="mt-2 text-xs text-white/50">Python: result = await wf.run(responses=&#123;&quot;manager_approval&quot;: note&#125;)</p>
        </motion.div>
      )}

      {/* Timeline */}
      {Object.keys(runs).length > 0 && (
        <div className="glass rounded-2xl p-4">
          <p className="mb-3 font-display text-sm font-bold">Execution timeline {mode === "concurrent" ? "· parallel fan-out" : "· one after another"}</p>
          <div className="space-y-1.5">
            {ids.map((id) => {
              const r = runs[id];
              if (!r?.start && r?.start !== 0) return null;
              const end = r.end ?? r.last ?? r.start;
              return (
                <div key={id} className="flex items-center gap-2">
                  <span className="w-36 shrink-0 truncate text-xs" style={{ color: defs[id].color }}>
                    {defs[id].name}
                  </span>
                  <div className="relative h-5 flex-1 rounded bg-white/5">
                    <div
                      className={`absolute inset-y-0 rounded ${r.status === "running" ? "pulse-soft" : ""}`}
                      style={{ left: `${(r.start / total) * 100}%`, width: `${Math.max(1, ((end - r.start) / total) * 100)}%`, background: defs[id].color }}
                    />
                  </div>
                  <span className="w-14 text-right font-mono text-[10px] text-white/50">{r.end ? `${((r.end - r.start) / 1000).toFixed(1)}s` : "…"}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Outputs */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ids.map((id) => {
          const r = runs[id];
          if (!r) return null;
          const isFinal = id === finalId;
          return (
            <div
              key={id}
              className={`glass flex flex-col rounded-2xl ${isFinal ? "md:col-span-2 xl:col-span-3" : ""}`}
              style={{ borderColor: `${defs[id].color}55` }}
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                <span className="size-2.5 rounded-full" style={{ background: defs[id].color }} />
                <span className="font-display text-sm font-bold">{defs[id].name}</span>
                {r.status === "running" && <LoaderCircle className="ml-auto size-4 animate-spin text-white/50" />}
                {r.status === "done" && <CircleCheck className="ml-auto size-4 text-emerald-300" />}
              </div>
              <div className={`overflow-y-auto p-4 ${isFinal ? "" : "max-h-80"}`}>
                {r.output ? <Markdown>{r.output}</Markdown> : <p className="text-sm text-white/40">{r.status === "waiting" ? "Waiting for human approval…" : "…"}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Node({ label, color, status, onEdit, small }: { label: string; color: string; status: Status; onEdit?: () => void; small?: boolean }) {
  return (
    <motion.div
      animate={status === "running" || status === "waiting" ? { boxShadow: [`0 0 0px ${color}00`, `0 0 24px ${color}aa`, `0 0 0px ${color}00`] } : { boxShadow: "0 0 0px #0000" }}
      transition={{ duration: 1.4, repeat: Infinity }}
      className={`relative flex items-center gap-2 rounded-xl border-2 bg-[#0d0f26] ${small ? "px-3 py-1.5" : "px-4 py-3"}`}
      style={{ borderColor: status === "idle" ? `${color}40` : color, opacity: status === "idle" ? 0.65 : 1 }}
    >
      <span className="size-2 rounded-full" style={{ background: color }} />
      <span className={`whitespace-nowrap font-semibold ${small ? "text-xs" : "text-sm"}`}>{label}</span>
      {status === "running" && <LoaderCircle className="size-3.5 animate-spin" style={{ color }} />}
      {status === "done" && <CircleCheck className="size-3.5 text-emerald-300" />}
      {status === "waiting" && <Hand className="size-3.5 text-amber-300 pulse-soft" />}
      {onEdit && (
        <button onClick={onEdit} title="Edit instructions" className="ml-1 text-white/40 hover:text-white">
          <Settings2 className="size-3.5" />
        </button>
      )}
    </motion.div>
  );
}

function Edge({ active }: { active: boolean }) {
  return (
    <svg width="44" height="12" className="shrink-0">
      <line x1="0" y1="6" x2="38" y2="6" stroke={active ? "#f472b6" : "#ffffff40"} strokeWidth="2" className={active ? "flow-line" : ""} />
      <path d="M44 6 l-7 -4 v8 z" fill={active ? "#f472b6" : "#ffffff40"} />
    </svg>
  );
}
