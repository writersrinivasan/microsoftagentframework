import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, GraduationCap, Rocket } from "lucide-react";
import { HomeHero } from "@/components/home/HomeHero";
import { MODULES, TOTAL_MINUTES } from "@/content/modules";
import { ModuleIcon } from "@/components/ModuleIcon";
import { Visual } from "@/components/infographics";

const OFFSETS = MODULES.map((_, i) => MODULES.slice(0, i).reduce((a, m) => a + m.minutes, 0));

export default function Home() {
  return (
    <>
      <HomeHero />

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { i: BookOpen, t: "Learn", d: "Visual, infographic modules with verified code for every concept.", c: "from-violet-500 to-fuchsia-500" },
            { i: FlaskConical, t: "Practise", d: "Agent Playground & Multi-Agent Studio — real Groq calls, live traces.", c: "from-cyan-500 to-blue-600" },
            { i: GraduationCap, t: "Get help", d: "A context-aware AI tutor and code reviewer on every page.", c: "from-pink-500 to-rose-600" },
            { i: Rocket, t: "Build", d: "Capstone: a multi-agent Business Operations Assistant.", c: "from-amber-400 to-orange-600" },
          ].map((s, i) => (
            <div key={s.t} className="glass relative rounded-2xl p-5">
              <span className="absolute right-4 top-4 font-display text-4xl font-bold text-white/5">0{i + 1}</span>
              <span className={`grid size-11 place-items-center rounded-xl bg-linear-to-br ${s.c}`}>
                <s.i className="size-5" />
              </span>
              <p className="mt-3 font-display text-lg font-bold">{s.t}</p>
              <p className="mt-1 text-sm text-white/60">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Time allocation + journey */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-300">The journey</p>
            <h2 className="font-display text-3xl font-bold">{TOTAL_MINUTES} minutes, 8 modules</h2>
          </div>
          <Link href="/learn" className="flex items-center gap-1 text-sm text-white/60 hover:text-white">
            All modules <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Stacked time bar */}
        <div className="glass mb-6 overflow-hidden rounded-2xl p-4">
          <div className="flex h-12 overflow-hidden rounded-xl">
            {MODULES.map((m) => (
              <Link
                key={m.slug}
                href={`/learn/${m.slug}`}
                className={`group relative grid place-items-center bg-linear-to-br ${m.gradient} text-xs font-bold transition hover:brightness-125`}
                style={{ width: `${(m.minutes / TOTAL_MINUTES) * 100}%` }}
                title={`${m.title} — ${m.minutes} min`}
              >
                <span className="hidden sm:inline">{m.minutes}′</span>
              </Link>
            ))}
          </div>
          <div className="mt-2 flex text-[10px] text-white/40">
            {MODULES.map((m, i) => (
              <span key={m.slug} style={{ width: `${(m.minutes / TOTAL_MINUTES) * 100}%` }} className="truncate">
                {OFFSETS[i]}′
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m) => (
            <Link key={m.slug} href={`/learn/${m.slug}`} className="group glass relative overflow-hidden rounded-2xl p-5 transition hover:-translate-y-1">
              <div className={`absolute -right-10 -top-10 size-32 rounded-full bg-linear-to-br ${m.gradient} opacity-25 blur-2xl transition group-hover:opacity-50`} />
              <div className="flex items-center justify-between">
                <span className={`grid size-11 place-items-center rounded-xl bg-linear-to-br ${m.gradient}`}>
                  <ModuleIcon name={m.icon} className="size-5" />
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{m.minutes} min</span>
              </div>
              <p className="mt-4 text-xs font-semibold text-white/40">MODULE {m.num}</p>
              <p className="font-display text-lg font-bold leading-tight">{m.title}</p>
              <p className="mt-2 line-clamp-2 text-sm text-white/55">{m.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Big picture */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">The big picture</p>
        <h2 className="mb-6 font-display text-3xl font-bold">How Microsoft Agent Framework fits together</h2>
        <Visual k="architecture" />
      </section>

      {/* Capstone teaser */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-500/25 via-pink-600/25 to-violet-700/30 p-8 sm:p-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">End-to-end project</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Multi-Agent Business Operations Assistant</h2>
            <p className="mt-3 text-white/70">
              A coordinator plans and delegates, Research → Analysis → Recommendation agents collaborate, a manager approves, and the
              coordinator delivers an executive brief. Run it live in your browser — then locally in Python.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/project" className="rounded-xl bg-white px-5 py-3 font-semibold text-black">
                See the architecture
              </Link>
              <Link href="/sandbox?tab=studio" className="rounded-xl border border-white/30 px-5 py-3 font-semibold">
                Run it live
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
