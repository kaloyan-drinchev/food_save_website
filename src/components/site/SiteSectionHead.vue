<script setup>
/**
 * Centred section heading with an optional one-line subtitle.
 * Use the `title` slot for headings with an accent word.
 */
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  /** center | left */
  align: { type: String, default: 'center' },
  /** Tighter bottom spacing (heading sits close to the content). */
  tight: { type: Boolean, default: false },
})
</script>

<template>
  <div class="fs-head" :class="[`fs-head--${align}`, { 'fs-head--tight': tight }]">
    <h2 class="fs-h2 fs-head__title"><slot name="title">{{ title }}</slot></h2>
    <p v-if="subtitle || $slots.subtitle" class="fs-head__sub">
      <slot name="subtitle">{{ subtitle }}</slot>
    </p>
  </div>
</template>

<style scoped>
.fs-head {
  margin-bottom: clamp(28px, 1.5rem + 2vw, 56px);
}

.fs-head--tight {
  margin-bottom: clamp(20px, 1rem + 1.2vw, 36px);
}

.fs-head--center {
  text-align: center;
}

.fs-head__title {
  max-width: 30ch;
  margin-inline: auto;
}

.fs-head--left .fs-head__title {
  margin-inline: 0;
}

.fs-head__sub {
  max-width: 62ch;
  margin: clamp(10px, 0.5rem + 0.6vw, 18px) auto 0;
  font-size: var(--fs-lead);
  color: var(--fs-body);
}

.fs-head--left .fs-head__sub {
  margin-inline: 0;
}
</style>
