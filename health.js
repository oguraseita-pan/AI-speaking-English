// Conversation turn -> Groq free tier (OpenAI-compatible). Returns { text } (JSON string; client parses).
// Free model as of 2026-06. Swap to "qwen/qwen3.6-27b" if you want stronger Japanese.
const MODEL = "openai/gpt-oss-120b";
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { system, messages } = req.body || {};
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: system }, ...(messages || [])],
        max_tokens: 400,
        temperature: 0.7
      })
    });
    const j = await r.json();
    const text = j.choices?.[0]?.message?.content || "";
    res.status(200).json({ text });
  } catch (e) { res.status(500).json({ error: String(e) }); }
};
