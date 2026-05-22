# CLAUDE.md — Instructions for Claude Code

このリポジトリは ROUNDIE LP の実装一次パッケージです。コードはあなたが書きます。本ファイルは、書く前/書く間に従う **契約と判断基準** です。

## 0. 最初に読むもの (この順)

1. `README.md` — 封筒の表紙
2. `docs/8-VIEWS-CONTRACT.md` — 8 視点の契約条文 (変更不可)
3. `docs/SECTIONS.md` — 11 セクションの実装仕様
4. `docs/ACCEPTANCE.md` — リリース前 12 ゲート

これらを先に読まずに実装を始めない。

## 1. 絶対原則

- **CSS animation only.** JS で transform/opacity を毎フレーム書き換えない。Step 7 の 5 演出は `src/motion/*.css` にすべて入っている。
- **JS は増強 (progressive enhancement)。** JS off / 3G / フォント未到達でも「詩」は読める。FAQ は `<details>`、言語切替は `<form GET>`、フォームは `<form POST>`。
- **トークンに無い値を書かない。** すべての色 / 余白 / 角丸 / フォントは `src/tokens/tokens.css` から。新しい色を足したくなったら **先に手を止めて KANOPY に確認**。
- **JSON コンテンツに無い文字列を HTML に書き込まない。** すべての本文は `src/content/{ja,en,ko}.json` から。例外: `A KANOPY PRODUCT` 等の構造ラベル。
- **ダークパターン禁止。** 「残り N 名」の煽り、退会の隠蔽、誤誘導の同意フロー — すべて Step 8.B / 8.D に反する。
- **`will-change` は出現直前で付与、終了で剥がす。** 常時 ON は GPU を食う (ISS-04)。

## 2. PR ルール

description の冒頭に必ず:

```
[Affects: B-CRO, G-A11Y · Untouched: A,C,D,E,F,H]
```

8 視点のうちどれを動かすか/動かさないかを宣言する。動かすなら、それぞれの章を読み直してから書く。

## 3. テスト・受入

- CI が落ちている PR は merge しない (Lighthouse / Axe / Pa11y)
- 4 BP × 3 lang × 11 セクション = 132 セル のスクリーンショット比較 (Playwright)
- AC-01..12 を一つでも未満たし → リリース不可

## 4. 「分からない」が出たら止まる

以下の判断はあなた単独でしない:

- 採用色を増やす / 既存色を変える
- セクションを増減する / 順序を変える
- 主 CTA 文言を変える ("先行申し込みはこちらから" は維持)
- KANOPY フッター表記の位置 / 大きさを変える
- 価格表示の通貨を変える
- 詩的 KPI (vision_complete / round_card_form_view / kudos_tap_demo) を CRO 指標から外す

これらが必要に見えたら、PR ではなく **issue** で提案する。

## 5. ファイル所有

| パス | 編集してよい? |
|---|---|
| `src/tokens/*` | ❌ デザインシステム側で決まる。提案は issue で |
| `src/content/*.json` | ❌ KANOPY 確認後のみ。typo 修正 PR は OK |
| `src/motion/*.css` | ⚠️ 演出仕様の変更は Step 7 に戻る。バグ修正 PR は OK |
| `src/structured-data/*` | ⚠️ SEO 担当の合意後のみ |
| `docs/*` | ❌ 契約条文。一切編集しない |
| `public/*` / `src/styles/*` / `src/scripts/*` | ✅ Claude Code の自由 |

## 6. 3 言語 URL 設計

```
/ja/          (default)
/en/
/ko/
```

`<html lang="ja">` を切り替え、`hreflang` を 3 言語分必置。`<link rel="alternate" hreflang="x-default" href="/ja/">`。

## 7. パフォーマンス予算 (合計 540KB)

| | 上限 |
|---|---|
| HTML | < 14 KB gzip |
| CSS | < 22 KB |
| JS | < 80 KB |
| Fonts | < 140 KB |
| Images | < 280 KB |

超えたら **機能を削るか、画質を落とすか**。動きを足すために予算を膨らませない (Step 8.F)。

## 8. 多言語フォント

- JA: Shippori Mincho B1 (display) + Noto Sans JP (body)
- EN: Inter Variable
- KO: Pretendard Variable

すべて variable + subset + `font-display: optional` + `size-adjust` で fallback metric を一致させる (CLS ゼロ)。

## 9. 完了の宣言

`docs/ACCEPTANCE.md` の AC-01..12 を **すべて green** にした PR で「完了」を宣言。それ以前は draft PR で。
