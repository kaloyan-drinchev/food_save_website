<script setup>
/**
 * Full-width rounded photo band with an optional colour overlay and a
 * title. Used for page heroes ("Добрата храна заслужава втори шанс"),
 * the "По-добра цена не означава по-ниско качество" bands, etc.
 */
defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  /** none | teal | dark | light */
  overlay: { type: String, default: 'none' },
  /** center | left */
  align: { type: String, default: 'center' },
  /** CSS object-position for the photo. */
  position: { type: String, default: 'center' },
  /** tall = page hero on the home-like pages; default = 356px band */
  size: { type: String, default: 'default' },
  eager: { type: Boolean, default: false },
})
</script>

<template>
  <div class="fs-banner fs-frame" :class="[`fs-banner--${overlay}`, `fs-banner--${align}`, `fs-banner--${size}`]">
    <img
      :src="src"
      :alt="alt"
      :style="{ objectPosition: position }"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : null"
      decoding="async"
    />
    <div v-if="overlay !== 'none'" class="fs-banner__overlay" aria-hidden="true"></div>
    <div v-if="$slots.default" class="fs-banner__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.fs-banner {
  height: clamp(190px, 9rem + 15vw, 356px);
}

.fs-banner--tall {
  height: clamp(220px, 10rem + 18vw, 420px);
}

.fs-banner > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fs-banner__overlay {
  position: absolute;
  inset: 0;
}

.fs-banner--teal .fs-banner__overlay {
  background: var(--fs-teal-overlay);
}

.fs-banner--dark .fs-banner__overlay {
  background: var(--fs-dark-overlay);
}

.fs-banner--light .fs-banner__overlay {
  background: rgba(238, 230, 216, 0.28);
}

.fs-banner__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: clamp(20px, 1.5rem + 2vw, 56px);
  text-align: center;
}

.fs-banner--left .fs-banner__content {
  align-items: flex-start;
  text-align: left;
  padding-inline: clamp(24px, 1.5rem + 3vw, 72px);
}

/* Titles inside a banner (page-level classes set colour). */
.fs-banner__content :deep(.fs-banner__title) {
  font-size: clamp(1.75rem, 1rem + 3.05vw, 3.875rem);
  line-height: 1.08;
  color: var(--fs-banner-title-color, var(--fs-white));
  text-wrap: balance;
}

.fs-banner--left .fs-banner__content :deep(.fs-banner__title) {
  max-width: 14ch;
}
</style>
