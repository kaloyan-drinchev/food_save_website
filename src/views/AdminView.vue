<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import '@/assets/css/admin.css'
import { generateMockData } from '@/composables/useAdminMock'
import AdminLogin from '@/components/admin/AdminLogin.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import KpiGrid from '@/components/admin/KpiGrid.vue'
import DashboardCharts from '@/components/admin/DashboardCharts.vue'
import PartnersTable from '@/components/admin/PartnersTable.vue'
import OrdersTable from '@/components/admin/OrdersTable.vue'
import EventsGrid from '@/components/admin/EventsGrid.vue'

const isLoggedIn = ref(sessionStorage.getItem('fs_admin') === 'true')
const sidebarOpen = ref(false)
const activeSection = ref('sec-overview')
const lastUpdated = ref('')
const loading = ref(true)
const dashData = ref(null)

let scrollObserver = null

function login() {
  sessionStorage.setItem('fs_admin', 'true')
  isLoggedIn.value = true
  nextTick(() => loadDashboard())
}

function logout() {
  sessionStorage.removeItem('fs_admin')
  isLoggedIn.value = false
  sidebarOpen.value = false
}

function loadDashboard() {
  loading.value = true
  setTimeout(() => {
    dashData.value = generateMockData()
    loading.value = false
    lastUpdated.value = 'Updated ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    nextTick(setupScrollSpy)
  }, 600)
}

function refresh() {
  loadDashboard()
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}

function navigateToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  sidebarOpen.value = false
}

function setupScrollSpy() {
  if (scrollObserver) scrollObserver.disconnect()
  const sections = document.querySelectorAll('.admin-section')
  scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
  )
  sections.forEach((sec) => scrollObserver.observe(sec))
}

onMounted(() => {
  document.title = 'FoodSave — Admin Dashboard'
  if (isLoggedIn.value) loadDashboard()
})

onUnmounted(() => {
  if (scrollObserver) scrollObserver.disconnect()
})
</script>

<template>
  <AdminLogin v-if="!isLoggedIn" @login="login" />

  <div v-else class="dashboard">
    <AdminHeader
      :last-updated="lastUpdated"
      @logout="logout"
      @refresh="refresh"
      @toggle-sidebar="toggleSidebar"
    />

    <div class="dash-layout">
      <AdminSidebar
        :is-open="sidebarOpen"
        :active-section="activeSection"
        @navigate="navigateToSection"
        @close="closeSidebar"
      />

      <div class="dash-main">
        <div class="dash-body">
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
              <DashboardCharts :data="dashData" />
            </section>

            <section id="sec-revenue" class="admin-section">
              <h2 class="admin-section-title">Revenue</h2>
              <div class="charts-grid">
                <div class="chart-card full-width">
                  <p style="color:var(--fs-on-surface-var);padding:20px;text-align:center">Revenue charts are included in the Analytics section above.</p>
                </div>
              </div>
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
        </div>
      </div>
    </div>
  </div>
</template>
