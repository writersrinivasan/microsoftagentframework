"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, FlaskConical, Rocket } from "lucide-react";
import { MODULES, TOTAL_MINUTES } from "@/content/modules";
import { ModuleIcon } from "@/components/ModuleIcon";
import { useProgress } from "@/lib/progress";

export function HomeHero() {
  const { progress } = useProgress();
  const done = progress.modules.length;
  const stats = [
    { v: MODULES.length, l: "modules" },
    { v: `${TOTAL_MINUTES}′`, l: "of live coding" },
    { v: 7, l: "hands-on exercises" },
    { v: 13, l: "framework concepts" },
  ];

  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 sm:pt-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-200"
          >
            <span className="size-1.5 rounded-full bg-fuchsia-400 pulse-soft" /> Application-first workshop · Python · agent-framework 1.26
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
          >
            Build real <span className="text-gradient">AI agent teams</span> with Microsoft Agent Framework
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 max-w-xl text-lg text-white/65"
          >
            From a six-line agent to a governed, multi-agent <b className="text-white">Business Operations Assistant</b> — tools, memory,
            workflows, human-in-the-loop and observability. Learn it visually, then practise it live.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/learn/introduction"
              className="group flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-5 py-3 font-semibold shadow-lg shadow-fuchsia-500/30"
            >
              Start Module 1 <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/sandbox" className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold hover:bg-white/10">
              <FlaskConical className="size-4 text-cyan-300" /> Open the Sandbox
            </Link>
            <Link href="/project" className="flex items-center gap-2 rounded-xl px-4 py-3 text-white/70 hover:text-white">
              <Rocket className="size-4 text-amber-300" /> Capstone
            </Link>
          </motion.div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="glass rounded-xl px-3 py-3"
              >
                <p className="font-display text-2xl font-bold">{s.v}</p>
                <p className="text-xs text-white/50">{s.l}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Orbit of modules */}
        <div className="relative mx-auto aspect-square w-full max-w-[480px]">
          <motion.div
            className="absolute inset-[18%] rounded-full bg-linear-to-br from-violet-600/50 via-fuchsia-600/40 to-cyan-500/40 blur-3xl"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <div className="absolute inset-[30%] grid place-items-center rounded-full border border-white/15 bg-[#0d0f26]/80 text-center backdrop-blur">
            <div>
              <p className="font-display text-4xl font-bold">
                {done}/{MODULES.length}
              </p>
              <p className="text-xs text-white/50">modules complete</p>
            </div>
          </div>
          <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }}>
            {MODULES.map((m, i) => {
              const a = (i / MODULES.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <motion.div
                  key={m.slug}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${50 + Math.cos(a) * 41}%`, top: `${50 + Math.sin(a) * 41}%` }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                >
                  <Link
                    href={`/learn/${m.slug}`}
                    className={`grid size-16 place-items-center rounded-2xl bg-linear-to-br ${m.gradient} shadow-lg transition hover:scale-110 ${
                      progress.modules.includes(m.slug) ? "ring-2 ring-white" : ""
                    }`}
                    title={m.title}
                  >
                    <ModuleIcon name={m.icon} className="size-7" />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
