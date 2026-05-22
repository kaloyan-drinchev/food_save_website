<script setup>
import { ref, onMounted } from 'vue'
import '@/assets/css/admin.css'
import { RouterView, useRouter } from 'vue-router'
import { api } from '@/services/api'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'

const router = useRouter()
const isLoggedIn = ref(!!sessionStorage.getItem('fs_admin_token'))
const sidebarOpen = ref(false)

function logout() {
  api.admin.logout()
  isLoggedIn.value = false
  sidebarOpen.value = false
  router.replace({ name: 'admin-login' })
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}

onMounted(() => {
  document.title = 'FoodSave — Admin Dashboard'
  if (!isLoggedIn.value) {
    router.replace({ name: 'admin-login' })
  }
})
</script>

<template>
  <div v-if="isLoggedIn" class="dashboard">
    <AdminHeader @logout="logout" @refresh="() => {}" @toggle-sidebar="toggleSidebar" />

    <div class="dash-layout">
      <AdminSidebar :is-open="sidebarOpen" @close="closeSidebar" />

      <div class="dash-main">
        <div class="dash-body">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
