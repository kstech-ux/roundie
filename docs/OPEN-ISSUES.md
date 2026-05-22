# 残課題 — Step 9.6 から持ち越し

7 件。P1 = リリース前必須解決、P2 = β 30 日で再評価、P3 = 運用 SOP 化。

---

## ISS-01 · P1 · KO × BP390 FEATURES Bento タイトル多行化

**症状:** KO の Bento タイトル "Round Card" / "ROUNDIE Score" が BP390 で 2 行に折り返し、サイズ階層が崩れる。

**解決:** `src/content/ko.json` で短縮版を採用 (Score → `Score`、피드 → `피드`)。**適用済み**。実装側は KO のみ `font-size` を 92% にする保険を入れる。

---

## ISS-02 · P1 · KO × BP390 FAQ summary 2 行化

**症状:** KO の FAQ summary が 2 行に折り返し、開閉時のレイアウト不安定。

**解決:** `src/content/ko.json` の `s10_faq.items[].q` を 16 文字以下に短縮。**適用済み**。

---

## ISS-03 · P2 · 02 VISION a11y — Kinetic + Scroll の同時演出累積

**症状:** Hero KT-A weight breath と VISION SC-A scroll-driven が画面内で同時可視になると、a11y G ◯。

**解決:** `SC-A` の `animation-range` を `entry 0% cover 35%` にし、Hero と VISION が同時に大きく動かないよう offset。β 30 日で再評価。

---

## ISS-04 · P2 · 04 FEATURES perf — RC-FORM 18 セル GPU 同時生成

**症状:** RC-FORM の 18 セルが同時に `will-change: transform` を持つと、低性能 Android で GPU 過負荷 (perf F ◯)。

**解決:** セルごとに `will-change` を出現直前付与、終了で剥がす。19 セル目以降は `will-change: auto`。β 30 日で実機計測。

---

## ISS-05 · P2 · 05 Score a11y — 3 軸バーの色のみ依存

**症状:** SKILL / VIBE / STYLE のバーが色のみで識別される。色覚多様性で識別不可 (a11y G ◯)。

**解決:** 各バーに (1) `aria-label="{axis} {value}/100"`、(2) ラベルテキスト併記、(3) 異なる stripe パターン overlay の 3 重対応。β 30 日で実装。

---

## ISS-06 · P2 · 09 Pricing CRO — P3 機能派の比較不足

**症状:** P3 (スコア追求型) には縦二段で十分な情報量がない (CRO B ◯)。

**解決:** Pricing 直下に「機能比較を見る」リンク → 比較表モーダル (SAFE)。A/B 03 で ON/OFF を検証。

---

## ISS-07 · P3 · 06 UGC Feed — β初期 14 日のプレースホルダ運用

**症状:** β初期は実投稿が 0。UGC ブロックが空になる。

**解決:** チーム投稿 3 件を表示、上部に `iss07_disclosure` 文 (※ 公開直後はチーム投稿を表示しています。) を必置。14 日で実投稿に置換。

---

## 配分

| 優先 | 件数 | 説明 |
|---|---|---|
| P1 | 2 | KO 文字溢れ — Step 5 コピー差分パッチで即解消 |
| P2 | 4 | a11y / perf / CRO — β 30 日で再評価 |
| P3 | 1 | UGC プレースホルダ — 運用 SOP 化 |
