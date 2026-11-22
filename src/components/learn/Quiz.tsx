"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CircleCheck, CircleX, RotateCcw } from "lucide-react";
import type { Quiz as Q } from "@/content/modules";
import { useProgress } from "@/lib/progress";

export function Quiz({ slug, items }: { slug: string; items: Q[] }) {
  const [picked, setPicked] = useState<(number | null)[]>(items.map(() => null));
  const { setQuiz } = useProgress();
  const answered = picked.filter((p) => p !== null).length;
  const correct = picked.filter((p, i) => p === items[i].answer).length;

  const choose = (qi: number, oi: number) => {
    if (picked[qi] !== null) return;
    const next = picked.map((p, i) => (i === qi ? oi : p));
    setPicked(next);
    if (next.every((p) => p !== null)) {
      setQuiz(slug, Math.round((next.filter((p, i) => p === items[i].answer).length / items.length) * 100));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full bg-linear-to-r from-emerald-400 to-cyan-400" animate={{ width: `${(correct / items.length) * 100}%` }} />
        </div>
        <span className="font-mono text-sm">
          {correct}/{items.length}
        </span>
        {answered > 0 && (
          <button onClick={() => setPicked(items.map(() => null))} className="text-white/50 hover:text-white" title="Retry">
            <RotateCcw className="size-4" />
          </button>
        )}
      </div>
      {items.map((q, qi) => (
        <div key={qi} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-semibold">
            <span className="mr-2 text-white/40">Q{qi + 1}.</span>
            {q.q}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {q.options.map((o, oi) => {
              const isPicked = picked[qi] === oi;
              const show = picked[qi] !== null;
              const right = oi === q.answer;
              return (
                <button
                  key={oi}
                  onClick={() => choose(qi, oi)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                    show && right
                      ? "border-emerald-400/60 bg-emerald-400/15"
                      : show && isPicked
                        ? "border-rose-400/60 bg-rose-400/15"
                        : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  {show && right && <CircleCheck className="size-4 shrink-0 text-emerald-300" />}
                  {show && isPicked && !right && <CircleX className="size-4 shrink-0 text-rose-300" />}
                  {o}
                </button>
              );
            })}
          </div>
          {picked[qi] !== null && <p className="mt-3 text-sm text-white/65">💡 {q.why}</p>}
        </div>
      ))}
    </div>
  );
}
