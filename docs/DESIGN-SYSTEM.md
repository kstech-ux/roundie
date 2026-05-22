# Design System (Step 2 抜粋)

詳細は `src/tokens/tokens.css` (実装) と `src/tokens/tokens.json` (Figma/Canva 同期源) を見る。本書はその哲学。

---

## 1. 色

- **基調はダーク warm-black** (`#0a0a08`)。純黒 `#000` は冷たすぎる。「ゴルフ後の駐車場の距離感」。
- **CTA は緑 `#4adb5c`** (`--green-500`)。Par green。**唯一のアクセント**。
- **Round Card パレット** (eagle/birdie/par/bogey/double) はシグネチャ。LP の視覚言語として横展開可。
- **純白を使わない**。文字色 `--ink-0` (`#ebe8de`) はクリーム寄り。

## 2. タイポ

- **JA display:** Shippori Mincho B1 (variable wght 400–700)
- **JA body:** Noto Sans JP
- **EN:** Inter Variable
- **KO:** Pretendard Variable

明朝の詩情を保ちつつ、3 言語で品質を担保する。Modular scale 1.25。

## 3. スペーシング

4/8 倍数の 9 段階。セクション間 `--s-7` (48px)、カード間 `--s-4` (16px)。

## 4. 角丸

ROUND が名前に入っている以上、強めに。chip `6` → hero `28` の 5 段階。

## 5. 影 vs 光

ダーク基盤では `box-shadow` 黒系は機能しない。**アクセント色の subtle glow** で focus / active / 主役を表現。`--glow-focus` / `--glow-cta`。

## 6. モーション

**「ゆっくり振り上げて、早く振り下ろす」** (ゴルフのスイング)。`--e-swing` がデフォルト。すべての演出に「機能的意味」を付与 (Step 7)。

## 7. グリッド & BP

- BP: 390 / 768 / 1280 / 1920
- モバイル基準 1 カラム、Tablet 2 col、Desktop 12 col
