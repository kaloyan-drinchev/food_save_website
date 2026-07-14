<script setup>
import { computed, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  data: { type: Object, required: true },
})

/* Theme tokens (read once — Apex needs raw colors) */
const COLOR_PRIMARY = '#80C49B'
const COLOR_ACCENT = '#EB8227'
const COLOR_INFO = '#3b82f6'
const COLOR_PURPLE = '#8b5cf6'
const TEXT_MUTED = '#9aa39c'
const GRID_LINE = 'rgba(255,255,255,0.05)'

const baseTooltip = {
  theme: 'dark',
  style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' },
}

const fmtMoney = (v) =>
  Number(v || 0).toLocaleString('bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
  ' лв'

/* ---------- Revenue (area, with range chips & stats) ---------- */
const range = ref('30d')
const rangeDays = computed(() => (range.value === '7d' ? 7 : range.value === '90d' ? 90 : 30))

const revenueSliced = computed(() => (props.data.revenue?.data || []).slice(-rangeDays.value))
const labelsSliced = computed(() => (props.data.revenue?.labels || []).slice(-rangeDays.value))
const revenueTotal = computed(() => revenueSliced.value.reduce((a, b) => a + b, 0))
const revenueAvg = computed(() =>
  revenueSliced.value.length ? revenueTotal.value / revenueSliced.value.length : 0,
)

const revenueSeries = computed(() => [{ name: 'Revenue', data: revenueSliced.value }])
const revenueOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false },
    sparkline: { enabled: false },
    foreColor: TEXT_MUTED,
    fontFamily: 'Inter, sans-serif',
    animations: { easing: 'easeOutCubic', speed: 600 },
    parentHeightOffset: 0,
  },
  colors: [COLOR_PRIMARY],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      type: 'vertical',
      opacityFrom: 0.55,
      opacityTo: 0,
      stops: [0, 100],
      colorStops: [
        { offset: 0, color: COLOR_PRIMARY, opacity: 0.55 },
        { offset: 100, color: COLOR_PRIMARY, opacity: 0 },
      ],
    },
  },
  grid: {
    borderColor: GRID_LINE,
    strokeDashArray: 4,
    padding: { left: 4, right: 4, top: -8, bottom: -4 },
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
  },
  xaxis: {
    categories: labelsSliced.value,
    axisBorder: { show: false },
    axisTicks: { show: false },
    tickAmount: 6,
    labels: { style: { fontSize: '10px', colors: TEXT_MUTED } },
  },
  yaxis: {
    labels: {
      formatter: (v) => (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : Math.round(v)),
      style: { fontSize: '10px', colors: TEXT_MUTED },
    },
  },
  tooltip: {
    ...baseTooltip,
    y: { formatter: (v) => fmtMoney(v) },
    marker: { show: false },
  },
  markers: { size: 0, hover: { size: 6, sizeOffset: 2 } },
  legend: { show: false },
}))

/* ---------- Total Profit (bar) ---------- */
const profitSeries = computed(() => [{ name: 'Profit', data: props.data.profit?.data || [] }])
const profitOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    foreColor: TEXT_MUTED,
    fontFamily: 'Inter, sans-serif',
    animations: { easing: 'easeOutCubic', speed: 600 },
  },
  colors: [COLOR_ACCENT],
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '55%',
      colors: {
        backgroundBarColors: [GRID_LINE],
        backgroundBarOpacity: 1,
        backgroundBarRadius: 6,
      },
    },
  },
  dataLabels: { enabled: false },
  grid: { borderColor: GRID_LINE, strokeDashArray: 4 },
  xaxis: {
    categories: props.data.profit?.labels || [],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { fontSize: '10px' } },
  },
  yaxis: {
    labels: {
      formatter: (v) => (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(0)),
      style: { fontSize: '10px' },
    },
  },
  tooltip: {
    ...baseTooltip,
    y: { formatter: (v) => v.toFixed(2) + ' лв' },
  },
}))

/* ---------- Sales overview (donut, with side legend) ---------- */
const salesRawSeries = computed(() => props.data.sales?.data || [])
const salesHasData = computed(() => salesRawSeries.value.some((v) => Number(v) > 0))
const salesSeries = computed(() => (salesHasData.value ? salesRawSeries.value : [1]))
const salesLabels = computed(() =>
  salesHasData.value ? props.data.sales?.labels || [] : ['No data'],
)
const SALES_COLORS = [COLOR_PRIMARY, COLOR_ACCENT, COLOR_INFO, COLOR_PURPLE]
const salesColors = computed(() => (salesHasData.value ? SALES_COLORS : [GRID_LINE]))
const salesTotal = computed(() => salesRawSeries.value.reduce((a, b) => a + b, 0))

