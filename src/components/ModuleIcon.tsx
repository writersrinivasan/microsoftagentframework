import { Bot, Brain, ShieldCheck, Sparkles, Trophy, Users, Workflow, Wrench } from "lucide-react";
import type { Module } from "@/content/modules";

const ICONS = { Sparkles, Bot, Wrench, Brain, Users, Workflow, ShieldCheck, Trophy };

export function ModuleIcon({ name, className }: { name: Module["icon"]; className?: string }) {
  const I = ICONS[name];
  return <I className={className} />;
}
