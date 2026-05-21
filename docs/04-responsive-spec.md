# 04. Responsive Specification

## ブレイクポイント定義

**モバイルファースト**で `min-width` @media を使用。以下の数値は「**この幅で別レイアウトに切り替える**」境界。

| BP | min-width | カテゴリ | 主代表デバイス | 設計意図 |
|---|---|---|---|---|
| `xs` | 360px | mobile-small | iPhone SE / Galaxy Fold 開 | 最小幅。横スク禁止 |
| `sm` | 480px | mobile-large | iPhone 15 Pro Max | ヒーロー縦並びでまだ余裕 |
| `md` | 768px | tablet-portrait | iPad mini 縦 / iPad 縦 | **タブレット縦は「広いモバイル」** |
| `lg` | 1024px | tablet-landscape / small-laptop | iPad Pro 横 / 古い PC | **タブレット横は「小さい PC」** |
| `xl` | 1280px | laptop | MacBook 13/14 | 標準 |
| `2xl` | 1536px | desktop | iMac / 外部モニタ | 大画面 |
| `3xl` | 1920px | large-desktop | ハイエンド | 超大画面（max-width で頭打ち） |

## 検証ビューポート（実機/エミュレータで毎回チェック）

| 用途 | サイズ |
|---|---|
| 横最小 | **280×653**（Galaxy Fold 閉） |
| iPhone SE | 375×667 |
| iPhone 15/16 | 393×852 |
| iPhone 15 Pro Max | 430×932 |
| iPhone 横 | 844×390（横） |
| iPad mini 縦 | 768×1024 |
| iPad Air 縦 | 820×1180 |
| iPad Pro 11 縦 | 834×1194 |
| iPad Air 横 | 1180×820 |
| iPad Pro 12.9 横 | 1366×1024 |
| MacBook 13 | 1280×800 |
| MacBook 14 | 1512×982 |
| 24inch | 1920×1200 |
| 27inch | 2560×1440 |

## デバイス別ファーストビュー設計

### モバイル（360-767px）
```
┌─────────────────────┐
│ HEADER (sticky)     │ ← ROUNDIE logo + hamburger
│                     │
│ EYE TEXT            │
│ HERO H1             │ ← 5-7行で「記憶を、かたちに。」
│ HERO H1 (続き)      │
│                     │
│ サブコピー(1行)     │
│                     │
│ [TestFlight CTA]    │ ← 主 CTA
│ [Email Notify CTA]  │ ← 副 CTA
└─────────────────────┘
↓ スクロールで Round Card サンプル
```
**特徴**: H1 を主役、Round Card サンプルは 2 画面目に。

### タブレット縦（768-1023px）
```
┌──────────────────────────────────┐
│ HEADER + nav links + lang        │
│                                  │
│ ヒーロー縦並び（モバイル拡張）   │
│ ただし H1 サイズ 1.5x            │
│ Round Card は 1 画面目に入る      │
└──────────────────────────────────┘
```
**特徴**: 「広いモバイル」として扱う。columns を切らない。

### タブレット横 / Laptop（1024-1279px）
```
┌────────────────────────────────────────────┐
│ HEADER + nav + lang + cta-top              │
│                                            │
│ ┌──────────────────┐  ┌─────────────┐     │
│ │ HERO LEFT        │  │ HERO RIGHT  │     │
│ │ H1, sub, CTAs    │  │ Round Card  │     │
│ │                  │  │ sample      │     │
│ └──────────────────┘  └─────────────┘     │
└────────────────────────────────────────────┘
```
**特徴**: 2 カラム発動。これが「ベース」レイアウト。

### Desktop（1280px+）
- max-width: 1200px で内容を中央寄せ。両端の余白を「呼吸」として使う
- スクロール深度に応じた parallax は使わない（パフォーマンス＆品質維持）

## 各セクションのデバイス別レイアウト方針

