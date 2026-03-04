<script setup>
import { ref, onMounted } from 'vue'
import '@/assets/css/admin.css'
import { RouterView } from 'vue-router'
import AdminLogin from '@/components/admin/AdminLogin.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'

const isLoggedIn = ref(sessionStorage.getItem('fs_admin') === 'true')
const sidebarOpen = ref(false)

function login() {
  sessionStorage.setItem('fs_admin', 'true')
  isLoggedIn.value = true
}

function logout() {
  sessionStorage.removeItem('fs_admin')
  isLoggedIn.value = false
  sidebarOpen.value = false
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}

onMounted(() => {
  document.title = 'FoodSave — Admin Dashboard'
})
</script>

<template>
  <AdminLogin v-if="!isLoggedIn" @login="login" />

  <div v-else class="dashboard">
    <AdminHeader
      @logout="logout"
      @refresh="() => {}"
      @toggle-sidebar="toggleSidebar"
    />

    <div class="dash-layout">
      <AdminSidebar
        :is-open="sidebarOpen"
        @close="closeSidebar"
      />

      <div class="dash-main">
        <div class="dash-body">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
