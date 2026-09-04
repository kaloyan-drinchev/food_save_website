<script setup>
/**
 * "За бизнеса" — mockup FoodSave_Web_site/4_Za_Biznesa. Copy: `hp.business.*`.
 */
import { useI18n } from 'vue-i18n'
import {
  photos,
  cutouts,
  cutoutSizes,
  businessWhy,
  businessSteps,
  businessTypes,
  businessTerms,
} from '@/content/site'
import SiteShell from '@/components/site/SiteShell.vue'
import SitePhotoBanner from '@/components/site/SitePhotoBanner.vue'
import SiteButton from '@/components/site/SiteButton.vue'
import SiteSectionHead from '@/components/site/SiteSectionHead.vue'
import SiteIcon from '@/components/site/SiteIcon.vue'
import SiteSteps from '@/components/site/SiteSteps.vue'
import SiteFaq from '@/components/site/SiteFaq.vue'
import SiteCtaBand from '@/components/site/SiteCtaBand.vue'

const { t } = useI18n()

const partnerLink = { path: '/contact', query: { topic: 'business' } }
</script>

<template>
  <SiteShell active="business" title-key="hp.meta.business">
    <!-- ── Hero ── -->
    <section class="biz-hero">
      <div class="fs-container">
        <SitePhotoBanner
          :src="photos.heroBusiness"
          :alt="t('hp.business.hero.bannerAlt')"
          position="center 42%"
          eager
        />

        <div class="biz-hero__grid">
          <div class="biz-hero__copy">
            <h1 class="fs-display biz-hero__title">
              {{ t('hp.business.hero.titleLead') }}
              <span class="fs-accent biz-hero__accent">{{ t('hp.business.hero.titleAccent') }}</span>
            </h1>
            <p class="fs-lead biz-hero__lead">{{ t('hp.business.hero.lead') }}</p>
            <SiteButton variant="orange" :to="partnerLink" class="biz-hero__btn">
              {{ t('hp.common.becomePartner') }}
            </SiteButton>
          </div>

          <figure class="biz-hero__photo" :class="{ 'biz-hero__photo--stand-in': !photos.bakerAtCounter }">
            <img
              v-if="photos.bakerAtCounter"
              :src="photos.bakerAtCounter"
              :alt="t('hp.photo.bakerAtCounter')"
              decoding="async"
            />
            <img
              v-else
              class="biz-hero__cutout"
              :src="cutouts.manTablet"
              :width="cutoutSizes.manTablet[0]"
              :height="cutoutSizes.manTablet[1]"
              :alt="t('hp.photo.bakerAtCounter')"
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </section>

    <!-- ── Защо FoodSave има смисъл ── -->
    <section class="fs-section biz-why">
      <div class="fs-container">
        <SiteSectionHead :title="t('hp.business.why.title')" />
        <div class="biz-why__grid">
          <article v-for="w in businessWhy" :key="w.title" class="biz-why__card" :class="`biz-why__card--${w.tone}`">
            <SiteIcon :name="w.icon" size="56px" circle="white" circle-size="clamp(80px, 5rem + 1vw, 100px)" />
            <h3 class="biz-why__title">{{ t(w.title) }}</h3>
            <p class="biz-why__text">{{ t(w.text) }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ── Как работи FoodSave за вашия обект? ── -->
    <section id="fs-how" class="fs-section fs-section--flush-top biz-how">
      <div class="fs-container">
        <SiteSectionHead :title="t('hp.business.how.title')" :subtitle="t('hp.business.how.subtitle')" />
        <SiteSteps :steps="businessSteps" />
      </div>
    </section>

    <!-- ── По-добра цена не означава по-ниско качество ── -->
    <section class="fs-section fs-section--flush-top biz-banner">
      <div class="fs-container">
        <SitePhotoBanner :src="photos.bannerBusiness" :alt="t('hp.business.banner.photoAlt')" overlay="dark" position="center 40%">
          <h2 class="fs-banner__title biz-banner__title">{{ t('hp.business.banner.title') }}</h2>
        </SitePhotoBanner>
      </div>
    </section>

    <!-- ── За какви бизнеси е FoodSave? ── -->
    <section class="fs-section biz-types">
      <div class="fs-container">
        <SiteSectionHead :title="t('hp.business.types.title')" :subtitle="t('hp.business.types.subtitle')" />
        <div class="biz-types__grid">
          <article v-for="b in businessTypes" :key="b.title" class="biz-types__card">
            <div class="biz-types__photo" :class="{ 'biz-types__photo--stand-in': !photos[b.photo] }">
              <img v-if="photos[b.photo]" :src="photos[b.photo]" :alt="t('hp.photo.type')" loading="lazy" decoding="async" />
              <img
                v-else-if="b.cutout"
                class="biz-types__cutout"
                :src="cutouts[b.cutout]"
                :width="cutoutSizes[b.cutout][0]"
                :height="cutoutSizes[b.cutout][1]"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <span class="biz-types__tab">
                <SiteIcon :name="b.icon" size="clamp(34px, 2rem + 0.8vw, 46px)" />
              </span>
            </div>
            <h3 class="biz-types__title">{{ t(b.title) }}</h3>
            <p class="biz-types__text">{{ t(b.text) }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ── Условията за партньорство ── -->
    <section class="fs-section fs-section--flush-top biz-terms">
      <div class="fs-container">
        <SiteSectionHead :title="t('hp.business.terms.title')" />
        <div class="biz-terms__box">
          <div v-for="row in [businessTerms.slice(0, 2), businessTerms.slice(2)]" :key="row[0].n" class="biz-terms__row">
            <div v-for="item in row" :key="item.n" class="biz-terms__cell">
              <span class="biz-terms__n">{{ item.n }}</span>
              <div>
                <h3 class="biz-terms__title">{{ t(item.title) }}</h3>
                <p class="biz-terms__text">{{ t(item.text) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <SiteFaq />
    <SiteCtaBand />
  </SiteShell>
</template>

<style scoped>
/* ── Hero ── */
.biz-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  align-items: start;
  gap: clamp(24px, 2rem + 2vw, 64px);
  padding-top: clamp(28px, 1.5rem + 3vw, 72px);
}

.biz-hero__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: clamp(0px, 4vw, 58px);
}

.biz-hero__title {
  max-width: 16ch;
  /* 60px at 1440: "Превърнете / непродадената / храна в стойност" */
  font-size: clamp(2.25rem, 0.75rem + 3.35vw, 3.75rem);
}

.biz-hero__accent {
  white-space: nowrap;
}

.biz-hero__lead {
  margin-top: clamp(18px, 1rem + 1.4vw, 38px);
  max-width: 44ch;
}

.biz-hero__btn {
  margin-top: clamp(22px, 1.25rem + 1.6vw, 44px);
  min-width: min(100%, 240px);
}

/* Photo bleeds to the right edge with a soft top-left / big bottom-left curve. */
.biz-hero__photo {
  position: relative;
  overflow: hidden;
  aspect-ratio: 673 / 410;
  margin-right: calc(-1 * var(--fs-gutter));
  border-radius: clamp(40px, 3rem + 3vw, 96px) 0 0 clamp(80px, 5rem + 7vw, 200px);
  background: var(--fs-card);
}

.biz-hero__photo > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.biz-hero__photo--stand-in {
  background:
    radial-gradient(70% 55% at 30% 25%, rgba(255, 236, 210, 0.7), transparent 65%),
    linear-gradient(180deg, #e3d2bb 0%, #b0906f 60%, #7a5a42 100%);
}

.biz-hero__photo--stand-in .biz-hero__cutout {
  position: absolute;
  left: 50%;
  bottom: -2%;
  width: auto;
  height: 104%;
  max-width: none;
  object-fit: contain;
  transform: translateX(-50%);
}

/* ── Why ── */
.biz-why__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--fs-gap);
}

.biz-why__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: clamp(300px, 15rem + 8vw, 426px);
  padding: clamp(28px, 1.5rem + 1.5vw, 44px) clamp(18px, 1rem + 1vw, 30px);
  border-radius: var(--fs-radius-lg);
  color: var(--fs-white);
  text-align: center;
}

