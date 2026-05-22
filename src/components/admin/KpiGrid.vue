<script setup>
defineProps({ groups: { type: Array, required: true } })

function toneFor(color) {
  if (color === 'green') return 'positive'
  if (color === 'accent') return 'warning'
  if (color === 'red') return 'negative'
  return 'neutral'
}
</script>

<template>
  <div class="kpi-groups">
    <section v-for="group in groups" :key="group.title" class="kpi-group">
      <header class="kpi-group-header">
        <h3 class="kpi-group-title">{{ group.title }}</h3>
        <p class="kpi-group-desc">{{ group.description }}</p>
      </header>

      <div class="kpi-card-grid" :class="`kpi-card-grid--${group.kpis.length}`">
        <article
          v-for="(k, i) in group.kpis"
          :key="i"
          class="kpi-card"
          :class="`kpi-card--${toneFor(k.color)}`"
        >
          <div class="kpi-card-label">{{ k.label }}</div>
          <div class="kpi-card-value">{{ k.value }}</div>
          <div v-if="k.desc" class="kpi-card-trend">
            <span class="kpi-card-trend-icon" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 8L6 4L10 8"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="kpi-card-trend-text">{{ k.desc }}</span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
