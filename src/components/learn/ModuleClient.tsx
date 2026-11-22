"use client";

import Link from "next/link";
import { CircleCheck, FlaskConical, MessageSquare } from "lucide-react";
import { useProgress } from "@/lib/progress";
import { askTutor } from "@/components/Tutor";

export function AskButton({ topic }: { topic: string }) {
  return (
    <button
      onClick={() => askTutor(`Explain "${topic}" in Microsoft Agent Framework with a short example.`)}
      className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/55 transition hover:border-fuchsia-400/40 hover:text-fuchsia-200"
    >
      <MessageSquare className="size-3" /> Ask tutor
    </button>
  );
}

export function CompleteButton({ slug }: { slug: string }) {
  const { progress, toggleModule } = useProgress();
  const done = progress.modules.includes(slug);
  return (
    <button
      onClick={() => toggleModule(slug)}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        done ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40" : "bg-white/10 hover:bg-white/15"
      }`}
    >
      <CircleCheck className="size-4" /> {done ? "Completed" : "Mark module complete"}
    </button>
  );
}

export function SandboxLink({ tab, exercise, label }: { tab: string; exercise?: number; label: string }) {
  const href = `/sandbox?tab=${tab}${exercise ? `&ex=${exercise}` : ""}`;
  return (
    <Link href={href} className="flex items-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-cyan-500/20">
      <FlaskConical className="size-4" /> {label}
    </Link>
  );
}
