<script setup>
/**
 * Home — "Добрата храна намира своя човек".
 * Mockup: FoodSave_Web_site/1_Home. Copy: i18n `hp.home.*`.
 */
import { useI18n } from 'vue-i18n'
import { photos, cutouts, cutoutSizes, homeSteps, homeStats } from '@/content/site'
import SiteShell from '@/components/site/SiteShell.vue'
import SiteButton from '@/components/site/SiteButton.vue'
import SiteSectionHead from '@/components/site/SiteSectionHead.vue'
import SiteAudienceCards from '@/components/site/SiteAudienceCards.vue'
import SiteIcon from '@/components/site/SiteIcon.vue'
import SitePhotoBanner from '@/components/site/SitePhotoBanner.vue'
import SiteFaq from '@/components/site/SiteFaq.vue'
import SiteStoreBadges from '@/components/site/SiteStoreBadges.vue'
import SiteLogo from '@/components/site/SiteLogo.vue'

const { t } = useI18n()

const leftSteps = homeSteps.slice(0, 2)
const rightSteps = homeSteps.slice(2)
</script>

<template>
  <SiteShell active="landing" title-key="hp.meta.home" standalone-title>
    <!-- ── Hero ─────────────────────────────────────────────── -->
    <section class="home-hero">
      <div class="fs-container">
        <div class="home-hero__frame fs-frame">
          <img
            :src="photos.heroHome"
            :alt="t('hp.home.hero.photoAlt')"
            fetchpriority="high"
            decoding="async"
          />
          <div class="home-hero__card">
            <span class="home-hero__pill">{{ t('hp.common.comingSoon') }}</span>
            <h1 class="fs-h1 home-hero__title">{{ t('hp.home.hero.title') }}</h1>
            <p class="fs-lead home-hero__lead">{{ t('hp.home.hero.lead') }}</p>
            <div class="home-hero__actions">
              <SiteButton variant="teal" arrow to="/for-clients">
                {{ t('hp.common.forConsumers') }}
              </SiteButton>
              <SiteButton variant="outline" arrow to="/for-businesses">
                {{ t('hp.common.forBusiness') }}
              </SiteButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Какво е FoodSave? ─────────────────────────────────── -->
    <section class="fs-section home-what">
      <div class="fs-container">
        <SiteSectionHead :title="t('hp.home.what.title')" :subtitle="t('hp.home.what.text')" />
        <SiteAudienceCards variant="home" />
      </div>
    </section>

    <!-- ── Как работи FoodSave? ──────────────────────────────── -->
    <section id="fs-how" class="fs-section home-how">
      <div class="fs-container">
        <SiteSectionHead :title="t('hp.home.how.title')" :subtitle="t('hp.home.how.subtitle')" />

        <div class="home-how__grid">
          <div class="home-how__col">
            <article v-for="(s, i) in leftSteps" :key="s.title" class="home-how__step">
              <div class="home-how__icon">
                <SiteIcon :name="s.icon" size="52%" />
                <span class="home-how__n">{{ i + 1 }}</span>
              </div>
              <h3 class="home-how__title">{{ t(s.title) }}</h3>
              <p class="home-how__text">{{ t(s.text) }}</p>
            </article>
          </div>

          <div class="home-how__phone">
            <img
              :src="cutouts.phone"
              :width="cutoutSizes.phone[0]"
              :height="cutoutSizes.phone[1]"
              :alt="t('hp.home.how.phoneAlt')"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div class="home-how__col">
            <article v-for="(s, i) in rightSteps" :key="s.title" class="home-how__step">
              <div class="home-how__icon">
                <SiteIcon :name="s.icon" size="52%" />
                <span class="home-how__n">{{ i + 3 }}</span>
              </div>
              <h3 class="home-how__title">{{ t(s.title) }}</h3>
              <p class="home-how__text">{{ t(s.text) }}</p>
            </article>
          </div>
        </div>

        <p class="home-how__tag">
          {{ t('hp.home.how.tag1a') }} <strong>{{ t('hp.home.how.tag1b') }}</strong>
          {{ t('hp.home.how.tag2a') }} <strong>{{ t('hp.home.how.tag2b') }}</strong>
          {{ t('hp.home.how.tag3a') }} <strong>{{ t('hp.home.how.tag3b') }}</strong>
        </p>
      </div>
    </section>

    <!-- ── Ние даваме втори шанс + statistics ───────────────── -->
    <section class="fs-section fs-section--flush-top home-band">
      <div class="fs-container">
        <SitePhotoBanner :src="photos.bandHome" :alt="t('hp.home.band.photoAlt')" overlay="teal" position="center 45%">
          <h2 class="home-band__title">
            {{ t('hp.home.band.line1a') }} <span class="fs-accent">{{ t('hp.home.band.line1b') }}</span><br />
            {{ t('hp.home.band.line2a') }} <span class="fs-accent">{{ t('hp.home.band.line2b') }}</span>
          </h2>
        </SitePhotoBanner>

        <dl class="home-stats">
          <div v-for="s in homeStats" :key="s.value" class="home-stats__item">
            <SiteIcon :name="s.icon" size="58px" class="home-stats__icon" />
            <div class="home-stats__body">
              <dt class="home-stats__value">{{ t(s.value) }}</dt>
              <dd class="home-stats__label">{{ t(s.label) }}</dd>
            </div>
          </div>
        </dl>
        <p class="home-stats__note">{{ t('hp.home.stats.note') }}</p>
      </div>
    </section>

    <SiteFaq />

    <!-- ── Closing band ──────────────────────────────────────── -->
    <section id="fs-download" class="fs-section home-close">
      <div class="fs-container">
        <div class="home-close__band">
          <div class="home-close__copy">
            <SiteLogo light class="home-close__logo" />
            <p class="home-close__tagline">{{ t('hp.common.tagline') }}</p>
            <div class="home-close__btns">
              <SiteButton variant="orange" size="lg" arrow href="#fs-download">
                {{ t('hp.common.downloadApp') }}
              </SiteButton>
              <SiteButton variant="sage" size="lg" arrow :to="{ path: '/contact', query: { topic: 'business' } }">
                {{ t('hp.common.becomePartner') }}
              </SiteButton>
            </div>
            <SiteStoreBadges />
          </div>
          <span class="home-close__divider" aria-hidden="true"></span>
          <div class="home-close__art">
            <img
              :src="cutouts.phonePlates"
              :width="cutoutSizes.phonePlates[0]"
              :height="cutoutSizes.phonePlates[1]"
              :alt="t('hp.home.closing.photoAlt')"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  </SiteShell>
