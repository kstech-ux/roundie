# 09. SEO Specification

## Title / Description（言語別）

| 言語 | title (chars) | meta description (chars) |
|---|---|---|
| JA | **ROUNDIE — 記憶を、かたちに。** (16) | **ROUNDIE は、ゴルフのラウンドを世界に一つだけのカラーグリッドにして残すソーシャルアプリ。20代・30代から始まる、新しいラウンドの楽しみ方。** (約 92) |
| EN | **ROUNDIE — Memories, in form. A golf social app.** (45) | **A golf social app for the 20s, 30s, and beyond. Every round becomes a one-of-a-kind color grid you can save, share, and revisit.** (約 130) |
| KO | **ROUNDIE — 기억을, 형태로. 골프 소셜 앱.** (29) | **20대·30대부터의 골프 소셜 앱. 라운드는 세상에 단 하나뿐인 컬러 그리드가 되어, 저장·공유·언제든 다시 볼 수 있는 형태로 남습니다.** (약 88) |

> JS で `document.title` / `<meta description>` を sl() の中で動的に更新する。

## キーワード戦略

### Primary keywords（target）
| keyword | 月間検索数(推定) | 競合度 | 優先 |
|---|---|---|---|
| ゴルフ アプリ おしゃれ | 中 | 中 | ◎ |
| ゴルフ アプリ シェア | 中 | 中 | ◎ |
| ゴルフ ラウンドカード | 低（新語） | 低 | ◎（造語で寡占） |
| ゴルフ コンペ アプリ 集計 | 高 | 高 | ○ |
| ゴルフ Strava | 低 | 低 | ◎ |
| golf social app | 高（EN） | 高 | △ |

### Long-tail keywords（記事化候補）
- 「ゴルフ アプリ スコア 残し方」
- 「ゴルフ ラウンド 思い出 記録」
- 「ゴルフ 仲間 共有 アプリ」
- 「golf round card sharing app」

### NG keywords（使わない）
- 「ゴルフ Wordle」（商標リスク）
- 「ゴルフ アプリ おすすめ」（競合過剰）

## hreflang 設定

```html
<link rel="alternate" hreflang="ja" href="https://roundie.app/?lang=ja">
<link rel="alternate" hreflang="en" href="https://roundie.app/?lang=en">
<link rel="alternate" hreflang="ko" href="https://roundie.app/?lang=ko">
<link rel="alternate" hreflang="x-default" href="https://roundie.app/">
```

GitHub Pages の制約上、URL パラメータ式が現実的（サブディレクトリやサブドメインを切らない）。

## OGP / Twitter Card

### 共通仕様
```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://roundie.app/">
<meta property="og:site_name" content="ROUNDIE">
<meta property="og:image" content="https://roundie.app/og/og-ja.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="ja_JP">
<meta property="og:locale:alternate" content="en_US">
<meta property="og:locale:alternate" content="ko_KR">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@kanopy_inc">  <!-- 公式 Twitter があれば -->
```

### OGP image 仕様（1200×630）
- 言語別 3 種類：`/og/og-ja.png` / `/og/og-en.png` / `/og/og-ko.png`
- 内容: ロゴ + タグライン + Round Card サンプル（86 グリッド）+ "TRY ON TESTFLIGHT"
- 背景: `#0A0A0A` / 文字 `#FFFFFF` + `#7FCF6F` アクセント
- 解像度: 1200×630（標準）と 1500×1500（Instagram シェア用）を別途用意

## 構造化データ（JSON-LD）

LP に埋め込む構造化データ。Google リッチリザルト合格を目標。

### 1. SoftwareApplication
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ROUNDIE",
  "description": "A golf social app. Every round becomes a one-of-a-kind color grid.",
  "applicationCategory": "SportsApplication",
  "operatingSystem": "iOS 16.0 or later",
  "offers": [
    {
      "@type": "Offer",
      "name": "Free",
      "price": "0",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "name": "Pro Monthly",
      "price": "4.99",
      "priceCurrency": "USD",
      "billingDuration": "P1M"
    },
    {
      "@type": "Offer",
      "name": "Pro Yearly",
      "price": "39.99",
      "priceCurrency": "USD",
      "billingDuration": "P1Y"
    },
    {
      "@type": "Offer",
      "name": "Comp Pack",
      "price": "9.99",
      "priceCurrency": "USD"
    }
  ],
  "publisher": {
    "@type": "Organization",
    "name": "KANOPY Inc.",
    "url": "https://kanopy-inc.com/"
  }
}
```

### 2. Organization
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "KANOPY Inc.",
  "alternateName": "株式会社KANOPY",
  "url": "https://kanopy-inc.com/",
  "logo": "https://kanopy-inc.com/assets/logo.svg",
  "sameAs": [
    "https://twitter.com/kanopy_inc"
  ]
}
```

