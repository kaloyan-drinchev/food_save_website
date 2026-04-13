<script setup>
import { useTheme } from '@/composables/useTheme'

const emit = defineEmits(['logout', 'refresh', 'toggleSidebar'])
defineProps({ lastUpdated: { type: String, default: '' } })

const { theme, toggle } = useTheme()
</script>

<template>
  <div class="dash-header">
    <div class="dash-header-left">
      <button class="sidebar-toggle" aria-label="Toggle sidebar" @click="emit('toggleSidebar')">
        <span></span><span></span><span></span>
      </button>
      <img src="/assets/images/logo.svg" alt="FoodSave" class="dash-logo" />
      <span class="dash-badge">ADMIN</span>
    </div>
    <div class="dash-header-right">
      <span class="dash-updated">{{ lastUpdated }}</span>
      <button class="btn-sm btn-theme" :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggle">
        <FontAwesomeIcon :icon="theme === 'dark' ? 'sun' : 'moon'" />
      </button>
      <button class="btn-sm btn-refresh" @click="emit('refresh')">Refresh</button>
      <button class="btn-sm btn-logout" @click="emit('logout')">Logout</button>
    </div>
  </div>
</template>
