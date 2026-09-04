<script setup>
import { computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SiteShell from '@/components/site/SiteShell.vue'
import { getMessages } from '@/i18n'

const { t, locale } = useI18n()

// Access HTML content directly, bypassing the vue-i18n message compiler
// (the compiler mis-parses special chars like % and @ inside large HTML strings)
const privacyContent = computed(() => getMessages(locale.value)?.privacy?.content ?? '')

function updateTitle() {
  document.title = `FoodSave — ${t('privacy.title')}`
}

watch(locale, updateTitle)
onMounted(updateTitle)
</script>

<template>
  <SiteShell>

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
      <div class="legal-content" v-html="privacyContent"></div>
      <p class="legal-meta">{{ t('privacy.updated') }}</p>
    </div>
  </main>

  </SiteShell>
</template>
