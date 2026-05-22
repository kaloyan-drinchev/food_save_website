<script setup>
import { ref } from 'vue'
import UserManagement from '@/components/admin/UserManagement.vue'
import BusinessManagement from '@/components/admin/BusinessManagement.vue'
import PaymentManagement from '@/components/admin/PaymentManagement.vue'

const activeTab = ref('users')

const tabs = [
  { id: 'users', label: 'Users', icon: '👤' },
  { id: 'businesses', label: 'Businesses', icon: '🏪' },
  { id: 'payments', label: 'Payments', icon: '💳' },
]
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
      <PaymentManagement v-if="activeTab === 'payments'" />
    </div>
  </div>
</template>
