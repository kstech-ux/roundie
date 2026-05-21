# 07. Section Architecture

## ページ全体構造（v2 案）

```
┌─────────────────────────────────────────┐
│ <header>                                │ sticky / blur background
│   logo / nav / lang / [JOIN] CTA         │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 00. HERO                                │ 100dvh、主役は H1
│   - Eye text                            │
│   - H1「記憶を、かたちに。」              │
│   - Sub copy                            │
│   - Primary CTA + Secondary CTA         │
│   - Round Card sample (right column)    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 01. VISION                              │ ゴルフ哲学・感情入口
│   - 「ゴルフは、スコアだけじゃない」      │
│   - Quote block (4時間の物語)            │
│   - ROUNDIE は、その記憶を…              │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 02. HOW IT WORKS                        │ 4 step
│   1. ⛳ Record   2. 🎨 Shape             │
│   3. 🤝 Share    4. 📈 Rise              │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 03. FEATURES (8 items, 実機SS主役)      │ Strava風セクション
│   01 Round Card                         │ 実機SS + 説明
│   02 ROUNDIE Score                      │ 実機SS + 3軸動的説明
│   03 Feed                               │ 実機SS
│   04 Kudos & Comments                   │ 実機SS
│   05 Competitions                       │ 実機SS + Comp Pack促し
│   06 Ranking & Growth                   │ 実機SS
│   07 Invite Friends                     │ 実機SS
│   08 Multi-Language                     │ 実機SS
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 04. ROUNDIE SCORE DEEP DIVE             │ Score を独立セクションで深掘り
│   - 3 pillars (SKILL/VIBE/STYLE)         │
│   - 7 rank ladder                       │
│   - 「課金で順位は買えない」              │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 05. SOCIAL PROOF (placeholder)          │ ローンチ後追加
│   - 「[導入企業数] 名のゴルファーが利用中」│ プレースホルダで枠だけ
│   - Press logo strip (準備中表示)        │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 06. PRICING                             │ Free / Pro / Comp Pack
│   - 決定木（誰がどれを選ぶか）            │ 1図で導線
│   - 3 cards + Comp Pack                 │
│   - 注釈（Apple ID / 返金）              │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 07. TRUST & PRIVACY                     │
│   - 公開範囲（ラウンド単位）             │
│   - ミュート（Twitter式・ブロック無し）   │
│   - データ所有権（Supabase 東京）        │
│   - App Store 審査基準                   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 08. FAQ (preview 3-5)                   │ 構造化データ目的 + 信頼形成
│   - Q: スコアは公開されますか？          │
│   - Q: Android はいつ？                  │
│   - Q: 解約はできますか？                │
│   - 「すべての FAQ を見る →」              │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 09. FINAL CTA                           │
│   - 巨大タイポ「今日のラウンドから、残す」│
│   - Primary CTA + Email Notify         │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ <footer>                                │
│   - PRODUCT / COMPANY / LEGAL columns  │
│   - 言語切替 (langs row)                │
│   - 著作権・社名・住所                  │
└─────────────────────────────────────────┘
```

## セクションごとの設計仕様

### 00. HERO
| 項目 | 設定 |
|---|---|
| 目的 | **3秒で「映える」「自分用」と分かる** + 続きを読ませる |
| 主読者 | Persona A（女性 25-32） |
| 感情変化 | 「なに？」→「興味ある」 |
| 主CTA | TestFlight で試す（無料） |
| 副CTA | 公開時に通知（メアド） |
| 計測 | `hero_view` / `hero_cta_click_testflight` / `hero_cta_click_email` |
| BG | `--bg` 単色（グラデや breathing 効果は使わない）|

### 01. VISION
| 項目 | 設定 |
|---|---|
| 目的 | 機能を見せる前に「**ゴルフ＝記憶**」という価値観で同意を取る |
| 主読者 | A + B |
| 感情変化 | 「興味ある」→「これ、私のためのアプリかも」 |
| CTA | なし（読ませることが目的） |
| 計測 | `view_section_vision` (scroll-tracked) |

### 02. HOW IT WORKS
| 項目 | 設定 |
|---|---|
| 目的 | アプリ体験のフローを 4 step で具体化 |
| 主読者 | 全員 |
| 感情変化 | 「私のためかも」→「使えそう」 |
| CTA | なし（後続セクションへ誘導） |
| 計測 | `view_section_how` / `step_hover_${n}` |

