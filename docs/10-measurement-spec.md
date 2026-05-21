# 10. Measurement Specification

## アーキテクチャ

```
User → LP → GTM (gtm.js) → GA4 / Meta Pixel / Google Ads (順次追加)
                          ↑
                          dataLayer.push({...})
                          ↑
                          Consent Mode v2 (denied → granted on opt-in)
                          ↑
                          CMP (Cookie Consent banner)
```

**既存**: GA4 (`G-T8YSVSPZ7E`) + MS Clarity (`w8acp9qnxk`) がベタ書き
**新規**: GTM コンテナで管理に統一 + Consent Mode v2 同期 + dataLayer 整備

## GTM コンテナ設計

### コンテナ ID
- GTM コンテナ: 取得予定（PM 確認後発行）
- 命名規則: `GTM-XXXXXXX`

### dataLayer 命名規則

```js
window.dataLayer = window.dataLayer || [];
```

すべてのイベントは以下の構造で push する:

```js
dataLayer.push({
  event: 'event_name',
  event_category: 'engagement' | 'conversion' | 'navigation',
  event_label: '具体的なラベル',
  // 個別パラメータ
  cta_location: 'hero',
  cta_target: 'testflight',
  // ...
});
```

### イベント命名規則
- すべて snake_case
- 動詞_対象: `cta_click` / `form_submit` / `section_view`
- GA4 推奨イベント名を活用: `page_view` / `scroll` / `generate_lead` / `sign_up`

## GA4 イベント設計

### 自動収集イベント
| イベント | 発火 | 用途 |
|---|---|---|
| `page_view` | ページロード | 基本 |
| `scroll` | 90% スクロール | 拡張計測 ON |
| `click` | アウトバウンドリンク | 拡張計測 ON |
| `file_download` | PDF/zipダウンロード | 拡張計測 ON |

### カスタム計測イベント

#### スクロール深度
```js
// 25%, 50%, 75%, 100% でそれぞれ
dataLayer.push({
  event: 'scroll_depth',
  scroll_percentage: 25 // 25 | 50 | 75 | 100
});
```

#### セクションビュー（IntersectionObserver）
```js
// 各セクションが viewport の 50% 以上に入った時、1回だけ発火
dataLayer.push({
  event: 'section_view',
  section_name: 'hero' // 'hero' | 'vision' | 'how' | 'features' | 'score' | 'pricing' | 'trust' | 'faq' | 'final'
});
```

#### CTA クリック（主・副・neutral）
```js
dataLayer.push({
  event: 'cta_click',
  cta_type: 'primary',          // 'primary' | 'secondary' | 'neutral'
  cta_location: 'hero',         // 'header' | 'hero' | 'features-end' | 'pricing-free' | 'pricing-pro-monthly' | 'pricing-pro-yearly' | 'pricing-comp-pack' | 'final' | 'mobile-bar' | 'footer'
  cta_target: 'testflight',     // 'testflight' | 'email_signup' | 'faq' | 'kanopy' | 'features-anchor'
  cta_label: 'TestFlight で試す',
  cta_language: 'ja'
});
```

#### TestFlight 遷移（外部リンク）
```js
// クリック時に発火、TestFlight ページに遷移する直前
dataLayer.push({
  event: 'testflight_redirect',
  source_location: 'hero',
  source_language: 'ja'
});
// 推奨イベント: generate_lead 相当（実際は TestFlight 参加完了まで追えない）
```

#### Email フォーム
```js
// 入力開始
dataLayer.push({ event: 'form_start', form_name: 'email_signup' });

// 送信成功
dataLayer.push({
  event: 'generate_lead',
  form_name: 'email_signup',
  form_location: 'hero' // or 'final'
});

// 送信失敗
dataLayer.push({
  event: 'form_error',
  form_name: 'email_signup',
  error_type: 'invalid_email' | 'server_error' | 'rate_limit'
});
```

#### 言語切替
```js
dataLayer.push({
  event: 'language_switch',
  language_from: 'ja',
  language_to: 'en'
});
```

