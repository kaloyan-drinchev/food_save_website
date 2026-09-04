<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

/** Honour prefers-reduced-motion for programmatic scrolling. */
function scrollMode() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

/** Modified clicks (cmd/ctrl/shift/alt, middle button) must keep the native link behaviour. */
function isModifiedClick(e) {
  return !!e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1)
}
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { setLocale } from '@/i18n'
import { navLinks } from '@/content/site'
import SiteLogo from './SiteLogo.vue'
import SiteButton from './SiteButton.vue'

/** `active` = the page key to highlight (landing | about | consumers | business | contact). */
defineProps({
  active: { type: String, default: '' },
})

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()

const open = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 4
}

function targetPath(to) {
  return typeof to === 'string' ? to : to.path
}

/**
 * Navigate to a link. When the target is a section on the page that is
 * already open, scroll to it instead of re-navigating (the router does
 * nothing for a same-hash push).
 */
async function go(link, e) {
  if (isModifiedClick(e)) return
  if (e) e.preventDefault()
  open.value = false
  const to = link.to
  const hash = typeof to === 'object' ? to.hash : null
  if (hash && route.path === targetPath(to)) {
    const el = document.querySelector(hash)
    if (el) {
      el.scrollIntoView({ behavior: scrollMode(), block: 'start' })
      return
    }
  }
  await router.push(to)
}

/** "Изтегли приложението": the download band on this page, else the home one. */
function goDownload() {
  open.value = false
  const el = document.getElementById('fs-download')
  if (el) {
    el.scrollIntoView({ behavior: scrollMode(), block: 'start' })
    return
  }
  router.push({ path: '/', hash: '#fs-download' })
}

const switchLang = setLocale

/** The header shows one button offering the other language. */
const otherLocale = computed(() => (locale.value === 'bg' ? 'en' : 'bg'))

// Close the drawer on route change and lock body scroll while it is open.
watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)
watch(open, (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
})

function onKey(e) {
  if (e.key === 'Escape') open.value = false
}

// The drawer only exists below the desktop breakpoint; close it if the
// viewport grows past it so the scroll lock cannot linger.
function onResize() {
  if (open.value && window.innerWidth >= 1280) open.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', onResize)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <header class="fs-nav" :class="{ 'is-scrolled': scrolled, 'is-open': open }">
    <div class="fs-container fs-nav__inner">
      <RouterLink to="/" class="fs-nav__brand" aria-label="FoodSave">
        <SiteLogo />
      </RouterLink>

      <nav class="fs-nav__links" :aria-label="t('hp.nav.menu')">
        <a
          v-for="l in navLinks"
          :key="l.key"
          :href="typeof l.to === 'string' ? l.to : l.to.path + (l.to.hash || '')"
          class="fs-nav__link"
          :class="{ 'is-active': l.match && l.match === active }"
          :aria-current="l.match && l.match === active ? 'page' : null"
          @click="go(l, $event)"
        >
          {{ t(l.key) }}
        </a>
      </nav>

      <div class="fs-nav__actions">
        <button
          class="fs-nav__lang-btn"
          type="button"
          :aria-label="otherLocale === 'en' ? t('hp.nav.switchToEn') : t('hp.nav.switchToBg')"
          @click="switchLang(otherLocale)"
        >
          {{ otherLocale.toUpperCase() }}
        </button>

        <SiteButton variant="orange" size="md" class="fs-nav__cta" @click="goDownload">
          {{ t('hp.nav.download') }}
        </SiteButton>

        <button
          class="fs-nav__burger"
          type="button"
          :aria-label="open ? t('hp.nav.close') : t('hp.nav.menu')"
          :aria-expanded="open"
          aria-controls="fs-nav-drawer"
          @click="open = !open"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <Transition name="fs-drawer">
      <div v-if="open" id="fs-nav-drawer" class="fs-nav__drawer">
        <div class="fs-container fs-nav__drawer-inner">
          <a
            v-for="l in navLinks"
            :key="l.key"
            :href="typeof l.to === 'string' ? l.to : l.to.path + (l.to.hash || '')"
            class="fs-nav__drawer-link"
            :class="{ 'is-active': l.match && l.match === active }"
            @click="go(l, $event)"
          >
            {{ t(l.key) }}
          </a>

          <SiteButton variant="orange" size="md" block class="fs-nav__drawer-cta" @click="goDownload">
            {{ t('hp.nav.download') }}
          </SiteButton>

          <div class="fs-nav__lang" role="group" :aria-label="t('hp.nav.language')">
            <button type="button" :class="{ 'is-active': locale === 'bg' }" @click="switchLang('bg')">
              BG
            </button>
            <span aria-hidden="true">/</span>
            <button type="button" :class="{ 'is-active': locale === 'en' }" @click="switchLang('en')">
              EN
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.fs-nav {
  position: sticky;
  top: 0;
  z-index: 60;
  background: var(--fs-bg);
  transition: box-shadow var(--fs-transition);
}

.fs-nav.is-scrolled {
  box-shadow: 0 10px 30px -20px rgba(50, 81, 83, 0.35);
}

.fs-nav__inner {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(14px, 0.25rem + 1vw, 30px);
  min-height: var(--fs-nav-h);
}

.fs-nav__brand {
  display: flex;
  align-items: center;
  --fs-logo-w: clamp(110px, 8rem + 4vw, 200px);
}

/* Links */
.fs-nav__links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(14px, 2.2vw, 42px);
}

