<script setup>
defineProps({ kpis: { type: Array, required: true } })
</script>

<template>
  <div class="kpi-grid">
    <div v-for="(k, i) in kpis" :key="i" class="kpi-card">
      <div class="kpi-value" :class="k.color">{{ k.value }}</div>
      <div class="kpi-label">{{ k.label }}</div>
      <div class="kpi-desc">{{ k.desc }}</div>
    </div>
  </div>
</template>