#### FAQ アコーディオン
```js
dataLayer.push({
  event: 'faq_toggle',
  question_id: 'q-score-visibility',
  question_text: 'スコアは公開されますか？',
  action: 'open' // 'open' | 'close'
});
```

## Consent Mode v2 実装

### 初期化（同意取得前）
```html
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Consent Mode v2 初期値 — すべて denied
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'granted',  // セキュリティ目的のみ granted
  'wait_for_update': 500
});

// GTM 初期化（タグは denied 状態で発火しない）
(function(w,d,s,l,i){...gtm.js...})();
</script>
```

### CMP バナーで同意取得後
```js
// All accepted
gtag('consent', 'update', {
  'ad_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted',
  'analytics_storage': 'granted',
  'functionality_storage': 'granted',
  'personalization_storage': 'granted'
});

// Or partial (analytics only)
gtag('consent', 'update', {
  'analytics_storage': 'granted'
});
```

### CMP バナー要件
- 同意前は **計測タグ発火しない**
- 「**すべて受け入れる**」「**拒否**」「**カスタマイズ**」の 3 ボタン（**「拒否」を「すべて受け入れる」と同じサイズ・色で**＝対等性）
- カテゴリ別の同意（Analytics / Marketing / Functionality）
- 再選択可能（フッターに「Cookie 設定」リンク）
- 同意ログ保存（localStorage に同意日時を記録）

### CMP ツール候補
- **A: Cookiebot**（GTM 連携簡単、有料 月額 €11〜）
- **B: 自前実装**（無料、完全制御、開発工数 0.5 日）→ **推奨**（GitHub Pages との相性◎）

## UTM パラメータ規約

### 命名規則
```
utm_source       = どこから = google | meta | instagram | tiktok | x | line | direct | referral
utm_medium       = どの種類 = cpc | social | email | press | qr | display | affiliate
utm_campaign     = キャンペーン名 = launch2026q3 / spring-girls / persona-a-test1
utm_content      = 広告クリエイティブ = video-yuki-30s / banner-grid-blue / static-quote
utm_term         = キーワード（検索広告のみ）= ゴルフ+アプリ+おしゃれ
```

### 例
```
https://roundie.app/?utm_source=instagram&utm_medium=social&utm_campaign=launch2026q3&utm_content=video-yuki-30s
```

## ヒートマップ / セッションリプレイ

### MS Clarity（既存）
- 既存タグ ID: `w8acp9qnxk`
- Consent Mode 同期: 同意後のみ発火するよう GTM 経由に変更
- 重要セクションには `data-clarity-mask="true"` を付与（個人情報マスク）

## 計測仕様の docs/ 配置
本ドキュメント自体が仕様書。GTM の Container Export JSON は別途 `/docs/gtm-container-export.json` に置く（実装フェーズで生成）。

## データ品質

### Bot 除外
- GA4: 自動 Bot フィルタリング有効
- Cloudflare の Bot Fight Mode（GitHub Pages では Cloudflare 経由でない可能性あり、要確認）

### 内部 IP 除外
- GA4 → Data Streams → Define Internal Traffic
- 開発者の自宅・オフィス IP を登録

### リファラスパム対策
- GA4 → Reference Exclusion で自社ドメイン除外（roundie.app / kanopy-inc.com）

## 計測検証チェックリスト

- [ ] GTM プレビューモードで全イベント発火を確認
- [ ] GA4 リアルタイムで `cta_click` / `section_view` / `scroll_depth` を確認
- [ ] Consent Mode 同意前は `analytics_storage: denied`、同意後は `granted` を確認
- [ ] Meta Pixel Helper（Chrome 拡張）で Pixel 発火確認（広告開始後）
- [ ] UTM パラメータ付き URL でアクセスし、`utm_*` が正しく取得されるか確認
- [ ] Clarity でセッションリプレイが正しく記録されているか
- [ ] Apple Search Ads / Google Ads / Meta Ads タグ追加後の Conversion 受信確認
