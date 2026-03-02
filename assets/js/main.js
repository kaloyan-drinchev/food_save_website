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
      // Animate hamburger → X
      const [s1, , s3] = btn.querySelectorAll('span');
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
    const nav = $('nav');
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

  /* ── Bubble canvas ───────────────────────────────────────────── */
  function initBubbles() {
    const canvas = $('#bubble-canvas');
    if (!canvas || typeof BubbleCanvas === 'undefined') return;
    const bc = new BubbleCanvas(canvas);
    bc.start();
  }

  /* ── Init ────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initLangToggle();
    initMobileNav();
    initNavScroll();
    initFadeIn();
    initBubbles();
  });
})();
