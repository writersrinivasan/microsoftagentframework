"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FlaskConical, KeyRound, Rocket, Sparkles } from "lucide-react";
import { useKey } from "@/lib/keystore";

const LINKS = [
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/project", label: "Capstone", icon: Rocket },
  { href: "/sandbox", label: "Sandbox", icon: FlaskConical },
];

export function Navbar() {
  const path = usePathname();
  const { apiKey, ready, openDialog, model } = useKey();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070816]/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
        <Link href="/" className="mr-3 flex items-center gap-2 font-display text-[15px] font-bold tracking-tight">
          <span className="grid size-7 place-items-center rounded-lg bg-linear-to-br from-violet-500 via-fuchsia-500 to-cyan-400 shadow-lg shadow-fuchsia-500/30">
            <Sparkles className="size-4 text-white" />
          </span>
          <span className="hidden sm:inline">
            MAF <span className="text-gradient">Academy</span>
          </span>
        </Link>
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition ${
                active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
        <button
          onClick={openDialog}
          className={`ml-auto flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            ready && apiKey
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
              : "border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20"
          }`}
        >
          <KeyRound className="size-3.5" />
          {ready && apiKey ? (
            <span className="max-w-40 truncate">Groq · {model}</span>
          ) : (
            <span>Add Groq key</span>
          )}
        </button>
      </nav>
    </header>
  );
}
