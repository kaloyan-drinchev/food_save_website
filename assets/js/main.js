/**
 * FoodSave Website — main.js
 * Language toggle, scroll effects, intersection observer fade-ins,
 * mobile nav, and BubbleCanvas initialisation.
 */

(() => {
  'use strict';

  /* ── DOM helpers ────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── Render all [data-i18n] elements ─────────────────────────
     Attribute variants:
       data-i18n="key"          → sets textContent
       data-i18n-html="key"     → sets innerHTML (legal content)
       data-i18n-placeholder="key" → sets placeholder attribute
  ──────────────────────────────────────────────────────────── */
  function applyTranslations() {
    $$('[data-i18n]').forEach((el) => {
      const val = I18n.t(el.dataset.i18n);
      if (val !== el.dataset.i18n) el.textContent = val;
    });
    $$('[data-i18n-html]').forEach((el) => {
      const val = I18n.t(el.dataset.i18nHtml);
      if (val !== el.dataset.i18nHtml) el.innerHTML = val;
    });
    $$('[data-i18n-placeholder]').forEach((el) => {
      const val = I18n.t(el.dataset.i18nPlaceholder);
      if (val !== el.dataset.i18nPlaceholder) el.placeholder = val;
    });
    // Update <html lang> attribute
    document.documentElement.lang = I18n.getLang();
    // Update page title — respect legal page titles via data-i18n on h1
    const legalTitle = document.querySelector('h1[data-i18n]');
    if (legalTitle) {
      document.title = `FoodSave — ${I18n.t(legalTitle.dataset.i18n)}`;
    } else {
      document.title =
        I18n.getLang() === 'bg'
          ? 'FoodSave — Спаси следващото си ястие'
          : 'FoodSave — Save Your Next Meal';
    }
  }

  /* ── Language toggle ─────────────────────────────────────────── */
  function initLangToggle() {
    const btnEn = $('#btn-lang-en');
    const btnBg = $('#btn-lang-bg');
    const btnEnMobile = $('#btn-lang-en-mobile');
    const btnBgMobile = $('#btn-lang-bg-mobile');

    function switchLang(lang) {
      I18n.setLang(lang);
      localStorage.setItem('foodsave-lang', lang);
      applyTranslations();
      // Update active class on all toggle buttons
      [btnEn, btnEnMobile].forEach((b) => {
        if (b) b.classList.toggle('active', lang === 'en');
      });
      [btnBg, btnBgMobile].forEach((b) => {
        if (b) b.classList.toggle('active', lang === 'bg');
      });
      // Swap inline background/color for the navbar toggle buttons
      const activeBg = '#1b5e20';
      const activeColor = '#69f0ae';
      const inactiveBg = 'transparent';
      const inactiveColor = '#bdbdbd';
      [btnBg, btnBgMobile].forEach((b) => {
        if (!b) return;
        b.style.background = lang === 'bg' ? activeBg : inactiveBg;
        b.style.color = lang === 'bg' ? activeColor : inactiveColor;
      });
      [btnEn, btnEnMobile].forEach((b) => {
        if (!b) return;
        b.style.background = lang === 'en' ? activeBg : inactiveBg;
        b.style.color = lang === 'en' ? activeColor : inactiveColor;
      });
    }

    btnEn && btnEn.addEventListener('click', () => switchLang('en'));
    btnBg && btnBg.addEventListener('click', () => switchLang('bg'));
    btnEnMobile &&
      btnEnMobile.addEventListener('click', () => switchLang('en'));
    btnBgMobile &&
      btnBgMobile.addEventListener('click', () => switchLang('bg'));

    // Restore saved language or default to Bulgarian
    const saved = localStorage.getItem('foodsave-lang') || 'bg';
    switchLang(saved);
  }

  /* ── Mobile nav hamburger ───────────────────────────────────── */
  function initMobileNav() {
    const btn = $('#nav-hamburger');
    const menu = $('#nav-mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      btn.classList.toggle('is-open', open);
    });

    // Close mobile menu when a link is clicked
    $$('a', menu).forEach((a) => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', false);
        btn.classList.remove('is-open');
      });
    });
  }

  /* ── Sticky nav shadow on scroll ────────────────────────────── */
  function initNavScroll() {
    const nav = $('#main-navbar');
    if (!nav) return;
    window.addEventListener(
      'scroll',
      () => {
        nav.style.boxShadow =
          window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,0.45)' : 'none';
      },
      { passive: true },
    );
  }

  /* ── Intersection Observer — fade-in on scroll ──────────────── */
  function initFadeIn() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    $$('.fade-in').forEach((el) => observer.observe(el));
  }

  /* ── Waitlist form (Formspree) ──────────────────────────────── */
  function initWaitlist() {
    const form = $('#waitlist-form');
    const modal = $('#waitlist-modal');
    const closeBtn = $('#waitlist-modal-close');
    if (!form) return;

    function closeModal() {
      if (modal) modal.hidden = true;
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.waitlist-submit');
      btn.disabled = true;
      btn.style.opacity = '0.6';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          form.reset();
          if (modal) modal.hidden = false;
        }
      } finally {
        btn.disabled = false;
        btn.style.opacity = '';
      }
    });
  }

  /* ── Hero carousel ──────────────────────────────────────────── */
  function initCarousel() {
    const slides = $('#hero-slides');
    const dots = $$('#hero-dots .hero-dot');
    const btn = $('#hero-carousel-btn');
    const carousel = $('#hero-carousel');
    if (!slides || !btn || !carousel) return;

    let current = 0;
    const total = 4;

    function goTo(index) {
      current = Math.max(0, Math.min(index, total - 1));
      slides.style.transform = `translateX(-${current * 25}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      const key = current === total - 1 ? 'hero.cta_start' : 'hero.cta_next';
      btn.dataset.i18n = key;
      btn.textContent = I18n.t(key);
    }

    btn.addEventListener('click', () => {
      if (current < total - 1) {
        goTo(current + 1);
      } else {
        const about = document.getElementById('about');
        if (about) about.scrollIntoView({ behavior: 'smooth' });
      }
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goTo(current + 1);
        else goTo(current - 1);
      }
    }, { passive: true });
  }

  /* ── Init ────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initLangToggle();
    initMobileNav();
    initNavScroll();
    initFadeIn();
    initCarousel();
    initWaitlist();
  });
})();