.fs-nav__link {
  position: relative;
  padding: 6px 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--fs-teal);
  white-space: nowrap;
  transition: color var(--fs-transition);
}

.fs-nav__link:hover,
.fs-nav__link.is-active {
  color: var(--fs-orange);
}

/* Actions */
.fs-nav__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* One-tap language switch: shows the language it will switch to. */
.fs-nav__lang-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 40px;
  padding: 0 10px;
  border: 1.5px solid rgba(50, 81, 83, 0.25);
  border-radius: var(--fs-radius-pill);
  background: transparent;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--fs-teal);
  cursor: pointer;
  transition:
    border-color var(--fs-transition),
    color var(--fs-transition),
    background var(--fs-transition);
}

.fs-nav__lang-btn:hover {
  border-color: var(--fs-orange);
  color: var(--fs-orange);
}

/* Mockup CTA is ~202 x 48px; trim the generic md padding. */
.fs-nav__cta.fs-btn {
  --btn-px: 20px;
  --btn-fs: 0.9375rem;
}

/* Hamburger: three teal lines, as drawn in the mobile mockups. */
.fs-nav__burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 0 8px;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.fs-nav__burger span {
  display: block;
  height: 2.5px;
  border-radius: 2px;
  background: var(--fs-teal);
  transition:
    transform var(--fs-transition),
    opacity var(--fs-transition);
}

.is-open .fs-nav__burger span:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}

.is-open .fs-nav__burger span:nth-child(2) {
  opacity: 0;
}

.is-open .fs-nav__burger span:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}

/* Drawer */
.fs-nav__drawer {
  position: absolute;
  inset: 100% 0 auto 0;
  height: calc(100vh - 100%);
  height: calc(100dvh - 100%);
  overflow-y: auto;
  background: var(--fs-bg);
  border-top: 1px solid rgba(50, 81, 83, 0.1);
}

.fs-nav__drawer-inner {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-block: 20px 32px;
}

.fs-nav__drawer-link {
  padding: 14px 0;
  border-bottom: 1px solid rgba(50, 81, 83, 0.1);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--fs-teal);
}

.fs-nav__drawer-link.is-active {
  color: var(--fs-orange);
}

.fs-nav__drawer-cta {
  margin-top: 20px;
}

.fs-nav__lang {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  color: var(--fs-note);
  font-size: 0.9375rem;
}

.fs-nav__lang button {
  padding: 4px 2px;
  border: 0;
  background: transparent;
  font-weight: 600;
  color: var(--fs-body-soft);
  cursor: pointer;
}

.fs-nav__lang button.is-active {
  color: var(--fs-orange);
}

.fs-drawer-enter-active,
.fs-drawer-leave-active {
  transition:
    opacity 180ms var(--fs-ease),
    transform 180ms var(--fs-ease);
}

.fs-drawer-enter-from,
.fs-drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Responsive: six Bulgarian labels + logo + CTA need ~1180px, so the
   drawer takes over below 1280px. ── */
@media (max-width: 1279px) {
  .fs-nav__inner {
    grid-template-columns: auto 1fr;
  }

  .fs-nav__links {
    display: none;
  }

  .fs-nav__actions {
    justify-self: end;
  }

  .fs-nav__burger {
    display: flex;
  }
}

/* The pill is the first thing to go when the bar gets tight: between 1280 and
   1359 the six links plus the CTA need the room, and the language switch is
   still one scroll away in the footer. Below 1280 the drawer carries BG / EN. */
@media (max-width: 1359px) {
  .fs-nav__lang-btn {
    display: none;
  }
}

@media (max-width: 640px) {
  .fs-nav__actions {
    gap: 6px;
  }

  .fs-nav__cta {
    --btn-h: 38px;
    --btn-px: 16px;
    --btn-fs: 0.75rem;
  }
}

@media (max-width: 380px) {
  .fs-nav__cta {
    display: none;
  }
}
</style>
