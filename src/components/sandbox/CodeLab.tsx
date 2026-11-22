"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { CircleCheck, Download, Eye, EyeOff, KeyRound, Lightbulb, LoaderCircle, RotateCcw, Terminal, WandSparkles } from "lucide-react";
import { useKey } from "@/lib/keystore";
import { useProgress } from "@/lib/progress";
import { chatStream } from "@/lib/groq";
import { MAF_CHEATSHEET } from "@/lib/maf-cheatsheet";
import { Markdown } from "@/components/Markdown";
import { CodeBlock } from "@/components/CodeBlock";
import type { LabBundle } from "@/lib/labs";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => <div className="h-[520px] animate-pulse rounded-xl bg-white/5" />,
});

const draftKey = (id: number) => `maf.draft.${id}`;
function loadDraft(id: number) {
  try {
    return localStorage.getItem(draftKey(id));
  } catch {
    return null;
  }
}
function saveDraft(id: number, code: string) {
  try {
    localStorage.setItem(draftKey(id), code);
  } catch {
    /* ignore */
  }
}

export function CodeLab({ bundles, initial }: { bundles: LabBundle[]; initial: number }) {
  const { apiKey, model, openDialog } = useKey();
  const { progress, toggleExercise } = useProgress();
  const [exId, setExId] = useState(initial);
  const ex = bundles.find((b) => b.id === exId) ?? bundles[0];
  const [code, setCode] = useState(ex.starter);
  const [showSolution, setShowSolution] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState<null | "hint" | "review">(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load the saved draft when switching exercise
    setCode(loadDraft(ex.id) ?? ex.starter);
    setShowSolution(false);
    setFeedback("");
  }, [ex.id, ex.starter]);

  const onChange = (v: string) => {
    setCode(v);
    saveDraft(ex.id, v);
  };

  const askAI = async (kind: "hint" | "review") => {
    if (!apiKey) return openDialog();
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setBusy(kind);
    setFeedback("");
    const task =
      kind === "hint"
        ? "Give ONE short, Socratic hint for the next TODO the learner hasn't solved. Do NOT reveal the full solution. Max 80 words, include at most a 2-line snippet."
        : `Review the learner's code. Respond in markdown with:
### Score: X/10
### ✅ What works
### 🔧 Fix next (ordered, concrete, reference line content)
### 💡 Stretch idea
Check correctness against the CURRENT MAF API. Flag deprecated names. Be encouraging and concise (max 220 words). Do not paste the whole reference solution.`;
    try {
      let acc = "";
      for await (const d of chatStream(
        apiKey,
        {
          model,
          temperature: 0.2,
          max_tokens: 900,
          messages: [
            {
              role: "system",
              content: `You are a senior Python mentor reviewing exercises in a Microsoft Agent Framework workshop.\n\n${MAF_CHEATSHEET}\n\nExercise ${ex.id}: ${ex.title} (expected output: ${ex.output}).\nREFERENCE SOLUTION (for you only — never paste it wholesale):\n\`\`\`python\n${ex.solution}\n\`\`\``,
            },
            { role: "user", content: `${task}\n\nLEARNER CODE:\n\`\`\`python\n${code}\n\`\`\`` },
          ],
        },
        ac.signal,
      )) {
        acc += d;
        setFeedback(acc);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setFeedback(`⚠️ ${(e as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([code], { type: "text/x-python" }));
    Object.assign(document.createElement("a"), { href: url, download: ex.solutionFile.replace(".py", "_mine.py") }).click();
    URL.revokeObjectURL(url);
  };

  const done = progress.exercises.includes(ex.id);

  return (
    <div className="grid gap-4 xl:grid-cols-[260px_1fr_400px]">
      {/* Exercise list */}
      <div className="glass h-fit space-y-1.5 rounded-2xl p-3">
        <p className="px-1 pb-1 font-display text-sm font-bold">Exercises</p>
        {bundles.map((b) => (
          <button
            key={b.id}
            onClick={() => setExId(b.id)}
            className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${b.id === ex.id ? "bg-linear-to-r from-cyan-500/25 to-blue-600/20 ring-1 ring-cyan-400/40" : "hover:bg-white/5"}`}
          >
            <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${progress.exercises.includes(b.id) ? "bg-emerald-400 text-black" : "bg-white/10"}`}>
              {progress.exercises.includes(b.id) ? "✓" : b.id}
            </span>
            <span>
              <span className="block text-sm leading-tight">{b.title}</span>
              <span className="block text-[11px] text-white/45">→ {b.output}</span>
            </span>
          </button>
        ))}
        <div className="mt-3 rounded-xl bg-black/30 p-3 text-xs text-white/60">
          <p className="mb-1 flex items-center gap-1.5 font-semibold text-white/80">
            <Terminal className="size-3.5" /> Run it locally
          </p>
          <code className="block whitespace-pre-wrap font-mono text-[10.5px] leading-relaxed text-cyan-200">
            {`cd maf-academy/labs\npip install -r requirements.txt\ncp .env.example .env  # add key\npython ${ex.solutionFile}`}
          </code>
        </div>
      </div>

      {/* Editor */}
      <div className="glass min-w-0 rounded-2xl p-3">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="mr-auto">
            <p className="text-xs text-white/45">Exercise {ex.id}</p>
            <p className="font-display font-bold">{ex.title}</p>
          </div>
          <button onClick={() => askAI("hint")} disabled={!!busy} className="flex items-center gap-1.5 rounded-lg bg-amber-400/15 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-400/25 disabled:opacity-50">
            {busy === "hint" ? <LoaderCircle className="size-3.5 animate-spin" /> : <Lightbulb className="size-3.5" />} Hint
          </button>
          <button
            onClick={() => askAI("review")}
            disabled={!!busy}
            className="flex items-center gap-1.5 rounded-lg bg-linear-to-r from-fuchsia-500 to-violet-600 px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
          >
            {busy === "review" ? <LoaderCircle className="size-3.5 animate-spin" /> : apiKey ? <WandSparkles className="size-3.5" /> : <KeyRound className="size-3.5" />} AI review
          </button>
          <button onClick={() => setShowSolution(!showSolution)} className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">
            {showSolution ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />} Solution
          </button>
          <button onClick={() => onChange(ex.starter)} title="Reset to starter" className="rounded-lg bg-white/5 p-1.5 hover:bg-white/10">
            <RotateCcw className="size-3.5" />
          </button>
          <button onClick={download} title="Download .py" className="rounded-lg bg-white/5 p-1.5 hover:bg-white/10">
            <Download className="size-3.5" />
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <CodeMirror value={code} onChange={onChange} height="520px" theme={oneDark} extensions={[python()]} basicSetup={{ foldGutter: false }} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-white/40">Draft auto-saved in this browser.</p>
          <button
            onClick={() => toggleExercise(ex.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${done ? "bg-emerald-500/20 text-emerald-200" : "bg-white/10 hover:bg-white/15"}`}
          >
            <CircleCheck className="size-3.5" /> {done ? "Completed" : "Mark complete"}
          </button>
        </div>
      </div>

      {/* Feedback / solution */}
      <div className="glass min-w-0 rounded-2xl p-4">
        {showSolution ? (
          <>
            <p className="mb-2 font-display text-sm font-bold">Reference solution · {ex.solutionFile}</p>
            <CodeBlock code={ex.solution} title={ex.solutionFile} download={ex.solutionFile} maxHeight={560} />
          </>
        ) : feedback ? (
          <>
            <p className="mb-2 flex items-center gap-1.5 font-display text-sm font-bold">
              <WandSparkles className="size-4 text-fuchsia-300" /> AI mentor
            </p>
            <Markdown>{feedback}</Markdown>
          </>
        ) : (
          <div className="grid h-full place-items-center text-center text-sm text-white/45">
            <div>
              <WandSparkles className="mx-auto mb-2 size-8 text-fuchsia-300/60" />
              Fill in the TODOs, then press <b className="text-white/80">AI review</b> for a score and concrete feedback — or <b className="text-white/80">Hint</b> if you&apos;re stuck.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
