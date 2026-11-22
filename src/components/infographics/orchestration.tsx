"use client";

import { motion } from "motion/react";
import { Eye, Hand, KeyRound, Lock, Scale, ShieldCheck, Target, UserCheck, FileSearch, Gauge, Rocket, Activity } from "lucide-react";
import { Frame, Reveal } from "./shared";

/* ── Team topology (hub & spoke) ───────────────────────────────── */
export function TeamTopology() {
  const team = [
    { n: "Research", d: "Collects & analyses information", c: "#38bdf8", x: 90, y: 230 },
    { n: "Analysis", d: "Identifies key insights", c: "#a78bfa", x: 300, y: 270 },
    { n: "Recommendation", d: "Actionable recommendations", c: "#f472b6", x: 510, y: 230 },
  ];
  return (
    <Frame caption="Coordinator delegates to specialists (agent.as_tool()) and consolidates their outputs.">
      <svg viewBox="0 0 600 320" className="w-full">
        <defs>
          <linearGradient id="hub" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <rect x="230" y="8" width="140" height="30" rx="15" fill="#ffffff10" stroke="#ffffff30" />
        <text x="300" y="28" textAnchor="middle" fontSize="12" fill="#e2e8f0">👤 Business request</text>
        <line x1="300" y1="38" x2="300" y2="72" stroke="#fbbf24" strokeWidth="2" className="flow-line" />
        <motion.g initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} style={{ transformOrigin: "300px 110px" }}>
          <circle cx="300" cy="112" r="40" fill="url(#hub)" opacity=".9" />
          <text x="300" y="108" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">Coordinator</text>
          <text x="300" y="124" textAnchor="middle" fontSize="9" fill="#fff">plans · delegates · merges</text>
        </motion.g>
        {team.map((t, i) => (
          <motion.g key={t.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.15 }}>
            <path d={`M300 152 Q ${(300 + t.x) / 2} ${t.y - 90} ${t.x} ${t.y - 28}`} stroke={t.c} strokeWidth="2" fill="none" className="flow-line" />
            <rect x={t.x - 80} y={t.y - 28} width="160" height="56" rx="14" fill="#0d0f26" stroke={t.c} />
            <text x={t.x} y={t.y - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill={t.c}>{t.n} Agent</text>
            <text x={t.x} y={t.y + 12} textAnchor="middle" fontSize="10" fill="#94a3b8">{t.d}</text>
          </motion.g>
        ))}
      </svg>
    </Frame>
  );
}

type Bar = { n: string; s: number; d: number; c: string };

