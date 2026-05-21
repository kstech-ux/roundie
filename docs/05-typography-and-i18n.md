# 05. Typography & i18n

## フォントスタック

```css
:root {
  /* Display (見出し・wordmark) */
  --font-display: "Arial Black", "Arial Black Std", "Helvetica Neue", system-ui, sans-serif;

  /* Body (本文) — 言語別フォールバック */
  --font-body:
    -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Inter", "Helvetica Neue",
    "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic",
    "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic",
    sans-serif;

  /* Mono (数字・コード) */
  --font-mono: ui-monospace, "SF Mono", "Fira Code", Menlo, monospace;
}
```

### lang別フォントスタック（精密化）
```css
:lang(ja) { font-family: -apple-system, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic", sans-serif; }
:lang(ko) { font-family: -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif; }
:lang(en) { font-family: -apple-system, "Inter", "Helvetica Neue", sans-serif; }

/* 数字は等幅 */
.tabular { font-variant-numeric: tabular-nums; }
```

### 和欧混植調整
```css
/* JA テキスト内に英数字が混じる場合の調整 */
:lang(ja) {
  font-feature-settings: "palt" 1; /* proportional alternate metrics */
}
```

## タイポグラフィ・ルール

### 改行制御

**Rule 1**: 装飾目的の `<br>` は **完全禁止**。
```html
<!-- ❌ BAD -->
<span data-l="ja">あなたのラウンドを、<br class="sp"><em>かたちに残す。</em></span>

<!-- ✅ GOOD -->
<span data-l="ja" lang="ja">あなたのラウンドを、<em>かたちに残す。</em></span>
<!-- CSS で text-wrap: balance / max-width: ??ch / <wbr> を使う -->
```

**Rule 2**: 行長制御は `max-width` を `ch` 単位で。
```css
:lang(ja) p { max-width: 35ch; line-height: 1.85; }
:lang(en) p { max-width: 65ch; line-height: 1.7; }
:lang(ko) p { max-width: 32ch; line-height: 1.85; }
```

**Rule 3**: 見出しは `text-wrap: balance`、本文は `text-wrap: pretty`。
```css
h1, h2, h3 { text-wrap: balance; }
p { text-wrap: pretty; }
```

**Rule 4**: 単語分割の言語別ポリシー。
```css
:lang(ja) {
  word-break: keep-all;        /* 単語境界を尊重 */
  overflow-wrap: anywhere;     /* 長い英単語のみ折り返し許可 */
  line-break: strict;          /* 行頭禁則を厳格に */
}
:lang(ko) {
  word-break: keep-all;
  overflow-wrap: anywhere;
}
:lang(en) {
  hyphens: auto;
  overflow-wrap: break-word;
}
```

**Rule 5**: 保護されるべき固有名詞・URL・電話・価格は `<span class="nowrap">` で囲む。
```css
.nowrap { white-space: nowrap; }
```

```html
<p>料金は <span class="nowrap">$4.99 / 月</span> から。</p>
```

**Rule 6**: 長い英単語には `<wbr>` を入れる。
```html
<p>To-the-<wbr>browser-<wbr>compatibility.</p>
```

## 言語別タイポ仕様

### 日本語（Primary）

| 項目 | 値 |
|---|---|
| フォントサイズ目安 | 本文 15-17px |
| 行長（max） | **35ch** |
| 行間（line-height） | 1.85 |
| 字間（letter-spacing） | 0（基本）/ 0.05em（見出し小）|
| 句読点 | 「、」「。」を使用（ピリオド . / カンマ , は使わない） |
| 「ですます」or「である」 | **ですます基本**、エモい所のみ体言止め |
| 引用 | 「日本語引用」 |
| 強調 | `<strong>` で `font-weight: 700`、色は `var(--t1)` |
| 装飾 | `<em>` で `font-style: normal; color: var(--green-on-dark)` |

### 英語（Secondary）

