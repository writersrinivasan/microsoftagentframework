/** Lists the chat models available to the participant's Groq key (also used to validate the key). */
export async function POST(request: Request) {
  const key = request.headers.get("x-groq-key");
  if (!key) return Response.json({ error: { message: "Missing key" } }, { status: 401 });

  const upstream = await fetch("https://api.groq.com/openai/v1/models", {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  const data = await upstream.json();
  if (!upstream.ok) return Response.json(data, { status: upstream.status });

  const skip = /whisper|tts|guard|distil|playai|orpheus|prompt-guard|safeguard|compound/i;
  const models: string[] = (data.data ?? [])
    .filter((m: { id: string; active?: boolean }) => m.active !== false && !skip.test(m.id))
    .map((m: { id: string }) => m.id)
    .sort();
  return Response.json({ models });
}
