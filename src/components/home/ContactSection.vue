<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section id="contact" class="fade-in">
    <div class="container">
      <div class="section-header centered">
        <span class="section-label">{{ t('contact.label') }}</span>
        <h2 class="section-title">{{ t('contact.title') }}</h2>
        <p class="section-subtitle">{{ t('contact.subtitle') }}</p>
      </div>
      <div class="contact-grid">
        <div class="contact-card">
          <div class="contact-card-icon">📧</div>
          <h3 class="contact-card-title">{{ t('contact.email_title') }}</h3>
          <p class="contact-card-value"><a :href="'mailto:' + t('contact.email_value')">{{ t('contact.email_value') }}</a></p>
        </div>
        <div class="contact-card">
          <div class="contact-card-icon">🤝</div>
          <h3 class="contact-card-title">{{ t('contact.business_title') }}</h3>
          <p class="contact-card-value"><a :href="'mailto:' + t('contact.business_value')">{{ t('contact.business_value') }}</a></p>
        </div>
        <div class="contact-card">
          <div class="contact-card-icon">⚖️</div>
          <h3 class="contact-card-title">{{ t('contact.legal_title') }}</h3>
          <p class="contact-card-value"><a :href="'mailto:' + t('contact.legal_value')">{{ t('contact.legal_value') }}</a></p>
        </div>
        <div class="contact-card">
          <div class="contact-card-icon">📱</div>
          <h3 class="contact-card-title">{{ t('contact.social_title') }}</h3>
          <p class="contact-card-value">{{ t('contact.social_value') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
