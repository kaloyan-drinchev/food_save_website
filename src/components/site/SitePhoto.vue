<script setup>
/**
 * Rounded photo slot. Pass `src` for a real image; with `null` it renders
 * an on-brand placeholder at the reserved aspect ratio, so the layout is
 * final before the photography arrives.
 */
defineProps({
  src: { type: String, default: null },
  alt: { type: String, default: '' },
  /** CSS aspect-ratio value, e.g. "209 / 360". */
  ratio: { type: String, default: '3 / 4' },
  /** Placeholder tint: light | warm */
  tone: { type: String, default: 'light' },
  position: { type: String, default: 'center' },
})
</script>

<template>
  <figure class="fs-photo" :class="[`fs-photo--${tone}`, { 'fs-photo--empty': !src }]" :style="{ aspectRatio: ratio }">
    <img v-if="src" :src="src" :alt="alt" loading="lazy" decoding="async" :style="{ objectPosition: position }" />
    <span v-else class="fs-photo__label">{{ alt }}</span>
  </figure>
</template>

<style scoped>
.fs-photo {
  position: relative;
  overflow: hidden;
  width: 100%;
  border-radius: var(--fs-photo-radius, var(--fs-radius-sm));
  background: var(--fs-card);
}

.fs-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fs-photo--empty {
  display: grid;
  place-items: center;
  background:
    radial-gradient(120% 80% at 30% 20%, rgba(255, 255, 255, 0.55), transparent 60%),
    linear-gradient(160deg, #e6e8dd 0%, #cfd6c5 100%);
}

.fs-photo--warm.fs-photo--empty {
  background:
    radial-gradient(120% 80% at 30% 20%, rgba(255, 255, 255, 0.5), transparent 60%),
    linear-gradient(160deg, #e9d9c4 0%, #c8a98a 100%);
}

.fs-photo__label {
  padding: 12px;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-align: center;
  color: rgba(50, 81, 83, 0.55);
}
</style>
