"use client";

import type { VisualKey } from "@/content/modules";
import * as F from "./foundations";
import * as O from "./orchestration";

const MAP: Record<VisualKey, () => React.ReactElement> = {
  evolution: F.Evolution,
  architecture: F.Architecture,
  agentVsWorkflow: F.AgentVsWorkflow,
  useCases: F.UseCases,
  agentAnatomy: F.AgentAnatomy,
  runLoop: F.RunLoop,
  providers: F.Providers,
  toolSequence: F.ToolSequence,
  toolAnatomy: F.ToolAnatomy,
  sessionMemory: F.SessionMemory,
  memoryTypes: F.MemoryTypes,
  teamTopology: O.TeamTopology,
  seqVsConcurrent: O.SeqVsConcurrent,
  orchestrationPatterns: O.OrchestrationPatterns,
  workflowGraph: O.WorkflowGraph,
  hitl: O.Hitl,
  middlewareOnion: O.MiddlewareOnion,
  traceWaterfall: O.TraceWaterfall,
  responsibleAI: O.ResponsibleAI,
  recapWheel: O.RecapWheel,
  adoption: O.Adoption,
};

export function Visual({ k }: { k: VisualKey }) {
  const C = MAP[k];
  return <C />;
}
