<script setup>
import { ref } from 'vue'
import { api } from '@/services/api'

const emit = defineEmits(['login'])
const username = ref('')
const password = ref('')
const showError = ref(false)
const errorMsg = ref('')
const loading = ref(false)

async function onSubmit() {
  showError.value = false
  errorMsg.value = ''
  loading.value = true
  try {
    await api.admin.login(username.value.trim(), password.value)
    emit('login')
  } catch (e) {
    errorMsg.value = e?.message || 'Invalid credentials'
    showError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-screen">
    <div class="login-card">
      <div class="login-logo">
        <img src="/assets/images/logo.svg" alt="FoodSave" class="login-logo-img" />
      </div>
      <p class="login-subtitle">Admin Dashboard</p>
      <form @submit.prevent="onSubmit">
        <div class="login-field">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" autocomplete="username" required />
        </div>
        <div class="login-field">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            autocomplete="current-password"
            required
          />
        </div>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Sign In' }}
        </button>
        <p class="login-error" :style="{ display: showError ? 'block' : 'none' }">
          {{ errorMsg || 'Invalid credentials' }}
        </p>
      </form>
    </div>
  </div>
</template>
