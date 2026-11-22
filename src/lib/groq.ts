"use client";

export type ToolCall = { id: string; type: "function"; function: { name: string; arguments: string } };
export type ChatMsg =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ToolCall[] }
  | { role: "tool"; content: string; tool_call_id: string };

export type ToolSchema = {
  type: "function";
  function: { name: string; description: string; parameters: Record<string, unknown> };
};

export type Usage = { prompt_tokens: number; completion_tokens: number; total_tokens: number };

export type ChatBody = {
  model: string;
  messages: ChatMsg[];
  tools?: ToolSchema[];
  temperature?: number;
  max_tokens?: number;
};

export class GroqError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function post(key: string, body: unknown, signal?: AbortSignal) {
  const res = await fetch("/api/groq/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-groq-key": key },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    let msg = `Groq error ${res.status}`;
    try {
      const j = await res.json();
      msg = j?.error?.message ?? msg;
    } catch {
      /* ignore */
    }
    throw new GroqError(msg, res.status);
  }
  return res;
}

/** One non-streaming completion — used for tool-calling loops where we need the whole message. */
export async function chatOnce(key: string, body: ChatBody, signal?: AbortSignal) {
  const t0 = performance.now();
  const res = await post(key, { ...body, stream: false }, signal);
  const json = await res.json();
  const choice = json.choices?.[0];
  return {
    message: choice?.message as { content: string | null; tool_calls?: ToolCall[] },
    finish: choice?.finish_reason as string,
    usage: json.usage as Usage | undefined,
    ms: Math.round(performance.now() - t0),
  };
}

/** Streaming completion — yields text deltas as they arrive (Server-Sent Events). */
export async function* chatStream(key: string, body: ChatBody, signal?: AbortSignal): AsyncGenerator<string> {
  const res = await post(key, { ...body, stream: true }, signal);
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const delta = JSON.parse(data).choices?.[0]?.delta?.content;
        if (delta) yield delta as string;
      } catch {
        /* partial JSON line — ignore */
      }
    }
  }
}

export async function listModels(key: string): Promise<string[]> {
  const res = await fetch("/api/groq/models", { method: "POST", headers: { "x-groq-key": key } });
  const j = await res.json();
  if (!res.ok) throw new GroqError(j?.error?.message ?? "Invalid key", res.status);
  return j.models as string[];
}
