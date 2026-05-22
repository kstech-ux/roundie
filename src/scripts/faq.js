/**
 * faq.js — progressive enhancement for <details> accordions
 * JS off: <details> still opens/closes natively.
 * JS on: adds smooth height transition (CSS handles it via MI-4).
 */
(function() {
  'use strict';
  // Single-open accordion behavior (optional UX)
  const groups = document.querySelectorAll('.faq-items');
  groups.forEach(group => {
    group.addEventListener('toggle', (e) => {
      if (!e.target.matches('details') || !e.target.open) return;
      group.querySelectorAll('details[open]').forEach(d => {
        if (d !== e.target) d.open = false;
      });
    }, true);
  });
})();
