"use client";

import { useEffect, useState } from "react";
import { CircleCheck, Eye, EyeOff, KeyRound, LoaderCircle, Lock, Trash, X } from "lucide-react";
import { PREFERRED_MODELS, useKey } from "@/lib/keystore";
import { listModels } from "@/lib/groq";

export function KeyDialog() {
  const { dialogOpen, closeDialog, apiKey, setApiKey, model, setModel, clearKey } = useKey();
  const [draft, setDraft] = useState("");
  const [show, setShow] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "testing" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!dialogOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset form each time the dialog opens
    setDraft(apiKey);
    setStatus(apiKey ? "ok" : "idle");
    if (apiKey) listModels(apiKey).then(setModels).catch(() => setModels([]));
  }, [dialogOpen, apiKey]);

  if (!dialogOpen) return null;

  const test = async () => {
    setStatus("testing");
    setError("");
    try {
      const list = await listModels(draft.trim());
      setModels(list);
      setApiKey(draft.trim());
      if (!list.includes(model)) setModel(PREFERRED_MODELS.find((m) => list.includes(m)) ?? list[0]);
      setStatus("ok");
    } catch (e) {
      setStatus("error");
      setError((e as Error).message);
    }
  };

  const options = models.length ? models : PREFERRED_MODELS;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={closeDialog}>
      <div onClick={(e) => e.stopPropagation()} className="glass glow-ring w-full max-w-md rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-orange-400 to-pink-500">
            <KeyRound className="size-5" />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-lg font-bold">Bring your own Groq key</h2>
            <p className="text-sm text-white/60">Powers the AI tutor, playground, multi-agent studio and code reviewer.</p>
          </div>
          <button onClick={closeDialog} className="rounded-md p-1 text-white/50 hover:bg-white/10">
            <X className="size-4" />
          </button>
        </div>

        <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-white/50">API key</label>
        <div className="mt-1.5 flex gap-2">
          <div className="relative flex-1">
            <input
              type={show ? "text" : "password"}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && draft && test()}
              placeholder="gsk_…"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 pr-9 font-mono text-sm outline-none focus:border-fuchsia-400/60"
            />
            <button onClick={() => setShow(!show)} className="absolute right-2 top-2 text-white/40 hover:text-white">
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <button
            onClick={test}
            disabled={!draft || status === "testing"}
            className="flex items-center gap-1.5 rounded-lg bg-linear-to-r from-fuchsia-500 to-violet-500 px-4 text-sm font-semibold disabled:opacity-40"
          >
            {status === "testing" ? <LoaderCircle className="size-4 animate-spin" /> : null}
            Test & save
          </button>
        </div>
        {status === "ok" && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300">
            <CircleCheck className="size-3.5" /> Key works · {models.length || "–"} chat models available
          </p>
        )}
        {status === "error" && <p className="mt-2 text-xs text-rose-300">{error}</p>}

        <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-white/50">Model</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none"
        >
          {!options.includes(model) && <option value={model}>{model}</option>}
          {options.map((m) => (
            <option key={m} value={m} className="bg-[#0e1027]">
              {m}
              {PREFERRED_MODELS.slice(0, 3).includes(m) ? "  ★ good at tool calling" : ""}
            </option>
          ))}
        </select>

        <div className="mt-5 flex items-start gap-2 rounded-lg bg-white/5 p-3 text-xs text-white/60">
          <Lock className="mt-0.5 size-3.5 shrink-0 text-cyan-300" />
          <p>
            Stored only in this browser&apos;s localStorage. Requests pass through this app&apos;s own <code>/api/groq</code> route
            straight to Groq — never logged or saved. Get a free key at{" "}
            <a className="text-cyan-300 underline" href="https://console.groq.com/keys" target="_blank" rel="noreferrer">
              console.groq.com/keys
            </a>
            .
          </p>
        </div>

        {apiKey && (
          <button onClick={clearKey} className="mt-3 flex items-center gap-1.5 text-xs text-rose-300/80 hover:text-rose-300">
            <Trash className="size-3.5" /> Remove key from this browser
          </button>
        )}
      </div>
    </div>
  );
}