</template>

<style scoped>
/* ── Hero ── */
.home-hero__frame {
  display: flex;
  align-items: center;
  min-height: clamp(360px, 20rem + 22vw, 626px);
  padding: clamp(20px, 3vw, 55px) clamp(12px, 3vw, 40px);
}

.home-hero__frame > img {
  position: absolute;
  inset: 0;
  object-position: center;
}

.home-hero__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: min(100%, 677px);
  padding: clamp(26px, 1.5rem + 2.5vw, 58px);
  border-radius: var(--fs-radius-xl);
  background: var(--fs-hero-glass);
  backdrop-filter: blur(2px);
}

.home-hero__pill {
  display: inline-block;
  padding: 6px 20px;
  border-radius: var(--fs-radius-pill);
  background: var(--fs-sage);
  color: var(--fs-teal);
  font-size: clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.home-hero__title {
  margin-top: clamp(18px, 1rem + 1.4vw, 36px);
  /* Two lines at 1440 ("Добрата храна / намира своя човек"). */
  font-size: clamp(2.125rem, 1.4rem + 2.3vw, 3.25rem);
  max-width: none;
}

.home-hero__lead {
  margin-top: clamp(14px, 0.75rem + 0.9vw, 26px);
  max-width: 36ch;
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-self: stretch;
  gap: 16px 24px;
  margin-top: clamp(24px, 1.5rem + 1.6vw, 44px);
}

.home-hero__actions > * {
  min-width: min(100%, 212px);
}

/* ── What ── */
.home-what :deep(.fs-head__sub) {
  max-width: 800px;
  font-size: 1.125rem;
}

/* ── How it works ── */
.home-how {
  scroll-margin-top: var(--fs-nav-h);
}

.home-how__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(104px, 4rem + 15.5vw, 290px) minmax(0, 1fr);
  gap: clamp(12px, 1rem + 2vw, 48px);
  align-items: center;
}

