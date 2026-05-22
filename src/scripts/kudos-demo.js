/**
 * kudos-demo.js — LP の Kudos デモ。タップで色付け & spring scale。
 * 計測は analytics.js が拾う (data-event="kudos_tap_demo")。
 */
(function() {
  'use strict';
  document.querySelectorAll('.kudos-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('tapped');
    });
  });
})();
