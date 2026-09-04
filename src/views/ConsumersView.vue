<script setup>
/**
 * "За потребители" — mockup FoodSave_Web_site/3_Za_Potrebiteli. Copy: `hp.consumers.*`.
 */
import { useI18n } from 'vue-i18n'
import {
  photos,
  cutouts,
  cutoutSizes,
  consumerPerks,
  consumerDiscover,
  consumerSteps,
  consumerValues,
} from '@/content/site'
import SiteShell from '@/components/site/SiteShell.vue'
import SitePhotoBanner from '@/components/site/SitePhotoBanner.vue'
import SiteButton from '@/components/site/SiteButton.vue'
import SiteStoreBadges from '@/components/site/SiteStoreBadges.vue'
import SiteSectionHead from '@/components/site/SiteSectionHead.vue'
import SiteIcon from '@/components/site/SiteIcon.vue'
import SiteSteps from '@/components/site/SiteSteps.vue'
import SiteFaq from '@/components/site/SiteFaq.vue'
import SiteCtaBand from '@/components/site/SiteCtaBand.vue'

const { t } = useI18n()
</script>

<template>
  <SiteShell active="consumers" title-key="hp.meta.consumers">
    <!-- ── Hero ── -->
    <section class="cons-hero">
      <span class="cons-hero__tab" aria-hidden="true"></span>
      <div class="fs-container">
        <SitePhotoBanner
          :src="photos.heroConsumers"
          :alt="t('hp.consumers.hero.bannerAlt')"
          position="center 55%"
          eager
        />

        <div class="cons-hero__grid">
          <div class="cons-hero__copy">
            <h1 class="fs-display cons-hero__title">
              {{ t('hp.consumers.hero.title1') }}<br />{{ t('hp.consumers.hero.title2') }}
            </h1>
            <p class="fs-lead cons-hero__lead">{{ t('hp.consumers.hero.lead') }}</p>
            <SiteButton variant="orange" href="#fs-download" class="cons-hero__btn">
              {{ t('hp.common.downloadApp') }}
            </SiteButton>
            <SiteStoreBadges />
          </div>
          <div class="cons-hero__art">
            <img
              :src="cutouts.phonePlates"
              :width="cutoutSizes.phonePlates[0]"
              :height="cutoutSizes.phonePlates[1]"
              :alt="t('hp.cta.photoAlt')"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ── Perks ── -->
    <section class="fs-section cons-perks">
      <div class="fs-container">
        <div class="cons-perks__grid">
          <article v-for="p in consumerPerks" :key="p.n" class="cons-perks__card">
            <span class="fs-num cons-perks__num">{{ p.n }}</span>
            <h2 class="cons-perks__title">{{ t(p.title) }}</h2>
            <p class="cons-perks__text">{{ t(p.text) }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ── Какво може да откриеш ── -->
    <section class="fs-section fs-section--flush-top cons-discover">
      <div class="fs-container">
        <SiteSectionHead :title="t('hp.consumers.discover.title')" />
        <div class="cons-discover__grid">
          <article v-for="d in consumerDiscover" :key="d.title" class="cons-discover__card">
            <SiteIcon :name="d.icon" size="clamp(44px, 2.5rem + 1.2vw, 60px)" />
            <h3 class="cons-discover__title">{{ t(d.title) }}</h3>
            <p class="cons-discover__text">{{ t(d.text) }}</p>
            <img
              class="cons-discover__cutout"
              :src="cutouts[d.cutout]"
              :width="cutoutSizes[d.cutout][0]"
              :height="cutoutSizes[d.cutout][1]"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </article>
        </div>
      </div>
    </section>

    <!-- ── Как работи FoodSave за теб ── -->
    <section id="fs-how" class="fs-section cons-how">
      <div class="fs-container">
        <SiteSectionHead tight>
          <template #title>
            {{ t('hp.consumers.how.titleLead') }}<span class="fs-accent">{{ t('hp.consumers.how.titleAccent') }}</span>{{ t('hp.consumers.how.titleTail') }}
          </template>
        </SiteSectionHead>
        <SiteSteps :steps="consumerSteps" />
      </div>
    </section>

    <!-- ── По-добра цена не означава по-ниско качество ── -->
    <section class="fs-section fs-section--flush-top cons-banner">
      <div class="fs-container">
        <SitePhotoBanner :src="photos.bannerConsumers" :alt="t('hp.consumers.banner.photoAlt')" overlay="light" position="center 20%">
          <h2 class="fs-banner__title cons-banner__title">
            {{ t('hp.consumers.banner.lead') }}
            <span class="fs-accent">{{ t('hp.consumers.banner.accent') }}</span><br />
            {{ t('hp.consumers.banner.tail') }}
          </h2>
        </SitePhotoBanner>
      </div>
    </section>

    <!-- ── Една поръчка. Повече стойност ── -->
    <section class="fs-section cons-value">
      <div class="fs-container">
        <SiteSectionHead :title="t('hp.consumers.value.title')" :subtitle="t('hp.consumers.value.text')" />
        <ul class="cons-value__bar">
          <li v-for="v in consumerValues" :key="v.label" class="cons-value__item">
            <SiteIcon :name="v.icon" size="clamp(44px, 2.5rem + 1.2vw, 60px)" />
            <span class="cons-value__label">{{ t(v.label) }}</span>
          </li>
        </ul>
      </div>
    </section>

    <SiteFaq />
    <SiteCtaBand />
  </SiteShell>
</template>

<style scoped>
/* ── Hero ── */
.cons-hero {
  position: relative;
}

/* Small teal tab pinned to the viewport's left edge beside the banner. */
.cons-hero__tab {
  position: absolute;
  left: 0;
  top: clamp(40px, 4rem + 2vw, 110px);
  width: clamp(20px, 2rem + 1.5vw, 58px);
  height: clamp(60px, 4rem + 4vw, 124px);
  background: var(--fs-teal);
  border-radius: 0 4px 4px 0;
}

.cons-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(24px, 2rem + 2vw, 64px);
  padding-top: clamp(28px, 1.5rem + 3vw, 72px);
}

