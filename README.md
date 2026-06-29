# Sprout Speaking — 0円版 デプロイ手順

`speaking.sproutenglish.jp` などSproutのサブドメインで動かし、iPhoneのホーム画面に追加して使うまで。
**会話・文字起こし=Groq無料枠 / 読み上げ=ブラウザ標準 / インフラ=Vercel・Firebase無料枠** → 1人・自分用なら実質0円。

## ファイル構成（ビルド不要）
```
sprout-speaking/
├── index.html              # アプリ本体（ダーク/Sprout配色）
├── manifest.webmanifest    # PWA設定
├── sw.js                   # Service Worker（インストール可能化）
├── icon-192.png / icon-512.png / apple-touch-icon.png
├── vercel.json
└── api/
    ├── health.js           # 起動時の判定用
    ├── chat.js             # 会話 → Groq無料LLM（OpenAI互換）
    └── transcribe.js       # 文字起こし → Groq無料Whisper（iOS PWA対応の肝）
```
※読み上げ(TTS)はブラウザ標準なのでサーバ関数なし＝0円。

## 1. Groqの無料APIキーを取得（クレカ不要）
1. https://console.groq.com にGoog/メールでサインアップ。
2. 「API Keys」→ Create API Key → キー（`gsk_...`）をコピー。
   - 無料枠：会話 約1,000リクエスト/日、文字起こし 約2,000リクエスト/日。1人なら十分。

## 2. GitHub → Vercel（いつもの流れ）
1. このフォルダの中身をリポジトリ直下に置いて push（`index.html` がルート）。
2. Vercel で New Project → Import → Deploy（Framework=Other、ビルド設定不要。`/api`は自動で関数化）。

## 3. キーを環境変数に（クライアントには絶対置かない）
Vercel → Project → **Settings → Environment Variables**
- `GROQ_API_KEY` = `gsk_...`
- 保存後 **Redeploy**。

## 4. サブドメインを割り当て
Vercel → Project → **Settings → Domains** → `speaking.sproutenglish.jp` を追加。
表示されたCNAME先を、`sproutenglish.jp` のDNSに登録：
```
TYPE: CNAME   NAME: speaking   VALUE: cname.vercel-dns.com
```
反映後、VercelがHTTPSを自動発行 → `https://speaking.sproutenglish.jp` で表示。

## 5. iPhoneでホーム画面に追加
1. **Safari** で `https://speaking.sproutenglish.jp` を開く（Chrome等不可）。
2. 共有 → **ホーム画面に追加**。
3. アイコンから起動 → マイク許可を「許可」。
   - 録音→Whisper方式なので**ホーム画面起動でも文字起こしが動く**。

## 6. 動作モードの自動切替（さわらなくてOK）
- デプロイ済み（/api あり）= Groq無料枠＋ブラウザ読み上げ。
- claude.ai 等プレビュー（/api 無し）= ブラウザ音声＋Claude。設定画面にバッジ表示。

## 7. 0円の代償（把握しておく）
- Groqの無料枠はレート制限あり・仕様変更あり（1人なら通常問題なし）。
- 読み上げの声はブラウザ標準なのでやや機械的。声を上げたくなったら `api/` にTTS関数を足してOpenAI/ElevenLabs等（月数十円〜）に。
- 会話の日本語訳が不自然なら `api/chat.js` の `MODEL` を `qwen/qwen3.6-27b` に変更。

## 8. 次の段階（任意）
- 保存の永続化：今は端末メモリのみ → localStorage化 → Firebaseで `cards` をSprout本体と双方向同期。
