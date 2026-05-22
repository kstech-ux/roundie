# 8 視点 1 行契約 — 変更不可の条文

> Step 8 サマリの "1 行責任" をそのまま README の表紙に置く。実装中に迷ったとき、これに照らして判断する。**ここは合意済みの契約条文として変更禁止 (要相談で変更可)。**

---

## A · SEO — 機械可読な詩。

JSON-LD 5 種 (Organization / SoftwareApplication / FAQPage / BreadcrumbList / Product) + AEO 用の "1 文 1 主張"。**ヒトの詩と機械の構造を同じ場所に。** リッチリザルトを追わない。1 文 1 主張で書く。

- `<title>`: `ROUNDIE — あなたのラウンドを、かたちに残す。` (60 文字以内)
- `meta description`: `スコアじゃない、瞬間を残すゴルフ。ゴルファーのソーシャルアプリ ROUNDIE。` (120 文字以内)
- `hreflang` × 3 + `x-default`
- OGP × 3 ロケール (`og/card-1200x630.{ja,en,ko}.avif`)

## B · CRO — 煽らず、9% を目指す。

6 段ファネル (流入 100 → ヒーロー 100 → VISION/FEATURES 88 → CTA クリック 62 → 申込 38 → アプリ起動 24 → 招待 14)。4 仮説 A/B (Hero HC-02 vs HC-04 / CTA 文言 / Pricing 比較表 / Android 待機位置)。**ダークパターン禁止。意図破壊の A/B も禁止。**

- 「残り N 名」「あと X 時間」の煽り表現禁止
- CVR が +12% でも、Kinetic Type を消す変更は採用しない

## C · 計測 — 詩的 KPI も追う。

GA4 14 イベント。詳細は `docs/GA4-EVENTS.md`。**vision_complete / round_card_form_view / kudos_tap_demo は等しく KPI。** CVR 直結でなくとも、世界観への到達は計測する。

- Consent Mode v2、denied 時は発火しない
- 1st party proxy (`analytics.kanopy.app`) でアドブロッカー命中率を 15% → 3% に

## D · 法規 — 規制範囲外でも透明に。

- ステマ規制対応: UGC は二重同意 (投稿時 + LP 掲載時)、`#PR` 表記
- 個人情報保護法: 取得目的明示、第三者提供 (Apple / GA = 米国) の同意
- GDPR / PIPA を見越して **初日からオプトイン型**
- 特商法 / プライバシー / 利用規約を `/legal/*` に配置、Footer から到達

## E · SEC — LP は本体ではない、は禁句。

- CSP `strict-dynamic` + nonce (inline script を全て nonce 化)
- 7 ヘッダ必須: CSP / HSTS / Referrer-Policy / Permissions-Policy / X-Content-Type-Options / X-Frame-Options / COOP
- 先行申し込み POST はレート制限 5/IP/時、DKIM 署名メール
- 計測 GA4 を 1st party proxy
- 3rd party ads / pixel ゼロ

## F · PERF — 動きを入れた分、軽くする。

- LCP < 2.0s · CLS < 0.05 · INP < 200ms · JS < 80KB
- **CSS animation only。** JS で reflow を発生させない
- Critical CSS inline (~6KB)、残りは preload+onload
- variable font subset + `font-display: optional` + `size-adjust`
- Hero は fold 内画像ゼロ — LCP は H1 文字列
- 合計予算 540KB

## G · A11Y — 美しさと到達可能性を両立。

- WCAG 2.2 AA 全項目
- **動きが情報の主役にならない。** `prefers-reduced-motion` で 5 演出全停止
- **色だけで情報を伝えない。** Round Card の eagle/birdie/par 等にはラベル + パターン
- focus-visible は `reduced-motion` でも常時 ON
- NVDA / VoiceOver で Hero と FAQ を実読してパス

## H · EDGE — 失敗の縁こそ設計の証明。

9 エッジケース:
1. JS off → FAQ `<details>` で開閉、フォーム POST 機能
2. 3G (300kbps) → `font-display: optional` で fallback 確定
3. フォント未到達 → `size-adjust` で reflow ゼロ
4. アドブロッカー → 1st party proxy
5. `prefers-reduced-motion` → 5 演出全停止
6. `prefers-color-scheme: light` → ダーク基盤を維持 (LP は世界観優先)
7. 言語切替 → `<form GET>` で URL 遷移
8. 古いブラウザ (no `animation-timeline`) → IntersectionObserver fallback
9. 過剰スクロール → 慣性スクロール尊重

**JS は増強のみ、最悪でも詩は読める。**