### 3. WebSite + SearchAction
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ROUNDIE",
  "url": "https://roundie.app/",
  "inLanguage": ["ja", "en", "ko"]
}
```

### 4. FAQPage（FAQ セクション用）
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "スコアは公開されますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "公開されません。ROUNDIE はスコア値ではなくカラーグリッドのみを共有します。"
      }
    },
    {
      "@type": "Question",
      "name": "Android 版はいつですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "現在 iOS 版を先行提供しています。Android 版は 2026 年後半リリース予定です。"
      }
    },
    {
      "@type": "Question",
      "name": "解約はできますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "いつでも App Store のサブスクリプション管理から解約できます。Pro アクセスは現在の請求期間終了まで継続します。"
      }
    }
  ]
}
```

### 5. BreadcrumbList（/faq, /privacy, /terms 用）
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ROUNDIE", "item": "https://roundie.app/" },
    { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://roundie.app/faq/" }
  ]
}
```

## sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://roundie.app/</loc>
    <lastmod>2026-05-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ja" href="https://roundie.app/?lang=ja"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://roundie.app/?lang=en"/>
    <xhtml:link rel="alternate" hreflang="ko" href="https://roundie.app/?lang=ko"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://roundie.app/"/>
  </url>
  <url>
    <loc>https://roundie.app/faq/</loc>
    <lastmod>2026-05-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://roundie.app/privacy/</loc>
    <lastmod>2026-05-21</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://roundie.app/terms/</loc>
    <lastmod>2026-05-21</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

## robots.txt

```
User-agent: *
Allow: /
Disallow: /mock/
Disallow: /docs/

# AI Crawlers
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://roundie.app/sitemap.xml
```

## llms.txt（AI 検索最適化）

```
# ROUNDIE

> A golf social app. Every round becomes a one-of-a-kind color grid you can save, share, and revisit.
> 20s, 30s, and beyond. Privacy-first: scores are not displayed publicly.

## Key facts
- Platform: iOS (TestFlight live), Android (planned 2026 H2)
- Company: KANOPY Inc., Tokyo, Japan
- Pricing: Free forever / Pro $4.99/mo / Pro $39.99/yr / Comp Pack $9.99/event (USD)
- Languages: Japanese, English, Korean
- Score system: SKILL 35 + VIBE 30 + STYLE 35 = 100 points
- Ranks: ROOKIE → PLAYER → REGULAR → SINGLE → SCRATCH → PRO → LEGEND

## URLs
- Landing: https://roundie.app/
- TestFlight: https://testflight.apple.com/join/TecygPvk
- Parent company: https://kanopy-inc.com/
```

## 画像 alt 属性ポリシー

| 画像 | alt 例 |
|---|---|
| ロゴ | `ROUNDIE — A golf social app` |
| Round Card SS | `Sample Round Card — 18-hole color grid showing a 86-stroke round` |
| ROUNDIE Score SS | `ROUNDIE Score screen — 72 points, REGULAR rank, with SKILL/VIBE/STYLE breakdown` |
| Feed SS | `Feed timeline — friends' rounds with color grids and Kudos counts` |
| 装飾画像 | `alt=""`（空文字、role="presentation"）|

## 内部リンク戦略

| from | to | anchor text |
|---|---|---|
| Hero | #features | 「機能を見る →」 |
| Vision | #score | （無し、自然スクロール）|
| Features | #pricing | 「料金を見る →」 |
| Pricing | /faq/ | 「すべての FAQ を見る →」 |
| Trust | /privacy/ | 「プライバシーポリシーを読む →」 |
| Final CTA | https://testflight.apple.com/... | TestFlight CTA |
| Footer | https://kanopy-inc.com/ | KANOPY |

## SEO 検証チェックリスト

- [ ] Google Search Console URL 検査でエラー無し
- [ ] Google リッチリザルトテストで構造化データ全種類合格
- [ ] Bing Webmaster Tools 登録
- [ ] hreflang validator で問題なし
- [ ] OGP デバッガー（Facebook / Twitter Card Validator）で警告なし
- [ ] PageSpeed Insights で Mobile/Desktop ともに「良好」
- [ ] Mobile-Friendly Test 合格
