import { Suspense } from "react";
import { loadExerciseBundles } from "@/lib/labs";
import { SandboxShell } from "@/components/sandbox/SandboxShell";

export const metadata = { title: "Sandbox — MAF Academy" };

export default function SandboxPage() {
  const bundles = loadExerciseBundles();
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-20 text-white/40">Loading sandbox…</div>}>
      <SandboxShell bundles={bundles} />
    </Suspense>
  );
}
