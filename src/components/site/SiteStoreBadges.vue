<script setup>
import { useI18n } from 'vue-i18n'
import { stores } from '@/content/site'
import SiteBrandIcon from './SiteBrandIcon.vue'

/**
 * "Available on the App Store" / "Android app on Google Play" badges.
 * Until the store links exist (src/content/site.js → stores) the badges
 * render as inert, titled elements rather than dead links.
 */
const { t } = useI18n()

const badges = [
  { key: 'apple', href: stores.appStore, icon: 'apple', top: 'hp.badges.appleTop', main: 'hp.badges.appleMain' },
  { key: 'play', href: stores.googlePlay, icon: 'googlePlay', top: 'hp.badges.playTop', main: 'hp.badges.playMain' },
]
</script>

<template>
  <div class="fs-badges">
    <component
      :is="b.href ? 'a' : 'span'"
      v-for="b in badges"
      :key="b.key"
      class="fs-badge"
      :class="`fs-badge--${b.key}`"
      :href="b.href || null"
      :target="b.href ? '_blank' : null"
      :rel="b.href ? 'noopener' : null"
      :title="b.href ? null : t('hp.common.comingSoonStore')"
    >
      <SiteBrandIcon :name="b.icon" class="fs-badge__icon" />
      <span class="fs-badge__text">
        <span class="fs-badge__top">{{ t(b.top) }}</span>
        <span class="fs-badge__main">{{ t(b.main) }}</span>
      </span>
    </component>
  </div>
</template>

<style scoped>
.fs-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.fs-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: clamp(44px, 2.5rem + 0.6vw, 52px);
  padding: 0 16px 0 12px;
  border-radius: 10px;
  background: linear-gradient(180deg, #2a2a2a 0%, #151515 100%);
  color: #fff;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.08) inset;
  transition:
    transform var(--fs-transition),
    opacity var(--fs-transition);
}

a.fs-badge:hover {
  transform: translateY(-1px);
}

.fs-badge__icon {
  flex: none;
  height: 1.6rem;
  width: auto;
}

.fs-badge--apple .fs-badge__icon {
  height: 1.75rem;
}

.fs-badge__text {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.fs-badge__top {
  font-size: 0.6875rem;
  letter-spacing: 0.01em;
  opacity: 0.95;
}

.fs-badge--play .fs-badge__top {
  font-size: 0.5625rem;
  letter-spacing: 0.04em;
}

.fs-badge__main {
  font-size: 1.1875rem;
  font-weight: 500;
  letter-spacing: -0.01em;
}

@media (max-width: 640px) {
  .fs-badges {
    gap: 10px;
  }

  .fs-badge {
    height: 42px;
    padding: 0 12px 0 10px;
    gap: 8px;
  }

  .fs-badge__icon,
  .fs-badge--apple .fs-badge__icon {
    height: 1.3rem;
  }

  .fs-badge__main {
    font-size: 1rem;
  }
}
</style>
