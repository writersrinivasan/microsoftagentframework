"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { GraduationCap, KeyRound, LoaderCircle, RotateCcw, Send, Square, X } from "lucide-react";
import { useKey } from "@/lib/keystore";
import { chatStream, type ChatMsg } from "@/lib/groq";
import { MAF_CHEATSHEET } from "@/lib/maf-cheatsheet";
import { MODULES } from "@/content/modules";
import { Markdown } from "./Markdown";

type Turn = { role: "user" | "assistant"; content: string };

function pageContext(path: string) {
  const slug = path.split("/")[2];
  const mod = MODULES.find((m) => m.slug === slug);
  if (mod) return { label: `Module ${mod.num}: ${mod.short}`, detail: `${mod.title}. Topics: ${mod.objectives.join("; ")}` };
  if (path.startsWith("/sandbox")) return { label: "Sandbox", detail: "The learner is practising in the sandbox (playground, multi-agent studio, code lab)." };
  if (path.startsWith("/project")) return { label: "Capstone", detail: "Capstone: multi-agent Business Operations Assistant." };
  return { label: "Workshop", detail: "Workshop overview." };
}

export function Tutor() {
  const path = usePathname();
  const { apiKey, model, openDialog } = useKey();
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const ctx = pageContext(path);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [turns]);

  // Let other components open the tutor with a prefilled question
  useEffect(() => {
    const h = (e: Event) => {
      setOpen(true);
      const q = (e as CustomEvent<string>).detail;
      if (q) setInput(q);
    };
    window.addEventListener("maf:ask", h);
    return () => window.removeEventListener("maf:ask", h);
  }, []);

  const ask = async (q: string) => {
    if (!q.trim() || busy) return;
    if (!apiKey) return openDialog();
    const history: Turn[] = [...turns, { role: "user", content: q }];
    setTurns([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    const ac = new AbortController();
    abortRef.current = ac;
    const messages: ChatMsg[] = [
      {
        role: "system",
        content: `You are the friendly, precise AI tutor of a hands-on Microsoft Agent Framework (MAF) workshop for Python developers.
Current page: ${ctx.label} — ${ctx.detail}
Answer concisely with short paragraphs, bullets and small Python snippets. Prefer the CURRENT API below; if the learner uses old preview names (ChatAgent, create_agent, get_new_thread, run_stream, ai_function), gently point out the new equivalent. If you are unsure about an API detail, say so.

${MAF_CHEATSHEET}`,
      },
      ...history.slice(-12),
    ];
    try {
      let acc = "";
      for await (const delta of chatStream(apiKey, { model, messages, temperature: 0.3, max_tokens: 1200 }, ac.signal)) {
        acc += delta;
        setTurns((t) => [...t.slice(0, -1), { role: "assistant", content: acc }]);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError")
        setTurns((t) => [...t.slice(0, -1), { role: "assistant", content: `⚠️ ${(e as Error).message}` }]);
    } finally {
      setBusy(false);
    }
  };

  const suggestions = [
    `Explain ${ctx.label === "Workshop" ? "agents vs workflows" : ctx.label} like I'm new`,
    "Give me a mini challenge on this topic",
    "What are common mistakes here?",
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 via-violet-500 to-cyan-500 px-4 py-3 text-sm font-semibold shadow-xl shadow-fuchsia-500/30"
      >
        <GraduationCap className="size-5" /> <span className="hidden sm:inline">AI Tutor</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            className="fixed bottom-20 right-3 z-50 flex h-[min(640px,calc(100vh-7rem))] w-[min(440px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d22]/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            <header className="flex items-center gap-3 border-b border-white/10 bg-linear-to-r from-fuchsia-500/20 via-violet-500/10 to-cyan-500/20 px-4 py-3">
              <GraduationCap className="size-5 text-fuchsia-300" />
              <div className="flex-1 leading-tight">
                <p className="font-display text-sm font-bold">MAF Tutor</p>
                <p className="text-[11px] text-white/50">
                  Context: {ctx.label} · {model}
                </p>
              </div>
              <button onClick={() => setTurns([])} title="New chat" className="rounded-md p-1.5 text-white/50 hover:bg-white/10">
                <RotateCcw className="size-4" />
              </button>
              <button onClick={() => setOpen(false)} className="rounded-md p-1.5 text-white/50 hover:bg-white/10">
                <X className="size-4" />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {!apiKey && (
                <button onClick={openDialog} className="flex w-full items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-left text-sm text-amber-100">
                  <KeyRound className="size-4" /> Add your Groq API key to start chatting.
                </button>
              )}
              {turns.length === 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-white/60">Ask anything about Microsoft Agent Framework — I know which page you&apos;re on.</p>
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => ask(s)} className="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm hover:bg-white/10">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {turns.map((t, i) =>
                t.role === "user" ? (
                  <div key={i} className="ml-8 rounded-2xl rounded-br-sm bg-linear-to-r from-violet-600/60 to-fuchsia-600/60 px-3.5 py-2 text-sm">
                    {t.content}
                  </div>
                ) : (
                  <div key={i} className="mr-4 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
                    {t.content ? <Markdown>{t.content}</Markdown> : <LoaderCircle className="size-4 animate-spin text-white/50" />}
                  </div>
                ),
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex gap-2 border-t border-white/10 p-3"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ask(input);
                  }
                }}
                rows={2}
                placeholder="Ask the tutor…"
                className="flex-1 resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-fuchsia-400/50"
              />
              {busy ? (
                <button type="button" onClick={() => abortRef.current?.abort()} className="rounded-xl bg-rose-500/80 px-3">
                  <Square className="size-4" />
                </button>
              ) : (
                <button className="rounded-xl bg-linear-to-br from-fuchsia-500 to-violet-600 px-3">
                  <Send className="size-4" />
                </button>
              )}
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/** Open the tutor from anywhere with an optional prefilled question. */
export function askTutor(question?: string) {
  window.dispatchEvent(new CustomEvent("maf:ask", { detail: question }));
}