.biz-why__card--teal {
  background: var(--fs-teal);
}

.biz-why__card--orange {
  background: var(--fs-orange);
}

.biz-why__title {
  margin-top: clamp(20px, 1rem + 1.2vw, 36px);
  color: var(--fs-white);
  font-size: clamp(1.25rem, 1rem + 0.9vw, 1.75rem);
  line-height: 1.15;
}

.biz-why__text {
  margin-top: clamp(14px, 0.75rem + 0.8vw, 26px);
  max-width: 26ch;
  font-size: var(--fs-small);
  line-height: 1.45;
}

/* ── How ── */
.biz-how {
  scroll-margin-top: var(--fs-nav-h);
}

/* ── Types ── */
.biz-types__grid {
  --cols: 5;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--fs-gap);
}

.biz-types__card {
  flex: 0 0 calc((100% - (var(--cols) - 1) * var(--fs-gap)) / var(--cols));
  min-width: 0;
}

.biz-types__photo {
  position: relative;
  aspect-ratio: 245 / 287;
  border-radius: var(--fs-radius-lg);
  overflow: visible;
  background: var(--fs-card);
}

.biz-types__photo > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.biz-types__photo--stand-in {
  background:
    radial-gradient(120% 80% at 30% 20%, rgba(255, 255, 255, 0.6), transparent 60%),
    linear-gradient(160deg, #e6e8dd 0%, #cfd6c5 100%);
}

.biz-types__cutout {
  position: absolute;
  inset: 8% 6% 14%;
  width: 88% !important;
  height: 78% !important;
  object-fit: contain !important;
  border-radius: 0 !important;
}

/* Icon tab notched into the photo's bottom-left corner (page-coloured). */
.biz-types__tab {
  position: absolute;
  left: 0;
  bottom: clamp(-22px, -1.5vw, -14px);
  display: grid;
  place-items: center;
  width: clamp(76px, 4rem + 2.8vw, 112px);
  height: clamp(54px, 3rem + 1.8vw, 76px);
  border-radius: 0 20px 20px 20px;
  background: var(--fs-bg);
  box-shadow: 0 0 0 clamp(6px, 0.6vw, 10px) var(--fs-bg);
}

.biz-types__title {
  margin-top: clamp(32px, 2rem + 1vw, 48px);
  font-size: clamp(1.0625rem, 0.95rem + 0.4vw, 1.25rem);
  line-height: 1.2;
}

.biz-types__text {
  margin-top: 10px;
  font-size: var(--fs-small);
  color: var(--fs-body);
}

/* ── Terms ── */
.biz-terms__box {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 1rem + 0.6vw, 24px);
}

