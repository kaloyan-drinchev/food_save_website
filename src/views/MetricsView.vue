<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { generateMockData } from '@/composables/useAdminMock'
import KpiGrid from '@/components/admin/KpiGrid.vue'
import DashboardCharts from '@/components/admin/DashboardCharts.vue'
import PartnersTable from '@/components/admin/PartnersTable.vue'
import OrdersTable from '@/components/admin/OrdersTable.vue'
import EventsGrid from '@/components/admin/EventsGrid.vue'

const loading = ref(true)
const dashData = ref(null)

let scrollObserver = null

function load() {
  loading.value = true
  setTimeout(() => {
    dashData.value = generateMockData()
    loading.value = false
    nextTick(setupScrollSpy)
  }, 400)
}

function setupScrollSpy() {
  if (scrollObserver) scrollObserver.disconnect()
  const sections = document.querySelectorAll('.admin-section')
  scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // scroll spy for future use
        }
      })
    },
    { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
  )
  sections.forEach((sec) => scrollObserver.observe(sec))
}

onMounted(load)
onUnmounted(() => { if (scrollObserver) scrollObserver.disconnect() })
</script>

<template>
  <div v-if="loading" class="loading-overlay">
    <div class="spinner"></div>
    <span class="loading-text">Loading metrics...</span>
  </div>

  <template v-else-if="dashData">
    <section id="sec-overview" class="admin-section">
      <h2 class="admin-section-title">Overview</h2>
      <KpiGrid :kpis="dashData.kpis" />
    </section>

    <section id="sec-analytics" class="admin-section">
      <h2 class="admin-section-title">Analytics</h2>
      <DashboardCharts :data="dashData" section="analytics" />
    </section>

    <section id="sec-revenue" class="admin-section">
      <h2 class="admin-section-title">Revenue</h2>
      <DashboardCharts :data="dashData" section="revenue" />
    </section>

    <section id="sec-partners" class="admin-section">
      <h2 class="admin-section-title">Partners</h2>
      <PartnersTable :partners="dashData.partners" />
    </section>

    <section id="sec-events" class="admin-section">
      <h2 class="admin-section-title">Platform Events</h2>
      <EventsGrid :events="dashData.platformEvents" />
    </section>

    <section id="sec-orders" class="admin-section">
      <h2 class="admin-section-title">Recent Orders</h2>
      <OrdersTable :orders="dashData.recentOrders" />
    </section>
  </template>
</template>
