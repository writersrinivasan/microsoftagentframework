"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Bot, CodeXml, Users } from "lucide-react";
import { Playground } from "./Playground";
import { Studio } from "./Studio";
import { CodeLab } from "./CodeLab";
import type { LabBundle } from "@/lib/labs";

const TABS = [
  { k: "playground", label: "Agent Playground", sub: "Modules 1–4, 7 · tools, memory, middleware", icon: Bot, g: "from-violet-500 to-fuchsia-500" },
  { k: "studio", label: "Multi-Agent Studio", sub: "Modules 5–6 · orchestration & HITL", icon: Users, g: "from-pink-500 to-rose-600" },
  { k: "code", label: "Code Lab", sub: "7 exercises · AI review", icon: CodeXml, g: "from-cyan-500 to-blue-600" },
] as const;

export function SandboxShell({ bundles }: { bundles: LabBundle[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const tab = (params.get("tab") as (typeof TABS)[number]["k"]) ?? "playground";
  const ex = Number(params.get("ex") ?? 1) || 1;

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Practise</p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Sandbox</h1>
          <p className="text-sm text-white/55">Real model calls with your Groq key — everything you configure maps 1:1 to Microsoft Agent Framework code.</p>
        </div>
      </div>
      <div className="mb-5 grid gap-2 sm:grid-cols-3">
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => router.replace(`/sandbox?tab=${t.k}`, { scroll: false })}
            className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${tab === t.k ? "border-white/25 bg-white/10" : "border-white/5 bg-white/[0.02] hover:bg-white/5"}`}
          >
            <span className={`grid size-10 place-items-center rounded-xl bg-linear-to-br ${t.g}`}>
              <t.icon className="size-5" />
            </span>
            <span>
              <span className="block font-display font-bold">{t.label}</span>
              <span className="block text-[11px] text-white/50">{t.sub}</span>
            </span>
          </button>
        ))}
      </div>
      {/* Keep all mounted so state survives tab switches */}
      <div className={tab === "playground" ? "" : "hidden"}>
        <Playground />
      </div>
      <div className={tab === "studio" ? "" : "hidden"}>
        <Studio />
      </div>
      <div className={tab === "code" ? "" : "hidden"}>
        <CodeLab key={ex} bundles={bundles} initial={ex} />
      </div>
    </div>
  );
}
