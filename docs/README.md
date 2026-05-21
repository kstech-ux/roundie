# ROUNDIE Landing Page — Design Specification

**Project**: ROUNDIE LP World-Class Rebuild
**Owner**: Biz Team (秘書ハブ経由ではなく直接実装)
**Date**: 2026-05-21
**Status**: 設計フェーズ（実装は PM レビュー後）

このディレクトリは ROUNDIE LP (https://roundie.app) を世界水準に引き上げるための設計書集。
Linear / Vercel / Stripe レベルの完成度を目標に、Strava / Letterboxd / Untappd の体験を借りて構築する。

---

## 目次

| # | ファイル | 内容 | 実装時の参照場所 |
|---|---|---|---|
| 1 | [01-target-persona.md](./01-target-persona.md) | ペルソナ A/B/C + JTBD + 来訪温度感 | コピー・ビジュアル方針 |
| 2 | [02-voice-and-tone.md](./02-voice-and-tone.md) | ボイス＆トーン定義 + 例文5・禁止表現 | 全コピー作成時 |
| 3 | [03-design-tokens.md](./03-design-tokens.md) | カラー / フォント / スペーシング / シャドウ / モーション | CSS `:root` 直書き |
| 4 | [04-responsive-spec.md](./04-responsive-spec.md) | BP定義 + デバイス別ファーストビュー + Container Query 活用 | 全 @media クエリ |
| 5 | [05-typography-and-i18n.md](./05-typography-and-i18n.md) | 言語別タイポ / 改行ポリシー / 禁則 | フォント・テキスト |
| 6 | [06-glossary-and-style-guide.md](./06-glossary-and-style-guide.md) | 用語集 (ROUNDIE Score / Pillar / Rank 用語統一) | 全文書 |
| 7 | [07-section-architecture.md](./07-section-architecture.md) | セクション構成 + 目的 + 感情変化 + CTA + 計測イベント | ページ全体 |
| 8 | [08-cta-hierarchy.md](./08-cta-hierarchy.md) | 主CTA / 副CTA / ニュートラルCTAの階層図と文言 | 全CTA |
| 9 | [09-seo-spec.md](./09-seo-spec.md) | title / description / 構造化データ / OGP / hreflang | `<head>` |
| 10 | [10-measurement-spec.md](./10-measurement-spec.md) | GA4 / GTM / dataLayer / UTM 規約 / Consent Mode v2 | `<script>` + GTM |
| 11 | [11-legal-compliance.md](./11-legal-compliance.md) | GDPR / APPI / 景表法 / ステマ規制 / 特商法 | フッター + 各ポリシーページ |
| 12 | [12-security-headers.md](./12-security-headers.md) | CSP / HSTS / Permissions-Policy / SRI | `<meta http-equiv>` + GH Pages 制約 |
| 13 | [13-performance-targets.md](./13-performance-targets.md) | LCP/INP/CLS 目標 / Critical CSS / 画像最適化 | 全体最適化 |
| 14 | [14-ab-test-roadmap.md](./14-ab-test-roadmap.md) | A/B テスト候補 + 仮説 + KPI | ローンチ後 4-8 週 |

---

## 実装方針サマリ

**Stack**: 純粋な HTML/CSS/JS（フレームワーク無し）。ビルドツール不要。
GitHub Pages にデプロイ。理由は [13-performance-targets.md](./13-performance-targets.md) の通り、ROUNDIE LP の規模では React/Next 導入の保守コスト > 利益。

**Brand Source of Truth**: [`golf-id/constants/brand-tokens.ts`](../../golf-id/constants/brand-tokens.ts) — アプリ本体と完全に同じトークンを使用。

**Primary KPI**: TestFlight 参加完了率（LP訪問 → TestFlight参加完了）= **1.5%** ベースライン目標。

**ターゲット**:
- Primary (60%): 女性 25-32 歳、Instagram 流入、映え重視
- Secondary (30%): 男性 28-36 歳、検索流入、Strava タイプ
- Tail (10%): コンペ幹事 30-45 歳、検索意図あり

---

## 設計の前提

1. **アプリと同一ブランドアイデンティティ**（フォント・カラー・ロゴが完全一致）
2. **JA 主軸 / EN・KO 同梱**（hreflang で SEO 分離）
3. **CMP + Consent Mode v2**（同意前は計測停止）
4. **広告タグ枠を事前用意**（Google Ads / Meta は GTM で後段追加可能に）
5. **a11y は WCAG 2.2 AA を厳守**（後付けではなく設計時から組み込む）

## 改訂履歴

| 日付 | 内容 |
|---|---|
| 2026-05-21 | 初版作成。057 reference point から世界水準リブランド開始。 |
