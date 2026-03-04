<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

defineProps({
  activePage: { type: String, default: '' }
})

const { t, locale } = useI18n()
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
  <div
    id="main-navbar"
    :style="{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '64px',
      zIndex: 1000, background: '#0d1f0e',
      borderBottom: '1px solid #424242',
      display: 'flex', alignItems: 'center', padding: '0 24px',
      fontFamily: &quot;'Inter', sans-serif&quot;,
      boxShadow: navShadow ? '0 4px 24px rgba(0,0,0,0.45)' : 'none'
    }"
  >
    <RouterLink to="/" style="color:#fff;text-decoration:none;font-weight:700;font-size:1.1rem;margin-right:auto">
      FoodSave
    </RouterLink>

    <div class="nav-desktop-links">
      <RouterLink to="/#about" style="color:#bdbdbd;text-decoration:none;font-size:0.85rem;padding:6px 10px" :style="activePage === 'about' ? {color:'#69f0ae'} : {}">
        {{ t('nav.about') }}
      </RouterLink>
      <RouterLink to="/#download" style="color:#bdbdbd;text-decoration:none;font-size:0.85rem;padding:6px 10px" :style="activePage === 'download' ? {color:'#69f0ae'} : {}">
        {{ t('nav.download') }}
      </RouterLink>
      <RouterLink to="/privacy" style="color:#bdbdbd;text-decoration:none;font-size:0.85rem;padding:6px 10px" :style="activePage === 'privacy' ? {color:'#69f0ae'} : {}">
        {{ t('nav.privacy') }}
      </RouterLink>
      <RouterLink to="/terms" style="color:#bdbdbd;text-decoration:none;font-size:0.85rem;padding:6px 10px" :style="activePage === 'terms' ? {color:'#69f0ae'} : {}">
        {{ t('nav.terms') }}
      </RouterLink>
      <RouterLink to="/#contact" style="color:#bdbdbd;text-decoration:none;font-size:0.85rem;padding:6px 10px" :style="activePage === 'contact' ? {color:'#69f0ae'} : {}">
        {{ t('nav.contact') }}
      </RouterLink>

      <div style="margin-left:auto;display:inline-flex;border:1px solid #424242;border-radius:20px;overflow:hidden">
        <button
          @click="switchLang('bg')"
          :style="{
            background: locale === 'bg' ? '#1b5e20' : 'transparent',
            color: locale === 'bg' ? '#69f0ae' : '#bdbdbd',
            border:'none',padding:'6px 14px',fontSize:'13px',fontWeight:600,cursor:'pointer'
          }"
        >BG</button>
        <button
          @click="switchLang('en')"
          :style="{
            background: locale === 'en' ? '#1b5e20' : 'transparent',
            color: locale === 'en' ? '#69f0ae' : '#bdbdbd',
            border:'none',padding:'6px 14px',fontSize:'13px',fontWeight:600,cursor:'pointer'
          }"
        >EN</button>
      </div>
    </div>

    <button
      class="nav-hamburger"
      :class="{ 'is-open': menuOpen }"
      aria-label="Menu"
      :aria-expanded="menuOpen"
      @click="toggleMenu"
    >
      <span></span><span></span><span></span>
    </button>
  </div>

  <div
    class="nav-mobile-menu"
    :class="{ open: menuOpen }"
    role="dialog"
    aria-label="Mobile navigation"
  >
    <RouterLink to="/#about" @click="closeMenu">{{ t('nav.about') }}</RouterLink>
    <RouterLink to="/#download" @click="closeMenu">{{ t('nav.download') }}</RouterLink>
    <RouterLink to="/privacy" @click="closeMenu">{{ t('nav.privacy') }}</RouterLink>
    <RouterLink to="/terms" @click="closeMenu">{{ t('nav.terms') }}</RouterLink>
    <RouterLink to="/#contact" @click="closeMenu">{{ t('nav.contact') }}</RouterLink>
    <div class="lang-toggle" style="margin-top:16px;align-self:flex-start">
      <button :class="{ active: locale === 'bg' }" @click="switchLang('bg')">BG</button>
      <button :class="{ active: locale === 'en' }" @click="switchLang('en')">EN</button>
    </div>
  </div>
</template>
