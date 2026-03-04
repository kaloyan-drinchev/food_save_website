<script setup>
import { computed } from 'vue'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Filler, Tooltip, Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend)

ChartJS.defaults.color = '#bdbdbd'
ChartJS.defaults.borderColor = 'rgba(255,255,255,0.06)'
ChartJS.defaults.font.family = "'Inter', sans-serif"
ChartJS.defaults.plugins.legend.display = false
ChartJS.defaults.plugins.tooltip.backgroundColor = '#1a2e1b'
ChartJS.defaults.plugins.tooltip.borderColor = '#424242'
ChartJS.defaults.plugins.tooltip.borderWidth = 1
ChartJS.defaults.plugins.tooltip.cornerRadius = 8
ChartJS.defaults.plugins.tooltip.titleColor = '#ffffff'
ChartJS.defaults.plugins.tooltip.bodyColor = '#bdbdbd'
ChartJS.defaults.plugins.tooltip.padding = 12
ChartJS.defaults.elements.point.radius = 0
ChartJS.defaults.elements.point.hoverRadius = 5
ChartJS.defaults.elements.point.hoverBackgroundColor = '#69f0ae'
ChartJS.defaults.elements.line.tension = 0.35
ChartJS.defaults.elements.line.borderWidth = 2
ChartJS.defaults.elements.bar.borderRadius = 4

const props = defineProps({
  data: { type: Object, required: true },
  section: { type: String, default: 'all' },
})

const scaleOpts = {
  x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { maxTicksLimit: 8, color: '#616161', font: { size: 10 } } },
  y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { maxTicksLimit: 6, color: '#616161', font: { size: 10 } }, beginAtZero: true },
}

const lineOpts = { responsive: true, maintainAspectRatio: false, scales: scaleOpts }
const barOpts = { responsive: true, maintainAspectRatio: false, scales: scaleOpts }
const doughOpts = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: { legend: { display: true, position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10, font: { size: 12 } } } },
}

function lineData(labels, data, color) {
  return { labels, datasets: [{ data, borderColor: color, backgroundColor: color + '33', fill: true, pointHitRadius: 10 }] }
}
function barData(labels, data, color) {
  return { labels, datasets: [{ data, backgroundColor: color + '99', hoverBackgroundColor: color }] }
}
function doughData(labels, data, colors) {
  return { labels, datasets: [{ data, backgroundColor: colors, borderColor: '#243425', borderWidth: 2, hoverOffset: 6 }] }
}
</script>

<template>
  <template v-if="section === 'analytics' || section === 'all'">
    <div class="charts-grid">
      <div class="chart-card">
        <h3>User Growth (last 90 days)</h3>
        <div class="chart-wrap"><Line :data="lineData(data.userGrowth.labels, data.userGrowth.data, '#69f0ae')" :options="lineOpts" /></div>
      </div>
      <div class="chart-card">
        <h3>Daily Active Users (last 30 days)</h3>
        <div class="chart-wrap"><Line :data="lineData(data.dau.labels, data.dau.data, '#3b82f6')" :options="lineOpts" /></div>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>Orders per Day (last 30 days)</h3>
        <div class="chart-wrap"><Bar :data="barData(data.ordersPerDay.labels, data.ordersPerDay.data, '#69f0ae')" :options="barOpts" /></div>
      </div>
      <div class="chart-card">
        <h3>Food Saved per Day — kg (last 30 days)</h3>
        <div class="chart-wrap"><Line :data="lineData(data.foodSavedPerDay.labels, data.foodSavedPerDay.data, '#2dd4bf')" :options="lineOpts" /></div>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>Orders by Business Category</h3>
        <div class="chart-wrap"><Doughnut :data="doughData(data.categories.labels, data.categories.data, ['#69f0ae','#ff8f00','#3b82f6','#8b5cf6'])" :options="doughOpts" /></div>
      </div>
      <div class="chart-card">
        <h3>Pickup Completion Rate</h3>
        <div class="chart-wrap"><Doughnut :data="doughData(data.pickupCompletion.labels, data.pickupCompletion.data, ['#69f0ae','#ef9a9a'])" :options="doughOpts" /></div>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>Waitlist Signups (last 30 days)</h3>
        <div class="chart-wrap"><Bar :data="barData(data.waitlistSignups.labels, data.waitlistSignups.data, '#8b5cf6')" :options="barOpts" /></div>
      </div>
      <div class="chart-card">
        <h3>Waitlist Breakdown</h3>
        <div class="chart-wrap"><Doughnut :data="doughData(data.waitlistBreakdown.labels, data.waitlistBreakdown.data, ['#69f0ae','#ff8f00','#3b82f6'])" :options="doughOpts" /></div>
      </div>
    </div>
  </template>

  <template v-if="section === 'revenue' || section === 'all'">
    <div class="charts-grid">
      <div class="chart-card">
        <h3>Revenue per Day — лв (last 30 days)</h3>
        <div class="chart-wrap"><Line :data="lineData(data.revenuePerDay.labels, data.revenuePerDay.data, '#ff8f00')" :options="lineOpts" /></div>
      </div>
      <div class="chart-card">
        <h3>CO₂ Prevented per Day — kg (last 30 days)</h3>
        <div class="chart-wrap"><Line :data="lineData(data.co2PerDay.labels, data.co2PerDay.data, '#2dd4bf')" :options="lineOpts" /></div>
      </div>
    </div>
  </template>
</template>
