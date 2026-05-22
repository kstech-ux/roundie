# 受入チェック — 本番リリース前 12 ゲート

1 つでも未通過なら **リリース不可**。Step 9.5 サインオフ表の ◯ は受入チェック後に ◎ へ動かす。

| ID | 内容 | 担当 | 視点 |
|---|---|---|---|
| AC-01 | Lighthouse Performance ≥ 95 (4 BP × モバイル 3G × 3 ロケール = 12 ラン) | CI | F PERF |
| AC-02 | Axe + Pa11y WCAG 2.2 AA 全項目 + NVDA/VO で Hero/FAQ 実読 | CI + QA | G A11Y |
| AC-03 | Visual Regression 4 BP × 3 lang × 11 sec (132 セル, 差分 < 2%) | CI | 9.1 |
| AC-04 | CSP / HSTS / Referrer-Policy / Permissions-Policy / X-CTO / X-Frame / COOP の 7 ヘッダ | DEVOPS | E SEC |
| AC-05 | GA4 14 イベント発火、DebugView で全件確認、denied 時不発火 | ANALYTICS | C 計測 |
| AC-06 | JSON-LD 5 種 Search Console テスト合格 (エラー 0 / 警告 0) | SEO | A SEO |
| AC-07 | 3 言語 × 4 BP の手動読み (KO 母語話者) | QA | 9.3 |
| AC-08 | 特商法 / プライバシー / Cookie 同意バナー実装、GDPR/PIPA 準拠 | LEGAL | D 法規 |
| AC-09 | 先行申し込みフォーム E2E + DKIM 確認 (Gmail/iCloud で迷惑判定なし) | BACKEND | E SEC |
| AC-10 | `prefers-reduced-motion` 縮退の手動目視 (5 演出すべて) | QA | G A11Y |
| AC-11 | JS off / 3G / フォント未到達のエッジ通過 | QA | H EDGE |
| AC-12 | 残課題 ISS-01..07 のステータス更新 (`docs/OPEN-ISSUES.md` 更新) | PM | 9.6 |

## 自動 CI ゲート

- `.github/workflows/audit.yml`: PR 毎に Lighthouse + Axe + Pa11y を走らせる
- `.github/workflows/deploy.yml`: main マージで Cloudflare Pages (Tokyo edge) にデプロイ
- AC-01..06, AC-10, AC-11 は CI で機械的に検証可能
- AC-07, AC-08, AC-09, AC-12 は手動 (人がサインオフ)