.biz-terms__row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: clamp(18px, 1rem + 0.8vw, 28px) 0;
  border-radius: var(--fs-radius-lg);
  background: var(--fs-pill);
}

.biz-terms__cell {
  display: flex;
  align-items: flex-start;
  gap: clamp(16px, 1rem + 1vw, 34px);
  padding: 8px clamp(18px, 1rem + 1.5vw, 40px);
}

.biz-terms__cell + .biz-terms__cell {
  border-left: 1px solid var(--fs-line-on-pill);
}

.biz-terms__n {
  font-size: clamp(2.5rem, 1.25rem + 4vw, 4.8rem);
  font-weight: 700;
  line-height: 1;
  color: var(--fs-teal);
}

.biz-terms__title {
  font-size: clamp(1.25rem, 1rem + 1.2vw, 2.0625rem);
  line-height: 1.15;
}

.biz-terms__text {
  margin-top: 8px;
  color: var(--fs-body);
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .biz-types__grid {
    --cols: 3;
  }
}

@media (max-width: 960px) {
  .biz-why__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .biz-why__card {
    min-height: 0;
  }
}

@media (max-width: 900px) {
  .biz-hero__grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
    gap: 20px;
    align-items: start;
  }

  .biz-hero__copy {
    padding-left: 0;
  }

  .biz-hero__title {
    font-size: clamp(1.75rem, 0.5rem + 3.6vw, 2.75rem);
  }

  .biz-hero__photo {
    aspect-ratio: 4 / 5;
    margin-top: 12px;
  }
}

@media (max-width: 760px) {
  /* Mobile mockup: one continuous box, short dividers between the four items. */
  .biz-terms__box {
    gap: 0;
    padding: 12px 0;
    border-radius: var(--fs-radius-lg);
    background: var(--fs-pill);
  }

  .biz-terms__row {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
    padding: 0;
    border-radius: 0;
    background: transparent;
  }

  .biz-terms__cell {
    position: relative;
    padding: 18px clamp(18px, 1rem + 1.5vw, 40px);
  }

  .biz-terms__cell + .biz-terms__cell {
    border-left: 0;
  }

  .biz-terms__n {
    flex: 0 0 2rem;
  }

  .biz-terms__cell + .biz-terms__cell::before,
  .biz-terms__row + .biz-terms__row .biz-terms__cell:first-child::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 1px;
    transform: translateX(-50%);
    background: var(--fs-line-on-pill);
  }

  .biz-types__grid {
    gap: 28px 12px;
  }

  .biz-types__title {
    font-size: 0.9375rem;
  }

  .biz-types__text {
    font-size: 0.8125rem;
  }

  .biz-types__tab {
    width: 58px;
    height: 44px;
    bottom: -12px;
    border-radius: 0 14px 14px 14px;
  }

  .biz-types__tab :deep(.fs-icon) {
    width: 28px !important;
    height: 28px !important;
  }
}

/* Mobile mockup keeps the photo beside the copy, bleeding to the right edge. */
@media (max-width: 640px) {
  .biz-hero__grid {
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
    gap: 14px;
  }

  .biz-hero__title {
    font-size: clamp(22px, 6.6vw, 34px);
    max-width: none;
  }

  .biz-hero__lead {
    margin-top: 14px;
    font-size: 0.9375rem;
  }

  .biz-hero__btn {
    margin-top: 18px;
    min-width: 0;
  }

  .biz-hero__photo {
    align-self: stretch;
    aspect-ratio: auto;
    min-height: 220px;
    margin-top: 4px;
    margin-right: calc(-1 * var(--fs-gutter));
    border-radius: clamp(28px, 8vw, 40px) 0 0 clamp(56px, 16vw, 90px);
  }

  .biz-hero__photo--stand-in .biz-hero__cutout {
    height: 104%;
  }
}

@media (max-width: 420px) {
  .biz-types__grid {
    --cols: 2;
  }
}

@media (max-width: 480px) {
  .biz-why__card {
    padding: 24px 14px;
  }
}
</style>
