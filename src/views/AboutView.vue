<script setup>
/**
 * "За FoodSave" — mockup FoodSave_Web_site/2_Za_FoodSave. Copy: `hp.about.*`.
 */
import { useI18n } from 'vue-i18n'
import { photos, cutouts, cutoutSizes, aboutHelps } from '@/content/site'
import SiteShell from '@/components/site/SiteShell.vue'
import SitePhotoBanner from '@/components/site/SitePhotoBanner.vue'
import SiteSectionHead from '@/components/site/SiteSectionHead.vue'
import SiteAudienceCards from '@/components/site/SiteAudienceCards.vue'

const { t } = useI18n()
</script>

<template>
  <SiteShell active="about" title-key="hp.meta.about">
    <!-- ── Hero ── -->
    <section class="about-hero">
      <div class="fs-container">
        <SitePhotoBanner
          :src="photos.heroAbout"
          :alt="t('hp.about.hero.photoAlt')"
          overlay="dark"
          align="left"
          position="center 35%"
          eager
        >
          <h1 class="fs-banner__title">{{ t('hp.about.hero.title') }}</h1>
        </SitePhotoBanner>
      </div>
    </section>

    <!-- ── Какво е FoodSave ── -->
    <section class="fs-section about-what">
      <div class="fs-container fs-container--narrow fs-center">
        <h2 class="fs-h2">{{ t('hp.about.what.title') }}</h2>
        <p class="fs-lead about-what__p">{{ t('hp.about.what.p1') }}</p>
        <p class="fs-lead about-what__p">{{ t('hp.about.what.p2') }}</p>
        <p class="fs-lead about-what__p about-what__strong">{{ t('hp.about.what.p3') }}</p>
      </div>
    </section>

    <!-- ── Нашата мисия ── -->
    <section class="fs-section fs-section--flush-top about-mission">
      <div class="fs-container">
        <div class="about-mission__band">
          <div class="about-mission__copy">
            <h2 class="fs-h2 about-mission__title">{{ t('hp.about.mission.title') }}</h2>
            <p class="about-mission__p">{{ t('hp.about.mission.p1') }}</p>
            <p class="about-mission__p">{{ t('hp.about.mission.p2') }}</p>
          </div>
          <div class="about-mission__art">
            <img
              :src="cutouts.phonePlates"
              :width="cutoutSizes.phonePlates[0]"
              :height="cutoutSizes.phonePlates[1]"
              :alt="t('hp.cta.photoAlt')"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ── Как FoodSave помага ── -->
    <section class="fs-section fs-section--flush-top about-helps">
      <div class="fs-container">
        <SiteSectionHead :title="t('hp.about.helps.title')" />
        <div class="about-helps__grid">
          <article v-for="h in aboutHelps" :key="h.n" class="about-helps__card">
            <span class="fs-num about-helps__num">{{ h.n }}</span>
            <h3 class="about-helps__title">{{ t(h.title) }}</h3>
            <p class="about-helps__text">{{ t(h.text) }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ── Audience cards ── -->
    <section class="fs-section fs-section--flush-top about-aud">
      <div class="fs-container">
        <SiteAudienceCards variant="about" />
      </div>
    </section>
  </SiteShell>
</template>

<style scoped>
/* ── Hero ── */
.about-hero :deep(.fs-banner__title) {
  text-wrap: wrap;
}

/* ── What ── */
.about-what__p {
  margin-top: clamp(16px, 0.75rem + 1vw, 28px);
  max-width: 60ch;
  margin-inline: auto;
}

.about-what__strong {
  font-weight: 700;
  color: var(--fs-teal);
}

/* ── Mission band ── */
.about-mission__band {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
  align-items: center;
  width: min(100%, 1110px);
  min-height: clamp(380px, 18rem + 16vw, 545px);
  margin-inline: auto;
  padding: clamp(32px, 2rem + 2vw, 64px) clamp(24px, 1.5rem + 3.5vw, 86px);
  border-radius: var(--fs-radius-xl);
  background: var(--fs-teal);
  color: var(--fs-white);
}

.about-mission__title {
  color: var(--fs-white);
}

.about-mission__p {
  margin-top: clamp(16px, 0.75rem + 1vw, 28px);
  max-width: 48ch;
  font-size: clamp(1rem, 0.95rem + 0.2vw, 1.125rem);
  line-height: 1.32;
}

.about-mission__art {
  position: absolute;
  top: 0;
  bottom: 8%;
  left: 52%;
  right: -4%;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.about-mission__art img {
  height: 100%;
  width: auto;
  max-width: none;
  filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.35));
}

/* ── Helps ── */
.about-helps .fs-head {
  margin-bottom: clamp(36px, 1.5rem + 4.2vw, 90px);
}
.about-helps__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  row-gap: var(--fs-gap);
  column-gap: clamp(24px, 1rem + 5vw, 88px);
  padding-top: 30px; /* room for the number circles that straddle the top edge */
}

.about-helps__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: clamp(220px, 12rem + 6vw, 300px);
  padding: clamp(72px, 4rem + 2vw, 100px) clamp(22px, 1rem + 1.5vw, 40px) clamp(32px, 2rem + 1vw, 48px);
  border-radius: var(--fs-radius-xl);
  background: var(--fs-card);
  text-align: center;
}

.about-helps__num {
  --fs-num-size: clamp(60px, 2.5rem + 2.65vw, 78px);
  position: absolute;
  top: calc(var(--fs-num-size) * -0.25);
  font-size: calc(var(--fs-num-size) * 0.54);
  left: 50%;
  transform: translateX(-50%);
}

.about-helps__title {
  font-size: clamp(1.375rem, 1.1rem + 1vw, 1.875rem);
}

.about-helps__text {
  margin-top: clamp(12px, 0.5rem + 0.8vw, 22px);
  max-width: 32ch;
  color: var(--fs-body);
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .about-mission__band {
    grid-template-columns: minmax(0, 1fr);
    text-align: center;
    padding-bottom: 0;
  }

  .about-mission__p {
    margin-inline: auto;
  }

  /* Composite overhangs the band's bottom edge (mobile mockup). */
  .about-mission__art {
    position: relative;
    inset: auto;
    margin-top: 24px;
    margin-bottom: clamp(-48px, -10vw, -32px);
  }

  .about-mission__art img {
    height: auto;
    width: min(88%, 420px);
  }

  .fs-section.about-mission {
    padding-bottom: clamp(16px, 5.5vw, 28px);
  }

  /* Leave room between the overhanging composite and the next heading. */
  .fs-section.about-helps {
    padding-top: clamp(28px, 8vw, 48px);
  }
}

@media (max-width: 900px) {
  .about-helps__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 44px;
  }

  .about-helps__card {
    min-height: 0;
  }
}
</style>
