<script setup>
import { ref } from 'vue'

const props = defineProps({
  prefillTxId: { type: String, default: '' },
})

// The API does not have refund endpoints yet.
// Refunds are managed locally until the backend adds support.
const pendingRefunds = ref([])
const processedRefunds = ref([])
const showManualForm = ref(false)
const manualForm = ref({ txId: props.prefillTxId || '', amount: '', reason: '' })
const confirmMsg = ref('')

function approveRefund(refund) {
  refund.status = 'approved'
  const now = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  processedRefunds.value.unshift({ ...refund, processedDate: now })
  pendingRefunds.value = pendingRefunds.value.filter((r) => r.id !== refund.id)
  confirmMsg.value = `Refund ${refund.id} approved`
  setTimeout(() => (confirmMsg.value = ''), 3000)
}

function rejectRefund(refund) {
  refund.status = 'rejected'
  const now = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  processedRefunds.value.unshift({ ...refund, processedDate: now })
  pendingRefunds.value = pendingRefunds.value.filter((r) => r.id !== refund.id)
  confirmMsg.value = `Refund ${refund.id} rejected`
  setTimeout(() => (confirmMsg.value = ''), 3000)
}

function openManualRefund() {
  manualForm.value = { txId: props.prefillTxId || '', amount: '', reason: '' }
  showManualForm.value = true
}

function submitManualRefund() {
  if (!manualForm.value.txId || !manualForm.value.amount) return
  const newRefund = {
    id: `RF-${String(3000 + pendingRefunds.value.length).padStart(4, '0')}`,
    txId: manualForm.value.txId,
    customer: 'Manual Entry',
    amount: parseFloat(manualForm.value.amount).toFixed(2) + ' лв',
    amountNum: parseFloat(manualForm.value.amount),
    reason: manualForm.value.reason || 'Manual refund',
    requested: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    status: 'pending',
  }
  pendingRefunds.value.unshift(newRefund)
  showManualForm.value = false
  confirmMsg.value = `Manual refund ${newRefund.id} created`
  setTimeout(() => (confirmMsg.value = ''), 3000)
}

function statusBadge(status) {
  const map = {
    pending: 'badge-payment-pending',
    approved: 'badge-active',
    rejected: 'badge-disabled',
  }
  return map[status] || ''
}
</script>

<template>
  <div class="ops-panel">
    <div class="ops-toolbar">
      <h3 style="font-size: 1rem; font-weight: 700; color: var(--fs-on-surface)">
        Pending Refunds ({{ pendingRefunds.length }})
      </h3>
      <button class="btn-sm btn-primary" @click="openManualRefund">+ Manual Refund</button>
    </div>

    <div v-if="confirmMsg" class="ops-toast">{{ confirmMsg }}</div>

    <div class="data-table-wrapper" style="margin-bottom: 24px">
      <table class="data-table">
        <thead>
          <tr>
            <th>Refund ID</th>
            <th>TX ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Reason</th>
            <th>Requested</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in pendingRefunds" :key="r.id">
            <td style="font-family: monospace; font-size: 0.78rem">{{ r.id }}</td>
            <td style="font-family: monospace; font-size: 0.78rem">{{ r.txId }}</td>
            <td>{{ r.customer }}</td>
            <td>{{ r.amount }}</td>
            <td>{{ r.reason }}</td>
            <td>{{ r.requested }}</td>
            <td class="ops-actions">
              <button class="btn-xs btn-confirm" @click="approveRefund(r)">Approve</button>
              <button class="btn-xs btn-disable" @click="rejectRefund(r)">Reject</button>
            </td>
          </tr>
          <tr v-if="pendingRefunds.length === 0">
            <td colspan="7" style="text-align: center; padding: 24px; color: var(--fs-outline)">
              No pending refunds
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 style="font-size: 1rem; font-weight: 700; color: var(--fs-on-surface); margin-bottom: 12px">
      Processed Refunds ({{ processedRefunds.length }})
    </h3>
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Refund ID</th>
            <th>TX ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Reason</th>
            <th>Processed</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in processedRefunds" :key="r.id">
            <td style="font-family: monospace; font-size: 0.78rem">{{ r.id }}</td>
            <td style="font-family: monospace; font-size: 0.78rem">{{ r.txId }}</td>
            <td>{{ r.customer }}</td>
            <td>{{ r.amount }}</td>
            <td>{{ r.reason }}</td>
            <td>{{ r.processedDate }}</td>
            <td>
              <span class="badge" :class="statusBadge(r.status)">{{ r.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="showManualForm" class="ops-modal-overlay" @click.self="showManualForm = false">
        <div class="ops-modal-card">
          <h3 class="ops-modal-title">Manual Refund</h3>
          <div class="ops-field">
            <label>Transaction ID</label>
            <input v-model="manualForm.txId" type="text" placeholder="e.g. TX-05012" />
          </div>
          <div class="ops-field">
            <label>Amount (лв)</label>
            <input
              v-model="manualForm.amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
          <div class="ops-field">
            <label>Reason</label>
            <input v-model="manualForm.reason" type="text" placeholder="Reason for refund" />
          </div>
          <div class="ops-modal-actions">
            <button class="btn-sm btn-primary" @click="submitManualRefund">Submit Refund</button>
            <button class="btn-sm btn-cancel" @click="showManualForm = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
