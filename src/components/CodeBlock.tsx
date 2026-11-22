"use client";

import { Highlight, themes } from "prism-react-renderer";
import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";

export function CodeBlock({
  code,
  title,
  language = "python",
  download,
  maxHeight,
}: {
  code: string;
  title?: string;
  language?: string;
  download?: string;
  maxHeight?: number;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  const save = () => {
    const url = URL.createObjectURL(new Blob([code], { type: "text/x-python" }));
    const a = Object.assign(document.createElement("a"), { href: url, download });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0d22] shadow-lg shadow-black/30">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2">
        <span className="flex gap-1.5">
          <i className="size-2.5 rounded-full bg-rose-400/80" />
          <i className="size-2.5 rounded-full bg-amber-300/80" />
          <i className="size-2.5 rounded-full bg-emerald-400/80" />
        </span>
        <span className="ml-2 truncate font-mono text-xs text-white/60">{title ?? language}</span>
        <div className="ml-auto flex gap-1">
          {download && (
            <button onClick={save} className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white" title="Download">
              <Download className="size-3.5" />
            </button>
          )}
          <button onClick={copy} className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white" title="Copy">
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          </button>
        </div>
      </div>
      <Highlight theme={themes.nightOwl} code={code.trimEnd()} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="overflow-auto p-4 font-mono text-[12.5px] leading-relaxed" style={{ maxHeight }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                <span className="table-cell select-none pr-4 text-right text-white/20">{i + 1}</span>
                <span className="table-cell">
                  {line.map((token, k) => (
                    <span key={k} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
