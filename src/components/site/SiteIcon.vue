<script setup>
import { computed } from 'vue'
import { icons } from '@/content/site'

/**
 * Designer icon (PNG/WebP with transparency), optionally inside a circle.
 *
 *   <SiteIcon name="store" size="58px" />
 *   <SiteIcon name="user" size="22px" circle="white" circle-size="40px" />
 */
const props = defineProps({
  name: { type: String, required: true },
  /** Glyph size (any CSS length). */
  size: { type: String, default: '56px' },
  /** white | sage | circle (light) — renders the glyph inside a disc. */
  circle: { type: String, default: null },
  circleSize: { type: String, default: null },
})

const src = computed(() => icons[props.name])
const circleSize = computed(() => props.circleSize || `calc(${props.size} * 1.9)`)
</script>

<template>
  <span
    v-if="circle"
    class="fs-icon fs-icon--disc"
    :class="`fs-icon--${circle}`"
    :style="{ '--fs-icon-size': size, '--fs-icon-disc': circleSize }"
  >
    <img :src="src" alt="" loading="lazy" decoding="async" />
  </span>
  <img
    v-else
    class="fs-icon"
    :src="src"
    alt=""
    loading="lazy"
    decoding="async"
    :style="{ width: size, height: size }"
  />
</template>

<style scoped>
.fs-icon {
  flex: none;
  object-fit: contain;
}

.fs-icon--disc {
  display: inline-grid;
  place-items: center;
  width: var(--fs-icon-disc);
  height: var(--fs-icon-disc);
  border-radius: 50%;
}

.fs-icon--disc img {
  width: var(--fs-icon-size);
  height: var(--fs-icon-size);
  object-fit: contain;
}

.fs-icon--white {
  background: var(--fs-white);
}

.fs-icon--sage {
  background: var(--fs-sage);
}

.fs-icon--circle {
  background: var(--fs-circle);
}
</style>
