"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CircleCheck, Hand } from "lucide-react";
import { useProgress } from "@/lib/progress";

const FLOW = [
  { n: 1, t: "User submits a business request", who: "User", c: "#e2e8f0" },
  { n: 2, t: "Coordinator understands the request & delegates", who: "Coordinator", c: "#fbbf24" },
  { n: 3, t: "Research Agent gathers relevant information", who: "Research", c: "#38bdf8" },
  { n: 4, t: "Analysis Agent processes info & identifies findings", who: "Analysis", c: "#a78bfa" },
  { n: 5, t: "Recommendation Agent generates actionable recommendations", who: "Recommendation", c: "#f472b6" },
  { n: 6, t: "Coordinator consolidates & delivers the final response", who: "Coordinator", c: "#facc15" },
];

export function ArchitectureFlow() {
  return (
    <div className="relative">
      <div className="grid gap-3 lg:grid-cols-6">
        {FLOW.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="relative"
          >
            <div className="h-full rounded-2xl border-2 bg-[#0d0f26] p-4" style={{ borderColor: `${s.c}88` }}>
              <span className="grid size-9 place-items-center rounded-full font-display font-bold text-black" style={{ background: s.c }}>
                {s.n}
              </span>
              <p className="mt-3 font-display font-bold" style={{ color: s.c }}>
                {s.who}
              </p>
              <p className="mt-1 text-sm text-white/70">{s.t}</p>
            </div>
            {i < FLOW.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden size-5 -translate-y-1/2 text-white/40 lg:block" />}
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-amber-400/40 bg-amber-400/5 p-3 text-sm text-amber-100">
        <Hand className="size-4" /> Between steps 5 and 6: a manager approves or annotates the draft (human-in-the-loop via <code>ctx.request_info</code>)
      </div>
    </div>
  );
}

const EXERCISES = [
  { n: 1, impl: "Create a basic agent using Microsoft Agent Framework", out: "Working AI agent", mod: "introduction" },
  { n: 2, impl: "Configure agent instructions and model connectivity", out: "Configured agent", mod: "first-agent" },
  { n: 3, impl: "Integrate Python functions as agent tools", out: "Tool-enabled agent", mod: "tools" },
  { n: 4, impl: "Implement multi-turn conversations and session management", out: "Context-aware agent", mod: "memory" },
  { n: 5, impl: "Create multiple specialised agents", out: "Multi-agent application", mod: "multi-agent" },
  { n: 6, impl: "Implement sequential or concurrent agent orchestration", out: "Coordinated agent workflow", mod: "workflows" },
  { n: 7, impl: "Test and debug agent execution", out: "Evaluated multi-agent application", mod: "testing" },
];

export function ExerciseRoadmap() {
  const { progress, toggleExercise } = useProgress();
  const done = progress.exercises.length;
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full bg-linear-to-r from-cyan-400 via-violet-500 to-pink-500" animate={{ width: `${(done / 7) * 100}%` }} />
        </div>
        <span className="font-mono text-sm">{done}/7 exercises</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        {EXERCISES.map((e) => {
          const ok = progress.exercises.includes(e.n);
          return (
            <div key={e.n} className="grid grid-cols-[48px_1fr] items-center gap-3 border-b border-white/5 bg-white/[0.02] p-3 last:border-0 sm:grid-cols-[48px_1fr_220px_auto]">
              <button onClick={() => toggleExercise(e.n)} className={`grid size-9 place-items-center rounded-full font-bold ${ok ? "bg-emerald-400 text-black" : "bg-white/10"}`}>
                {ok ? <CircleCheck className="size-5" /> : e.n}
              </button>
              <p className="text-sm">{e.impl}</p>
              <span className="hidden rounded-full bg-cyan-400/10 px-3 py-1 text-center text-xs text-cyan-200 sm:block">{e.out}</span>
              <div className="col-span-2 flex gap-2 sm:col-span-1">
                <Link href={`/learn/${e.mod}`} className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">
                  Learn
                </Link>
                <Link href={`/sandbox?tab=code&ex=${e.n}`} className="rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-semibold">
                  Code
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
