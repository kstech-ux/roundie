#!/usr/bin/env node
/**
 * scripts/build.mjs — SSG build for ROUNDIE LP
 *
 * Workflow:
 *  1. Read public/index.html as template
 *  2. For each locale (ja, en, ko):
 *     - Read src/content/{lang}.json
 *     - Apply data-i18n / data-i18n-html / data-i18n-aria / data-i18n-placeholder
 *     - Expand data-i18n-loop / data-i18n-loop-flat / data-prop-loop
 *     - Resolve data-*-from attributes (size/feature/color/href/...)
 *     - Inject JSON-LD (5 docs from src/structured-data/*.json)
 *     - Inject critical CSS (from src/motion/* core selectors)
 *     - Generate Round Card 18 cells
 *     - Set <html lang>, <title>, <meta description>, og:* per locale
 *     - Rewrite asset paths: /src/* → /assets/*
 *  3. Write dist/{lang}/index.html (and dist/index.html = JA mirror for / route)
 *  4. Copy assets:
 *     - src/tokens/tokens.css → dist/assets/tokens.css
 *     - src/motion/*.css → concat → dist/assets/motion.css
 *     - src/scripts/*.js → concat → dist/assets/scripts.js
 *  5. Copy static:
 *     - public/robots.txt, public/sitemap.xml → dist/
 *     - CNAME → dist/CNAME
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync, copyFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

const LOCALES = ['ja', 'en', 'ko'];

const TITLES = {
  ja: 'ROUNDIE — あなたのラウンドを、かたちに残す。',
  en: 'ROUNDIE — Capture the round. Keep the day.',
  ko: 'ROUNDIE — 라운드를, 형태로 남깁니다.'
};
const DESCRIPTIONS = {
  ja: 'スコアじゃない、瞬間を残すゴルフ。ゴルファーのソーシャルアプリ ROUNDIE。',
  en: 'A golf app that remembers more than your score. ROUNDIE by KANOPY.',
  ko: '스코어가 아닌, 순간을 남기는 골프. 골퍼의 소셜 앱 ROUNDIE.'
};

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function get(obj, path) {
  return path.split('.').reduce((acc, k) => acc && acc[k], obj);
}

/* ============================================================
   Apply i18n attributes to a parsed DOM
   ============================================================ */
