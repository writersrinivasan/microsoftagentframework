import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Hammer, Lightbulb, Target } from "lucide-react";
import { MODULES, getModule } from "@/content/modules";
import { readLab } from "@/lib/labs";
import { ModuleIcon } from "@/components/ModuleIcon";
import { Markdown } from "@/components/Markdown";
import { CodeBlock } from "@/components/CodeBlock";
import { Visual } from "@/components/infographics";
import { Quiz } from "@/components/learn/Quiz";
import { AskButton, CompleteButton, SandboxLink } from "@/components/learn/ModuleClient";

export function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  const m = getModule(slug);
  return { title: m ? `M${m.num} · ${m.short} — MAF Academy` : "Module" };
}

const TAB_LABEL = { playground: "Open Agent Playground", studio: "Open Multi-Agent Studio", code: "Open Code Lab" } as const;

/** Shell shared by every module URL; the URL-specific content streams in inside Suspense. */
export default function ModulePage({ params }: PageProps<"/learn/[slug]">) {
  return (
    <Suspense fallback={<ModuleSkeleton />}>
      <ModuleContent params={params} />
    </Suspense>
  );
}

function ModuleSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-6 px-4 py-12">
      <div className="h-4 w-28 rounded bg-white/10" />
      <div className="flex gap-5">
        <div className="size-16 rounded-2xl bg-white/10" />
        <div className="flex-1 space-y-3">
          <div className="h-10 w-3/4 rounded bg-white/10" />
          <div className="h-5 w-1/2 rounded bg-white/5" />
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-white/5" />
    </div>
  );
}

async function ModuleContent({ params }: { params: PageProps<"/learn/[slug]">["params"] }) {
  const { slug } = await params;
  const m = getModule(slug);
  if (!m) notFound();
  const idx = MODULES.indexOf(m);
  const prev = MODULES[idx - 1];
  const next = MODULES[idx + 1];
  const lab = m.activity.lab ? readLab(m.activity.lab) : null;

  return (
    <div>
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-white/10">
        <div className={`absolute inset-0 bg-linear-to-br ${m.gradient} opacity-20`} />
        <div className={`absolute -right-24 -top-24 size-96 rounded-full bg-linear-to-br ${m.gradient} opacity-30 blur-3xl`} />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <Link href="/learn" className="text-sm text-white/50 hover:text-white">
            ← All modules
          </Link>
          <div className="mt-4 flex items-start gap-5">
            <span className={`grid size-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br ${m.gradient} shadow-2xl`}>
              <ModuleIcon name={m.icon} className="size-8" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-white/60">MODULE {m.num} OF {MODULES.length}</span>
                <span className="flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-0.5">
                  <Clock className="size-3.5" /> {m.minutes} minutes
                </span>
              </div>
              <h1 className="mt-1 font-display text-3xl font-bold sm:text-5xl">{m.title}</h1>
              <p className="mt-3 max-w-3xl text-lg text-white/70">{m.tagline}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {m.objectives.map((o, i) => (
              <div key={o} className="flex items-start gap-2 rounded-xl bg-black/25 px-3 py-2 text-sm">
                <Target className={`mt-0.5 size-4 shrink-0 ${m.text}`} />
                <span>
                  <span className="mr-1 text-white/40">{i + 1}.</span>
                  {o}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[200px_1fr]">
        {/* TOC */}
        <aside className="hidden lg:block">
          <nav className="sticky top-20 space-y-1 text-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">On this page</p>
            {m.sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block rounded-md px-2 py-1 text-white/55 hover:bg-white/5 hover:text-white">
                {s.title}
              </a>
            ))}
            <a href="#takeaways" className="block rounded-md px-2 py-1 text-white/55 hover:bg-white/5 hover:text-white">Key takeaways</a>
            <a href="#activity" className="block rounded-md px-2 py-1 text-white/55 hover:bg-white/5 hover:text-white">Hands-on activity</a>
            <a href="#quiz" className="block rounded-md px-2 py-1 text-white/55 hover:bg-white/5 hover:text-white">Quiz</a>
          </nav>
        </aside>

        <article className="min-w-0 space-y-14">
          {m.sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-20 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`grid size-8 place-items-center rounded-lg bg-linear-to-br ${m.gradient} text-sm font-bold`}>{i + 1}</span>
                <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${m.text}`}>{s.kicker}</span>
                <span className="ml-auto">
                  <AskButton topic={s.title} />
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">{s.title}</h2>
              <Markdown className="text-white/80">{s.body}</Markdown>
              {s.visual && <Visual k={s.visual} />}
              {s.code && <CodeBlock code={s.code} title={s.codeTitle} />}
            </section>
          ))}

          {/* Takeaways */}
          <section id="takeaways" className="scroll-mt-20">
            <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold">
              <Lightbulb className="size-6 text-yellow-300" /> Key takeaways
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {m.takeaways.map((t, i) => (
                <div key={t} className="glass flex gap-3 rounded-xl p-4">
                  <span className={`font-display text-2xl font-bold ${m.text}`}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-sm text-white/80">{t}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Activity */}
          <section id="activity" className="scroll-mt-20">
            <div className={`rounded-2xl bg-linear-to-br ${m.gradient} p-[1px]`}>
              <div className="rounded-2xl bg-[#0b0d22] p-6">
                <p className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${m.text}`}>
                  <Hammer className="size-4" /> Hands-on activity
                </p>
                <h3 className="mt-2 font-display text-xl font-bold">{m.activity.title}</h3>
                <ol className="mt-4 space-y-2">
                  {m.activity.steps.map((s, i) => (
                    <li key={s} className="flex gap-3 text-sm text-white/80">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-bold">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex flex-wrap gap-3">
                  <SandboxLink tab={m.activity.sandbox} exercise={m.activity.exercise} label={TAB_LABEL[m.activity.sandbox]} />
                  {m.activity.exercise && m.activity.sandbox !== "code" && (
                    <SandboxLink tab="code" exercise={m.activity.exercise} label={`Exercise ${m.activity.exercise} in Code Lab`} />
                  )}
                  <CompleteButton slug={m.slug} />
                </div>
              </div>
            </div>
            {lab && (
              <div className="mt-6">
                <p className="mb-2 text-sm text-white/50">
                  Reference solution — <code className="text-white/70">labs/{m.activity.lab}</code> (verified on agent-framework-core 1.26)
                </p>
                <CodeBlock code={lab} title={m.activity.lab} download={m.activity.lab} maxHeight={520} />
              </div>
            )}
          </section>

          {/* Quiz */}
          <section id="quiz" className="scroll-mt-20">
            <h2 className="mb-4 font-display text-2xl font-bold">Check your understanding</h2>
            <Quiz slug={m.slug} items={m.quiz} />
          </section>

          {/* Prev / next */}
          <nav className="flex justify-between gap-3 border-t border-white/10 pt-6">
            {prev ? (
              <Link href={`/learn/${prev.slug}`} className="glass flex items-center gap-2 rounded-xl px-4 py-3 text-sm hover:bg-white/10">
                <ArrowLeft className="size-4" /> M{prev.num} · {prev.short}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/learn/${next.slug}`} className={`flex items-center gap-2 rounded-xl bg-linear-to-r ${next.gradient} px-4 py-3 text-sm font-semibold`}>
                M{next.num} · {next.short} <ArrowRight className="size-4" />
              </Link>
            ) : (
              <Link href="/project" className="flex items-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-pink-500 px-4 py-3 text-sm font-semibold">
                Capstone project <ArrowRight className="size-4" />
              </Link>
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}
