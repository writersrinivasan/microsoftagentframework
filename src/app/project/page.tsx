import Link from "next/link";
import { Activity, ChartColumn, Code, Cpu, Database, FlaskConical, LayoutDashboard, Network, Play, Plug, Puzzle, Workflow } from "lucide-react";
import { readLab } from "@/lib/labs";
import { CodeBlock } from "@/components/CodeBlock";
import { ArchitectureFlow, ExerciseRoadmap } from "@/components/project/ProjectClient";

export const metadata = { title: "Capstone — MAF Academy" };

const STACK = [
  { c: "Agent Framework", t: "Microsoft Agent Framework", i: Puzzle, col: "#a78bfa" },
  { c: "Language", t: "Python 3.10+", i: Code, col: "#38bdf8" },
  { c: "Dev environment", t: "Google Colab / VS Code", i: LayoutDashboard, col: "#34d399" },
  { c: "AI model provider", t: "Groq (BYOK) · Azure OpenAI · Foundry", i: Cpu, col: "#fb923c" },
  { c: "Agent development", t: "agent-framework-core / -openai", i: Plug, col: "#f472b6" },
  { c: "Tool integration", t: "Python functions (@tool)", i: Workflow, col: "#fbbf24" },
  { c: "Workflow orchestration", t: "MAF Workflows & orchestrations", i: Network, col: "#22d3ee" },
  { c: "Data processing", t: "Pandas", i: Database, col: "#a3e635" },
  { c: "Application interface", t: "Streamlit (optional) · this web app", i: ChartColumn, col: "#e879f9" },
  { c: "Monitoring", t: "OpenTelemetry / framework observability", i: Activity, col: "#f87171" },
];

const PREREQS = [
  "Basic knowledge of Python programming",
  "Basic understanding of Large Language Models (LLMs)",
  "Familiarity with Generative AI and Agentic AI concepts",
  "Basic understanding of APIs and function calling",
  "Python environment configured (Google Colab or VS Code)",
  "Access to a supported AI model provider + credentials (a free Groq key works)",
  "Required package: agent-framework (agent-framework-core + -openai + -orchestrations)",
  "Sample business use cases and datasets (labs/data/sales.csv)",
];

export default function ProjectPage() {
  const code = readLab("capstone_business_ops.py");
  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-12">
      <header className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-500/30 via-pink-600/25 to-violet-700/30 p-8 sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">End-to-end hands-on project</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">Multi-Agent Business Operations Assistant</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/75">
          Specialised AI agents collaborate to solve a real business problem — planned by a coordinator, reviewed by a human, delivered as an executive brief.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/sandbox?tab=studio" className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black">
            <Play className="size-4" /> Run it live (Coordinator mode)
          </Link>
          <a href="#code" className="flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 font-semibold">
            <FlaskConical className="size-4" /> View the Python
          </a>
        </div>
      </header>

      <section>
        <h2 className="mb-1 font-display text-3xl font-bold">Application architecture</h2>
        <p className="mb-6 text-white/60">Six steps, five agent calls, one human checkpoint.</p>
        <ArchitectureFlow />
      </section>

      <section>
        <h2 className="mb-1 font-display text-3xl font-bold">Practical implementation exercises</h2>
        <p className="mb-6 text-white/60">Each exercise builds one capability of the final assistant. Tick them off as you go.</p>
        <ExerciseRoadmap />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-2xl font-bold">Technical stack</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {STACK.map((s) => (
              <div key={s.c} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg" style={{ background: `${s.col}26` }}>
                  <s.i className="size-4" style={{ color: s.col }} />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-white/40">{s.c}</p>
                  <p className="text-sm font-semibold">{s.t}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 font-display text-2xl font-bold">Prerequisites</h2>
          <ul className="space-y-2">
            {PREREQS.map((p, i) => (
              <li key={p} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-linear-to-br from-violet-500 to-pink-500 text-xs font-bold">{i + 1}</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="code" className="scroll-mt-20">
        <h2 className="mb-1 font-display text-3xl font-bold">The complete capstone</h2>
        <p className="mb-4 text-white/60">
          <code>labs/capstone_business_ops.py</code> — functional workflow with <code>@step</code> caching and human approval. Run with{" "}
          <code>python capstone_business_ops.py</code>.
        </p>
        <CodeBlock code={code} title="capstone_business_ops.py" download="capstone_business_ops.py" />
      </section>
    </div>
  );
}
