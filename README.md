# ROUNDIE LP — Handoff Package

> "あなたのラウンドを、かたちに残す。" — この 1 行を、132 セル / 44 アートボード / 12 受入条件 / 30 日プレイブックに分解した結果が、この封筒です。

**Status:** Step 0 → Step 10 完了。本パッケージは Claude Code が実装に着手するための一次情報。
**Date:** 2026.05
**Owner:** KANOPY × Claude Design

---

## 8 視点 1 行契約 (Step 8 サマリ)

| | 視点 | 1 行責任 |
|---|---|---|
| **A** | SEO | 機械可読な詩。JSON-LD 5 種 + AEO 用の "1 文 1 主張"。 |
| **B** | CRO | 煽らず、9% を目指す。6 段ファネル / 4 仮説 A/B。**ダークパターン禁止。** |
| **C** | 計測 | 詩的 KPI も追う。GA4 14 イベント。`vision_complete` / `round_card_form_view` / `kudos_tap_demo` は等しく KPI。 |
| **D** | 法規 | 規制範囲外でも透明に。ステマ規制 + UGC 二重同意。 |
| **E** | SEC | LP は本体ではない、は禁句。CSP strict-dynamic + nonce、1st party proxy 計測、DKIM 署名メール。 |
| **F** | PERF | 動きを入れた分、軽くする。LCP < 2s, CLS < 0.05, INP < 200ms, JS < 80KB。**CSS animation only。** |
| **G** | A11Y | 美しさと到達可能性を両立。WCAG 2.2 AA 全項目。**動きが情報の主役にならない。色だけで情報を伝えない。** |
| **H** | EDGE | 失敗の縁こそ設計の証明。9 エッジケース。**JS は増強のみ、最悪でも詩は読める。** |

> PR description の冒頭に必ず: `[Affects: B-CRO, G-A11Y · Untouched: A,C,D,E,F,H]` の形で書く。

---

## 何が入っているか

| パス | 内容 |
|---|---|
| `README.md` | この封筒の表紙 (今読んでいる) |
| `CLAUDE.md` | Claude Code 向け作業指示。**最初に必ず読む** |
| `public/index.html` | 静的 LP の骨格 (11 セクション、A11Y属性付き) |
| `public/robots.txt` / `sitemap.xml` | 3 ロケール公開用 |
| `src/tokens/tokens.css` | CSS 変数の唯一の正本 (14 色 + 8 type + 9 spacing + 4 motion) |
| `src/tokens/tokens.json` | Style Dictionary 互換。Figma / Canva 同期源 |
| `src/content/{ja,en,ko}.json` | 11 セクション × 3 言語の本番コピー (Step 5.A 採用)。**KO は ISS-01/02 短縮版** |
| `src/motion/*.css` × 6 | 5 演出 + reduced-motion fallback (CSS only) |
| `src/structured-data/*.json` × 5 | Organization / SoftwareApp / FAQPage / Breadcrumb / Product |
| `src/scripts/*.js` | analytics / i18n / faq / kudos デモ (defer) |
| `docs/8-VIEWS-CONTRACT.md` | 8 視点の全文。**契約条文、勝手に書き換えない** |
| `docs/SECTIONS.md` | 11 セクションの実装仕様 (採用方向 / 演出 / 計測) |
| `docs/GA4-EVENTS.md` | 14 イベント定義 |
| `docs/ACCEPTANCE.md` | リリース前 12 ゲート |
| `docs/OPEN-ISSUES.md` | Step 9.6 残課題 7 件 |
| `docs/RUNBOOK-30D.md` | D0 → D30 プレイブック |
| `docs/DESIGN-SYSTEM.md` | Step 2 抜粋 (タイポ / 色 / motion 原則) |

---

## 1 コマンドで起動 (実装側で配線)

```bash
cp .env.example .env
npm i
npm run dev
# → http://localhost:5173/ja/
```

ビルドは静的サイトジェネレータ非依存。最終的に Cloudflare Pages (Tokyo edge) にデプロイ。

---

## 採用方向 (Step 6)

- **Hero · HC-02 呼吸する H1** (REFINED + 採用トレンド B)
- **ナラティブ · B Emotion-First** (Step 3 採択)
- **FEATURES のみ BOLD** (Bento + Round Card 主役)
- **FAQ + 先行申し込み = SAFE** (摩擦最小化)

---

## 残課題 (Step 9.6 から持ち越し)

| ID | 優先 | 領域 | 解決方針 |
|---|---|---|---|
| ISS-01 | P1 | KO × BP390 FEATURES タイトル多行化 | `content/ko.json` で短縮済み (適用済み) |
| ISS-02 | P1 | KO × BP390 FAQ summary 2 行化 | `content/ko.json` で短縮済み (適用済み) |
| ISS-03 | P2 | VISION 02 a11y 累積演出 | `reduced-motion` 全演出停止 + scenes全表示 |
| ISS-04 | P2 | FEATURES 04 perf RC-FORM 18セル GPU | `will-change` を出現直前付与、終了で剥がす |
| ISS-05 | P2 | Score 05 a11y 色のみ依存 | `aria-label` + ラベルテキスト + パターン併用 |
| ISS-06 | P2 | Pricing 09 CRO 比較不足 | 比較表モーダルを A/B 03 で検証 |
| ISS-07 | P3 | UGC 06 β初期プレースホルダ | チーム投稿 3 件 + 透明開示文 |

---

## 受入チェック (Step 10.7)

12 項目、すべてパスしてからリリース。詳細は `docs/ACCEPTANCE.md`。

---

## 連絡経路

- **設計判断の問い合わせ** → KANOPY (本ドキュメント発行元)
- **デザイン編集 (Canva トラック)** → デザイナー / マーケ
- **本番リリース判断** → KANOPY 主導 + Claude Code から AC-01..12 グリーンレポート

> 翻訳が終わった今、原文に戻る。**"あなたのラウンドを、かたちに残す。"**