const salesLegend = computed(() => {
  const labels = props.data.sales?.labels || []
  return labels.map((label, i) => {
    const value = salesRawSeries.value[i] || 0
    const pct = salesTotal.value ? Math.round((value / salesTotal.value) * 100) : 0
    return { label, value, pct, color: SALES_COLORS[i % SALES_COLORS.length] }
  })
})

const salesOptions = computed(() => ({
  chart: {
    type: 'donut',
    foreColor: TEXT_MUTED,
    fontFamily: 'Inter, sans-serif',
    animations: { easing: 'easeOutCubic', speed: 600 },
    parentHeightOffset: 0,
  },
  labels: salesLabels.value,
  colors: salesColors.value,
  stroke: { width: 4, colors: ['#15201A'] },
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      expandOnClick: false,
      donut: {
        size: '78%',
        background: 'transparent',
        labels: {
          show: true,
          name: { fontSize: '11px', color: TEXT_MUTED, offsetY: 18 },
          value: {
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#fff',
            offsetY: -10,
            formatter: () => salesTotal.value.toLocaleString(),
          },
          total: {
            show: true,
            label: 'Total orders',
            color: TEXT_MUTED,
            fontSize: '11px',
            formatter: () => salesTotal.value.toLocaleString(),
          },
        },
      },
    },
  },
  tooltip: {
    ...baseTooltip,
    y: {
      formatter: (v) =>
        `${v} (${salesTotal.value ? Math.round((v / salesTotal.value) * 100) : 0}%)`,
    },
  },
}))
</script>

<template>
  <div class="dash-charts-grid">
    <!-- Sales Overview (left) -->
    <article class="dash-chart-card">
      <header class="dash-chart-head">
        <div>
          <h3 class="dash-chart-title">Sales Overview</h3>
          <p class="dash-chart-sub">Distribution by status</p>
        </div>
      </header>

      <div class="dash-donut-row">
        <div class="dash-donut-wrap">
          <VueApexCharts type="donut" height="220" :options="salesOptions" :series="salesSeries" />
        </div>

        <ul class="dash-legend dash-legend--side">
          <li v-for="item in salesLegend" :key="item.label" class="dash-legend-item">
            <span class="dash-legend-dot" :style="{ background: item.color }"></span>
            <span class="dash-legend-label">{{ item.label }}</span>
            <span class="dash-legend-pct">{{ item.pct }}%</span>
          </li>
        </ul>
      </div>
    </article>

    <!-- Revenue (right, wide) -->
    <article class="dash-chart-card dash-chart-card--wide">
      <header class="dash-chart-head dash-chart-head--stack">
        <div>
          <h3 class="dash-chart-title">Revenue</h3>
          <p class="dash-chart-sub">Earnings overview</p>
        </div>
        <div class="dash-range">
          <button
            v-for="r in ['7d', '30d', '90d']"
            :key="r"
            type="button"
            class="dash-range-btn"
            :class="{ 'is-active': range === r }"
            @click="range = r"
          >
            {{ r === '7d' ? '7D' : r === '30d' ? '30D' : '90D' }}
          </button>
        </div>
      </header>

      <div class="dash-stats-row">
        <div class="dash-stat">
          <span class="dash-stat-label">Total</span>
          <span class="dash-stat-value">{{ fmtMoney(revenueTotal) }}</span>
        </div>
        <div class="dash-stat">
          <span class="dash-stat-label">Avg / day</span>
          <span class="dash-stat-value dash-stat-value--muted">{{ fmtMoney(revenueAvg) }}</span>
        </div>
        <div class="dash-stat">
          <span class="dash-stat-label">Trend</span>
          <span class="dash-chart-chip dash-chart-chip--positive">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            >
              <polyline points="6 14 12 8 18 14" />
            </svg>
            {{ data.revenue?.delta || '+0%' }}
          </span>
        </div>
      </div>

      <VueApexCharts type="area" height="220" :options="revenueOptions" :series="revenueSeries" />
    </article>

    <!-- Profit (full width) -->
    <article class="dash-chart-card dash-chart-card--wide">
      <header class="dash-chart-head">
        <div>
          <h3 class="dash-chart-title">Total Profit</h3>
          <p class="dash-chart-sub">Weekly buckets</p>
        </div>
        <span class="dash-chart-chip dash-chart-chip--warning">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <polyline points="6 14 12 8 18 14" />
          </svg>
          {{ data.profit?.delta || '+0%' }}
        </span>
      </header>
      <VueApexCharts type="bar" height="220" :options="profitOptions" :series="profitSeries" />
    </article>
  </div>
</template>