function applyI18n(document, content) {
  /* data-i18n="path" → element.textContent */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = get(content, el.getAttribute('data-i18n'));
    if (typeof v === 'string') el.textContent = v;
  });

  /* data-i18n-html="path" → element.innerHTML */
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = get(content, el.getAttribute('data-i18n-html'));
    if (typeof v === 'string') el.innerHTML = v;
  });

  /* data-i18n-aria="path" → element.setAttribute('aria-label', v) */
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const v = get(content, el.getAttribute('data-i18n-aria'));
    if (typeof v === 'string') el.setAttribute('aria-label', v);
  });

  /* data-i18n-placeholder="path" → element.setAttribute('placeholder', v) */
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const v = get(content, el.getAttribute('data-i18n-placeholder'));
    if (typeof v === 'string') el.setAttribute('placeholder', v);
  });

  /* data-i18n-loop="path" → repeat first child for each item, fill props */
  document.querySelectorAll('[data-i18n-loop]').forEach(host => {
    const items = get(content, host.getAttribute('data-i18n-loop'));
    if (!Array.isArray(items)) return;
    const tpl = host.firstElementChild;
    if (!tpl) return;
    const out = [];
    items.forEach(item => {
      const node = tpl.cloneNode(true);

      /* data-i18n-prop="prop" → textContent */
      node.querySelectorAll('[data-i18n-prop]').forEach(c => {
        const k = c.getAttribute('data-i18n-prop');
        if (item[k] != null) c.textContent = item[k];
      });

      /* data-href-from="prop" → href attr */
      node.querySelectorAll('[data-href-from]').forEach(c => {
        const k = c.getAttribute('data-href-from');
        if (item[k] != null) c.setAttribute('href', item[k]);
      });

      /* data-size-from / data-feature-from / data-color-from / data-kudos-type-from */
      const dataFromAttrs = ['size', 'feature', 'color', 'kudos-type'];
      dataFromAttrs.forEach(name => {
        const sel = `[data-${name}-from]`;
        node.querySelectorAll(sel).forEach(c => {
          const k = c.getAttribute(`data-${name}-from`);
          if (item[k] != null) c.setAttribute(`data-${name}`, item[k]);
        });
        if (node.matches && node.matches(sel)) {
          const k = node.getAttribute(`data-${name}-from`);
          if (item[k] != null) node.setAttribute(`data-${name}`, item[k]);
        }
      });

      /* data-i18n-aria-prop="prop" → aria-label */
      node.querySelectorAll('[data-i18n-aria-prop]').forEach(c => {
        const k = c.getAttribute('data-i18n-aria-prop');
        if (item[k] != null) c.setAttribute('aria-label', item[k]);
      });

      /* data-prop-loop="features" → flat list expansion */
      node.querySelectorAll('[data-prop-loop]').forEach(c => {
        const k = c.getAttribute('data-prop-loop');
        if (Array.isArray(item[k])) {
          c.innerHTML = item[k].map(s => `<li>${escapeHtml(s)}</li>`).join('');
        }
      });

      out.push(node.outerHTML);
    });
    host.innerHTML = out.join('');
  });

  /* data-i18n-loop-flat="path" → simple <li> per string */
  document.querySelectorAll('[data-i18n-loop-flat]').forEach(host => {
    const items = get(content, host.getAttribute('data-i18n-loop-flat'));
    if (!Array.isArray(items)) return;
    host.innerHTML = items.map(s => `<li>${escapeHtml(s)}</li>`).join('');
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* ============================================================
   Inject JSON-LD (concat 5 structured-data docs)
   ============================================================ */
function injectJsonLd(document) {
  const docs = ['organization', 'software-app', 'product-pricing', 'faq-page', 'breadcrumb']
    .map(name => readJson(join(ROOT, `src/structured-data/${name}.json`)));

  const ldBlock = docs.map(d => JSON.stringify(d, null, 2)).join(',\n');
  const ldText = `[\n${ldBlock}\n]`;

  /* Replace the placeholder <script type="application/ld+json"> content */
  const ldScript = document.querySelector('script[type="application/ld+json"]');
  if (ldScript) {
    ldScript.textContent = ldText;
  }
}

/* ============================================================
   Inject critical CSS (small subset of tokens + above-the-fold)
   ============================================================ */
function injectCriticalCss(document) {
  const critical = `
:root{--bg-0:#0a0a08;--ink-0:#ebe8de;--ink-1:#c6c2b5;--green-500:#4adb5c;
--f-mincho:"Shippori Mincho B1","Hiragino Mincho ProN",serif;
--f-sans-ja:"Noto Sans JP",-apple-system,BlinkMacSystemFont,sans-serif;
--f-sans-en:"Inter",-apple-system,BlinkMacSystemFont,sans-serif;
--f-sans-ko:"Pretendard Variable","Noto Sans KR",sans-serif;
--f-mono:"JetBrains Mono",ui-monospace,monospace;
--fs-display-xl:clamp(40px,6vw,88px);--fs-body-lg:17px}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg-0);color:var(--ink-0);font-family:var(--f-sans-ja);font-size:var(--fs-body-lg);line-height:1.85;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
:lang(en) body{font-family:var(--f-sans-en)}
:lang(ko) body{font-family:var(--f-sans-ko)}
img,svg{max-width:100%;height:auto;display:block}
a{color:inherit;text-decoration:none}
::selection{background:var(--green-500);color:var(--bg-0)}
.skip-link{position:fixed;left:-9999px;top:0;z-index:9999;padding:14px 22px;background:var(--green-500);color:var(--bg-0);font-family:var(--f-mono);font-weight:700;font-size:11px;letter-spacing:.18em}
.skip-link:focus{left:0}
:focus-visible{outline:2px solid var(--green-500);outline-offset:2px;border-radius:4px}
.site-header{position:fixed;top:0;left:0;right:0;z-index:100;padding:20px clamp(20px,4vw,40px);padding-top:max(20px,env(safe-area-inset-top));display:flex;justify-content:space-between;align-items:center;background:linear-gradient(180deg,rgba(10,10,8,.95) 0%,rgba(10,10,8,.6) 70%,transparent);backdrop-filter:blur(12px)}
.brand{font-family:var(--f-mincho);font-weight:600;font-size:18px;letter-spacing:.04em;color:var(--ink-0)}
.site-header nav form{display:flex;gap:8px}
.site-header nav button{background:none;border:none;color:var(--ink-1);font-family:var(--f-mono);font-size:11px;letter-spacing:.14em;padding:6px 10px;cursor:pointer;min-height:32px}
.site-header nav button:hover{color:var(--ink-0)}
main{display:block;padding-top:120px}
section{padding:clamp(64px,12vw,160px) clamp(20px,5vw,80px)}
.hero{min-height:80dvh;display:flex;flex-direction:column;justify-content:center;max-width:1200px;margin:0 auto}
.eyebrow{font-family:var(--f-mono);font-size:11px;letter-spacing:.18em;color:var(--ink-1);text-transform:uppercase;margin-bottom:24px}
.hero h1{font-family:var(--f-mincho);font-weight:500;font-size:var(--fs-display-xl);line-height:1.1;letter-spacing:.02em;margin:0 0 24px;text-wrap:balance;color:var(--ink-0)}
.hero h1 em{font-style:normal;color:var(--green-500)}
.lede{color:var(--ink-1);font-size:17px;line-height:1.85;max-width:60ch;margin:0 0 36px;text-wrap:pretty}
.cta-row{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:16px}
.cta-hint{font-size:13px;color:#8b887d;margin:0}
`.trim();

  const styleEl = document.querySelector('style#critical');
  if (styleEl) styleEl.textContent = critical;
}

/* ============================================================
   Generate Round Card 18 cells
   ============================================================ */
function generateRoundCardCells(document) {
  /* Match real round: 4 5 3 6 4 5 3 4 6 | 4 7 5 3 7 4 6 5 5 = 86 */
  const cells = [
    { score: 4, type: 'par' },
    { score: 5, type: 'bogey' },
    { score: 3, type: 'par' },
    { score: 6, type: 'bogey' },
    { score: 4, type: 'par' },
    { score: 5, type: 'bogey' },
    { score: 3, type: 'eagle' },
    { score: 4, type: 'par' },
    { score: 6, type: 'double' },
    { score: 4, type: 'par' },
    { score: 7, type: 'triple' },
    { score: 5, type: 'bogey' },
    { score: 3, type: 'par' },
    { score: 7, type: 'double' },
    { score: 4, type: 'par' },
    { score: 6, type: 'double' },
    { score: 5, type: 'par' },
    { score: 5, type: 'bogey' }
  ];
  const rc = document.querySelector('.round-card');
  if (rc) {
    rc.innerHTML = cells.map((c, i) =>
      `<div class="cell" style="--i:${i};background:var(--rc-${c.type})" data-score="${c.score}" aria-label="ホール${i+1} ${c.type} ${c.score}打">${c.score}</div>`
    ).join('');
  }
}

/* ============================================================
   Inject UGC β placeholder posts (ISS-07)
   ============================================================ */
function injectUgcPlaceholders(document, content) {
  const feed = document.querySelector('section.ugc ul.feed');
  if (!feed) return;
  const posts = [
    { user: 'YUKI', day: '04.12', score: 86, kudos: 12 },
    { user: 'KENJI', day: '04.10', score: 92, kudos: 8 },
    { user: 'MIO', day: '04.08', score: 88, kudos: 5 }
  ];
  feed.innerHTML = posts.map(p =>
    `<li class="feed-post"><div class="post-meta"><b>${p.user}</b><span>${p.day} · PAR 72</span></div><div class="post-grid" aria-label="ラウンドカード"></div><div class="post-kudos">🔥 ${p.kudos}</div></li>`
  ).join('');
}

/* ============================================================
   Rewrite asset paths from /src/* to /assets/*
   ============================================================ */
function rewriteAssetPaths(html) {
  /* Concat single CSS bundle + single JS bundle */
  /* Replace 6 motion CSS links with 1 */
  html = html.replace(/<link rel="stylesheet" href="\/src\/tokens\/tokens\.css">\s*\n*\s*(<!-- Motion -->\s*\n*)?(<link rel="stylesheet" href="\/src\/motion\/[^"]+\.css">\s*\n*)+/,
    '<link rel="stylesheet" href="/assets/styles.css">\n');

  /* Just in case (any remaining /src/...) */
  html = html.replace(/\/src\/tokens\/[^"]+/g, '/assets/styles.css');
  html = html.replace(/\/src\/motion\/[^"]+/g, '/assets/styles.css');

  /* Scripts: 4 files → 1 bundle */
  html = html.replace(/<script src="\/src\/scripts\/i18n\.js" defer><\/script>\s*\n*\s*<script src="\/src\/scripts\/analytics\.js" defer><\/script>\s*\n*\s*<script src="\/src\/scripts\/faq\.js" defer><\/script>\s*\n*\s*<script src="\/src\/scripts\/kudos-demo\.js" defer><\/script>/,
    '<script src="/assets/scripts.js" defer></script>');

  /* Preload main CSS path */
  html = html.replace('<link rel="preload" href="/assets/styles.css" as="style" onload="this.rel=\'stylesheet\'">', '<link rel="preload" href="/assets/styles.css" as="style" onload="this.rel=\'stylesheet\'">');

  return html;
}

/* ============================================================
   Localize <title>, meta, og:*
   ============================================================ */
function localizeHeadTags(document, lang) {
  document.documentElement.setAttribute('lang', lang);

  const title = document.querySelector('title');
  if (title) title.textContent = TITLES[lang];

  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', DESCRIPTIONS[lang]);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', TITLES[lang]);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', DESCRIPTIONS[lang]);

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) ogImage.setAttribute('content', `https://roundie.app/og/card-1200x630.${lang}.avif`);

  /* og:locale */
  const head = document.querySelector('head');
  const ogLocaleMap = { ja: 'ja_JP', en: 'en_US', ko: 'ko_KR' };
  const oldLocale = document.querySelector('meta[property="og:locale"]');
  if (oldLocale) oldLocale.remove();
  const oc = document.createElement('meta');
  oc.setAttribute('property', 'og:locale');
  oc.setAttribute('content', ogLocaleMap[lang]);
  head.appendChild(oc);

  /* Update language switch form action to current lang's root */
  const langForm = document.querySelector('form[data-i18n-switch]');
  if (langForm) langForm.setAttribute('action', `/${lang}/`);
}

/* ============================================================
   Build a single locale's HTML
   ============================================================ */
function buildLocaleHtml(templateHtml, lang) {
  const content = readJson(join(ROOT, `src/content/${lang}.json`));
  const dom = new JSDOM(templateHtml);
  const document = dom.window.document;

  /* Order matters: localize head BEFORE i18n (i18n doesn't touch <title>/meta) */
  localizeHeadTags(document, lang);
  applyI18n(document, content);
  injectJsonLd(document);
  injectCriticalCss(document);
  generateRoundCardCells(document);
  injectUgcPlaceholders(document, content);

  let html = dom.serialize();
  html = rewriteAssetPaths(html);
  return html;
}

/* ============================================================
   Bundle CSS (tokens + 6 motion files)
   ============================================================ */
function bundleCss() {
  /* Order matters:
     1. tokens.css   — CSS variables (must come first)
     2. main.css     — layout / typography / components (uses variables)
     3. motion/*.css — overlays animations on top
  */
  const files = [
    'src/tokens/tokens.css',
    'src/styles/main.css',
    'src/motion/kt-a-breath.css',
    'src/motion/kt-c-pulse.css',
    'src/motion/sc-a-fade.css',
    'src/motion/rc-form.css',
    'src/motion/mi-states.css',
    'src/motion/reduced-motion.css'
  ];
  return files.map(f => `/* ${f} */\n${readFileSync(join(ROOT, f), 'utf8')}`).join('\n\n');
}

/* ============================================================
   Bundle JS (4 scripts concatenated)
   ============================================================ */
function bundleJs() {
  const files = [
    'src/scripts/i18n.js',
    'src/scripts/analytics.js',
    'src/scripts/faq.js',
    'src/scripts/kudos-demo.js'
  ];
  return files.map(f => `/* ${f} */\n${readFileSync(join(ROOT, f), 'utf8')}`).join('\n\n');
}

/* ============================================================
   Main
   ============================================================ */
function main() {
  /* Clean dist */
  if (existsSync(DIST)) rmSync(DIST, { recursive: true });
  mkdirSync(DIST, { recursive: true });
  mkdirSync(join(DIST, 'assets'), { recursive: true });

  /* Read template */
  const templateHtml = readFileSync(join(ROOT, 'public/index.html'), 'utf8');

  /* Build each locale */
  for (const lang of LOCALES) {
    const html = buildLocaleHtml(templateHtml, lang);
    const targetDir = join(DIST, lang);
    mkdirSync(targetDir, { recursive: true });
    writeFileSync(join(targetDir, 'index.html'), html);
    console.log(`  ✓ dist/${lang}/index.html  (${(html.length / 1024).toFixed(1)} KB)`);
  }

  /* Default route = JA mirror */
  const jaHtml = readFileSync(join(DIST, 'ja/index.html'), 'utf8');
  writeFileSync(join(DIST, 'index.html'), jaHtml);
  console.log(`  ✓ dist/index.html  (= JA mirror)`);

  /* Bundle assets */
  const cssBundle = bundleCss();
  writeFileSync(join(DIST, 'assets/styles.css'), cssBundle);
  console.log(`  ✓ dist/assets/styles.css  (${(cssBundle.length / 1024).toFixed(1)} KB)`);

  const jsBundle = bundleJs();
  writeFileSync(join(DIST, 'assets/scripts.js'), jsBundle);
  console.log(`  ✓ dist/assets/scripts.js  (${(jsBundle.length / 1024).toFixed(1)} KB)`);

  /* Static files */
  copyFileSync(join(ROOT, 'public/robots.txt'), join(DIST, 'robots.txt'));
  copyFileSync(join(ROOT, 'public/sitemap.xml'), join(DIST, 'sitemap.xml'));
  if (existsSync(join(ROOT, 'CNAME'))) {
    copyFileSync(join(ROOT, 'CNAME'), join(DIST, 'CNAME'));
  }
  console.log(`  ✓ static files copied (robots.txt, sitemap.xml, CNAME)`);

  /* 404 page (simple JA redirect to /) */
  const notFound404 = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>404 — ROUNDIE</title><meta http-equiv="refresh" content="3; url=/"><meta name="robots" content="noindex"></head><body style="background:#0a0a08;color:#ebe8de;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;text-align:center"><div><h1 style="font-size:72px;color:#4adb5c;margin:0">404</h1><p>ページが見つかりません。<a href="/" style="color:#4adb5c">トップへ戻る</a></p></div></body></html>`;
  writeFileSync(join(DIST, '404.html'), notFound404);

  console.log(`\n  Build complete: ${DIST}`);
}

main();