function Bars({ rows, label, total, max }: { rows: Bar[]; label: string; total: number; max: number }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="font-display font-bold">{label}</p>
        <p className="font-mono text-sm text-white/60">≈ {total.toFixed(1)}s</p>
      </div>
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <div key={r.n} className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-xs text-white/60">{r.n}</span>
            <div className="relative h-6 flex-1 rounded bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(r.d / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (r.s / max) * 1.5 + i * 0.05 }}
                className="absolute inset-y-0 rounded"
                style={{ left: `${(r.s / max) * 100}%`, background: `linear-gradient(90deg, ${r.c}, ${r.c}aa)` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Sequential vs concurrent gantt ────────────────────────────── */
export function SeqVsConcurrent() {
  const seq = [
    { n: "Research", s: 0, d: 3.2, c: "#38bdf8" },
    { n: "Analysis", s: 3.2, d: 2.6, c: "#a78bfa" },
    { n: "Recommend", s: 5.8, d: 2.9, c: "#f472b6" },
  ];
  const conc = [
    { n: "Finance", s: 0, d: 2.8, c: "#34d399" },
    { n: "Operations", s: 0, d: 3.1, c: "#fbbf24" },
    { n: "Risk", s: 0, d: 2.5, c: "#fb923c" },
    { n: "Aggregate", s: 3.1, d: 0.3, c: "#e2e8f0" },
  ];
  const max = 9;
  return (
    <Frame caption="Illustrative timings. Sequential ≈ sum of steps (each builds on the last); concurrent ≈ slowest branch.">
      <div className="grid gap-6 md:grid-cols-2">
        <Bars rows={seq} label="Sequential" total={8.7} max={max} />
        <Bars rows={conc} label="Concurrent" total={3.4} max={max} />
      </div>
    </Frame>
  );
}

/* ── Orchestration patterns ────────────────────────────────────── */
function Mini({ kind, c }: { kind: string; c: string }) {
  const node = (x: number, y: number, k: string | number) => <circle key={k} cx={x} cy={y} r="9" fill={`${c}55`} stroke={c} />;
  const edge = (d: string, k: string | number) => <path key={k} d={d} stroke={c} strokeWidth="1.5" fill="none" className="flow-line" />;
  return (
    <svg viewBox="0 0 140 80" className="h-20 w-full">
      {kind === "seq" && [edge("M24 40 H58", 1), edge("M82 40 H116", 2), node(15, 40, "a"), node(70, 40, "b"), node(125, 40, "c")]}
      {kind === "conc" && [
        edge("M24 40 L60 14", 1), edge("M24 40 L60 40", 2), edge("M24 40 L60 66", 3),
        edge("M80 14 L116 40", 4), edge("M80 40 L116 40", 5), edge("M80 66 L116 40", 6),
        node(15, 40, "s"), node(70, 14, "a"), node(70, 40, "b"), node(70, 66, "c"), node(125, 40, "e"),
      ]}
      {kind === "handoff" && [edge("M24 40 Q 70 0 116 30", 1), edge("M116 50 Q 70 80 24 40", 2), edge("M24 40 L70 66", 3), node(15, 40, "t"), node(125, 40, "b"), node(70, 66, "x")]}
      {kind === "group" && [
        edge("M70 40 L20 15", 1), edge("M70 40 L120 15", 2), edge("M70 40 L20 65", 3), edge("M70 40 L120 65", 4),
        <rect key="m" x="58" y="28" width="24" height="24" rx="5" fill={`${c}88`} />,
        node(20, 15, "a"), node(120, 15, "b"), node(20, 65, "c"), node(120, 65, "d"),
      ]}
      {kind === "magentic" && [
        <rect key="l" x="52" y="4" width="36" height="22" rx="4" fill={`${c}44`} stroke={c} />,
        <text key="lt" x="70" y="19" textAnchor="middle" fontSize="8" fill="#fff">ledger</text>,
        edge("M70 26 L25 60", 1), edge("M70 26 L70 60", 2), edge("M70 26 L115 60", 3), edge("M115 60 Q 130 20 88 15", 4),
        node(25, 66, "a"), node(70, 66, "b"), node(115, 66, "c"),
      ]}
    </svg>
  );
}

export function OrchestrationPatterns() {
  const ps = [
    { k: "seq", n: "Sequential", b: "SequentialBuilder", d: "Pipeline; each agent builds on the last", c: "#38bdf8" },
    { k: "conc", n: "Concurrent", b: "ConcurrentBuilder", d: "Fan-out in parallel, aggregate results", c: "#34d399" },
    { k: "handoff", n: "Handoff", b: "HandoffBuilder", d: "Agents transfer control dynamically", c: "#fbbf24" },
    { k: "group", n: "Group chat", b: "GroupChatBuilder", d: "Manager picks next speaker in shared chat", c: "#f472b6" },
    { k: "magentic", n: "Magentic", b: "MagenticBuilder", d: "Planner with task ledger, re-plans on stalls", c: "#a78bfa" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {ps.map((p, i) => (
        <Reveal key={p.k} delay={i * 0.07}>
          <div className="h-full rounded-xl border p-3" style={{ borderColor: `${p.c}44`, background: `${p.c}0d` }}>
            <Mini kind={p.k} c={p.c} />
            <p className="mt-1 font-display font-bold" style={{ color: p.c }}>
              {p.n}
            </p>
            <p className="font-mono text-[10px] text-white/50">{p.b}</p>
            <p className="mt-1 text-xs text-white/70">{p.d}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ── Workflow graph with supersteps ────────────────────────────── */
export function WorkflowGraph() {
  const nodes = [
    { id: "start", x: 60, y: 130, label: "Coordinator", c: "#fbbf24", s: 1 },
    { id: "fin", x: 230, y: 50, label: "Finance", c: "#34d399", s: 2 },
    { id: "ops", x: 230, y: 130, label: "Operations", c: "#38bdf8", s: 2 },
    { id: "risk", x: 230, y: 210, label: "Risk", c: "#fb923c", s: 2 },
    { id: "agg", x: 400, y: 130, label: "Aggregator", c: "#a78bfa", s: 3 },
    { id: "pub", x: 560, y: 130, label: "@executor publish", c: "#f472b6", s: 4 },
  ];
  const edges = [
    ["start", "fin", "fan-out"], ["start", "ops", ""], ["start", "risk", ""],
    ["fin", "agg", "fan-in"], ["ops", "agg", ""], ["risk", "agg", ""], ["agg", "pub", "edge"],
  ];
  const at = (id: string) => nodes.find((n) => n.id === id)!;
  return (
    <Frame caption="Executors (nodes) connected by typed edges. The runtime runs ready nodes per superstep — Finance, Ops and Risk run in parallel in superstep 2.">
      <div className="overflow-x-auto">
        <svg viewBox="0 0 640 280" className="min-w-[560px]">
          {[1, 2, 3, 4].map((s) => {
            const xs = { 1: 60, 2: 230, 3: 400, 4: 560 }[s]!;
            return (
              <g key={s}>
                <rect x={xs - 70} y="8" width="140" height="264" rx="12" fill="#ffffff05" stroke="#ffffff10" />
                <text x={xs} y="266" textAnchor="middle" fontSize="10" fill="#64748b">superstep {s}</text>
              </g>
            );
          })}
          {edges.map(([a, b, l], i) => {
            const A = at(a), B = at(b);
            return (
              <g key={i}>
                <path d={`M${A.x + 55} ${A.y} C ${(A.x + B.x) / 2} ${A.y}, ${(A.x + B.x) / 2} ${B.y}, ${B.x - 55} ${B.y}`} stroke={A.c} strokeOpacity=".8" strokeWidth="2" fill="none" className="flow-line" />
                {l && <text x={(A.x + B.x) / 2} y={(A.y + B.y) / 2 - 8} textAnchor="middle" fontSize="9" fill="#94a3b8">{l}</text>}
              </g>
            );
          })}
          {nodes.map((n, i) => (
            <motion.g key={n.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: n.s * 0.25 + i * 0.03 }}>
              <rect x={n.x - 55} y={n.y - 18} width="110" height="36" rx="10" fill="#0d0f26" stroke={n.c} strokeWidth="1.5" />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fill={n.c} fontWeight="600">{n.label}</text>
            </motion.g>
          ))}
        </svg>
      </div>
    </Frame>
  );
}

/* ── Human in the loop ─────────────────────────────────────────── */
export function Hitl() {
  const steps = [
    { t: "run(request)", d: "Steps execute & are cached", c: "#38bdf8" },
    { t: "request_info()", d: "Workflow pauses, emits event", c: "#fbbf24", pause: true },
    { t: "Human reviews", d: "Approve / edit / reject in your UI", c: "#f472b6", human: true },
    { t: "run(responses={…})", d: "Resume — cached steps skipped", c: "#a78bfa" },
    { t: "Output", d: "Final brief yielded", c: "#34d399" },
  ];
  return (
    <Frame caption="With a checkpoint store the pause can last minutes or days — even across process restarts.">
      <div className="relative grid gap-3 md:grid-cols-5">
        {steps.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.12}>
            <div
              className={`relative h-full rounded-xl border p-3 ${s.pause ? "ring-2 ring-amber-400/40" : ""}`}
              style={{ borderColor: `${s.c}55`, background: `${s.c}12` }}
            >
              {s.human ? <Hand className="mb-1 size-5" style={{ color: s.c }} /> : <span className="mb-1 block font-mono text-[10px] text-white/40">step {i + 1}</span>}
              <p className="font-mono text-xs font-semibold" style={{ color: s.c }}>
                {s.t}
              </p>
              <p className="mt-1 text-[11px] text-white/60">{s.d}</p>
              {s.pause && <span className="pulse-soft absolute -top-2 right-2 rounded-full bg-amber-400 px-2 text-[10px] font-bold text-black">PAUSED</span>}
            </div>
          </Reveal>
        ))}
      </div>
    </Frame>
  );
}

/* ── Middleware onion ──────────────────────────────────────────── */
export function MiddlewareOnion() {
  const rings = [
    { r: 150, n: "Agent middleware", d: "guardrails · timing · caching", c: "#a3e635" },
    { r: 110, n: "Chat middleware", d: "prompt edits · token metering", c: "#22d3ee" },
    { r: 70, n: "Function middleware", d: "audit · validate · approve", c: "#f472b6" },
  ];
  return (
    <Frame caption="Each layer is async def mw(context, call_next). Code before call_next() runs on the way in, code after on the way out.">
      <div className="grid items-center gap-6 md:grid-cols-[320px_1fr]">
        <svg viewBox="-160 -160 320 320" className="mx-auto w-full max-w-[320px]">
          {rings.map((r, i) => (
            <motion.circle
              key={r.n}
              r={r.r}
              fill={`${r.c}14`}
              stroke={r.c}
              strokeWidth="1.5"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring" }}
            />
          ))}
          <circle r="34" fill="#fbbf24" opacity=".85" />
          <text y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#000">LLM / tool</text>
          {rings.map((r) => (
            <text key={r.n} y={-r.r + 16} textAnchor="middle" fontSize="10" fill={r.c} fontWeight="600">
              {r.n}
            </text>
          ))}
        </svg>
        <div className="space-y-3">
          {rings.map((r) => (
            <div key={r.n} className="rounded-xl border p-3" style={{ borderColor: `${r.c}44` }}>
              <p className="font-display font-bold" style={{ color: r.c }}>
                {r.n}
              </p>
              <p className="text-sm text-white/65">{r.d}</p>
            </div>
          ))}
          <p className="rounded-lg bg-white/5 p-3 text-xs text-white/60">
            🔒 <b>Short-circuit:</b> don&apos;t call <code>call_next()</code>; set <code>context.result</code> — the inner layers never run.
          </p>
        </div>
      </div>
    </Frame>
  );
}

/* ── Trace waterfall ───────────────────────────────────────────── */
export function TraceWaterfall() {
  const spans = [
    { n: "invoke_agent PricingAgent", s: 0, d: 100, depth: 0, c: "#a3e635" },
    { n: "chat llama-3.3-70b (1)", s: 3, d: 34, depth: 1, c: "#22d3ee", meta: "in 212 · out 31 tok" },
    { n: "execute_tool discount_price", s: 38, d: 6, depth: 1, c: "#f472b6", meta: "1200, 15 → 1020.00" },
    { n: "chat llama-3.3-70b (2)", s: 46, d: 50, depth: 1, c: "#22d3ee", meta: "in 260 · out 48 tok" },
  ];
  return (
    <Frame caption="What an OpenTelemetry trace of one tool-using agent run looks like (GenAI semantic conventions).">
      <div className="space-y-2">
        {spans.map((s, i) => (
          <div key={s.n} className="grid grid-cols-[minmax(0,220px)_1fr] items-center gap-3">
            <div className="truncate font-mono text-[11px]" style={{ paddingLeft: s.depth * 14, color: s.c }}>
              {s.depth ? "└ " : ""}
              {s.n}
            </div>
            <div className="relative h-7 rounded bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.d}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="absolute inset-y-1 flex items-center overflow-hidden rounded px-2 text-[10px] whitespace-nowrap text-black"
                style={{ left: `${s.s}%`, background: s.c }}
              >
                {s.meta}
              </motion.div>
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[minmax(0,220px)_1fr] gap-3 text-[10px] text-white/35">
          <span />
          <div className="flex justify-between">
            <span>0 ms</span>
            <span>≈ 1.2 s</span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ── Responsible AI checklist ──────────────────────────────────── */
export function ResponsibleAI() {
  const items = [
    { i: Lock, t: "Least privilege", d: "Each agent gets only the tools & data it needs.", c: "#a3e635" },
    { i: UserCheck, t: "Human approval", d: "approval_mode='always_require' for irreversible actions.", c: "#22d3ee" },
    { i: ShieldCheck, t: "Input/output guardrails", d: "Middleware blocks PII, jailbreaks & unsafe output.", c: "#f472b6" },
    { i: KeyRound, t: "Secrets out of prompts", d: "Keys in env / Key Vault / Entra ID, never in instructions.", c: "#fbbf24" },
    { i: Eye, t: "Transparency", d: "Tell users they talk to AI; show sources & tool use.", c: "#a78bfa" },
    { i: FileSearch, t: "Prompt-injection defence", d: "Treat tool & web content as untrusted data.", c: "#fb923c" },
    { i: Activity, t: "Observability", d: "Trace every run; sensitive data off in prod.", c: "#38bdf8" },
    { i: Scale, t: "Evaluate for fairness", d: "Test diverse scenarios; red-team before launch.", c: "#34d399" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((x, k) => (
        <Reveal key={x.t} delay={k * 0.05}>
          <div className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <x.i className="size-5" style={{ color: x.c }} />
            <p className="mt-2 text-sm font-bold">{x.t}</p>
            <p className="mt-1 text-xs text-white/60">{x.d}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ── Recap wheel (13 concepts) ─────────────────────────────────── */
export function RecapWheel() {
  const concepts = [
    "Architecture", "Agents & execution", "Model providers", "Tools & function calling", "Multi-turn sessions",
    "Context providers & memory", "Agent-to-agent", "Sequential & concurrent", "Graph workflows",
    "Human-in-the-loop", "Middleware", "Observability", "Hosting & deployment",
  ];
  const palette = ["#8b5cf6", "#0ea5e9", "#f59e0b", "#34d399", "#ec4899", "#6366f1", "#a3e635"];
  const R = 150;
  return (
    <Frame>
      <div className="relative mx-auto hidden aspect-square max-w-[460px] sm:block">
        <svg viewBox="-200 -200 400 400" className="absolute inset-0">
          {concepts.map((_, i) => {
            const a0 = (i / concepts.length) * Math.PI * 2 - Math.PI / 2;
            const a1 = ((i + 1) / concepts.length) * Math.PI * 2 - Math.PI / 2;
            const p = (a: number, r: number) => `${Math.cos(a) * r} ${Math.sin(a) * r}`;
            return (
              <motion.path
                key={i}
                d={`M${p(a0, 70)} L${p(a0, 190)} A190 190 0 0 1 ${p(a1, 190)} L${p(a1, 70)} A70 70 0 0 0 ${p(a0, 70)}`}
                fill={palette[i % palette.length]}
                fillOpacity=".22"
                stroke="#070816"
                strokeWidth="3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              />
            );
          })}
          <circle r="66" fill="#0d0f26" stroke="#ffffff22" />
          <text y="-4" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">MAF</text>
          <text y="14" textAnchor="middle" fontSize="9" fill="#94a3b8">13 concepts ✓</text>
        </svg>
        {concepts.map((c, i) => {
          const a = ((i + 0.5) / concepts.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <span
              key={c}
              className="absolute w-24 -translate-x-1/2 -translate-y-1/2 text-center text-[10.5px] font-semibold leading-tight"
              style={{ left: `${50 + (Math.cos(a) * R * 100) / 400 / 1.15}%`, top: `${50 + (Math.sin(a) * R * 100) / 400 / 1.15}%`, color: palette[i % palette.length] }}
            >
              {c}
            </span>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 sm:hidden">
        {concepts.map((c, i) => (
          <span key={c} className="rounded-full px-2.5 py-1 text-xs" style={{ background: `${palette[i % 7]}33` }}>
            ✓ {c}
          </span>
        ))}
      </div>
    </Frame>
  );
}

/* ── Adoption roadmap ──────────────────────────────────────────── */
export function Adoption() {
  const phases = [
    { t: "Explore", w: "Weeks 1–2", d: "Pick 1 internal, high-volume, low-risk use case. Prototype with tools + sessions.", i: Target, c: "#38bdf8" },
    { t: "Pilot", w: "Weeks 3–6", d: "Workflow + human approval, OpenTelemetry, eval dataset, 10–50 users.", i: Gauge, c: "#a78bfa" },
    { t: "Harden", w: "Weeks 7–10", d: "Guardrail middleware, Entra ID auth, checkpoints, cost dashboards.", i: ShieldCheck, c: "#f472b6" },
    { t: "Scale", w: "Quarter 2+", d: "Reusable agent catalogue, A2A interop, Foundry hosting, CoE.", i: Rocket, c: "#34d399" },
  ];
  return (
    <div className="relative grid gap-3 md:grid-cols-4">
      <div className="absolute left-0 right-0 top-7 hidden h-0.5 bg-linear-to-r from-sky-400 via-fuchsia-400 to-emerald-400 md:block" />
      {phases.map((p, i) => (
        <Reveal key={p.t} delay={i * 0.12}>
          <div className="relative">
            <span className="relative z-10 mx-auto grid size-14 place-items-center rounded-full border-2 bg-[#070816]" style={{ borderColor: p.c }}>
              <p.i className="size-6" style={{ color: p.c }} />
            </span>
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
              <p className="font-display font-bold" style={{ color: p.c }}>
                {p.t}
              </p>
              <p className="text-[11px] text-white/40">{p.w}</p>
              <p className="mt-1 text-xs text-white/65">{p.d}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
