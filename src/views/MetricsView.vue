<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { api } from '@/services/api'
import KpiGrid from '@/components/admin/KpiGrid.vue'
import PartnersTable from '@/components/admin/PartnersTable.vue'
import OrdersTable from '@/components/admin/OrdersTable.vue'

const loading = ref(true)
const dashData = ref(null)
const error = ref('')

let scrollObserver = null

function dateLabels(days) {
  const labels = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    labels.push(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))
  }
  return labels
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (diff < 60) return `${diff}m ago`
  const h = Math.floor(diff / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [businesses, orders, payments] = await Promise.all([
      api.getBusinesses().catch(() => []),
      api.getOrders().catch(() => []),
      api.getPayments().catch(() => []),
    ])

    const bizList = Array.isArray(businesses) ? businesses : []
    const orderList = Array.isArray(orders) ? orders : []
    const paymentList = Array.isArray(payments) ? payments : []

    // Compute total revenue from payments (amounts in stotinki)
    const totalRevenue =
      paymentList.filter((p) => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0) /
      100
    const platformRevenue = totalRevenue * 0.25

    const kpis = [
      {
        label: 'Partner Businesses',
        value: String(bizList.length),
        desc: 'Active food partners',
        color: '',
      },
      { label: 'Total Orders', value: String(orderList.length), desc: 'All time', color: 'green' },
      {
        label: 'Total Revenue',
        value: totalRevenue.toLocaleString('bg-BG', { minimumFractionDigits: 2 }) + ' лв',
        desc: 'From completed payments',
        color: '',
      },
      {
        label: 'Platform Revenue',
        value: platformRevenue.toLocaleString('bg-BG', { minimumFractionDigits: 2 }) + ' лв',
        desc: '25% commission',
        color: 'green',
      },
      {
        label: 'Completed Orders',
        value: String(
          orderList.filter((o) => o.status === 'picked_up' || o.status === 'completed').length,
        ),
        desc: 'Successfully fulfilled',
        color: 'green',
      },
      {
        label: 'Pending Orders',
        value: String(orderList.filter((o) => o.status === 'pending').length),
        desc: 'Awaiting confirmation',
        color: 'accent',
      },
      {
        label: 'Verified Businesses',
        value: String(bizList.filter((b) => b.isVerified).length),
        desc: 'Verified partners',
        color: 'green',
      },
      {
        label: 'Unverified Businesses',
        value: String(bizList.filter((b) => !b.isVerified).length),
        desc: 'Awaiting verification',
        color: 'accent',
      },
      {
        label: 'Total Payments',
        value: String(paymentList.length),
        desc: 'All transactions',
        color: '',
      },
      {
        label: 'Avg Order Value',
        value:
          orderList.length > 0
            ? (
                orderList.reduce((s, o) => s + (o.totalPrice || 0), 0) /
                orderList.length /
                100
              ).toFixed(2) + ' лв'
            : '0 лв',
        desc: 'Average total price',
        color: '',
      },
    ]

    // Partners table from businesses
    const partners = bizList
      .map((b) => ({
        name: b.companyName || 'Unnamed',
        category: b.businessType?.type || 'Unknown',
        orders: 0, // no per-business order count from API
        foodSaved: '-',
        rating: b.rating || 0,
      }))
      .sort((a, b) => b.rating - a.rating)

    // Recent orders
    const recentOrders = orderList.slice(0, 20).map((o) => ({
      time: o.createdAt ? timeAgo(o.createdAt) : '-',
      customer: o.user
        ? [o.user.customer?.firstName, o.user.customer?.lastName].filter(Boolean).join(' ') ||
          o.user.email
        : 'User #' + o.userId,
      partner:
        o.businessLocation?.name ||
        o.businessLocation?.address ||
        'Location #' + (o.businessLocationId || ''),
      items: o.items?.map((i) => i.productLocation?.product?.name || 'Item').join(', ') || '-',
      amount: ((o.totalPrice || 0) / 100).toFixed(2) + ' лв',
      status: o.status || 'pending',
    }))

    dashData.value = { kpis, partners, recentOrders }
  } catch (e) {
    error.value = 'Failed to load metrics: ' + e.message
  } finally {
    loading.value = false
    nextTick(setupScrollSpy)
  }
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
    { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 },
  )
  sections.forEach((sec) => scrollObserver.observe(sec))
}

onMounted(load)
onUnmounted(() => {
  if (scrollObserver) scrollObserver.disconnect()
})
</script>

<template>
  <div v-if="loading" class="loading-overlay">
    <div class="spinner"></div>
    <span class="loading-text">Loading metrics...</span>
  </div>

  <div
    v-else-if="error"
    class="ops-panel"
    style="text-align: center; padding: 40px; color: #ef9a9a"
  >
    {{ error }}
    <br />
    <button class="btn-sm btn-primary" style="margin-top: 16px" @click="load">Retry</button>
  </div>

  <template v-else-if="dashData">
    <section id="sec-overview" class="admin-section">
      <h2 class="admin-section-title">Overview</h2>
      <KpiGrid :kpis="dashData.kpis" />
    </section>

    <section id="sec-partners" class="admin-section">
      <h2 class="admin-section-title">Partners</h2>
      <PartnersTable :partners="dashData.partners" />
    </section>

    <section id="sec-orders" class="admin-section">
      <h2 class="admin-section-title">Recent Orders</h2>
      <OrdersTable :orders="dashData.recentOrders" />
    </section>
  </template>
</template>