.home-how__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(36px, 2rem + 3.5vw, 94px);
}

.home-how__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 330px);
  text-align: center;
}

.home-how__icon {
  --disc: clamp(64px, 3.5rem + 3.5vw, 115px);
  position: relative;
  display: grid;
  place-items: center;
  width: var(--disc);
  height: var(--disc);
  border-radius: 50%;
  background: var(--fs-circle);
}

.home-how__n {
  position: absolute;
  right: calc(var(--disc) * -0.06);
  bottom: calc(var(--disc) * -0.04);
  display: grid;
  place-items: center;
  width: calc(var(--disc) * 0.5);
  height: calc(var(--disc) * 0.5);
  border-radius: 50%;
  background: var(--fs-teal);
  color: var(--fs-white);
  font-weight: 700;
  font-size: calc(var(--disc) * 0.24);
}

.home-how__title {
  margin-top: clamp(12px, 0.5rem + 0.8vw, 22px);
  font-size: var(--fs-h4);
}

.home-how__text {
  margin-top: clamp(8px, 0.4rem + 0.5vw, 14px);
  color: var(--fs-body);
}

.home-how__phone img {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 30px 34px rgba(0, 0, 0, 0.18));
}

.home-how__tag {
  margin-top: clamp(32px, 2rem + 2vw, 64px);
  text-align: center;
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.3125rem);
  color: var(--fs-body);
}

.home-how__tag strong {
  color: var(--fs-teal);
  font-weight: 700;
}

/* ── Band + stats ── */
.home-band__title {
  font-size: clamp(1.5rem, 0.5rem + 3.6vw, 3.75rem);
  line-height: 1.04;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--fs-white);
}

.home-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: clamp(28px, 1.5rem + 2vw, 54px);
  padding: clamp(16px, 0.75rem + 0.8vw, 26px) 0;
  border-radius: var(--fs-radius-md);
  background: var(--fs-pill);
}

.home-stats__item {
  display: flex;
  align-items: center;
  gap: clamp(12px, 0.5rem + 0.6vw, 18px);
  padding: 6px clamp(14px, 0.5rem + 1.2vw, 28px);
}

.home-stats__item + .home-stats__item {
  border-left: 1px solid var(--fs-line-on-pill);
}

.home-stats__icon {
  width: clamp(42px, 2rem + 1.5vw, 58px) !important;
  height: clamp(42px, 2rem + 1.5vw, 58px) !important;
}

.home-stats__value {
  white-space: nowrap;
  font-size: clamp(1.375rem, 0.75rem + 1.9vw, 2.5rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--fs-teal);
}

.home-stats__label {
  margin: 4px 0 0;
  font-size: clamp(0.875rem, 0.75rem + 0.55vw, 1.25rem);
  color: var(--fs-body);
}

.home-stats__note {
  margin-top: 16px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--fs-note);
}

/* ── Closing band ── */
.home-close {
  scroll-margin-top: var(--fs-nav-h);
}

.home-close__band {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  min-height: clamp(420px, 20rem + 18vw, 569px);
  margin-top: clamp(24px, 2vw, 48px);
  padding: clamp(32px, 2rem + 2vw, 64px) clamp(24px, 1.5rem + 3vw, 72px);
  border-radius: var(--fs-radius-xl);
  background: var(--fs-teal);
  color: var(--fs-white);
}

