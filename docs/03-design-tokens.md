# 03. Design Tokens

**Source of Truth**: アプリ本体の [`golf-id/constants/brand-tokens.ts`](../../golf-id/constants/brand-tokens.ts) と**完全一致**。LP 独自の色・フォントを足さない。

## カラー

### Background
| Token | Value | 用途 |
|---|---|---|
| `--bg`    | `#0A0A0A` | ベース背景（アプリ準拠） |
| `--bg-2`  | `#141414` | カード背景・alt section |
| `--bg-3`  | `#1A1A1A` | hover / より深いカード |
| `--ink`   | `#0A0A0A` | 反転文字色 |

### Brand Green（アプリ正本）
| Token | Value | 用途 |
|---|---|---|
| `--green`        | `#2D5A27` | プライマリ — wordmark, ロゴ R |
| `--green-mid`    | `#4A9A5D` | hover |
| `--green-hi`     | `#5BAF52` | ロゴ内円、アクセント |
| `--green-on-dark`| `#7FCF6F` | ダーク背景上の見出し・リンク・focus ring |

### Text on `--bg`
| Token | Value | コントラスト |
|---|---|---|
| `--t1` | `#FFFFFF` | 21:1（最大コントラスト・見出し） |
| `--t2` | `#A8A8A8` | 7.3:1（本文） |
| `--t3` | `#7A7A7A` | 4.6:1（補助・キャプション、12px 以下は使わない） |
| `--t4` | `#525252` | 3.0:1（**装飾用のみ・テキストには使わない**） |

### Score Colors（ROUNDIE グリッド用、アプリ準拠）
| Token | Value | 意味 |
|---|---|---|
| `--eagle`  | `#F5C400` | イーグル金 |
| `--birdie` | `#2D5A27` | バーディー（パーと同色だがアプリ仕様） |
| `--par`    | `#2D5A27` | パー緑 |
| `--bogey`  | `#60A5FA` | ボギー青 |
| `--double` | `#9B8EC4` | ダブル紫 |
| `--triple` | `#888888` | トリプル+ 灰 |

### Semantic
| Token | Value | 用途 |
|---|---|---|
| `--ok`    | `#34D399` | 成功 |
| `--warn`  | `#FBBF24` | 注意 |
| `--err`   | `#F87171` | エラー |
| `--info`  | `#60A5FA` | 情報 |

### Border / Surface
| Token | Value | 用途 |
|---|---|---|
| `--border-1` | `rgba(255,255,255,0.06)` | 標準境界線 |
| `--border-2` | `rgba(255,255,255,0.10)` | 強調境界線 |
| `--focus-ring` | `var(--green-on-dark)` | focus-visible |

---

## タイポグラフィ

### Font Families
```css
--font-display: "Arial Black", "Helvetica Neue", system-ui, sans-serif;
--font-body: -apple-system, BlinkMacSystemFont, "Inter", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Noto Sans KR", sans-serif;
--font-mono: ui-monospace, "SF Mono", Menlo, monospace;
```

- 見出し（H1/H2/wordmark）= **Arial Black 900**（letter-spacing 0.04em〜0.42em 用途次第）
- 本文 = システムフォント優先（フォールバック群で多言語対応）
- 数字（スコア・価格）= Arial Black

### Type Scale（clamp ベース）
```css
--fs-9xl: clamp(56px, 12vw, 156px);  /* hero H1 */
--fs-8xl: clamp(40px, 8vw, 96px);    /* section H2 */
--fs-7xl: clamp(32px, 5vw, 64px);    /* feature H3 */
--fs-6xl: clamp(24px, 3.6vw, 40px);  /* sub heading */
--fs-5xl: clamp(20px, 2.4vw, 28px);  /* large body */
--fs-4xl: clamp(18px, 1.8vw, 22px);  /* body lead */
--fs-3xl: 17px;  /* body */
--fs-2xl: 15px;  /* body small */
--fs-xl:  13px;  /* meta */
--fs-l:   11px;  /* eye / tag */
--fs-m:   10px;  /* footnote */
--fs-s:   9px;   /* legal */
```

### Line Height & Letter Spacing
```css
--lh-tight: 1.0;   /* display H1 */
--lh-snug:  1.15;  /* section H2 */
--lh-normal:1.5;   /* body */
--lh-relax: 1.7;   /* body long */
--lh-loose: 1.85;  /* JA long form */

--ls-display: -0.02em;  /* hero / large display */
--ls-heading: 0.02em;   /* H2-H3 */
--ls-eye:     0.22em;   /* 「VISION」「FEATURES」eye text */
--ls-tag:     0.16em;   /* tag chip */
--ls-body:    0;
```

## Spacing

```css
--sp-1: 4px;
--sp-2: 8px;
--sp-3: 12px;
--sp-4: 16px;
--sp-5: 20px;
--sp-6: 24px;
--sp-8: 32px;
--sp-10: 40px;
--sp-12: 48px;
--sp-16: 64px;
--sp-20: 80px;
--sp-24: 96px;
--sp-32: 128px;
--sp-40: 160px;

/* Section vertical padding */
--section-py: clamp(80px, 12vw, 160px);
--container-max: 1200px;
--container-px: clamp(20px, 4vw, 64px);
```

## Radius

```css
--radius-0: 0;       /* Brutalist hard edges */
--radius-1: 2px;     /* default */
--radius-2: 6px;     /* card */
--radius-3: 12px;    /* large card */
--radius-4: 18px;    /* phone mockup */
--radius-pill: 9999px;
```

## Shadow

```css
--shadow-1: 0 1px 2px rgba(0,0,0,0.4);
--shadow-2: 0 4px 16px rgba(0,0,0,0.5);
--shadow-3: 0 20px 60px rgba(0,0,0,0.6);
--shadow-glow: 0 0 60px rgba(45,90,39,0.4);
--shadow-brut: 6px 6px 0 currentColor; /* Brutalist offset shadow */
```

## Motion

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-brutal: cubic-bezier(0.22, 1, 0.36, 1);

--dur-fast:  150ms;
--dur-base:  250ms;
--dur-slow:  450ms;
--dur-reveal:800ms;
```

### Motion 原則
- **3 種類の動きしか使わない**: (1) フェードイン (2) スライドアップ (3) スケール
- **マーキー・無限ループ系は禁止**（前回ロールバックの教訓）
- **prefers-reduced-motion: reduce** で **全アニメ停止**

## Z-Index

```css
--z-base: 0;
--z-sticky: 10;
--z-fixed: 20;
--z-overlay: 30;
--z-modal: 40;
--z-toast: 50;
--z-tooltip: 60;
--z-skip-link: 9999;
```

## Breakpoints

```css
--bp-xs:  360px;   /* small mobile */
--bp-sm:  480px;   /* mobile */
--bp-md:  768px;   /* tablet portrait */
--bp-lg:  1024px;  /* tablet landscape / small laptop */
--bp-xl:  1280px;  /* laptop */
--bp-2xl: 1536px;  /* desktop */
--bp-3xl: 1920px;  /* large desktop */
```

詳細は [04-responsive-spec.md](./04-responsive-spec.md) 参照。
