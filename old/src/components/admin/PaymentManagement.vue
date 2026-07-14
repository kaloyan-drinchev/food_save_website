<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api'

const payments = ref([])
const loading = ref(true)
const filter = ref('all')
const search = ref('')

function mapPayment(p) {
  return {
    id: String(p.id),
    date: p.createdAt
      ? new Date(p.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '',
    customer: p.userId ? 'User #' + p.userId : '-',
    partner: p.orderId ? 'Order #' + p.orderId : '-',
    amount: ((p.amount || 0) / 100).toFixed(2) + ' лв',
    amountNum: (p.amount || 0) / 100,
    status: p.status || 'pending',
  }
}

async function loadPayments() {
  loading.value = true
  try {
    // No /admin/payments endpoint yet — aggregate from /admin/orders.
    const orders = await api.admin.listOrders()
    const list = []
    for (const o of Array.isArray(orders) ? orders : []) {
      const ps = Array.isArray(o.payments) ? o.payments : []
      for (const p of ps) {
        list.push(mapPayment({ ...p, orderId: o.id, userId: o.userId }))
      }
    }
    payments.value = list
  } catch (e) {
    payments.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadPayments)

const filtered = computed(() => {
  let list = payments.value
  if (filter.value !== 'all') {
    list = list.filter((p) => p.status === filter.value)
  }
  const q = search.value.trim().toLowerCase()
  if (!q) return list
  return list.filter(
    (p) =>
      p.id.toLowerCase().includes(q) ||
      p.date.toLowerCase().includes(q) ||
      p.customer.toLowerCase().includes(q) ||
      p.partner.toLowerCase().includes(q) ||
      p.amount.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q),
  )
})

const summaryCards = computed(() => {
  const all = payments.value
  return [
    { label: 'Total Transactions', value: all.length, color: '' },
    {
      label: 'Total Amount',
      value: all.reduce((s, p) => s + p.amountNum, 0).toFixed(2) + ' лв',
      color: 'green',
    },
    { label: 'Pending', value: all.filter((p) => p.status === 'pending').length, color: 'accent' },
    { label: 'Blocked', value: all.filter((p) => p.status === 'blocked').length, color: 'red' },
  ]
})

function unblock(payment) {
  payment.status = 'pending'
}

function markComplete(payment) {
  payment.status = 'completed'
}

function statusClass(status) {
  const map = {
    pending: 'badge-payment-pending',
    completed: 'badge-payment-completed',
    blocked: 'badge-payment-blocked',
    refunded: 'badge-payment-refunded',
  }
  return map[status] || ''
}
</script>

<template>
  <div class="ops-panel">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <span class="loading-text">Loading payments...</span>
    </div>

    <template v-else>
      <div class="ops-inline-toolbar">
        <div class="ops-stats-strip">
          <template v-for="(card, index) in summaryCards" :key="card.label">
            <div class="ops-stat">
              <span
                class="ops-stat-dot"
                :class="card.color ? `dot-${card.color}` : 'dot-neutral'"
              ></span>
              <span class="ops-stat-value">{{ card.value }}</span>
              <span class="ops-stat-label">{{ card.label }}</span>
            </div>
            <div v-if="index < summaryCards.length - 1" class="ops-stat-divider"></div>
          </template>
        </div>

        <div class="ops-inline-controls">
          <input
            v-model="search"
            type="text"
            class="ops-search"
            placeholder="Search by TX ID, customer, partner..."
          />
          <select v-model="filter" class="ops-filter">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div class="ops-count">{{ filtered.length }} transactions</div>

      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>TX ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Partner</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filtered" :key="p.id">
              <td style="font-family: monospace; font-size: 0.78rem">{{ p.id }}</td>
              <td>{{ p.date }}</td>
              <td>{{ p.customer }}</td>
              <td>{{ p.partner }}</td>
              <td>{{ p.amount }}</td>
              <td>
                <span class="badge" :class="statusClass(p.status)">{{ p.status }}</span>
              </td>
              <td class="ops-actions">
                <button v-if="p.status === 'blocked'" class="btn-xs btn-enable" @click="unblock(p)">
                  Unblock
                </button>
                <button
                  v-if="p.status === 'pending'"
                  class="btn-xs btn-confirm"
                  @click="markComplete(p)"
                >
                  Complete
                </button>
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="7" style="text-align: center; padding: 24px; color: var(--fs-outline)">
                No transactions found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