### 03. FEATURES（8 items, **実機SS 主役**）
| 項目 | 設定 |
|---|---|
| 目的 | **「これは本物のプロダクトだ」と認識させる**（mock UI ではなく実機SSで） |
| 主読者 | B + A |
| 感情変化 | 「使えそう」→「使ってみたい」 |
| CTA | 各機能カードに「TestFlight で試す」マイクロCTA（透明）|
| 計測 | `feature_view_${name}` |
| 画像 | **実機スクリーンショット必須**（mockではない）。`/public/screenshots/` 配下に SS 配置 |

### 04. ROUNDIE SCORE DEEP DIVE
| 項目 | 設定 |
|---|---|
| 目的 | ROUNDIE の差別化要素 No.1 を独立セクションで深掘り |
| 主読者 | B（数字以外で成長したい男性） |
| 感情変化 | 「使ってみたい」→「これは他にない」 |
| CTA | なし |
| 計測 | `view_section_score` / `rank_hover_${rank}` |

### 05. SOCIAL PROOF（placeholder）
| 項目 | 設定 |
|---|---|
| 目的 | プリローンチ期は **プレースホルダ枠だけ** 用意（虚偽厳禁） |
| 主読者 | 慎重派 |
| 感情変化 | （ローンチ後）「他の人も使ってる」「信頼できそう」 |
| CTA | なし |
| 計測 | `view_section_proof` |
| Note | プリローンチ期は `display: none` または "Coming soon - 2026" 明示 |

### 06. PRICING
| 項目 | 設定 |
|---|---|
| 目的 | 価格の透明性を示し、Free で十分と最初に言う誠実さ |
| 主読者 | C → B → A の順 |
| 感情変化 | 「これは他にない」→「払う価値ある」 |
| 主CTA | START FREE（Free card）|
| 副CTA | GO PRO YEARLY / GO PRO MONTHLY / BUY COMP PACK |
| 計測 | `view_section_pricing` / `pricing_cta_click_${plan}` |

### 07. TRUST & PRIVACY
| 項目 | 設定 |
|---|---|
| 目的 | プライバシー懸念を払拭、特に Persona A に安心感を |
| 主読者 | A（プライバシー敏感）|
| 感情変化 | 「払う価値ある」→「安心して使える」 |
| CTA | なし |
| 計測 | `view_section_trust` |

### 08. FAQ
| 項目 | 設定 |
|---|---|
| 目的 | 直前の意思決定における疑問を解消 + 構造化データ(FAQPage)で SEO |
| 主読者 | 全員 |
| 感情変化 | 「安心して使える」→「導入しよう」 |
| CTA | 「すべての FAQ を見る →」→ `/faq/` |
| 計測 | `faq_toggle_${question_id}` |

### 09. FINAL CTA
| 項目 | 設定 |
|---|---|
| 目的 | 最後の踏ん切りを後押し |
| 主読者 | 全員 |
| 感情変化 | 「導入しよう」→ アクション |
| 主CTA | TestFlight で試す（無料） |
| 副CTA | 公開時に通知 |
| 計測 | `final_cta_view` / `final_cta_click_${target}` |

## モバイル固定 CTA バー（スクロール 60% 以降出現）

```
┌─────────────────────────────────────┐
│ [TestFlight で試す →]    […通知]   │
└─────────────────────────────────────┘
```
- スクロール 60% 以降に表示
- 二択（主・副）
- `position: fixed; bottom: 0; safe-area-inset-bottom 考慮`
- Esc キー or X ボタンで dismiss 可能（24時間 localStorage で再表示）

## スクロール演出（Motion 規則 = [03-design-tokens](./03-design-tokens.md)）

| セクション | 演出 | duration |
|---|---|---|
| Hero | H1 line-by-line slide-up | 800ms |
| Vision | quote fade-in | 600ms |
| HowItWorks | step順次 stagger | 200ms × 4 |
| Features | card slide-up + bar fill | 800ms |
| Score | rank ladder horizontal stagger | 100ms × 7 |
| Pricing | card scale in | 600ms |
| Final CTA | text scale in | 1000ms |

すべて `prefers-reduced-motion: reduce` 時は無効化。

## セクション間の余白

- セクション間: `padding: var(--section-py)` = `clamp(80px, 12vw, 160px)`
- セクション内の各ブロック間: `margin-bottom: clamp(32px, 5vw, 64px)`
- 横余白: `padding-inline: var(--container-px)` = `clamp(20px, 4vw, 64px)`
