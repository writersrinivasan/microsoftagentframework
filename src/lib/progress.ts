"use client";

import { useCallback, useEffect, useState } from "react";

type Progress = { modules: string[]; exercises: number[]; quiz: Record<string, number> };
const KEY = "maf.progress";
const EMPTY: Progress = { modules: [], exercises: [], quiz: {} };

function read(): Progress {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return EMPTY;
  }
}

/** Per-browser learning progress (a personal convenience — nothing leaves the browser). */
export function useProgress() {
  const [p, setP] = useState<Progress>(EMPTY);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from browser storage
    setP(read());
    const sync = () => setP(read());
    window.addEventListener("maf:progress", sync);
    return () => window.removeEventListener("maf:progress", sync);
  }, []);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    const next = fn(read());
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setP(next);
    window.dispatchEvent(new Event("maf:progress"));
  }, []);

  return {
    progress: p,
    toggleModule: (slug: string) =>
      update((x) => ({ ...x, modules: x.modules.includes(slug) ? x.modules.filter((s) => s !== slug) : [...x.modules, slug] })),
    toggleExercise: (id: number) =>
      update((x) => ({ ...x, exercises: x.exercises.includes(id) ? x.exercises.filter((s) => s !== id) : [...x.exercises, id] })),
    setQuiz: (slug: string, score: number) => update((x) => ({ ...x, quiz: { ...x.quiz, [slug]: score } })),
  };
}
