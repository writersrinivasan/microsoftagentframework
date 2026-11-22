import Link from "next/link";
import { MODULES, TOTAL_MINUTES } from "@/content/modules";
import { ModuleIcon } from "@/components/ModuleIcon";
import { ModuleDoneBadge } from "@/components/learn/ModuleDoneBadge";

export const metadata = { title: "Learn — MAF Academy" };

export default function LearnIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-300">Curriculum</p>
      <h1 className="font-display text-4xl font-bold">Learning path</h1>
      <p className="mt-2 max-w-2xl text-white/60">
        {MODULES.length} modules · {TOTAL_MINUTES} minutes · each ends with a hands-on activity in the sandbox and a quick quiz.
      </p>

      <ol className="relative mt-10 space-y-5 before:absolute before:bottom-6 before:left-[27px] before:top-6 before:w-0.5 before:bg-linear-to-b before:from-violet-500 before:via-pink-500 before:to-yellow-400">
        {MODULES.map((m) => (
          <li key={m.slug} className="relative flex gap-5">
            <span className={`relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br ${m.gradient} shadow-lg`}>
              <ModuleIcon name={m.icon} className="size-6" />
            </span>
            <Link href={`/learn/${m.slug}`} className="glass group flex-1 rounded-2xl p-5 transition hover:bg-white/[0.07]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-white/40">MODULE {m.num}</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px]">{m.minutes} min</span>
                <ModuleDoneBadge slug={m.slug} />
              </div>
              <p className="mt-1 font-display text-xl font-bold group-hover:text-white">{m.title}</p>
              <p className="mt-1 text-sm text-white/55">{m.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.objectives.slice(0, 4).map((o) => (
                  <span key={o} className={`rounded-full border border-white/10 px-2 py-0.5 text-[11px] ${m.text}`}>
                    {o}
                  </span>
                ))}
                {m.objectives.length > 4 && <span className="text-[11px] text-white/40">+{m.objectives.length - 4} more</span>}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
