<script setup>
import { ref } from 'vue'

const emit = defineEmits(['logout', 'refresh', 'toggleSidebar'])
defineProps({ lastUpdated: { type: String, default: '' } })
</script>

<template>
  <div class="dash-header">
    <div class="dash-header-left">
      <button class="sidebar-toggle" aria-label="Toggle sidebar" @click="emit('toggleSidebar')">
        <span></span><span></span><span></span>
      </button>
      <span class="dash-logo">🌿 FoodSave</span>
      <span class="dash-badge">ADMIN</span>
    </div>
    <div class="dash-header-right">
      <span class="dash-updated">{{ lastUpdated }}</span>
      <button class="btn-sm btn-refresh" @click="emit('refresh')">Refresh</button>
      <button class="btn-sm btn-logout" @click="emit('logout')">Logout</button>
    </div>
  </div>
</template>
