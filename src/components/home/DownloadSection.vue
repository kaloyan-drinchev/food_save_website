<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section id="download" class="fade-in">
    <div class="container">
      <div class="section-header centered">
        <span class="section-label">{{ t('download.label') }}</span>
        <div class="section-divider"></div>
        <h2 class="section-title">{{ t('download.title') }}</h2>
        <p class="section-subtitle">{{ t('download.subtitle') }}</p>
      </div>
      <div class="download-grid">
        <div class="download-card card-client">
          <div class="download-card-icon">📱</div>
          <h3 class="download-card-title">{{ t('download.client_title') }}</h3>
          <p class="download-card-desc">{{ t('download.client_desc') }}</p>
          <div class="store-badges">
            <div class="store-badge">
              <span class="badge-icon">▶</span>
              <div><div class="badge-text-sm">{{ t('download.play_label') }}</div><div class="badge-text-lg">{{ t('download.play_store') }}</div></div>
              <span class="coming-soon-pill">{{ t('download.coming_soon') }}</span>
            </div>
            <div class="store-badge">
              <span class="badge-icon" style="font-size:1.6rem">🍎</span>
              <div><div class="badge-text-sm">{{ t('download.apple_label') }}</div><div class="badge-text-lg">{{ t('download.apple_store') }}</div></div>
              <span class="coming-soon-pill">{{ t('download.coming_soon') }}</span>
            </div>
          </div>
        </div>
        <div class="download-card card-business">
          <div class="download-card-icon">🏪</div>
          <h3 class="download-card-title">{{ t('download.business_title') }}</h3>
          <p class="download-card-desc">{{ t('download.business_desc') }}</p>
          <div class="store-badges">
            <div class="store-badge">
              <span class="badge-icon">▶</span>
              <div><div class="badge-text-sm">{{ t('download.play_label') }}</div><div class="badge-text-lg">{{ t('download.play_store') }}</div></div>
              <span class="coming-soon-pill">{{ t('download.coming_soon') }}</span>
            </div>
            <div class="store-badge">
              <span class="badge-icon" style="font-size:1.6rem">🍎</span>
              <div><div class="badge-text-sm">{{ t('download.apple_label') }}</div><div class="badge-text-lg">{{ t('download.apple_store') }}</div></div>
              <span class="coming-soon-pill">{{ t('download.coming_soon') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
