(function () {
  'use strict';

  const LERP_FACTOR = 0.08;
  let scrollY = 0;
  let currentScrollY = 0;
  let ticking = false;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function getProgress(el) {
    var rect = el.getBoundingClientRect();
    var winH = window.innerHeight;
    return clamp((winH - rect.top) / (winH + rect.height), 0, 1);
  }

  /* ── Hero parallax ── */
  function animateHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var text = hero.querySelector('.hero-text');
    var imgWrap = hero.querySelector('.hero-image-wrapper');
    var scrollRatio = clamp(currentScrollY / window.innerHeight, 0, 1.5);

    if (text) {
      text.style.transform =
        'translateY(' + (scrollRatio * 80) + 'px) translateZ(' + (-scrollRatio * 60) + 'px)';
      text.style.opacity = 1 - scrollRatio * 0.8;
    }

    if (imgWrap) {
      imgWrap.style.transform =
        'translateY(' + (scrollRatio * 40) + 'px) rotateY(' + (scrollRatio * -8) + 'deg) rotateX(' + (scrollRatio * 5) + 'deg) scale(' + (1 - scrollRatio * 0.08) + ')';
    }
  }

  /* ── 3D card reveal (About / Spirit / CTA cards) ── */
  var revealed = new WeakSet();

  function revealCards() {
    document.querySelectorAll('.scroll-3d-card').forEach(function (card, i) {
      if (revealed.has(card)) return;
      var rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) {
        var delay = (i % 3) * 120;
        card.style.transitionDelay = delay + 'ms';
        card.classList.add('scroll-3d-card--visible');
        revealed.add(card);
      }
    });
  }

  /* ── Drives image-card depth tilt ── */
  var drivesSettled = new WeakSet();

  function animateDrivesCards() {
    document.querySelectorAll('.drives-card').forEach(function (card) {
      if (drivesSettled.has(card)) return;

      var p = getProgress(card);
      var mid = clamp((p - 0.2) / 0.6, 0, 1);

      if (mid >= 0.98) {
        card.style.transform = '';
        card.style.opacity = '';
        drivesSettled.add(card);
        return;
      }

      var rotX = lerp(6, 0, mid);
      var rotY = lerp(-4, 0, mid);
      var tz = lerp(-60, 0, mid);
      var opacity = lerp(0.4, 1, mid);

      card.style.transform =
        'perspective(900px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateZ(' + tz + 'px)';
      card.style.opacity = opacity;
    });
  }

  /* ── Story text reveal (no image in updated layout) ── */
  function animateStory() {
    var section = document.querySelector('.story');
    if (!section) return;

    var p = getProgress(section);
    var mid = clamp((p - 0.15) / 0.5, 0, 1);

    var textEl = section.querySelector('.story-text');
    var h2 = section.querySelector('.story-text h2');
    var paragraphs = section.querySelectorAll('.story-text p');

    if (h2) {
      h2.style.transform =
        'perspective(1200px) rotateX(' + lerp(-6, 0, mid) + 'deg) translateY(' + lerp(30, 0, mid) + 'px)';
      h2.style.opacity = lerp(0, 1, mid);
    }

    paragraphs.forEach(function (para, i) {
      var d = clamp(mid - i * 0.06, 0, 1);
      para.style.transform =
        'perspective(1200px) rotateY(' + lerp(4, 0, d) + 'deg) translateX(' + lerp(-40, 0, d) + 'px)';
      para.style.opacity = lerp(0, 1, d);
    });
  }

  /* ── Spirit quote bar ── */
  function animateQuote() {
    var quote = document.querySelector('.spirit-quote');
    if (!quote) return;

    var p = getProgress(quote);
    var mid = clamp((p - 0.2) / 0.5, 0, 1);

    quote.style.transform =
      'perspective(800px) rotateX(' + lerp(12, 0, mid) + 'deg) translateY(' + lerp(40, 0, mid) + 'px)';
    quote.style.opacity = lerp(0, 1, mid);
  }

  /* ── CTA section rise ── */
  function animateCTA() {
    var cta = document.querySelector('.cta');
    if (!cta) return;

    var p = getProgress(cta);
    var mid = clamp((p - 0.1) / 0.5, 0, 1);

    var h2 = cta.querySelector('h2');
    var sub = cta.querySelector('.cta-subtitle');
    var btn = cta.querySelector('.btn-white');
    var footer = cta.querySelector('.cta-footer');

    [h2, sub, btn, footer].forEach(function (el, i) {
      if (!el) return;
      var d = clamp(mid - i * 0.08, 0, 1);
      el.style.transform =
        'translateY(' + lerp(50, 0, d) + 'px) translateZ(' + lerp(-30, 0, d) + 'px)';
      el.style.opacity = lerp(0, 1, d);
    });
  }

  /* ── Section header reveals ── */
  function animateSectionHeaders() {
    document.querySelectorAll('.section-header').forEach(function (header) {
      var p = getProgress(header);
      var mid = clamp((p - 0.15) / 0.45, 0, 1);

      var h2 = header.querySelector('h2');
      var desc = header.querySelector('p');

      if (h2) {
        h2.style.transform =
          'perspective(1000px) rotateX(' + lerp(-8, 0, mid) + 'deg) translateY(' + lerp(30, 0, mid) + 'px)';
        h2.style.opacity = lerp(0, 1, mid);
      }
      if (desc) {
        var d = clamp(mid - 0.1, 0, 1);
        desc.style.transform = 'translateY(' + lerp(20, 0, d) + 'px)';
        desc.style.opacity = lerp(0, 1, d);
      }
    });
  }

  /* ── Spirit body paragraphs ── */
  function animateSpiritBody() {
    var body = document.querySelector('.spirit-body');
    if (!body) return;

    var p = getProgress(body);
    var mid = clamp((p - 0.15) / 0.5, 0, 1);

    body.querySelectorAll('p').forEach(function (para, i) {
      var d = clamp(mid - i * 0.06, 0, 1);
      para.style.transform = 'translateY(' + lerp(30, 0, d) + 'px)';
      para.style.opacity = lerp(0, 1, d);
    });
  }

  /* ── Tick loop ── */
  function tick() {
    currentScrollY = lerp(currentScrollY, scrollY, LERP_FACTOR);

    animateHero();
    revealCards();
    animateDrivesCards();
    animateStory();
    animateQuote();
    animateCTA();
    animateSectionHeaders();
    animateSpiritBody();

    if (Math.abs(currentScrollY - scrollY) > 0.5) {
      requestAnimationFrame(tick);
    } else {
      ticking = false;
    }
  }

  function onScroll() {
    scrollY = window.pageYOffset;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(tick);
    }
  }

  function init() {
    var cardSelectors = [
      '.about-card',
      '.spirit-card',
      '.cta-card'
    ];
    cardSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (card) {
        card.classList.add('scroll-3d-card');
      });
    });

    scrollY = window.pageYOffset;
    currentScrollY = scrollY;

    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
