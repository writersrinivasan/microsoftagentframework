"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const KEY_STORAGE = "maf.groqKey";
const MODEL_STORAGE = "maf.groqModel";

/** Models we know handle tool calling well on Groq — used to pick a sensible default. */
export const PREFERRED_MODELS = [
  "openai/gpt-oss-120b",
  "llama-3.3-70b-versatile",
  "moonshotai/kimi-k2-instruct",
  "qwen/qwen3-32b",
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant",
];

type KeyState = {
  apiKey: string;
  model: string;
  ready: boolean;
  dialogOpen: boolean;
  setApiKey: (k: string) => void;
  setModel: (m: string) => void;
  openDialog: () => void;
  closeDialog: () => void;
  clearKey: () => void;
};

const Ctx = createContext<KeyState | null>(null);

function safeGet(k: string) {
  try {
    return localStorage.getItem(k) ?? "";
  } catch {
    return "";
  }
}
function safeSet(k: string, v: string) {
  try {
    if (v) localStorage.setItem(k, v);
    else localStorage.removeItem(k);
  } catch {
    /* private mode — key lives only in memory */
  }
}

export function KeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setKey] = useState("");
  const [model, setModelState] = useState(PREFERRED_MODELS[1]);
  const [ready, setReady] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from browser storage once
    setKey(safeGet(KEY_STORAGE));
    const m = safeGet(MODEL_STORAGE);
    if (m) setModelState(m);
    setReady(true);
  }, []);

  const setApiKey = useCallback((k: string) => {
    setKey(k);
    safeSet(KEY_STORAGE, k);
  }, []);
  const setModel = useCallback((m: string) => {
    setModelState(m);
    safeSet(MODEL_STORAGE, m);
  }, []);
  const clearKey = useCallback(() => setApiKey(""), [setApiKey]);

  return (
    <Ctx.Provider
      value={{
        apiKey,
        model,
        ready,
        dialogOpen,
        setApiKey,
        setModel,
        clearKey,
        openDialog: () => setDialogOpen(true),
        closeDialog: () => setDialogOpen(false),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useKey() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useKey must be used inside <KeyProvider>");
  return v;
}
