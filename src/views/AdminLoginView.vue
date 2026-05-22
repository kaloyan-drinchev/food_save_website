<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/css/admin.css'
import AdminLogin from '@/components/admin/AdminLogin.vue'

const router = useRouter()

onMounted(() => {
  document.title = 'FoodSave — Admin Login'
  // If already authenticated, skip the login screen.
  if (sessionStorage.getItem('fs_admin_token')) {
    router.replace({ name: 'admin' })
  }
})

function onLogin() {
  router.replace({ name: 'admin' })
}
</script>

<template>
  <AdminLogin @login="onLogin" />
</template>
