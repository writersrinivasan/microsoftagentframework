import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";

/** The Python files in /labs are the single source of truth — the site renders them verbatim. */
const LABS_DIR = path.join(process.cwd(), "labs");

export function readLab(file: string): string {
  return readFileSync(path.join(LABS_DIR, file), "utf8");
}

export const EXERCISES = [
  { id: 1, title: "Create a basic agent", output: "Working AI agent", solution: "ex1_first_agent.py", starter: "starters/ex1.py", module: "introduction" },
  { id: 2, title: "Configure instructions & model connectivity", output: "Configured agent", solution: "ex2_configured_agent.py", starter: "starters/ex2.py", module: "first-agent" },
  { id: 3, title: "Integrate Python functions as tools", output: "Tool-enabled agent", solution: "ex3_tools_agent.py", starter: "starters/ex3.py", module: "tools" },
  { id: 4, title: "Multi-turn conversations & sessions", output: "Context-aware agent", solution: "ex4_sessions_memory.py", starter: "starters/ex4.py", module: "memory" },
  { id: 5, title: "Create multiple specialised agents", output: "Multi-agent application", solution: "ex5_multi_agent.py", starter: "starters/ex5.py", module: "multi-agent" },
  { id: 6, title: "Sequential / concurrent orchestration", output: "Coordinated agent workflow", solution: "ex6_workflows.py", starter: "starters/ex6.py", module: "workflows" },
  { id: 7, title: "Test & debug agent execution", output: "Evaluated multi-agent application", solution: "ex7_testing_monitoring.py", starter: "starters/ex7.py", module: "testing" },
] as const;

export type LabBundle = {
  id: number;
  title: string;
  output: string;
  module: string;
  solutionFile: string;
  starter: string;
  solution: string;
};

export function loadExerciseBundles(): LabBundle[] {
  return EXERCISES.map((e) => ({
    id: e.id,
    title: e.title,
    output: e.output,
    module: e.module,
    solutionFile: e.solution,
    starter: readLab(e.starter),
    solution: readLab(e.solution),
  }));
}
