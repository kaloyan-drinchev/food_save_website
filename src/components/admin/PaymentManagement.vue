<script setup>
import { ref, computed } from 'vue'
import { generateMockPayments } from '@/composables/useAdminMock'

const emit = defineEmits(['goto-refunds'])

const payments = ref(generateMockPayments())
const filter = ref('all')

const filtered = computed(() => {
  if (filter.value === 'all') return payments.value
  return payments.value.filter((p) => p.status === filter.value)
})

const summaryCards = computed(() => {
  const all = payments.value
  return [
    { label: 'Total Transactions', value: all.length, color: '' },
    { label: 'Total Amount', value: all.reduce((s, p) => s + p.amountNum, 0).toFixed(2) + ' лв', color: 'green' },
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

function initiateRefund(payment) {
  emit('goto-refunds', payment.id)
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
    <div class="ops-summary-grid">
      <div v-for="card in summaryCards" :key="card.label" class="ops-summary-card">
        <div class="ops-summary-value" :class="card.color">{{ card.value }}</div>
        <div class="ops-summary-label">{{ card.label }}</div>
      </div>
    </div>

    <div class="ops-toolbar">
      <select v-model="filter" class="ops-filter">
        <option value="all">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="blocked">Blocked</option>
        <option value="refunded">Refunded</option>
      </select>
      <span class="ops-count">{{ filtered.length }} transactions</span>
    </div>

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
            <td><span class="badge" :class="statusClass(p.status)">{{ p.status }}</span></td>
            <td class="ops-actions">
              <button v-if="p.status === 'blocked'" class="btn-xs btn-enable" @click="unblock(p)">Unblock</button>
              <button v-if="p.status === 'pending'" class="btn-xs btn-confirm" @click="markComplete(p)">Complete</button>
              <button v-if="p.status !== 'refunded'" class="btn-xs btn-refund" @click="initiateRefund(p)">Refund</button>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="7" style="text-align: center; padding: 24px; color: var(--fs-outline)">No transactions found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
