# 13. Performance Targets

## Core Web Vitals 目標

| 指標 | 目標 | Good 閾値 | Poor 閾値 |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | **< 2.0s** | < 2.5s | > 4.0s |
| **INP** (Interaction to Next Paint) | **< 150ms** | < 200ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | **< 0.05** | < 0.1 | > 0.25 |
| FCP (First Contentful Paint) | **< 1.5s** | < 1.8s | > 3.0s |
| TTFB (Time to First Byte) | **< 600ms** | < 800ms | > 1.8s |
| TBT (Total Blocking Time) | **< 150ms** | < 200ms | > 600ms |

## Lighthouse 目標

| Category | 目標 |
|---|---|
| Performance | **95+** |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |
| PWA | N/A（PWA 化はしない） |

## 画像最適化

### フォーマット優先度
1. **AVIF**（最新ブラウザ、最高圧縮率）
2. **WebP**（広いサポート）
3. **JPG/PNG**（最終フォールバック）

### `<picture>` パターン（実装テンプレート）
```html
<picture>
  <!-- AVIF, 解像度別 -->
  <source media="(min-width:1024px)" srcset="/img/hero@1x.avif 1x, /img/hero@2x.avif 2x" type="image/avif">
  <source media="(max-width:1023px)" srcset="/img/hero-sm@1x.avif 1x, /img/hero-sm@2x.avif 2x" type="image/avif">
  <!-- WebP, 解像度別 -->
  <source media="(min-width:1024px)" srcset="/img/hero@1x.webp 1x, /img/hero@2x.webp 2x" type="image/webp">
  <source media="(max-width:1023px)" srcset="/img/hero-sm@1x.webp 1x, /img/hero-sm@2x.webp 2x" type="image/webp">
  <!-- JPG fallback -->
  <img src="/img/hero.jpg" alt="..." width="600" height="600" loading="eager" decoding="async" fetchpriority="high">
</picture>
```

### 画像ガイドライン
- すべての `<img>` に `width` `height` を明示（CLS 防止）
- 上から見える画像は `loading="eager"` + `fetchpriority="high"`
- 下方の画像は `loading="lazy"` + `decoding="async"`
- alt 属性必須（装飾画像は `alt=""` + `role="presentation"`）
- SVG はインライン化（fill / stroke を CSS で制御）

### サイズ目標
| 用途 | 最大ファイルサイズ |
|---|---|
| Hero メイン画像 (1x) | 80 KB |
| Hero メイン画像 (2x) | 160 KB |
| Feature SS (1x) | 50 KB |
| Feature SS (2x) | 100 KB |
| OGP 画像 (1200x630) | 100 KB |
| ロゴ SVG | 5 KB |

## フォント最適化

### 戦略: **Web Font ロード無し**
- Arial Black / Inter（macOS/iOS では Helvetica Neue にフォールバック）/ Hiragino はシステムフォント
- カスタムフォントを **読み込まない** → フォント読み込み待ちゼロ・FOIT/FOUT ゼロ

### 万一カスタムフォントが必要になった場合
```html
<link rel="preload" href="/fonts/custom.woff2" as="font" type="font/woff2" crossorigin>
```
+ CSS:
```css
@font-face {
  font-family: 'Custom';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;  /* FOIT を避ける */
  font-weight: 100 900; /* variable font */
  unicode-range: U+0020-007F, U+3000-30FF, U+4E00-9FFF;  /* JP subset */
}
```

## CSS 最適化

### Critical CSS インライン化
- ヒーロー領域のスタイル ~10KB を `<head>` の `<style>` にインライン
- 残りは外部 CSS で `<link rel="stylesheet">`
- LP の規模なら全 CSS インラインでも OK（推奨）

### 未使用 CSS の削減
- 純粋静的 LP なので、CSS の全部が使われる前提で書く
- PurgeCSS / UnCSS 等の使用は不要

### CSS サイズ目標
- インライン CSS: **< 20 KB**（minified, gzipped）
- 全 CSS: **< 30 KB**

## JavaScript 最適化

### 戦略: **最小限の JS**
- 言語切替（sl 関数）
- スクロール演出（IntersectionObserver）
- CMP バナー
- Email フォーム
- GTM 初期化

### JS サイズ目標
- インライン JS: **< 5 KB**
- 外部 JS（GTM 含む）: **< 50 KB**（GZipped）
- **モジュールバンドラ不使用**（純粋 ES Modules）

### ロード戦略
```html
<!-- 即時実行不要、HTML パース完了後 -->
<script defer src="/js/app.js"></script>

<!-- 外部スクリプトは GTM 経由で遅延ロード -->
<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX"></script>
```

### 第三者スクリプト遅延ロード戦略
- Cookie 同意前: 何も発火しない
- Cookie 同意後: GTM ロード → GA4/Clarity ロード
- 結果: First Paint 時の JS 実行はほぼ 0

## リソースヒント

```html
<head>
  <!-- 重要なドメインに preconnect -->
  <link rel="preconnect" href="https://www.googletagmanager.com">
  <link rel="preconnect" href="https://www.google-analytics.com">

  <!-- フォント (システムフォント使用のため不要) -->

  <!-- LCP 画像 -->
  <link rel="preload" as="image" href="/img/hero.avif" type="image/avif" fetchpriority="high">

  <!-- 自社 favicon を SVG インライン化 -->
</head>
```

## キャッシュ戦略

### GitHub Pages のデフォルト Cache-Control
- HTML: `max-age=600` (10 minutes)
- CSS/JS: `max-age=600`
- Images: `max-age=600`

### 改善案
- 静的アセットには **ファイル名にハッシュを含める**（例: `hero-a3f2.avif`）
- Cloudflare 経由配信時は Cache Rules で `max-age=31536000, immutable` を強制
- HTML は **常に短期キャッシュ** + ETag 利用

## HTTP/2 / HTTP/3

- GitHub Pages は HTTP/2 対応済（自動）
- Cloudflare 経由なら HTTP/3 (QUIC) 利用可能

## Brotli 圧縮

- GitHub Pages は **Gzip のみ**（Brotli 非対応）
- Cloudflare 経由なら Brotli 自動有効

## 計測 / モニタリング

### Real User Monitoring (RUM)
- GA4 の Web Vitals 計測を有効化
- Cloudflare Web Analytics（無料）併用検討

### Synthetic Monitoring
- WebPageTest で月 1 回テスト
- PageSpeed Insights を定期的にチェック
- Lighthouse CI の GitHub Actions 統合

## パフォーマンスバジェット

### Total page weight (HTML+CSS+JS+Images on first load)
| ビュー | 目標 |
|---|---|
| Mobile (3G) | **< 500 KB** |
| Mobile (4G) | **< 800 KB** |
| Desktop | **< 1.5 MB** |

### Request count
- First Paint まで: **< 10 requests**
- Full page: **< 30 requests**

## チェックリスト（公開前）

- [ ] Lighthouse Mobile/Desktop で 4 カテゴリすべて 90+（理想は Performance 95+, 他 100）
- [ ] WebPageTest で LCP < 2.5s
- [ ] 画像すべて AVIF/WebP（JPG/PNG はフォールバックのみ）
- [ ] すべての画像に width/height 明示
- [ ] CSS インライン化 + 外部 CSS 30 KB 以下
- [ ] JS 50 KB 以下
- [ ] フォント読み込み無し（システムフォント）
- [ ] preconnect / preload 設定
- [ ] CMP 同意前は計測タグ発火停止
- [ ] CLS 0 を確認（layout shift なし）
