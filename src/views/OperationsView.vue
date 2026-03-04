<script setup>
import { ref, watch } from 'vue'
import UserManagement from '@/components/admin/UserManagement.vue'
import BusinessManagement from '@/components/admin/BusinessManagement.vue'
import PaymentManagement from '@/components/admin/PaymentManagement.vue'
import RefundManagement from '@/components/admin/RefundManagement.vue'

const activeTab = ref('users')
const refundPrefillTxId = ref('')

const tabs = [
  { id: 'users', label: 'Users', icon: '👤' },
  { id: 'businesses', label: 'Businesses', icon: '🏪' },
  { id: 'payments', label: 'Payments', icon: '💳' },
  { id: 'refunds', label: 'Refunds', icon: '↩️' },
]

function gotoRefunds(txId) {
  refundPrefillTxId.value = txId
  activeTab.value = 'refunds'
}

watch(activeTab, (val) => {
  if (val !== 'refunds') refundPrefillTxId.value = ''
})
</script>

<template>
  <div class="ops-container">
    <div class="ops-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="ops-tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <span class="ops-tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </div>

    <div class="ops-content">
      <UserManagement v-if="activeTab === 'users'" />
      <BusinessManagement v-if="activeTab === 'businesses'" />
      <PaymentManagement v-if="activeTab === 'payments'" @goto-refunds="gotoRefunds" />
      <RefundManagement v-if="activeTab === 'refunds'" :prefill-tx-id="refundPrefillTxId" />
    </div>
  </div>
</template>
