<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

defineProps({
  activePage: { type: String, default: '' },
})

const { t, locale } = useI18n()
const { theme, toggle: toggleTheme } = useTheme()
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

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
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
          to="/#about"
          class="nav-link"
          :class="{ 'active-link': activePage === 'about' }"
        >
          {{ t('nav.about') }}
        </RouterLink>
        <RouterLink
          to="/#faq"
          class="nav-link"
          :class="{ 'active-link': activePage === 'faq' }"
        >
          {{ t('nav.faq') }}
        </RouterLink>
        <RouterLink
          to="/#download"
          class="nav-link"
          :class="{ 'active-link': activePage === 'download' }"
        >
          {{ t('nav.download') }}
        </RouterLink>
        <RouterLink
          to="/privacy"
          class="nav-link"
          :class="{ 'active-link': activePage === 'privacy' }"
        >
          {{ t('nav.privacy') }}
        </RouterLink>
        <RouterLink to="/terms" class="nav-link" :class="{ 'active-link': activePage === 'terms' }">
          {{ t('nav.terms') }}
        </RouterLink>
        <RouterLink
          to="/#contact"
          class="nav-link"
          :class="{ 'active-link': activePage === 'contact' }"
        >
          {{ t('nav.contact') }}
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
        <RouterLink to="/#about" @click="closeMenu">{{ t('nav.about') }}</RouterLink>
        <RouterLink to="/#faq" @click="closeMenu">{{ t('nav.faq') }}</RouterLink>
        <RouterLink to="/#download" @click="closeMenu">{{ t('nav.download') }}</RouterLink>
        <RouterLink to="/privacy" @click="closeMenu">{{ t('nav.privacy') }}</RouterLink>
        <RouterLink to="/terms" @click="closeMenu">{{ t('nav.terms') }}</RouterLink>
        <RouterLink to="/#contact" @click="closeMenu">{{ t('nav.contact') }}</RouterLink>
      </div>
      <div class="mobile-menu-footer">
        <div class="lang-toggle" :class="locale === 'bg' ? 'lang-active-bg' : 'lang-active-en'">
          <span class="lang-slider"></span>
          <button :class="{ active: locale === 'bg' }" @click="switchLang('bg')">🇧🇬 BG</button>
          <button :class="{ active: locale === 'en' }" @click="switchLang('en')">🇬🇧 EN</button>
        </div>
        <button class="theme-toggle" @click="toggleTheme">
          <FontAwesomeIcon :icon="theme === 'dark' ? 'sun' : 'moon'" />
        </button>
      </div>
    </div>
  </Transition>
</template>
