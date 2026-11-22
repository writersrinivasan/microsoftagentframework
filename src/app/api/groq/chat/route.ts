/**
 * BYOK proxy for Groq chat completions.
 * The participant's key arrives in the `x-groq-key` header, is forwarded once to Groq,
 * and is never logged or stored on the server.
 */
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: Request) {
  const key = request.headers.get("x-groq-key");
  if (!key) {
    return Response.json({ error: { message: "Missing Groq API key. Add it via the key button in the top bar." } }, { status: 401 });
  }

  const body = await request.text();
  const upstream = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body,
    signal: request.signal,
  });

  // Stream (SSE) or JSON — pass straight through
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}
