"use client";

import { CircleCheck } from "lucide-react";
import { useProgress } from "@/lib/progress";

export function ModuleDoneBadge({ slug }: { slug: string }) {
  const { progress } = useProgress();
  const score = progress.quiz[slug];
  return (
    <>
      {progress.modules.includes(slug) && (
        <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] text-emerald-300">
          <CircleCheck className="size-3" /> done
        </span>
      )}
      {score !== undefined && <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-[11px] text-cyan-300">quiz {score}%</span>}
    </>
  );
}