| セクション | mobile | tablet縦 | tablet横/laptop | desktop |
|---|---|---|---|---|
| Hero | 縦並び 1col | 縦並び 1col | 2col (text + visual) | 2col + 呼吸余白 |
| Vision | 1col, quote block | 1col, 大型 quote | 1col, max 800px | 1col, max 900px |
| HowItWorks | 4 step 縦並び | 2×2 grid | 4 step 横並び | 4 step 横並び |
| Features (8 cards) | 1col 縦 | 1col 大カード | 2col grid | 2col grid, hover↑ |
| Score deep dive | 1col 階段式 | 1col | 3col (pillars) + ranks | 3col + 余白拡大 |
| Pricing | 1col 縦 (popular中) | 1col | 3col card | 3col card + Comp Pack横並び |
| Trust | 3 card 縦 | 3 card 縦 | 3col | 3col |
| Final CTA | 中央寄せ大文字 | 中央寄せ巨大 | 中央寄せ巨大 | 同左 + 横長余白 |

## レイアウト原則

### A. 横スクロール事故ゼロ
```css
html, body { overflow-x: hidden; }
* { max-width: 100%; }
img, svg { max-width: 100%; height: auto; }
```

### B. dvh / svh / lvh 使用
- **`100vh` 禁止**（iOS Safari でアドレスバー分が崩れる）
- ヒーロー高さ: `min-height: 100dvh;` または `min-height: max(640px, 92dvh);`

### C. safe-area-inset 対応
```css
.header { padding-top: env(safe-area-inset-top); }
footer { padding-bottom: env(safe-area-inset-bottom); }
.mobile-cta-bar { padding-bottom: max(16px, env(safe-area-inset-bottom)); }
```

### D. Container Queries（必要な箇所で使用）
- Feature カード内部のレイアウト変化に container query を使用
- ビューポート横幅ではなくカード幅で切り替える

```css
.feat-card { container-type: inline-size; }
@container (min-width: 480px) {
  .feat-card-inner { grid-template-columns: 1fr 1fr; }
}
```

### E. ポインタとホバーの分岐
```css
/* タッチデバイスでは hover を発動させない */
@media (hover: hover) and (pointer: fine) {
  .btn:hover { transform: translate(-3px, -3px); }
}
```

### F. 画像 `<picture>` パターン
```html
<picture>
  <source media="(max-width: 480px)" srcset="hero-card@1x.avif 1x, hero-card@2x.avif 2x" type="image/avif">
  <source media="(max-width: 480px)" srcset="hero-card@1x.webp 1x, hero-card@2x.webp 2x" type="image/webp">
  <source srcset="hero-card-lg@1x.avif 1x, hero-card-lg@2x.avif 2x" type="image/avif">
  <img src="hero-card-lg.jpg" alt="..." width="600" height="600" loading="eager" decoding="async">
</picture>
```

### G. iPad 専用最適化
- **iPad 縦 (768-1023px)**: ヒーローは 1 カラム、Round Card は HOWITWORKS の直後
- **iPad 横 (1024-1366px)**: 「小さい PC」として扱う。フル 2 カラム
- iPad の Apple Pencil 入力対応: focus-visible に Pencil ホバー時の `@media (hover: hover)` 適用

### H. 折りたたみ・超狭幅（280px）
- nav は collapse → ハンバーガーのみ
- ロゴは「R」のみに（ROUNDIE 全文は出さない）
- 文字サイズは最小限を確保（fs-l = 11px 以下にはしない）

## レスポンシブの検証チェックリスト

各 BP（少なくとも 360 / 480 / 768 / 1024 / 1280 / 1920）で:
- [ ] 横スクロール 0
- [ ] テキストの孤立行（オーファン・ウィドウ）が出ていない
- [ ] CTA はファーストビュー内に最低 1 個
- [ ] タッチターゲット最小 44×44px
- [ ] iOS Safari でアドレスバーを含めても破綻なし
- [ ] フォーカスリングが見える
- [ ] reduce-motion で全アニメ停止
- [ ] dvh 使用箇所が `100vh` ベタ書きになっていない