| 項目 | 値 |
|---|---|
| フォントサイズ目安 | 本文 16-18px |
| 行長（max） | **65ch** |
| 行間 | 1.7 |
| 字間 | 0（基本）/ 0.04em（H1 large）|
| 大文字小文字 | 見出しは **Sentence case**（"Memories, in form."）。長い見出しは Title Case ではなく Sentence Case |
| Oxford comma | **使う**（"A, B, and C"） |
| Quotation | "smart quotes" を使用（ASCII の " を使わない） |
| Hyphenation | `hyphens: auto;` 有効 |

### 韓国語（Tertiary）

| 項目 | 値 |
|---|---|
| フォントサイズ目安 | 本文 15-17px |
| 行長（max） | **32ch** |
| 行間 | 1.85 |
| 字間 | 0（基本） |
| 띄어쓰기 | **합니다체基本**（해요体は避ける） |
| 한자 표기 | 原則使わない（カタカナ表記も併記しない） |
| 英文表記 | TestFlight / App Store / Pro はそのまま |
| 句読点 | 마침표 `.` / 쉼표 `,` |

## 禁則・孤立行対策

### 孤立行（widows / orphans）
```css
p {
  text-wrap: pretty;       /* widow/orphan を自動回避 */
  orphans: 2; widows: 2;   /* 印刷用 */
}
```

### 「ですます」の体言止め混用は最小限
- 章タイトルで体言止め OK
- 本文中は「ですます」統一

## マイクロコピー基準

| 場面 | JA | EN | KO |
|---|---|---|---|
| 主CTA | TestFlight で試す | Try on TestFlight | TestFlight 에서 시작 |
| 副CTA | 公開時に通知 | Notify me at launch | 출시 알림 받기 |
| placeholder（mail） | you@example.com | you@example.com | you@example.com |
| 必須マーク | （必須） | (required) | (필수) |
| エラー（メール） | メールアドレスの形式が違います | Please enter a valid email | 올바른 이메일 주소를 입력해 주세요 |
| 完了 | 登録できました | You're in. We'll notify you. | 등록되었습니다 |

## 数字表記

| 種類 | JA | EN | KO |
|---|---|---|---|
| 価格 | $4.99 / 月 | $4.99/mo | $4.99/월 |
| パーセント | 17% OFF | 17% off | 17% 할인 |
| 期間 | 2 ヶ月分お得 | 2 months free | 2개월 무료 |
| ホール数 | 18 ホール | 18 holes | 18홀 |

**通貨は USD 統一**（[project_pricing_usd](../../.claude/projects/-Users-kazushigeshiba/.secretary/memory/project_pricing_usd.md) PM 確定）。

## 表記揺れ防止リスト

| 統一形 | NG表記 |
|---|---|
| ROUNDIE | Roundie / roundie / ROUNDLE |
| TestFlight | Test Flight / testflight |
| ROUNDIE Score | ROUNDIEスコア / ROUNDIE スコア（半角スペース必須） |
| ラウンドカード | ラウンド・カード / ラウンド カード |
| カラーグリッド | カラーグリット / color grid（日本語では「カラーグリッド」） |
| 仲間 | 友達 / friends（日本語訳） |
| Kudos | クドス / クードス（英語のまま） |
| App Store | AppStore / Appstore |

## lang 属性の厳密化

```html
<!-- ❌ BAD -->
<html lang="ja">
<span data-l="en">Memories, in form.</span>
<span data-l="ja" class="a">記憶を、かたちに。</span>
<span data-l="ko">기억을, 형태로.</span>

<!-- ✅ GOOD -->
<html lang="ja">  <!-- 初期値、JS で切替 -->
<span data-l="en" lang="en">Memories, in form.</span>
<span data-l="ja" class="a" lang="ja">記憶を、かたちに。</span>
<span data-l="ko" lang="ko">기억을, 형태로.</span>
```

スクリーンリーダーが言語切替で正しく発音するために、**lang 属性を span 単位で**必ず付ける。
