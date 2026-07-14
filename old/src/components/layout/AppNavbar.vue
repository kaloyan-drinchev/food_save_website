<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

defineProps({
  activePage: { type: String, default: '' },
})

const { t, locale } = useI18n()
const { theme, toggle: toggleTheme } = useTheme()
const router = useRouter()
const route = useRoute()
const menuOpen = ref(false)
const navShadow = ref(false)

function switchLang(lang) {
  locale.value = lang
  localStorage.setItem('foodsave-lang', lang)
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function onScroll() {
  navShadow.value = window.scrollY > 10
}

// Smooth-scroll to a section without writing the hash into the URL.
async function scrollToSection(id) {
  closeMenu()
  if (route.path !== '/') {
    await router.push('/')
  }
  // Wait one frame so the target exists if we just navigated.
  requestAnimationFrame(() => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  // Strip any leftover hash on the homepage so reloads land at /.
  if (route.path === '/' && window.location.hash) {
    history.replaceState(null, '', '/')
  }
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <nav id="main-navbar" class="navbar-glass" :class="{ scrolled: navShadow }">
    <RouterLink to="/" class="nav-brand">
      <img src="/assets/images/logo.svg" alt="FoodSave" class="nav-logo" />
    </RouterLink>

    <div class="nav-desktop-links">
      <div class="nav-pill-group">
        <RouterLink
          to="/for-businesses"
          class="nav-link"
          :class="{ 'active-link': activePage === 'for-businesses' }"
        >
          {{ t('landing.bs_label') }}
        </RouterLink>
        <RouterLink
          to="/for-clients"
          class="nav-link"
          :class="{ 'active-link': activePage === 'for-clients' }"
        >
          {{ t('landing.cf_label') }}
        </RouterLink>
        <RouterLink to="/privacy" class="nav-link">
          {{ t('nav.privacy') }}
        </RouterLink>
        <RouterLink to="/terms" class="nav-link">
          {{ t('nav.terms') }}
        </RouterLink>
      </div>
    </div>

    <div class="nav-right-group">
      <div class="lang-toggle" :class="locale === 'bg' ? 'lang-active-bg' : 'lang-active-en'">
        <span class="lang-slider"></span>
        <button :class="{ active: locale === 'bg' }" @click="switchLang('bg')">BG</button>
        <button :class="{ active: locale === 'en' }" @click="switchLang('en')">EN</button>
      </div>

      <button
        class="theme-toggle"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleTheme"
      >
        <FontAwesomeIcon :icon="theme === 'dark' ? 'sun' : 'moon'" />
      </button>

      <button class="nav-hamburger" aria-label="Menu" :aria-expanded="menuOpen" @click="toggleMenu">
        <FontAwesomeIcon :icon="menuOpen ? 'xmark' : 'bars'" />
      </button>
    </div>
  </nav>

  <Transition name="mobile-menu">
    <div v-if="menuOpen" class="nav-mobile-menu" role="dialog" aria-label="Mobile navigation">
      <div class="mobile-menu-links">
        <RouterLink to="/for-businesses" @click="closeMenu">{{ t('landing.bs_label') }}</RouterLink>
        <RouterLink to="/for-clients" @click="closeMenu">{{ t('landing.cf_label') }}</RouterLink>
        <RouterLink to="/privacy" @click="closeMenu">{{ t('nav.privacy') }}</RouterLink>
        <RouterLink to="/terms" @click="closeMenu">{{ t('nav.terms') }}</RouterLink>
      </div>
      <div class="mobile-menu-footer">
        <div class="lang-toggle" :class="locale === 'bg' ? 'lang-active-bg' : 'lang-active-en'">
          <span class="lang-slider"></span>
          <button :class="{ active: locale === 'bg' }" @click="switchLang('bg')">BG</button>
          <button :class="{ active: locale === 'en' }" @click="switchLang('en')">EN</button>
        </div>
        <button class="theme-toggle" @click="toggleTheme">
          <FontAwesomeIcon :icon="theme === 'dark' ? 'sun' : 'moon'" />
        </button>
      </div>
    </div>
  </Transition>
</template>
