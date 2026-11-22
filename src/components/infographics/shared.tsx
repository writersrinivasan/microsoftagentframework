"use client";

import { motion } from "motion/react";

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Frame({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <figure className="glass relative overflow-hidden rounded-2xl p-4 sm:p-6">
      {children}
      {caption && <figcaption className="mt-4 text-center text-xs text-white/45">{caption}</figcaption>}
    </figure>
  );
}

export function Chip({ children, color = "#a78bfa" }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium"
      style={{ borderColor: `${color}55`, background: `${color}1a`, color }}
    >
      {children}
    </span>
  );
}
