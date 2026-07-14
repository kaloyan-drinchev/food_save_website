<script setup>
defineProps({ events: { type: Array, required: true } })
</script>

<template>
  <div class="charts-grid">
    <div class="chart-card full-width">
      <h3>Platform Events (last 30 days)</h3>
      <div class="event-counts-grid">
        <div v-for="e in events" :key="e.name" class="event-count-item">
          <span class="event-count-name">{{ e.name }}</span>
          <span class="event-count-val">{{ e.count.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
