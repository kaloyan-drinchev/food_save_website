<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const items = [1, 2, 3, 4, 5]
</script>

<template>
  <section id="faq" class="fade-in">
    <div class="container">
      <div class="section-header centered">
        <span class="section-label">{{ t('faq.label') }}</span>
        <div class="section-divider"></div>
        <h2 class="section-title">{{ t('faq.title') }}</h2>
        <p class="section-subtitle">{{ t('faq.subtitle') }}</p>
      </div>
      <div class="faq-list">
        <details v-for="n in items" :key="n" class="faq-item">
          <summary class="faq-question">{{ t(`faq.q${n}`) }}</summary>
          <p class="faq-answer">{{ t(`faq.a${n}`) }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
