<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { cutouts, cutoutSizes } from '@/content/site'

/**
 * Four numbered steps laid out along an S-shaped path with a phone beside
 * each one (consumer + business "Как работи" sections).
 *
 * Desktop: the mockup's zig-zag — text/phone, phone/text, phone/text,
 * text/phone. Mobile: text/phone alternating with phone/text.
 *
 * The thin connector is measured, not hand-drawn: after layout the path is
 * built through the actual badge, text and phone rectangles, so it starts
 * under badge 1, runs beneath the first text, passes behind each phone on
 * its outer side and crosses between rows only in the text-free bands.
 */
defineProps({
  /** [{ n, title, text }] — title/text are i18n keys */
  steps: { type: Array, required: true },
})

const { t, locale } = useI18n()

const root = ref(null)
const size = ref({ w: 1000, h: 1000 })
const d = ref('')

/** Catmull-Rom spline through `pts` as a cubic-Bézier SVG path. */
function spline(pts) {
  if (pts.length < 2) return ''
  const f = (n) => n.toFixed(1)
  let path = `M ${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    path += ` C ${f(c1[0])} ${f(c1[1])}, ${f(c2[0])} ${f(c2[1])}, ${f(p2[0])} ${f(p2[1])}`
  }
  return path
}

function draw() {
  const el = root.value
  if (!el) return
  const R = el.getBoundingClientRect()
  if (!R.width || !R.height) return
  const rel = (r) => ({
    l: r.left - R.left,
    t: r.top - R.top,
    r: r.right - R.left,
    b: r.bottom - R.top,
    cx: (r.left + r.right) / 2 - R.left,
    cy: (r.top + r.bottom) / 2 - R.top,
    w: r.width,
    h: r.height,
  })
  const rows = [...el.querySelectorAll('.fs-steps__row')].map((row) => ({
    text: rel(row.querySelector('.fs-steps__text').getBoundingClientRect()),
    phone: rel(row.querySelector('.fs-steps__phone img').getBoundingClientRect()),
    num: rel(row.querySelector('.fs-steps__num').getBoundingClientRect()),
  }))
  if (rows.length < 2) return

  const pts = []
  const first = rows[0]
  // Start under badge 1, dip below the first text block, then run through
  // the lower part of phone 1 (the SVG sits behind the phones).
  pts.push([first.num.cx, first.num.b + 4])
  pts.push([first.num.cx - first.num.w * 0.25, first.text.b + 18])
  pts.push([first.phone.cx, first.phone.cy + first.phone.h * 0.22])

  for (let i = 1; i < rows.length; i++) {
    const prev = rows[i - 1]
    const row = rows[i]
    // Cross between the rows in the text-free band, drifting towards the next phone.
    const bandY = (Math.max(prev.text.b, prev.phone.b - prev.phone.h * 0.2) + row.text.t) / 2
    pts.push([prev.phone.cx + (row.phone.cx - prev.phone.cx) * 0.55, bandY])
    // Pass behind the phone on the side away from its text, then wrap under it.
    const outerRight = row.phone.cx > row.text.cx
    const side = outerRight ? row.phone.r - row.phone.w * 0.2 : row.phone.l + row.phone.w * 0.2
    pts.push([side, row.phone.cy - row.phone.h * 0.05])
    if (i < rows.length - 1) pts.push([row.phone.cx, row.phone.b + 14])
  }
  const last = rows[rows.length - 1]
  pts.push([last.phone.cx - last.phone.w * 0.25, R.height + 4])

  size.value = { w: R.width, h: R.height }
  d.value = spline(pts)
}

let ro = null
onMounted(() => {
  draw()
  ro = new ResizeObserver(() => draw())
  ro.observe(root.value)
  // Fonts may finish loading after mount and change the text heights.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw)
})
onBeforeUnmount(() => ro && ro.disconnect())
watch(locale, () => nextTick(draw))
</script>

<template>
  <div ref="root" class="fs-steps">
    <svg
      class="fs-steps__curve"
      :viewBox="`0 0 ${size.w} ${size.h}`"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path :d="d" vector-effect="non-scaling-stroke" />
    </svg>

    <div v-for="(s, i) in steps" :key="s.n" class="fs-steps__row" :class="`fs-steps__row--${i + 1}`">
      <div class="fs-steps__text">
        <span class="fs-num fs-steps__num">{{ s.n }}</span>
        <div class="fs-steps__copy">
          <h3 class="fs-steps__title">{{ t(s.title) }}</h3>
          <p class="fs-steps__desc">{{ t(s.text) }}</p>
        </div>
      </div>
      <div class="fs-steps__phone">
        <img
          :src="cutouts.phone"
          :width="cutoutSizes.phone[0]"
          :height="cutoutSizes.phone[1]"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fs-steps {
  /* Mockup phone body ≈ 176px wide at 1440. */
  --phone-w: clamp(120px, 5rem + 6.5vw, 186px);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1vw, 20px);
  padding-block: 8px;
}

.fs-steps__curve {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: var(--fs-teal);
  stroke-width: 1.2px;
  stroke-opacity: 0.6;
  pointer-events: none;
}

.fs-steps__row {
  position: relative;
  display: grid;
  grid-template-columns: repeat(20, minmax(0, 1fr));
  align-items: center;
}

.fs-steps__text {
  display: flex;
  align-items: flex-start;
  gap: clamp(12px, 0.5rem + 1vw, 24px);
}

.fs-steps__num {
  --fs-num-size: clamp(44px, 2.5rem + 0.8vw, 60px);
  margin-top: 2px;
}

.fs-steps__title {
  font-size: clamp(1.25rem, 1rem + 1vw, 2rem);
  line-height: 1.1;
}

.fs-steps__desc {
  margin-top: 10px;
  max-width: 26ch;
  color: var(--fs-body);
}

.fs-steps__phone {
  position: relative;
  z-index: 1;
  width: var(--phone-w);
}

.fs-steps__phone img {
  width: 100%;
  height: auto;
  filter: drop-shadow(-14px 22px 24px rgba(0, 0, 0, 0.16));
}

/* ── Desktop placement (20-column grid, mirrors the mockup) ── */
.fs-steps__row--1 .fs-steps__text {
  grid-column: 2 / 8;
}
.fs-steps__row--1 .fs-steps__phone {
  grid-column: 8 / 12;
  justify-self: start;
}

.fs-steps__row--2 .fs-steps__text {
  grid-column: 12 / 17;
  grid-row: 1;
}
.fs-steps__row--2 .fs-steps__phone {
  grid-column: 17 / 21;
  grid-row: 1;
  justify-self: start;
}

.fs-steps__row--3 .fs-steps__phone {
  grid-column: 2 / 6;
  grid-row: 1;
  justify-self: start;
}
.fs-steps__row--3 .fs-steps__text {
  grid-column: 6 / 11;
  grid-row: 1;
}

.fs-steps__row--4 .fs-steps__text {
  grid-column: 11 / 17;
  grid-row: 1;
}
.fs-steps__row--4 .fs-steps__phone {
  grid-column: 17 / 21;
  grid-row: 1;
  justify-self: start;
}

/* ── Narrow: two columns, alternating ── */
@media (max-width: 900px) {
  .fs-steps {
    --phone-w: clamp(100px, 30vw, 150px);
    gap: 18px;
  }

  .fs-steps__row {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 16px;
  }

  .fs-steps__row .fs-steps__text,
  .fs-steps__row .fs-steps__phone {
    grid-row: auto;
    grid-column: auto;
    justify-self: auto;
  }

  .fs-steps__row--2,
  .fs-steps__row--4 {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .fs-steps__row--2 .fs-steps__phone,
  .fs-steps__row--4 .fs-steps__phone {
    order: -1;
  }

  .fs-steps__num {
    --fs-num-size: 40px;
  }

  .fs-steps__title {
    font-size: 1.25rem;
  }

  .fs-steps__desc {
    font-size: 0.9375rem;
  }
}
</style>
