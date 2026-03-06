<script setup>
import { computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import bgMessages from '@/i18n/bg.js'
import enMessages from '@/i18n/en.js'

const { t, locale } = useI18n()

const localeMessages = { bg: bgMessages, en: enMessages }

// Access HTML content directly, bypassing the vue-i18n message compiler
// (the compiler mis-parses special chars like % and @ inside large HTML strings)
const termsContent = computed(
  () => localeMessages[locale.value]?.terms?.content ?? bgMessages.terms.content,
)

function updateTitle() {
  document.title = `FoodSave — ${t('terms.title')}`
}

watch(locale, updateTitle)
onMounted(updateTitle)
</script>

<template>
  <AppNavbar active-page="terms" />

  <div class="legal-page-hero">
    <div class="container">
      <div class="legal-page-hero-inner">
        <h1 class="legal-page-title">{{ t('terms.title') }}</h1>
        <p class="legal-page-subtitle">{{ t('terms.subtitle') }}</p>
      </div>
    </div>
  </div>

  <main>
    <div class="container legal-page-container">
      <div class="legal-content" v-html="termsContent"></div>
      <p class="legal-meta">{{ t('terms.updated') }}</p>
    </div>
  </main>

  <AppFooter />
</template>
