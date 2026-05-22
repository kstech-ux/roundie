# GA4 イベント定義 — 14 本

すべて `src/scripts/analytics.js` から発火。Consent Mode v2 で `analytics_storage = denied` の時は発火しない。

| # | イベント名 | 発火タイミング | パラメータ | KPI 分類 |
|---|---|---|---|---|
| 1 | `page_view` | 初期ロード (GA4 標準) | `page_location` / `page_referrer` / `language` | 流入 |
| 2 | `scroll_25` | スクロール 25% | `scroll_depth` | 関心 |
| 3 | `scroll_50` | スクロール 50% | `scroll_depth` | 関心 |
| 4 | `vision_complete` | VISION 4 シーン目到達 (SC-A 完了) | `scroll_time_ms` / `direction` | **詩的** |
| 5 | `feature_view` | FEATURES Bento の各カードがビュー | `feature_id` | 検討 |
| 6 | `round_card_form_view` | RC-FORM 1.08s 完了 | `cells_visible` | **詩的** |
| 7 | `kudos_tap_demo` | LP の Kudos デモタップ | `kudos_type` (shot/fight/buddy) | **詩的** |
| 8 | `faq_open` | FAQ 開閉 | `question_id` / `direction` | 摩擦解消 |
| 9 | `early_access_help_open` | "先行申し込みって？" FAQ | — | 摩擦解消 |
| 10 | `hero_cta_click` | Hero CTA クリック | `cta_location` (hero/footer) | CVR |
| 11 | `pricing_view` | Pricing 50% ビュー | `plan_visible` (free/pro) | CVR |
| 12 | `early_access_signup` | 申し込みフォーム送信完了 | `language` / `os_hint` | **CVR 最終** |
| 13 | `android_waitlist_submit` | Android 待機リスト送信 | `device_model` (任意) | サブ CVR |
| 14 | `language_switch` | 言語切替 | `from` / `to` | 多言語 |

## 詩的 KPI 3 本

`vision_complete` / `round_card_form_view` / `kudos_tap_demo` の 3 つは **CVR 直結ではなくとも、世界観への到達** を計測する独立 KPI。CRO ダッシュボードで CVR と並べて表示し、片方だけを最適化目標にしない。

## Consent Mode v2

```js
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage:        'denied',
  ad_user_data:      'denied',
  ad_personalization:'denied',
  wait_for_update:   500
});
```

同意バナーで明示同意後にのみ `gtag('consent', 'update', { analytics_storage: 'granted' })`。

## 1st party proxy

`https://analytics.kanopy.app/g/collect` に転送する Cloudflare Worker を経由。アドブロッカー命中率を 15% → 3% に。
