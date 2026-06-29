// Audio (base64) -> Groq Whisper free tier -> { text }.
const MODEL = "whisper-large-v3-turbo";
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { audio, mime } = req.body || {};
    if (!audio) return res.status(400).json({ error: "no audio" });
    const buf = Buffer.from(audio, "base64");
    const ext = (mime || "").includes("webm") ? "webm" : (mime || "").includes("ogg") ? "ogg" : "mp4";
    const form = new FormData();
    form.append("file", new Blob([buf], { type: mime || "audio/mp4" }), `audio.${ext}`);
    form.append("model", MODEL);
    form.append("language", "en");
    form.append("response_format", "json");
    const r = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: form
    });
    const j = await r.json();
    res.status(200).json({ text: j.text || "" });
  } catch (e) { res.status(500).json({ error: String(e) }); }
};
