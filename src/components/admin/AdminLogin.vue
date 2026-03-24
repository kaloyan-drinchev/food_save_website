<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])
const username = ref('')
const password = ref('')
const showError = ref(false)

function onSubmit() {
  showError.value = false
  if (username.value.trim() === 'admin' && password.value === 'guiadmin') {
    sessionStorage.setItem('fs_admin', 'true')
    emit('login')
  } else {
    showError.value = true
  }
}
</script>

<template>
  <div class="login-screen">
    <div class="login-card">
      <div class="login-logo">🌿 FoodSave</div>
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
        <button type="submit" class="login-btn">Sign In</button>
        <p class="login-error" :style="{ display: showError ? 'block' : 'none' }">
          Invalid credentials
        </p>
      </form>
    </div>
  </div>
</template>
