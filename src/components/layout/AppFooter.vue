<script setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
const { t } = useI18n()
</script>

<template>
  <footer>
    <div class="container footer-inner">
      <div class="footer-logo">
        <img src="/assets/images/logo.svg" alt="FoodSave" class="footer-logo-img" />
      </div>
      <p class="footer-copy">{{ t('footer.tagline') }}</p>
      <nav class="footer-links" aria-label="Footer links">
        <RouterLink to="/privacy">{{ t('footer.privacy') }}</RouterLink>
        <RouterLink to="/terms">{{ t('footer.terms') }}</RouterLink>
        <RouterLink to="/#contact">{{ t('footer.contact') }}</RouterLink>
      </nav>
      <p class="footer-copy">{{ t('footer.copy') }}</p>
    </div>
  </footer>
</template>
