# 11 セクション 実装仕様

各セクションの**採用方向 / 演出 / 計測 / a11y / コピー出典**を 1 ページに。コピーは `src/content/{ja,en,ko}.json` から読む。

---

## 01 · Hero

- **採用:** HC-02 呼吸する H1 (REFINED + トレンド B)
- **コピー:** `s01_hero` (Step 5.A 感情軸)
- **演出:** KT-A weight breath (5s loop) + KT-C 句点 pulse (1.4s loop)
- **計測:** `scroll_25` / `hero_cta_click`
- **a11y:** H1 は `<h1>`、KT-A は `role="presentation"`、ARIA は h1_plain を読ませる
- **fold 内画像:** なし (LCP = H1 文字列)

## 02 · VISION

- **採用:** REFINED
- **コピー:** `s02_vision` (4 シーン)
- **演出:** SC-A fade & rise (scroll-driven, 4 scenes)
- **計測:** `scroll_50` / `vision_complete` (4 シーン目到達)
- **a11y:** 各シーンは `<article>`、reduced-motion で全表示
- **ISS-03:** Kinetic 累積を避けるため Hero と同時表示にしない (50% offset 必須)

## 03 · HOW IT WORKS

- **採用:** REFINED
- **コピー:** `s03_how` (4 動詞)
- **演出:** 静的、ステップ番号のみ subtle entry
- **計測:** `feature_view` (50% 視認)

## 04 · FEATURES (Bento)

- **採用:** BOLD (Round Card 主役)
- **コピー:** `s04_features.bento[]` (6 カード)
- **演出:** RC-FORM 18 セル順次着色 (stagger 60ms / BP390 は 30ms)
- **計測:** `feature_view` (各カード)、`round_card_form_view` (1.08s 完了後)
- **a11y:** Round Card には `aria-label="あなたの 18 ホール"`
- **ISS-01:** KO BP390 は `content/ko.json` の短縮版を使用 (適用済み)
- **ISS-04:** `will-change` 出現直前付与 + 終了剥がし

## 05 · ROUNDIE Score

- **採用:** REFINED
- **コピー:** `s05_score` (3 軸 + 5 ランク)
- **演出:** 3 バー grow (Functional Micro-ix)
- **計測:** `feature_view` (50% 視認)
- **ISS-05:** 色のみ依存禁止。各バーに `aria-label` + ラベル文 + パターン (実装側で stripe overlay)

## 06 · UGC Feed

- **採用:** BOLD
- **コピー:** `s06_ugc` + 実投稿 (β初期 14 日は `iss07_disclosure` 文付きでチーム 3 件)
- **演出:** 静的、hover で subtle lift (Putt easing)
- **計測:** `feature_view`
- **ISS-07:** プレースホルダ運用、開示文を上部に必置
- **法規:** ステマ規制 — 投稿者の二重同意、`#PR` 表記

## 07 · Kudos & Comments

- **採用:** BOLD
- **コピー:** `s07_kudos` (3 カード)
- **演出:** タップで色変化 + spring scale (LP デモ)
- **計測:** `kudos_tap_demo` (kudos_type = shot/fight/buddy)

## 08 · コンペ機能

- **採用:** REFINED
- **コピー:** `s08_compe` (Part A: 3 ステップ / Part B: 結果発表)
- **演出:** 静的
- **計測:** `feature_view`

## 09 · Pricing

- **採用:** REFINED 縦二段
- **コピー:** `s09_pricing.plans[]` (FREE / PRO 完全開示)
- **演出:** 静的
- **計測:** `pricing_view` (50% 視認, plan_visible=free/pro)
- **ISS-06:** A/B 03 で比較表モーダル ON/OFF を検証

## 10 · FAQ + 先行申し込み + Android 待機

- **採用:** SAFE
- **コピー:** `s10_faq` (7 Q&A + 申し込みフォーム + Android 待機フォーム)
- **演出:** `<details>` 開閉 + MI-4 arrow rotate
- **計測:** `faq_open` / `early_access_help_open` / `early_access_signup` / `android_waitlist_submit`
- **a11y:** `<details><summary>` で JS off でも開閉
- **ISS-02:** KO BP390 は `content/ko.json` の短縮版を使用 (適用済み)
- **法規:** リンク先未確定の文言 (cta_primary_hint) を直下に常時表示

## 11 · Footer

- **採用:** REFINED
- **コピー:** `s11_footer`
- **演出:** 詩の余韻 — 小さな KT-A (subtle)
- **計測:** `share_click` / `language_switch`
- **構造:** KANOPY 表記小さく、legal links + locale switch
