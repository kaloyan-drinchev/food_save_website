<script setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { setLocale } from '@/i18n'
import { footerColumns, social } from '@/content/site'
import SiteLogo from './SiteLogo.vue'
import SiteBrandIcon from './SiteBrandIcon.vue'

const { t, locale } = useI18n()

const switchLang = setLocale
</script>

<template>
  <footer class="fs-footer">
    <div class="fs-container fs-footer__inner">
      <div class="fs-footer__brand">
        <RouterLink to="/" aria-label="FoodSave"><SiteLogo /></RouterLink>
        <div class="fs-footer__social">
          <a :href="social.instagram" target="_blank" rel="noopener" :aria-label="t('hp.footer.instagram')">
            <SiteBrandIcon name="instagram" size="1.4rem" />
          </a>
          <a :href="social.facebook" target="_blank" rel="noopener" :aria-label="t('hp.footer.facebook')">
            <SiteBrandIcon name="facebook" size="1.4rem" />
          </a>
        </div>
      </div>

      <nav
        v-for="(col, i) in footerColumns"
        :key="col.title"
        class="fs-footer__col"
        :class="`fs-footer__col--${i + 1}`"
        :aria-label="t(col.title)"
      >
        <h2 class="fs-footer__title">{{ t(col.title) }}</h2>
        <ul>
          <li v-for="l in col.links" :key="l.key">
            <RouterLink :to="l.to">{{ t(l.key) }}</RouterLink>
          </li>
        </ul>
      </nav>
    </div>

    <div class="fs-container fs-footer__bottom">
      <p>{{ t('hp.footer.copyright') }}</p>
      <div class="fs-footer__lang" role="group" :aria-label="t('hp.nav.language')">
        <button type="button" :class="{ 'is-active': locale === 'bg' }" @click="switchLang('bg')">BG</button>
        <span aria-hidden="true">/</span>
        <button type="button" :class="{ 'is-active': locale === 'en' }" @click="switchLang('en')">EN</button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.fs-footer {
  margin: 0;
  padding: clamp(40px, 2rem + 3vw, 80px) 0 28px;
  border: 0;
  background: var(--fs-bg);
  color: var(--fs-body);
}

.fs-footer__inner {
  display: grid;
  grid-template-columns: minmax(200px, 1fr) repeat(4, auto);
  gap: 32px clamp(24px, 1rem + 3vw, 64px);
  align-items: start;
}

.fs-footer__brand {
  --fs-logo-w: clamp(150px, 9rem + 3vw, 200px);
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.fs-footer__social {
  display: flex;
  gap: 22px;
  font-size: 1.5rem;
  color: var(--fs-teal);
}

.fs-footer__social a {
  display: grid;
  place-items: center;
  transition: color var(--fs-transition);
}

.fs-footer__social a:hover {
  color: var(--fs-orange);
}

.fs-footer__title {
  margin-bottom: 4px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--fs-teal);
}

.fs-footer__col ul {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.fs-footer__col a {
  display: inline-block;
  padding: 2px 0;
  font-size: 1rem;
  line-height: 1.35;
  color: var(--fs-body);
  transition: color var(--fs-transition);
}

.fs-footer__col a:hover {
  color: var(--fs-orange);
}

.fs-footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: clamp(28px, 2rem + 1vw, 48px);
  font-size: var(--fs-xsmall);
  color: var(--fs-note);
}

.fs-footer__lang {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fs-footer__lang button {
  padding: 2px;
  border: 0;
  background: transparent;
  font-weight: 600;
  color: var(--fs-body-soft);
  cursor: pointer;
  transition: color var(--fs-transition);
}

.fs-footer__lang button.is-active,
.fs-footer__lang button:hover {
  color: var(--fs-orange);
}

/* ── Responsive ── */
@media (max-width: 1200px) {
  .fs-footer__inner {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .fs-footer__brand {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

/* Two link columns, brand row at the bottom (mobile mockup) */
@media (max-width: 900px) {
  .fs-footer__inner {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 36px 24px;
  }

  .fs-footer__col--1 {
    order: 1;
  }

  .fs-footer__col--3 {
    order: 2;
  }

  .fs-footer__col--2 {
    order: 3;
  }

  .fs-footer__col--4 {
    order: 4;
  }

  .fs-footer__brand {
    order: 5;
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
  }
}

@media (max-width: 480px) {
  .fs-footer__bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
