# 08. CTA Hierarchy

## CTA 階層図

```
                ┌─────────────────────────┐
                │  PRIMARY CTA            │ ← 「TestFlight で試す」(無料)
                │  brand green, large     │   主目的: TestFlight 参加
                └─────────────────────────┘
                          │
                          ↓
                ┌─────────────────────────┐
                │  SECONDARY CTA          │ ← 「公開時に通知 (メアド)」
                │  outline, small         │   主目的: メアド取得
                └─────────────────────────┘
                          │
                          ↓
                ┌─────────────────────────┐
                │  NEUTRAL CTA            │ ← 「機能を見る」「FAQ」「もっと詳しく」
                │  text link / ghost      │   主目的: スクロール継続
                └─────────────────────────┘
                          │
                          ↓
                ┌─────────────────────────┐
                │  EXTERNAL CTA           │ ← 「KANOPY について」「Press kit」
                │  text link              │   主目的: 関連サイト誘導
                └─────────────────────────┘
```

## CTA 文言（多言語）

### Primary（TestFlight）

| 場面 | JA | EN | KO |
|---|---|---|---|
| ヘッダー | 参加する | JOIN | 참여 |
| ヒーロー | TestFlight で試す（無料） | Try on TestFlight — free | TestFlight 에서 시작 (무료) |
| Pricing Free | Free で始める | Start free | 무료로 시작 |
| Pricing Pro | Pro を始める | Go Pro | Pro 시작 |
| Final CTA | 今日のラウンドから始める | Start with today's round | 오늘 라운드부터 시작 |
| Mobile fixed bar | TestFlight で試す → | Try on TestFlight → | TestFlight 에서 → |

### Secondary（Email）

| 場面 | JA | EN | KO |
|---|---|---|---|
| ヒーロー | 公開時に通知（メアド） | Notify me at launch | 출시 알림 받기 |
| Final CTA | 公開時に通知 | Get notified | 알림 받기 |
| Mobile fixed bar | …通知 | …Notify | …알림 |

### Neutral

| 場面 | JA | EN | KO |
|---|---|---|---|
| ヒーロー副 | 機能を見る → | See features → | 기능 보기 → |
| Features末 | すべての機能 → | All features → | 모든 기능 → |
| FAQ末 | すべての FAQ → | All FAQs → | 모든 FAQ → |
| Footer | KANOPY について | About KANOPY | KANOPY 소개 |

## デザイン仕様

### Primary CTA
```css
.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: var(--green);
  color: var(--t1);
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 13px;
  letter-spacing: 0.18em;
  border: 2px solid var(--green);
  border-radius: var(--radius-1);
  text-decoration: none;
  cursor: pointer;
  transition: transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out);
}
@media (hover: hover) {
  .cta-primary:hover {
    transform: translate(-3px, -3px);
    box-shadow: 6px 6px 0 var(--green-on-dark);
  }
}
.cta-primary:focus-visible {
  outline: 2px solid var(--green-on-dark);
  outline-offset: 4px;
}
```

### Secondary CTA
```css
.cta-secondary {
  /* 同じサイズ感だが outline 透明 */
  background: transparent;
  color: var(--t1);
  border: 1px solid var(--border-2);
}
@media (hover: hover) {
  .cta-secondary:hover {
    border-color: var(--green-on-dark);
    color: var(--green-on-dark);
  }
}
```

### Neutral CTA
```css
.cta-neutral {
  padding: 8px 0;
  background: none;
  color: var(--t2);
  font-size: 13px;
  letter-spacing: 0.04em;
  border: none;
  border-bottom: 1px solid transparent;
  transition: color var(--dur-fast), border-color var(--dur-fast);
}
.cta-neutral:hover {
  color: var(--green-on-dark);
  border-bottom-color: var(--green-on-dark);
}
```

## 配置原則

### 1. ファーストビュー内に主CTA 必須
ヒーロー領域に必ず Primary CTA + Secondary CTA を並べる。

### 2. セクションごとに 1 つの主CTA
ヒーロー → Features 末 → Pricing → Final CTA の **最低 4 箇所** に Primary CTA。

### 3. モバイルは固定バー（スクロール 60% 以降）
スクロール深度 60% で出現する `.mobile-cta-bar`（[07-section-architecture.md](./07-section-architecture.md) 参照）。

### 4. 主CTA と副CTA を「同列に」並べない
副CTA は **常に主CTA より小さく・地味に**。

## CTA テキストの書き方

### ✅ 良い CTA
- 動詞で始まる（**Try / Start / Get / Notify**）
- 利益が明確（**Try → "free"** を入れる）
- 短い（3 単語以内）
- 緊急性を捏造しない（**「今すぐ」「今だけ」は使わない**）

### ❌ 悪い CTA
- 「Click here」「もっと見る」のような無情報
- 「サインアップ無料で今すぐ」(動詞x情報x期間 詰め込み過剰)
- 「お試しください」「ぜひ」(媚び)
- 「Get Early Access」(抽象的・利益不明)

## 計測タグ（GA4 イベント）

```js
// Primary CTA クリック
gtag('event', 'cta_click', {
  cta_type: 'primary',
  cta_target: 'testflight',
  cta_location: 'hero',  // 'hero' | 'features-end' | 'pricing-free' | 'final' | 'mobile-bar' | 'header'
  cta_label: 'TestFlight で試す'
});

// Secondary CTA クリック
gtag('event', 'cta_click', {
  cta_type: 'secondary',
  cta_target: 'email_signup',
  cta_location: 'hero',
  cta_label: '公開時に通知'
});
```

## 副オファー（Email 登録）の実装

メール登録のためのフォームは LP 内に **モーダル** で実装（ページ遷移なし）。

### フィールド最小化
- メールアドレスのみ（必須）
- 名前は任意（あれば 1 行）
- チェックボックス「KANOPY からのお知らせを受け取る」（任意・default unchecked）

### バリデーション
- リアルタイム（`oninput`）
- 形式不一致 → 即時表示

### 送信先
- 仮置き: Formspree / Netlify Forms / Google Apps Script Webhook
- 本実装: Supabase Edge Function（既存インフラ流用）

### 完了体験
- 「登録できました」+ 「TestFlight も試せます →」と続けて Primary CTA を表示
- メール検証 OPT-IN 双方向確認は実装しない（プリローンチ・低リスク）

## A/B テスト候補（ローンチ後）

| 仮説 | A | B | KPI |
|---|---|---|---|
| 動詞変更 | 「TestFlight で試す」 | 「先行体験を始める」 | CTR |
| 利益強調 | 「TestFlight で試す（無料）」 | 「TestFlight で試す」 | CTR |
| 主・副の順 | TestFlight が左 | Email が左 | CTR / Lead 率 |
| Mobile bar 出現タイミング | 60% | 40% | dismiss 率 / CTR |
| 副オファー有無 | 副CTA あり | 副CTA なし | TF 参加 + Email 合計 |
