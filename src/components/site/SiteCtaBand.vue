<script setup>
import { useI18n } from 'vue-i18n'
import { cutouts, cutoutSizes } from '@/content/site'
import SiteButton from './SiteButton.vue'
import SiteStoreBadges from './SiteStoreBadges.vue'

/**
 * Closing teal band on the consumer and business pages:
 * "Добрата храна е по-близо, отколкото си мислиш" + download button +
 * store badges, with the phone-and-plates composite floating on the right.
 */
const { t } = useI18n()
</script>

<template>
  <section id="fs-download" class="fs-section fs-cta-wrap">
    <div class="fs-container">
      <div class="fs-cta">
        <div class="fs-cta__copy">
          <h2 class="fs-cta__title">
            {{ t('hp.cta.titleLead') }}
            <span class="fs-accent">{{ t('hp.cta.titleAccent') }}</span>{{ t('hp.cta.titleTail') }}
          </h2>
          <SiteButton variant="orange" size="lg" arrow href="#fs-download" class="fs-cta__btn">
            {{ t('hp.common.downloadApp') }}
          </SiteButton>
          <SiteStoreBadges />
        </div>

        <div class="fs-cta__art" aria-hidden="true">
          <img
            :src="cutouts.phonePlates"
            :width="cutoutSizes.phonePlates[0]"
            :height="cutoutSizes.phonePlates[1]"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fs-cta-wrap {
  scroll-margin-top: var(--fs-nav-h);
}

.fs-cta {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) minmax(0, 1fr);
  align-items: center;
  min-height: clamp(300px, 14rem + 12vw, 400px);
  padding: clamp(32px, 2rem + 2vw, 58px) clamp(24px, 1.5rem + 3vw, 72px);
  border-radius: var(--fs-radius-xl);
  background: var(--fs-teal);
  color: var(--fs-on-teal);
  margin-top: clamp(24px, 2rem + 1vw, 48px); /* room for the art to overhang */
}

.fs-cta__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(22px, 1.25rem + 1vw, 36px);
}

.fs-cta__title {
  color: var(--fs-on-teal);
  font-size: clamp(1.75rem, 1.2rem + 2vw, 3.125rem);
  line-height: 1.12;
  max-width: 14em;
}

/* Never break the accent word ("по-близо") at its hyphen. */
.fs-cta__title .fs-accent {
  white-space: nowrap;
}

.fs-cta__btn {
  min-width: min(100%, 320px);
}

.fs-cta__art {
  position: absolute;
  right: 1.5%;
  top: -6%;
  height: 112%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  pointer-events: none;
}

.fs-cta__art img {
  height: 100%;
  width: auto;
  max-width: none;
  filter: drop-shadow(0 30px 40px rgba(0, 0, 0, 0.35));
}

@media (max-width: 1200px) {
  .fs-cta__art {
    top: -3%;
    right: 0;
    height: 100%;
  }
}

/* Mobile mockup: composite above the band's top edge, copy centred below. */
@media (max-width: 900px) {
  .fs-cta {
    grid-template-columns: minmax(0, 1fr);
    padding-top: 0;
    margin-top: clamp(40px, 2rem + 6vw, 96px);
  }

  .fs-cta__art {
    order: -1;
    position: relative;
    inset: auto;
    height: auto;
    justify-content: center;
    margin-top: clamp(-90px, -14vw, -40px);
    margin-bottom: clamp(16px, 4vw, 28px);
  }

  .fs-cta__art img {
    height: auto;
    width: min(88%, 420px);
  }

  .fs-cta__copy {
    align-items: center;
    text-align: center;
  }

  .fs-cta__title {
    margin-inline: auto;
  }

  .fs-cta__copy :deep(.fs-badges) {
    justify-content: center;
  }
}
</style>
