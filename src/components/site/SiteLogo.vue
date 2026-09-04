<script setup>
import { logos } from '@/content/site'

/** FoodSave wordmark. `light` = cream/orange version for teal surfaces. */
defineProps({
  light: { type: Boolean, default: false },
})
</script>

<template>
  <img
    class="fs-logo"
    :src="light ? logos.light : logos.color"
    alt="FoodSave"
    width="506"
    height="109"
    decoding="async"
  />
</template>

<style scoped>
.fs-logo {
  width: var(--fs-logo-w, 200px);
  height: auto;
}
</style>
