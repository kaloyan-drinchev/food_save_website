<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { faqItems } from '@/content/site'
import SiteSectionHead from './SiteSectionHead.vue'

/**
 * "Често задавани въпроси" — two columns of pills that read DOWN the left
 * column first (1-3), then the right (4-6); one stack on mobile.
 *
 * The answer panel animates `height` between 0 and its measured content
 * height (set as an inline custom property), which works in every browser
 * and does not depend on animatable grid tracks.
 */
const { t, locale } = useI18n()

const half = Math.ceil(faqItems.length / 2)
const columns = [faqItems.slice(0, half), faqItems.slice(half)]

const openId = ref(null)
const panels = new Map() // id -> panel element

function setPanel(id, el) {
  if (el) panels.set(id, el)
  else panels.delete(id)
}

function measure(id) {
  const panel = panels.get(id)
  if (!panel) return
  const inner = panel.firstElementChild
  panel.style.setProperty('--faq-h', `${inner ? inner.scrollHeight : 0}px`)
}

function toggle(id) {
  const next = openId.value === id ? null : id
  if (next) measure(next)
  openId.value = next
}

// Keep the open panel's height in sync when the viewport changes.
function onResize() {
  if (openId.value) measure(openId.value)
}

// Answers change length with the language.
watch(locale, () => nextTick(onResize))

onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<template>
  <section id="fs-faq" class="fs-section fs-faq">
    <div class="fs-container">
      <SiteSectionHead :title="t('hp.faq.title')" :subtitle="t('hp.faq.subtitle')" />

      <div class="fs-faq__grid">
        <div v-for="(col, ci) in columns" :key="ci" class="fs-faq__col">
          <div
            v-for="item in col"
            :key="item.id"
            class="fs-faq__item"
            :class="{ 'is-open': openId === item.id }"
          >
            <button
              type="button"
              class="fs-faq__q"
              :aria-expanded="openId === item.id"
              :aria-controls="`${item.id}-panel`"
              @click="toggle(item.id)"
            >
              <span>{{ t(item.q) }}</span>
              <span class="fs-faq__plus" aria-hidden="true"></span>
            </button>
            <div
              :id="`${item.id}-panel`"
              :ref="(el) => setPanel(item.id, el)"
              class="fs-faq__a"
              role="region"
              :aria-hidden="openId !== item.id"
            >
              <div class="fs-faq__a-inner">
                <p>{{ t(item.a) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fs-faq {
  scroll-margin-top: var(--fs-nav-h);
}

.fs-faq__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 29px;
  align-items: start;
}

.fs-faq__col {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.fs-faq__item {
  border-radius: 40px;
  background: var(--fs-pill);
  transition: background var(--fs-transition);
}

.fs-faq__q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  min-height: clamp(60px, 3rem + 1.2vw, 76px);
  padding: 14px clamp(22px, 1rem + 2.6vw, 58px);
  border: 0;
  background: transparent;
  text-align: left;
  font-size: clamp(1.0625rem, 0.95rem + 0.4vw, 1.25rem);
  font-weight: 700;
  color: var(--fs-teal);
  cursor: pointer;
  border-radius: inherit;
}

.fs-faq__q:hover .fs-faq__plus {
  transform: scale(1.1);
}

/* Thin orange "+" that turns into "−" when open. */
.fs-faq__plus {
  position: relative;
  flex: none;
  width: 22px;
  height: 22px;
  transition: transform var(--fs-transition);
}

.fs-faq__plus::before,
.fs-faq__plus::after {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  background: var(--fs-orange);
  border-radius: 2px;
  transition: transform var(--fs-transition);
}

.fs-faq__plus::before {
  width: 22px;
  height: 1.8px;
}

.fs-faq__plus::after {
  width: 1.8px;
  height: 22px;
}

.is-open .fs-faq__plus::after {
  transform: rotate(90deg);
}

/* Answer panel: height animates between 0 and the measured content height. */
.fs-faq__a {
  height: 0;
  overflow: hidden;
  transition: height 260ms var(--fs-ease);
}

.is-open .fs-faq__a {
  height: var(--faq-h, auto);
}

.fs-faq__a-inner p {
  padding: 0 clamp(22px, 1rem + 2.6vw, 58px) 26px;
  color: var(--fs-body);
}

@media (max-width: 760px) {
  .fs-faq__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }

  .fs-faq__col {
    display: contents;
  }

  .fs-faq__item {
    border-radius: 32px;
  }
}
</style>
