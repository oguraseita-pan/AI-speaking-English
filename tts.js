// Text -> Groq PlayAI TTS (free tier, same GROQ_API_KEY) -> { audio: base64 wav }.
const MODEL = "playai-tts";
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { input, voice, speed } = req.body || {};
    if (!input) return res.status(400).json({ error: "no input" });
    const r = await fetch("https://api.groq.com/openai/v1/audio/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: MODEL,
        input: String(input).slice(0, 1200),
        voice: voice || "Celeste-PlayAI",
        response_format: "wav",
        speed: Math.min(1.4, Math.max(0.7, Number(speed) || 1))
      })
    });
    if (!r.ok) { const t = await r.text(); return res.status(r.status).json({ error: t.slice(0, 300) }); }
    const buf = Buffer.from(await r.arrayBuffer());
    res.status(200).json({ audio: buf.toString("base64") });
  } catch (e) { res.status(500).json({ error: String(e) }); }
};
