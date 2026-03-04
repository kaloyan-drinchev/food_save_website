<script setup>
import { watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const { t, locale } = useI18n()

function updateTitle() {
  document.title = `FoodSave — ${t('privacy.title')}`
}

watch(locale, updateTitle)
onMounted(updateTitle)
</script>

<template>
  <AppNavbar active-page="privacy" />

  <div class="legal-page-hero">
    <div class="container">
      <div class="legal-page-hero-inner">
        <h1 class="legal-page-title">{{ t('privacy.title') }}</h1>
        <p class="legal-page-subtitle">{{ t('privacy.subtitle') }}</p>
      </div>
    </div>
  </div>

  <main>
    <div class="container legal-page-container">
      <div class="legal-content" v-html="t('privacy.content')"></div>
      <p class="legal-meta">{{ t('privacy.updated') }}</p>
    </div>
  </main>

  <AppFooter />
</template>