.cons-hero__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: clamp(0px, 4vw, 58px);
}

.cons-hero__title {
  white-space: nowrap;
}

.cons-hero__lead {
  margin-top: clamp(18px, 1rem + 1.4vw, 38px);
  max-width: 44ch;
}

.cons-hero__btn {
  margin-top: clamp(22px, 1.25rem + 1.6vw, 44px);
  min-width: min(100%, 240px);
}

.cons-hero__copy :deep(.fs-badges) {
  margin-top: clamp(22px, 1.25rem + 1.6vw, 44px);
}

.cons-hero__art {
  display: flex;
  justify-content: center;
}

.cons-hero__art img {
  width: min(100%, 610px);
  height: auto;
  filter: drop-shadow(0 30px 40px rgba(0, 0, 0, 0.28));
}

/* ── Perks ── */
.cons-perks__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--fs-gap);
  padding-top: 30px;
}

.cons-perks__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: clamp(200px, 10rem + 6vw, 290px);
  padding: clamp(60px, 2.5rem + 3.6vw, 92px) clamp(22px, 1rem + 1.5vw, 40px) clamp(24px, 1.25rem + 1vw, 40px);
  border-radius: var(--fs-radius-xl);
  background: var(--fs-teal);
  color: var(--fs-white);
  text-align: center;
}

.cons-perks__num {
  --fs-num-size: clamp(56px, 3rem + 2.2vw, 80px);
  position: absolute;
  top: calc(var(--fs-num-size) * -0.25);
  left: 50%;
  transform: translateX(-50%);
}

.cons-perks__title {
  color: var(--fs-white);
  font-size: clamp(1.375rem, 1.1rem + 1vw, 1.875rem);
}

.cons-perks__text {
  margin-top: clamp(12px, 0.5rem + 0.8vw, 22px);
  max-width: 34ch;
}

/* ── Discover ── */
.cons-discover__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--fs-gap);
}

.cons-discover__card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: clamp(22px, 1.25rem + 1.2vw, 38px) clamp(18px, 1rem + 0.8vw, 28px) clamp(120px, 6rem + 5vw, 170px);
  border-radius: var(--fs-radius-xl);
  background: var(--fs-card);
}

.cons-discover__title {
  margin-top: clamp(18px, 1rem + 1.2vw, 34px);
  font-size: clamp(1.25rem, 1rem + 1vw, 1.875rem);
  line-height: 1.12;
}

.cons-discover__text {
  margin-top: clamp(10px, 0.5rem + 0.6vw, 18px);
  max-width: 24ch;
  color: var(--fs-body);
}

/* Sized by height so every cut-out fills the same slot regardless of its aspect ratio. */
.cons-discover__cutout {
  position: absolute;
  right: -3%;
  bottom: -1%;
  height: clamp(120px, 6rem + 5vw, 170px);
  width: auto;
  max-width: 94%;
  object-fit: contain;
  object-position: right bottom;
  pointer-events: none;
}

/* ── How ── */
.cons-how {
  scroll-margin-top: var(--fs-nav-h);
}

.cons-how :deep(.fs-head__title) {
  text-wrap: balance;
}

/* ── Banner: teal headline on the light photo, as in the mockup ── */
.cons-banner {
  --fs-banner-title-color: var(--fs-teal);
}

/* ── Value bar ── */
.cons-value__bar {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: clamp(18px, 1rem + 1vw, 30px) 0;
  border-radius: var(--fs-radius-md);
  background: var(--fs-pill);
}

.cons-value__item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(14px, 0.75rem + 1vw, 28px);
  padding: 8px clamp(16px, 1rem + 1vw, 32px);
}

.cons-value__item + .cons-value__item {
  border-left: 1px solid var(--fs-line-on-pill);
}

.cons-value__label {
  font-size: clamp(1.125rem, 0.9rem + 0.9vw, 1.75rem);
  font-weight: 700;
  line-height: 1.15;
  color: var(--fs-teal);
  max-width: 16ch;
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .cons-discover__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .cons-hero__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .cons-hero__copy {
    padding-left: 0;
  }

  .cons-hero__art {
    order: -1;
  }

  .cons-hero__art img {
    width: min(80%, 420px);
  }

  .cons-perks__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 44px;
  }

  .cons-perks__card {
    min-height: 0;
  }

  /* Mobile mockup: rows share one left edge, centred in the bar, short dividers. */
  .cons-value__bar {
    grid-template-columns: minmax(0, max-content);
    justify-content: center;
    padding: 12px 0;
  }

  .cons-value__item {
    position: relative;
    justify-content: flex-start;
    padding: 20px 24px;
  }

  .cons-value__item + .cons-value__item {
    border-left: 0;
  }

  .cons-value__item + .cons-value__item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 1px;
    transform: translateX(-50%);
    background: var(--fs-line-on-pill);
  }
}

@media (max-width: 640px) {
  .cons-hero__art {
    order: 0;
  }

  .cons-hero__art img {
    width: min(92%, 380px);
  }

  .cons-discover__card {
    padding-bottom: clamp(120px, 34vw, 160px);
  }

  .cons-discover__cutout {
    height: clamp(120px, 34vw, 160px);
    max-width: 92%;
  }
}
</style>
