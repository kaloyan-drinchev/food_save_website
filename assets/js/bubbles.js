/**
 * BubbleCanvas — ported from Flutter BubblePainter
 *
 * Ten bokeh bubbles oscillate slowly using independent sine/cosine
 * frequencies, matching the effect seen in the FoodSave app onboarding.
 */

(() => {
  'use strict';

  /* Pre-defined bubble configurations (mirrors Flutter _Bubble list)
     Fields: startX, startY, radius, opacity, freqX, freqY, ampX, ampY */
  const BUBBLES = [
    {
      startX: 0.12,
      startY: 0.18,
      radius: 40,
      opacity: 0.08,
      freqX: 0.7,
      freqY: 0.3,
      ampX: 0.04,
      ampY: 0.03,
    },
    {
      startX: 0.85,
      startY: 0.12,
      radius: 22,
      opacity: 0.06,
      freqX: 1.1,
      freqY: 0.5,
      ampX: 0.03,
      ampY: 0.05,
    },
    {
      startX: 0.35,
      startY: 0.75,
      radius: 55,
      opacity: 0.1,
      freqX: 0.5,
      freqY: 0.8,
      ampX: 0.05,
      ampY: 0.02,
    },
    {
      startX: 0.7,
      startY: 0.55,
      radius: 30,
      opacity: 0.07,
      freqX: 0.9,
      freqY: 1.2,
      ampX: 0.02,
      ampY: 0.04,
    },
    {
      startX: 0.22,
      startY: 0.45,
      radius: 65,
      opacity: 0.05,
      freqX: 1.3,
      freqY: 0.4,
      ampX: 0.03,
      ampY: 0.06,
    },
    {
      startX: 0.9,
      startY: 0.8,
      radius: 35,
      opacity: 0.09,
      freqX: 0.6,
      freqY: 0.9,
      ampX: 0.06,
      ampY: 0.02,
    },
    {
      startX: 0.5,
      startY: 0.1,
      radius: 48,
      opacity: 0.04,
      freqX: 1.0,
      freqY: 0.7,
      ampX: 0.04,
      ampY: 0.05,
    },
    {
      startX: 0.08,
      startY: 0.85,
      radius: 28,
      opacity: 0.06,
      freqX: 0.8,
      freqY: 1.1,
      ampX: 0.02,
      ampY: 0.03,
    },
    {
      startX: 0.65,
      startY: 0.3,
      radius: 18,
      opacity: 0.12,
      freqX: 1.2,
      freqY: 0.6,
      ampX: 0.05,
      ampY: 0.04,
    },
    {
      startX: 0.4,
      startY: 0.92,
      radius: 42,
      opacity: 0.07,
      freqX: 0.4,
      freqY: 1.0,
      ampX: 0.03,
      ampY: 0.02,
    },
  ];

  /* Base colour: primaryGreenLight from FoodSave dark scheme */
  const BASE_COLOR = { r: 105, g: 240, b: 174 }; // #69F0AE

  class BubbleCanvas {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.time = 0;
      this.rafId = null;
      this._resize();
      this._bindResize();
    }

    _resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.canvas.style.width = rect.width + 'px';
      this.canvas.style.height = rect.height + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    _bindResize() {
      this._onResize = () => this._resize();
      window.addEventListener('resize', this._onResize, { passive: true });
    }

    start() {
      const loop = () => {
        this._draw();
        /* Increment time slowly — ~0.0003/frame at 60 fps ≈ 1 full cycle every ~55 s */
        this.time = (this.time + 0.0003) % 1.0;
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    }

    stop() {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      window.removeEventListener('resize', this._onResize);
    }

    _draw() {
      const ctx = this.ctx;
      const w = this.canvas.width / (window.devicePixelRatio || 1);
      const h = this.canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, w, h);

      const TWO_PI = Math.PI * 2;
      const angle = this.time * TWO_PI;

      for (const b of BUBBLES) {
        const dx = Math.sin(angle * b.freqX) * b.ampX * w;
        const dy = Math.cos(angle * b.freqY) * b.ampY * h;
        const x = b.startX * w + dx;
        const y = b.startY * h + dy;

        ctx.beginPath();
        ctx.arc(x, y, b.radius, 0, TWO_PI);
        ctx.fillStyle = `rgba(${BASE_COLOR.r}, ${BASE_COLOR.g}, ${BASE_COLOR.b}, ${b.opacity})`;
        ctx.fill();
      }
    }
  }

  /* Expose globally so main.js can instantiate it */
  window.BubbleCanvas = BubbleCanvas;
})();
