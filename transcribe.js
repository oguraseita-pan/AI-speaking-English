// Startup probe so the frontend knows the backend is live.
module.exports = (req, res) => { res.status(200).json({ ok: true }); };
