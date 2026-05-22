/**
 * GA4 analytics — 14 events (Step 8.C / docs/GA4-EVENTS.md)
 * Consent Mode v2. Respects denied state. 1st party proxy.
 */
(function() {
  'use strict';

  const GA_ENDPOINT = 'https://analytics.kanopy.app/g/collect';
  const GA_ID = window.__ROUNDIE_GA_ID || 'G-XXXXXXX';
  let consented = false;

  // Default consent: all denied until explicit opt-in
  function pushDefault() {
    if (typeof window.gtag !== 'function') {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() { window.dataLayer.push(arguments); };
    }
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    });
  }

  function track(eventName, params) {
    if (!consented) return;
    fetch(GA_ENDPOINT + '?tid=' + GA_ID + '&en=' + eventName, {
      method: 'POST',
      keepalive: true,
      body: JSON.stringify(params || {})
    }).catch(() => { /* silent */ });
  }

  // 1. page_view (auto on load)
  function trackPageView() {
    track('page_view', {
      page_location: location.href,
      page_referrer: document.referrer,
      language: document.documentElement.lang
    });
  }

  // 2, 3, 4. scroll_25 / scroll_50 / vision_complete
  function setupScrollEvents() {
    let fired = { 25: false, 50: false, vision: false };
    function onScroll() {
      const pct = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
      if (pct >= 25 && !fired[25]) { fired[25] = true; track('scroll_25',  { scroll_depth: 25 }); }
      if (pct >= 50 && !fired[50]) { fired[50] = true; track('scroll_50',  { scroll_depth: 50 }); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    const visionLast = document.querySelector('.vision .scene:last-child');
    if (visionLast) {
      const io = new IntersectionObserver((es) => {
        es.forEach(e => {
          if (e.isIntersecting && !fired.vision) {
            fired.vision = true;
            track('vision_complete', { direction: 'down' });
            io.disconnect();
          }
        });
      }, { threshold: 0.6 });
      io.observe(visionLast);
    }
  }

  // 5. feature_view
  function setupFeatureView() {
    document.querySelectorAll('.bento-card').forEach(card => {
      const id = card.dataset.feature || card.getAttribute('data-feature-from');
      const io = new IntersectionObserver((es) => {
        es.forEach(e => {
          if (e.isIntersecting) {
            track('feature_view', { feature_id: id });
            io.disconnect();
          }
        });
      }, { threshold: 0.5 });
      io.observe(card);
    });
  }

  // 6. round_card_form_view — fire 1.08s after RC enters viewport
  function setupRoundCardForm() {
    const rc = document.querySelector('.round-card');
    if (!rc) return;
    const io = new IntersectionObserver((es) => {
      es.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => {
            track('round_card_form_view', { cells_visible: rc.children.length });
          }, 1080);
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(rc);
  }

  // 7. kudos_tap_demo
  function setupKudosDemo() {
    document.querySelectorAll('[data-event="kudos_tap_demo"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.kudosType || btn.getAttribute('data-kudos-type-from');
        track('kudos_tap_demo', { kudos_type: type });
      });
    });
  }

  // 8, 9. faq_open / early_access_help_open
  function setupFaq() {
    document.querySelectorAll('.faq-items details').forEach((d, i) => {
      d.addEventListener('toggle', () => {
        track('faq_open', { question_id: 'q' + (i+1), direction: d.open ? 'open' : 'close' });
        if (i === 0 && d.open) track('early_access_help_open');
      });
    });
  }

  // 10. hero_cta_click
  function setupCta() {
    document.querySelectorAll('[data-event="hero_cta_click"]').forEach(el => {
      el.addEventListener('click', () => {
        track('hero_cta_click', { cta_location: el.dataset.ctaLocation || 'hero' });
      });
    });
  }

  // 11. pricing_view
  function setupPricing() {
    const pricing = document.getElementById('pricing');
    if (!pricing) return;
    const io = new IntersectionObserver((es) => {
      es.forEach(e => {
        if (e.isIntersecting) {
          ['free', 'pro'].forEach(plan => track('pricing_view', { plan_visible: plan }));
          io.disconnect();
        }
      });
    }, { threshold: 0.5 });
    io.observe(pricing);
  }

  // 12, 13. early_access_signup / android_waitlist_submit
  function setupForms() {
    document.querySelectorAll('form[data-event]').forEach(f => {
      f.addEventListener('submit', () => {
        track(f.dataset.event, {
          language: document.documentElement.lang,
          os_hint: /iP(hone|ad|od)/.test(navigator.userAgent) ? 'ios'
                 : /Android/.test(navigator.userAgent) ? 'android' : 'other'
        });
      });
    });
  }

  // 14. language_switch
  function setupLanguageSwitch() {
    document.querySelectorAll('[data-i18n-switch] button').forEach(b => {
      b.addEventListener('click', () => {
        track('language_switch', { from: document.documentElement.lang, to: b.value });
      });
    });
  }

  // Public API
  window.ROUNDIE_GA = {
    grantConsent: function() {
      consented = true;
      window.gtag && window.gtag('consent', 'update', { analytics_storage: 'granted' });
      trackPageView();
    },
    revokeConsent: function() {
      consented = false;
      window.gtag && window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
  };

  // Init
  pushDefault();
  setupScrollEvents();
  setupFeatureView();
  setupRoundCardForm();
  setupKudosDemo();
  setupFaq();
  setupCta();
  setupPricing();
  setupForms();
  setupLanguageSwitch();
})();
