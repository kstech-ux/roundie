# 14. A/B Test Roadmap

## テスト原則

1. **1 テスト 1 変数**（hero copy と CTA を同時に変えない）
2. **最低 2 週間 / 最低 500 訪問者**（統計有意性確保）
3. **仮説ベース**（「A の方が良い気がする」は NG。**理由**を書く）
4. **計測可能**（GA4 で測れない仮説はテストしない）
5. **ローンチ後フェーズ**（プリローンチ期はサンプル足りないので最初は安定 KPI 確認に専念）

## 推奨ツール

| ツール | 用途 |
|---|---|
| **GA4 Audience + Custom Definition** | セグメント分割（フリー） |
| **Google Optimize** | ❌ 終了 (2023/9) |
| **VWO / Optimizely** | 有料、本格的 |
| **PostHog（OSS）** | 自前ホスト、Feature Flag + AB |
| **Self-rolled**（URL param + GA4 dimension） | LP 規模なら**これで十分** |

## ローンチ後 4-12 週のテスト候補

### A/B-01. **Hero H1 訴求の検証**
| 仮説 | "記憶を、かたちに" よりも "ゴルフは、スコアだけじゃない" の方が共感率が高い |
| KPI | スクロール 50% 到達率 / TestFlight CTR |
| 期間 | 2 週間 |
| サンプル | 各 500 訪問 |
| 期待差 | +20% スクロール 50% |
| 計測 | URL parameter `?v=a/b` → GA4 user_property に保存 |

### A/B-02. **Primary CTA 文言**
| 仮説 | 「TestFlight で試す（無料）」の "無料" の有無で CTR が変わる |
| Variants | A: 「TestFlight で試す」/ B: 「TestFlight で試す（無料）」 |
| KPI | cta_click_testflight CTR |
| 期間 | 2 週間 |

### A/B-03. **副 CTA の有無**
| 仮説 | 副CTA（Email）があると、TestFlight CTR が下がる代わりに合計リード数が増える |
| Variants | A: Primary CTA のみ / B: Primary + Secondary |
| KPI | TF 参加 vs Email 登録の合計（generate_lead） |
| 期間 | 3 週間 |

### A/B-04. **モバイル固定 CTA バーの出現タイミング**
| 仮説 | スクロール 40% 出現は早すぎ、80% は遅すぎる |
| Variants | A: 40% / B: 60% / C: 80% |
| KPI | dismiss 率 vs CTR |
| 期間 | 2 週間（3 群） |

### A/B-05. **Round Card サンプルの表示位置**
| 仮説 | ヒーロー右に表示するより、Hero 直下に独立セクションで見せた方が情緒的に刺さる |
| Variants | A: ヒーロー右 / B: ヒーロー直下独立 |
| KPI | スクロール 75% 到達率 / TF CTR |
| 期間 | 2 週間 |

### A/B-06. **Pricing 順序**
| 仮説 | Pro Yearly を中央に置くと CVR が上がる |
| Variants | A: Free → Monthly → Yearly / B: Free → Yearly → Monthly / C: Comp Pack → Free → Pro |
| KPI | Pricing CTA クリック分布 |
| 期間 | 4 週間 |

### A/B-07. **Vision セクションの長さ**
| 仮説 | 短い方が直帰率が下がる |
| Variants | A: Quote + 続きの長い説明（現状）/ B: Quote のみ（短縮） |
| KPI | 直帰率 / スクロール 50% 到達率 |
| 期間 | 2 週間 |

### A/B-08. **競合参照（Strava ライク表現）の有無**
| 仮説 | 「Strava のような Kudos」と書くと既存 Strava ユーザーの共感を呼ぶ |
| Variants | A: 言及無し / B: 「Strava のような Kudos 文化」を Feature 04 説明に追加 |
| KPI | TF CTR / Persona B 層の獲得（既存 Strava ユーザー = 計測難しい、内製アンケート） |
| 期間 | 4 週間 |

### A/B-09. **言語の自動切替挙動**
| 仮説 | navigator.language ベースの自動切替は JA を強制したい日本ユーザーには不便 |
| Variants | A: 自動切替（現状）/ B: 常に JA 初期 + ユーザー手動切替 |
| KPI | 言語切替操作率 / 直帰率 |
| 期間 | 2 週間 |

### A/B-10. **Pricing 比較表の表示**
| 仮説 | 比較表（決定木）を表示すると Comp Pack 訴求が強くなる |
| Variants | A: 比較表なし（3 カードのみ） / B: 比較表あり |
| KPI | Comp Pack CTA クリック率 |
| 期間 | 4 週間 |

## ロードマップ

```
Launch    Week2-3      Week4-5     Week6-7      Week8-10     Week11-12
│           │            │           │            │             │
│  baseline │  A/B-01    │  A/B-02   │  A/B-03    │  A/B-04     │  A/B-06
│  observe  │  Hero      │  CTA      │  副CTA     │  Mobile bar │  Pricing
│           │            │           │            │             │
└───────────┴────────────┴───────────┴────────────┴─────────────┴─────────
            ↑
            ローンチ後 2 週間は何もテストせず、ベースライン KPI を観察
```

## 仮説ライティング・テンプレート

```markdown
### A/B-XX. [テスト名]

**背景**: [なぜこのテストをやるか]
**仮説**: [何が起きると予想するか]
**Variants**:
  - A (control): [現状]
  - B (variant): [変更内容]
**KPI**: [計測する指標]
**Secondary KPI**: [副指標]
**期間**: [日数]
**必要サンプル**: [各群 N]
**期待差**: [予想される効果サイズ]
**実装**: [どう実装するか]
**結果記録**: [テスト終了後の結論をここに追記]
```

## ベースライン KPI（ローンチ後最初の 2 週間に観察）

| KPI | 目標値 | 計測 |
|---|---|---|
| LP 訪問数 | 月 5,000+ | GA4 page_view |
| 直帰率 | < 60% | GA4 bounce rate |
| 平均セッション | 60s+ | GA4 |
| スクロール 50% 到達 | 40% | カスタム scroll_depth |
| TF CTA クリック率 | 5% | GA4 cta_click event |
| **TF 参加完了率** | **1.5%** | TestFlight Analytics + GA4 |
| Email 登録率 | 1% | GA4 generate_lead |
| 言語切替率 | 5% | GA4 language_switch |

## NG なテスト

- **コピーが法規違反になる variants**（景表法・ステマ規制）
- **アクセシビリティを犠牲にする variants**（フォーカスリング消す等）
- **ダークパターン**（解約困難・同意誘導）
- **プラン構成・料金変更**（PM 承認なしには変えない）

## テスト結果の報告フォーマット

毎週金曜に biz/outbox に報告:
```markdown
# A/B-XX 結果 (Week N)

**期間**: 2026-XX-XX 〜 2026-XX-XX
**サンプル**: A=NNN, B=NNN
**KPI**: cta_click_testflight CTR

| Variant | Visitors | CTA Clicks | CTR |
|---|---|---|---|
| A | 547 | 28 | 5.12% |
| B | 521 | 35 | 6.72% |

**結論**: B が有意（p=0.04）。+1.6 ポイント。
**次アクション**: B を全訪問者に展開。
```
