# 12. Security Headers

## 制約: GitHub Pages のヘッダ設定

GitHub Pages はサーバーヘッダを自由に設定できない（カスタムサーバー前提でない）。
よって以下の戦略:

1. **`<meta http-equiv>` で設定可能なヘッダ** → HTML に埋め込む
2. **設定不可なヘッダ**（HSTS など） → Cloudflare 経由で配信する場合に Cloudflare Page Rules で設定
3. **将来 Vercel / Cloudflare Pages 等に移行する場合** → `_headers` / `vercel.json` で設定

## 推奨ヘッダ一覧

### 1. Content-Security-Policy（CSP）

`<meta>` で設定可能。

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline'
    https://www.googletagmanager.com
    https://www.google-analytics.com
    https://www.clarity.ms
    https://*.clarity.ms;
  style-src 'self' 'unsafe-inline'
    https://fonts.googleapis.com;
  font-src 'self'
    https://fonts.gstatic.com data:;
  img-src 'self' data: blob:
    https://www.google-analytics.com
    https://*.clarity.ms;
  connect-src 'self'
    https://www.google-analytics.com
    https://*.clarity.ms
    https://*.analytics.google.com
    https://stats.g.doubleclick.net;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
">
```

**注意**: `'unsafe-inline'` は GA4 / GTM のインラインスクリプト用。**理想は nonce ベース**だが GitHub Pages では実装困難。Trade-off として `'unsafe-inline'` を許容。

### 2. HSTS（Strict-Transport-Security）

GitHub Pages は自動で HTTPS リダイレクトするが、HSTS ヘッダは出ない。
**Cloudflare 経由配信する場合**:
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

GitHub Pages 単独では HTML meta から HSTS は設定できない。

### 3. X-Content-Type-Options

`<meta>` 不可。サーバーヘッダ必須。
**Cloudflare**:
```
X-Content-Type-Options: nosniff
```

### 4. Referrer-Policy

`<meta>` で設定可能。
```html
<meta name="referrer" content="strict-origin-when-cross-origin">
```

### 5. Permissions-Policy

`<meta http-equiv>` で設定可能（一部ブラウザは無視するが）。
```html
<meta http-equiv="Permissions-Policy" content="
  camera=(),
  microphone=(),
  geolocation=(),
  payment=(),
  usb=(),
  magnetometer=(),
  gyroscope=(),
  accelerometer=(),
  interest-cohort=()
">
```

**`interest-cohort=()`** で Google FLoC を無効化（プライバシー保護）。

### 6. X-Frame-Options / frame-ancestors

CSP `frame-ancestors` で代替（X-Frame-Options は古い）。
```
Content-Security-Policy: frame-ancestors 'none';
```
これを上記 CSP に含める。

### 7. Cross-Origin-Opener-Policy / Cross-Origin-Embedder-Policy

`<meta>` 不可、サーバー側のみ。Cloudflare で設定。
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: credentialless
```

## SRI（Subresource Integrity）

外部 JS / CSS 読み込みには SRI ハッシュを追加。

### GA4 / GTM
Google のスクリプトは頻繁に更新されるため SRI を付けるとブロックされる可能性大。
→ **GA4/GTM は SRI なし、代わりに CSP で許可ドメインを厳密化**

### Google Fonts
```html
<!-- 推奨: フォントファイルを self-host し、SRI 付与 -->
<link rel="preload" href="/fonts/arial-black.woff2" as="font" type="font/woff2" crossorigin
      integrity="sha384-...">
```

ただし Arial Black は Adobe / Microsoft のライセンス対象。**Google Fonts に代替 Black weight 候補無し**。
→ **System font stack** で `"Arial Black", "Helvetica Neue", system-ui` を指定し、Web Font は使わない（パフォーマンス的にも有利）。

## CSRF / 形式バリデーション

### Email 登録フォーム
- **CSRF トークン**: フォーム表示時にトークン生成、submit 時に検証
- **honeypot**: 隠しフィールド（CSS で hidden）に入力があれば bot 判定
- **Turnstile**（Cloudflare の無料 CAPTCHA、reCAPTCHA より軽量）の導入を推奨

### サーバー側（Supabase Edge Function）
```js
// example: pseudo
export async function POST(req) {
  const { email, csrf_token, honeypot } = await req.json();

  // CSRF check
  if (!verifyToken(csrf_token)) return new Response('Invalid token', { status: 403 });

  // Honeypot check
  if (honeypot && honeypot.length > 0) return new Response('OK', { status: 200 }); // silent fail

  // Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return new Response('Invalid email', { status: 400 });

  // Rate limit (per IP)
  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for');
  if (await isRateLimited(ip)) return new Response('Too many requests', { status: 429 });

  // Save
  await db.insert({ email, ip, created_at: new Date() });
  return new Response('OK', { status: 200 });
}
```

## 依存関係の管理

### 静的 LP は npm 依存ゼロを維持
- ビルドツールなし
- 外部ライブラリは GA4 / GTM / Clarity の3つだけ
- これらは Google / Microsoft の信頼できるソースから取得

### Supabase Edge Function の依存
- Supabase 側で管理（`supabase/functions/`）
- `npm audit` / Dependabot で定期チェック
- Snyk スキャンを月 1 回

## 環境変数 / シークレット

- **公開 LP には API キー・秘密情報を含めない**
- GA4 ID (`G-T8YSVSPZ7E`) は **public**（公開してよい）
- Clarity ID (`w8acp9qnxk`) は **public**
- Supabase Edge Function URL は public、anon key は public
- **service_role key は絶対に公開しない**（サーバー側のみ）

## securityheaders.com / Mozilla Observatory 目標

| ツール | 目標スコア | 現状 |
|---|---|---|
| securityheaders.com | **A 以上** | D 推定 |
| Mozilla Observatory | **B 以上** | C 推定 |

GitHub Pages 単独では A+ は厳しい。Cloudflare 経由配信に変更すれば A+ 達成可能。

## チェックリスト（公開前）

- [ ] CSP メタタグを `<head>` に追加、Console エラー無し
- [ ] Referrer-Policy 設定
- [ ] Permissions-Policy 設定（不要権限すべて拒否）
- [ ] CSP `frame-ancestors 'none'`
- [ ] 外部スクリプトは CSP で許可ドメインを最小化
- [ ] Email フォームに CSRF + honeypot + rate limit
- [ ] Turnstile 統合（オプション）
- [ ] securityheaders.com で A 以上
- [ ] Mozilla Observatory で B 以上
- [ ] HTTPS リダイレクト確認（GitHub Pages 自動）
- [ ] CNAME 設定確認
