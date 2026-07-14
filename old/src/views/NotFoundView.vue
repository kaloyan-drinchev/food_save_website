<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const { t } = useI18n()

onMounted(() => {
  document.title = `FoodSave — 404`
})
</script>

<template>
  <AppNavbar />

  <section class="not-found-section">
    <div class="container not-found-container">
      <span class="not-found-code">404</span>
      <h1 class="not-found-title">{{ t('notFound.title') }}</h1>
      <p class="not-found-text">{{ t('notFound.text') }}</p>
      <RouterLink to="/" class="btn-primary not-found-btn">
        {{ t('notFound.button') }}
      </RouterLink>
    </div>
  </section>

  <AppFooter />
</template>
