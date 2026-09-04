<script setup>
import { computed } from 'vue'

/**
 * The four third-party marks the public site needs (two social links, two app
 * stores), inlined as SVG.
 *
 * They are drawn here rather than pulled from FontAwesome so the marketing
 * pages ship no icon-font runtime at all — the whole set below costs under
 * 2 KB. Glyph outlines are from Font Awesome Free 6 (CC BY 4.0,
 * https://fontawesome.com/license/free).
 */
const props = defineProps({
  /** instagram | facebook | apple | googlePlay */
  name: { type: String, required: true },
  size: { type: String, default: '1em' },
})

const ICONS = {
  // Authored here: rounded square + lens + flash dot, matching the outline
  // weight of the designer's own icon set.
  instagram: {
    box: '0 0 24 24',
    stroke: true,
    body: `<rect x="3" y="3" width="18" height="18" rx="5" />
           <circle cx="12" cy="12" r="4" />
           <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" stroke="none" />`,
  },
  facebook: {
    box: '0 0 320 512',
    body: `<path d="M80 299.3V512h116V299.3h86.5l18-97.8H196v-33.9c0-51.6 20.3-71.2 72.7-71.2 16.3 0 29.4.4 37 1.2V7.9C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4v42.1H14v97.8h66z" />`,
  },
  apple: {
    box: '0 0 384 512',
    body: `<path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />`,
  },
  googlePlay: {
    box: '0 0 512 512',
    body: `<path d="M325.3 234.3 104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />`,
  },
}

const icon = computed(() => ICONS[props.name] || ICONS.instagram)
</script>

<template>
  <svg
    class="fs-brand-icon"
    :viewBox="icon.box"
    :style="{ '--fs-brand-size': size }"
    :fill="icon.stroke ? 'none' : 'currentColor'"
    :stroke="icon.stroke ? 'currentColor' : undefined"
    :stroke-width="icon.stroke ? 1.8 : undefined"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    v-html="icon.body"
  ></svg>
</template>

<style scoped>
.fs-brand-icon {
  display: block;
  width: auto;
  height: var(--fs-brand-size, 1em);
  flex: none;
}
</style>
