/**
 * i18n — minimal data-binding from src/content/*.json
 * JS-off fallback: SSR/SSG should pre-fill content at build time.
 * This script only runs in client-rendered prototype mode.
 */
(async function() {
  'use strict';
  const lang = document.documentElement.lang || 'ja';
  let content;
  try {
    content = await fetch('/src/content/' + lang + '.json').then(r => r.json());
  } catch (e) {
    console.warn('[i18n] fallback to JA', e);
    content = await fetch('/src/content/ja.json').then(r => r.json());
  }

  function get(path) {
    return path.split('.').reduce((acc, k) => acc && acc[k], content);
  }

  // Simple text replace
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = get(el.dataset.i18n);
    if (v != null) el.textContent = v;
  });

  // HTML (use carefully — only for trusted keys with <em>/<br>)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = get(el.dataset.i18nHtml);
    if (v != null) el.innerHTML = v;
  });

  // aria-label / placeholder
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const v = get(el.dataset.i18nAria);
    if (v != null) el.setAttribute('aria-label', v);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const v = get(el.dataset.i18nPlaceholder);
    if (v != null) el.setAttribute('placeholder', v);
  });

  // List loops — minimal templating
  document.querySelectorAll('[data-i18n-loop]').forEach(host => {
    const items = get(host.dataset.i18nLoop);
    if (!Array.isArray(items)) return;
    const tpl = host.firstElementChild;
    if (!tpl) return;
    host.innerHTML = '';
    items.forEach(item => {
      const node = tpl.cloneNode(true);
      node.querySelectorAll('[data-i18n-prop]').forEach(c => {
        const k = c.dataset.i18nProp;
        if (item[k] != null) c.textContent = item[k];
      });
      node.querySelectorAll('[data-href-from]').forEach(c => {
        c.setAttribute('href', item[c.dataset.hrefFrom] || '#');
      });
      host.appendChild(node);
    });
  });

  // Flat loops (array of strings)
  document.querySelectorAll('[data-i18n-loop-flat]').forEach(host => {
    const items = get(host.dataset.i18nLoopFlat);
    if (!Array.isArray(items)) return;
    host.innerHTML = items.map(s => '<li>' + s + '</li>').join('');
  });
})();