.home-close__copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  width: min(100%, 440px);
  margin-left: clamp(0px, 8%, 110px);
  text-align: center;
}

.home-close__logo {
  --fs-logo-w: clamp(220px, 12rem + 8vw, 360px);
}

.home-close__tagline {
  margin-top: 6px;
  font-size: clamp(1.125rem, 0.9rem + 1vw, 1.8rem);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.home-close__btns {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: min(100%, 340px);
  margin-top: clamp(28px, 1.5rem + 2vw, 60px);
}

.home-close__btns > * {
  width: 100%;
}

.home-close__copy :deep(.fs-badges) {
  margin-top: clamp(28px, 1.5rem + 2.5vw, 66px);
  justify-content: center;
}

.home-close__divider {
  position: absolute;
  left: 50%;
  top: 10%;
  bottom: 9%;
  width: 1px;
  background: rgba(176, 189, 163, 0.55);
}

.home-close__art {
  position: absolute;
  top: calc(-7.5% - 32px);
  left: 48%;
  right: 1%;
  height: 103%;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.home-close__art img {
  height: 100%;
  width: auto;
  max-width: none;
  filter: drop-shadow(0 30px 40px rgba(0, 0, 0, 0.35));
}

/* ── Responsive ── */
@media (max-width: 1200px) {
  .home-close__art {
    top: calc(-4% - 32px);
    left: 50%;
    right: 0;
    height: 96%;
  }

  .home-close__copy {
    margin-left: 0;
    width: min(100%, 400px);
  }
}

/* Mobile mockup: composite above the band's top edge, copy centred below. */
@media (max-width: 900px) {
  .home-close__band {
    grid-template-columns: minmax(0, 1fr);
    margin-top: clamp(72px, 2rem + 12vw, 140px);
    padding-top: 0;
  }

  .home-close__divider {
    display: none;
  }

  .home-close__art {
    order: -1;
    position: relative;
    inset: auto;
    height: auto;
    margin-top: clamp(-96px, -20vw, -64px);
    margin-bottom: 8px;
  }

  .home-close__art img {
    height: auto;
    width: min(88vw, 460px);
  }

  .home-close__copy {
    margin-left: 0;
    width: 100%;
  }

  .home-close__copy :deep(.fs-badges) {
    margin-top: 28px;
  }
}

@media (max-width: 960px) {
  .home-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 0;
  }

  .home-stats__item {
    padding: 18px 14px;
  }

  .home-stats__item + .home-stats__item {
    border-left: 0;
  }

  .home-stats__item:nth-child(2n) {
    border-left: 1px solid var(--fs-line-on-pill);
  }

  .home-stats__item:nth-child(n + 3) {
    border-top: 1px solid var(--fs-line-on-pill);
  }

  .home-how__grid {
    gap: 8px;
  }

  .home-how__title {
    font-size: 0.9375rem;
  }

  .home-how__text {
    font-size: 0.8125rem;
  }
}

/* Below 480px three columns no longer fit: steps 1-2, the phone, steps 3-4 in one column. */
@media (max-width: 479px) {
  .home-how__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }

  .home-how__phone {
    justify-self: center;
    width: min(46%, 170px);
  }

  .home-how__col {
    gap: 28px;
  }

  .home-stats__value {
    font-size: 1.25rem;
  }

  .home-stats__icon {
    width: 36px !important;
    height: 36px !important;
  }
}

@media (max-width: 1024px) {
  .home-hero__title {
    max-width: 16ch;
  }
}

@media (max-width: 480px) {
  .home-hero__frame {
    margin-inline: calc(-1 * (var(--fs-gutter) - 6px));
    padding: 24px 12px;
  }

  .home-hero__actions > * {
    min-width: 0;
    flex: 1 1 140px;
  }
}
</style>
