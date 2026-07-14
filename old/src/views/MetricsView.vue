<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { api } from '@/services/api'
import KpiGrid from '@/components/admin/KpiGrid.vue'
import PartnersTable from '@/components/admin/PartnersTable.vue'
import OrdersTable from '@/components/admin/OrdersTable.vue'
import OverviewCharts from '@/components/admin/OverviewCharts.vue'
import CustomerList from '@/components/admin/CustomerList.vue'

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
    const [users, businesses, orders] = await Promise.all([
      api.admin.listUsers().catch(() => []),
      api.admin.listBusinesses().catch(() => []),
      api.admin.listOrders().catch(() => []),
    ])

    const userList = Array.isArray(users) ? users : []
    const bizList = Array.isArray(businesses) ? businesses : []
    const orderList = Array.isArray(orders) ? orders : []
    // Aggregate payments from orders (no /admin/payments endpoint yet).
    const paymentList = orderList.flatMap((o) => (Array.isArray(o.payments) ? o.payments : []))

    const overviewGroups = [
      {
        title: 'Partners',
        description: 'Partner network health and verification status.',
        kpis: [
          {
            label: 'Partner Businesses',
            value: String(bizList.length),
            desc: 'Active food partners',
            color: '',
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
        ],
      },
      {
        title: 'Orders',
        description: 'Order volume and current fulfillment pipeline.',
        kpis: [
          {
            label: 'Total Orders',
            value: String(orderList.length),
            desc: 'All time',
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
        ],
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

    /* ---------- chart data ---------- */
    const days = 30
    const revLabels = dateLabels(days)
    const revData = new Array(days).fill(0)
    const profitData = new Array(days).fill(0)
    const todayMid = new Date()
    todayMid.setHours(0, 0, 0, 0)

    for (const o of orderList) {
      const payments = Array.isArray(o.payments) ? o.payments : []
      for (const p of payments) {
        if (p.status !== 'completed') continue
        const d = new Date(p.createdAt || o.createdAt || 0)
        const idx = days - 1 - Math.floor((todayMid - d) / 86400000)
        if (idx >= 0 && idx < days) {
          const amt = (p.amount || 0) / 100
          revData[idx] += amt
          profitData[idx] += amt * 0.25
        }
      }
    }

    // Weekly profit buckets (last 8 weeks)
    const profitWeeks = []
    const profitWeekLabels = []
    for (let w = 7; w >= 0; w--) {
      const start = new Date(todayMid)
      start.setDate(start.getDate() - (w + 1) * 7 + 1)
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      let sum = 0
      for (const o of orderList) {
        const payments = Array.isArray(o.payments) ? o.payments : []
        for (const p of payments) {
          if (p.status !== 'completed') continue
          const d = new Date(p.createdAt || o.createdAt || 0)
          if (d >= start && d <= end) sum += ((p.amount || 0) / 100) * 0.25
        }
      }
      profitWeeks.push(Number(sum.toFixed(2)))
      profitWeekLabels.push('W-' + w)
    }

    const statusCount = { Completed: 0, Pending: 0, Cancelled: 0, Other: 0 }
    for (const o of orderList) {
      if (o.status === 'completed' || o.status === 'picked_up') statusCount.Completed++
      else if (o.status === 'pending') statusCount.Pending++
      else if (o.status === 'cancelled') statusCount.Cancelled++
      else statusCount.Other++
    }

    const chartData = {
      revenue: {
        labels: revLabels,
        data: revData.map((v) => Number(v.toFixed(2))),
        delta: '+0.4% vs last month',
      },
      profit: {
        labels: profitWeekLabels,
        data: profitWeeks,
        delta: '+12% vs last week',
      },
      sales: {
        labels: Object.keys(statusCount),
        data: Object.values(statusCount),
      },
    }

    /* ---------- customer list ---------- */
    const byUser = new Map()
    for (const o of orderList) {
      const uid = o.userId || o.user?.id
      if (!uid) continue
      if (!byUser.has(uid)) {
        const u = o.user || userList.find((x) => x.id === uid) || {}
        const name =
          [u.customer?.firstName, u.customer?.lastName].filter(Boolean).join(' ') ||
          u.email ||
          'User #' + uid
        byUser.set(uid, {
          id: uid,
          name,
          email: u.email || `user${uid}@foodsave.app`,
          deals: 0,
          total: 0,
        })
      }
      const c = byUser.get(uid)
      c.deals += 1
      c.total += (o.totalPrice || 0) / 100
    }
    const customers = Array.from(byUser.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
      .map((c) => ({
        ...c,
        totalValue: c.total.toLocaleString('bg-BG', { minimumFractionDigits: 2 }) + ' лв',
      }))

    dashData.value = { overviewGroups, partners, recentOrders, chartData, customers }
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
      <KpiGrid :groups="dashData.overviewGroups" />
    </section>

    <section id="sec-charts" class="admin-section">
      <OverviewCharts :data="dashData.chartData" />
    </section>

    <section id="sec-customers" class="admin-section">
      <CustomerList :customers="dashData.customers" />
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
