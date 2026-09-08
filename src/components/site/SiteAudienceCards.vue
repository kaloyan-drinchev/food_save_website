<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { photos, cutouts, cutoutSizes } from '@/content/site'
import SiteIcon from './SiteIcon.vue'
import SiteButton from './SiteButton.vue'
import SitePhoto from './SitePhoto.vue'

/**
 * The teal "За потребители" + orange "За бизнеса" card pair.
 * `variant` picks the copy set (home | about); layout is identical.
 */
const props = defineProps({
  variant: { type: String, default: 'home' },
})

const { t } = useI18n()
const k = computed(() => `hp.audience.${props.variant}`)
</script>

<template>
  <div class="fs-aud">
    <article class="fs-aud__card fs-aud__card--teal">
      <div class="fs-aud__body">
        <p class="fs-aud__label">
          <SiteIcon name="user" size="22px" circle="white" circle-size="40px" />
          <span>{{ t('hp.audience.consumersLabel') }}</span>
        </p>
        <h3 class="fs-aud__title">{{ t(`${k}.consumersTitle`) }}</h3>
        <p class="fs-aud__text">{{ t(`${k}.consumersText`) }}</p>
        <SiteButton variant="orange" size="sm" arrow to="/for-clients" class="fs-aud__btn">
          {{ t('hp.common.seeConsumers') }}
        </SiteButton>
      </div>
      <SitePhoto
        :src="photos.womanWithPhone"
        :alt="t('hp.photo.womanWithPhone')"
        ratio="209 / 360"
        class="fs-aud__photo"
      />
    </article>

    <article class="fs-aud__card fs-aud__card--orange">
      <div class="fs-aud__body">
        <p class="fs-aud__label">
          <SiteIcon name="business" size="24px" circle="white" circle-size="40px" />
          <span>{{ t('hp.audience.businessLabel') }}</span>
        </p>
        <h3 class="fs-aud__title">{{ t(`${k}.businessTitle`) }}</h3>
        <p class="fs-aud__text">{{ t(`${k}.businessText`) }}</p>
        <SiteButton variant="teal" size="sm" arrow to="/for-businesses" class="fs-aud__btn">
          {{ t('hp.common.seeBusiness') }}
        </SiteButton>
      </div>
      <figure class="fs-aud__photo fs-aud__photo--cutout">
        <img
          :src="cutouts.manTablet"
          :width="cutoutSizes.manTablet[0]"
          :height="cutoutSizes.manTablet[1]"
          :alt="t('hp.photo.bakerAtCounter')"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </article>
  </div>
</template>

<style scoped>
.fs-aud {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--fs-gap);
}

.fs-aud__card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(150px, 9rem + 5vw, 209px);
  gap: 12px;
  align-items: start;
  padding: clamp(24px, 1.25rem + 2.5vw, 58px) clamp(16px, 0.75rem + 1.2vw, 29px)
    clamp(24px, 1.25rem + 2.5vw, 58px) clamp(24px, 1.25rem + 2.5vw, 58px);
  border-radius: var(--fs-radius-xl);
  color: var(--fs-white);
}

.fs-aud__card--teal {
  background: var(--fs-teal);
}

.fs-aud__card--orange {
  background: var(--fs-orange);
}

.fs-aud__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.fs-aud__label {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: clamp(0.8125rem, 0.75rem + 0.3vw, 1rem);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.fs-aud__title {
  margin-top: clamp(18px, 1rem + 1vw, 32px);
  color: inherit;
  font-size: clamp(1.375rem, 0.95rem + 1.4vw, 2.125rem);
  line-height: 1.15;
}

.fs-aud__text {
  margin-top: clamp(14px, 0.75rem + 0.8vw, 24px);
  font-size: var(--fs-text-size);
  line-height: 1.45;
  max-width: 34ch;
}

.fs-aud__btn {
  margin-top: clamp(24px, 1.25rem + 1.5vw, 44px);
  min-width: 0;
  max-width: 100%;
}

.fs-aud__photo {
  --fs-photo-radius: var(--fs-radius-sm);
  width: 100%;
}

/* The business portrait is a cut-out; give it the warm café backdrop
   the mockup shows behind him. */
.fs-aud__photo--cutout {
  position: relative;
  overflow: hidden;
  aspect-ratio: 209 / 360;
  border-radius: var(--fs-radius-sm);
  background:
    radial-gradient(90% 60% at 60% 20%, rgba(255, 228, 190, 0.55), transparent 65%),
    linear-gradient(180deg, #d9c1a4 0%, #a98466 55%, #6e4f3a 100%);
}

.fs-aud__photo--cutout img {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 118%;
  height: auto;
  max-width: none;
  transform: translateX(-50%);
}

@media (max-width: 1100px) {
  .fs-aud {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 480px) {
  .fs-aud__card {
    grid-template-columns: minmax(0, 1fr) 33%;
    gap: 14px;
    padding: 22px 20px 26px;
  }

  .fs-aud__label {
    gap: 8px;
  }

  .fs-aud__btn {
    min-width: 0;
  }
}
</style>
