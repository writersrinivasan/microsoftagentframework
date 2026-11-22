"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`md ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: ({ className: cls, children: c }) => {
            const lang = /language-(\w+)/.exec(cls ?? "")?.[1];
            const text = String(c ?? "");
            if (!lang && !text.includes("\n")) return <code>{c}</code>;
            return (
              <div className="my-3">
                <CodeBlock code={text} language={lang ?? "text"} />
              </div>
            );
          },
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
