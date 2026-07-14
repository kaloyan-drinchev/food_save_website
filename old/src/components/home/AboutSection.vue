<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section id="about" class="fade-in">
    <div class="container">
      <div class="section-header centered">
        <span class="section-label">{{ t('about.label') }}</span>
        <div class="section-divider"></div>
        <h2 class="section-title">{{ t('about.title') }}</h2>
        <p class="section-subtitle">{{ t('about.subtitle') }}</p>
      </div>
      <div class="steps-grid">
        <div v-for="n in 3" :key="n" class="step-card">
          <div class="step-number">{{ t(`about.step${n}_num`) }}</div>
          <div class="step-icon">{{ t(`about.step${n}_icon`) }}</div>
          <h3 class="step-title">{{ t(`about.step${n}_title`) }}</h3>
          <p class="step-desc">{{ t(`about.step${n}_desc`) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
