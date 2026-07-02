// v6: html背景色の明示指定（実機での端数ズレ対策）
const C = "sprout-speaking-v6";
const ASSETS = ["/icon-192.png", "/icon-512.png", "/apple-touch-icon.png", "/manifest.webmanifest"];
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c => c.addAll(ASSETS)).catch(() => {}));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);
  if (url.pathname.startsWith("/api/")) return;     // API は触らない
  if (req.method !== "GET") return;
  const isHTML = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
  if (isHTML) {
    // network-first: 常に最新のHTMLを取りにいく。オフライン時だけキャッシュ。
    e.respondWith(
      fetch(req).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(req, cp)); return r; })
                .catch(() => caches.match(req).then(r => r || caches.match("/index.html")))
    );
    return;
  }
  // 静的アセット: cache-first
  e.respondWith(
    caches.match(req).then(r => r || fetch(req).then(resp => { const cp = resp.clone(); caches.open(C).then(c => c.put(req, cp)); return resp; }))
  );
});
