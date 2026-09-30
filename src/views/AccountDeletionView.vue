<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '@/services/api'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const user = ref(null)
const step = ref('login')
const loading = ref(false)
const error = ref('')
const acknowledged = ref(false)

const displayEmail = computed(() => user.value?.email || email.value.trim())

onMounted(() => {
  document.title = 'Delete your FoodSave account'
})

async function signIn() {
  error.value = ''
  loading.value = true

  try {
    const data = await api.login(email.value.trim(), password.value)
    user.value = data.user || { email: email.value.trim() }
    password.value = ''
    step.value = 'confirm'
  } catch (err) {
    error.value =
      err?.status === 401
        ? 'The email or password is incorrect.'
        : err?.message || 'Unable to sign in. Please try again.'
  } finally {
    loading.value = false
  }
}

function useAnotherAccount() {
  api.logout()
  user.value = null
  acknowledged.value = false
  error.value = ''
  step.value = 'login'
}

async function deleteAccount() {
  if (!acknowledged.value || loading.value) return

  error.value = ''
  loading.value = true

  try {
    await api.deleteAccount()
    step.value = 'complete'
  } catch (err) {
    if (err?.status === 401) {
      api.logout()
      user.value = null
      acknowledged.value = false
      step.value = 'login'
      error.value = 'Your session has expired. Please sign in again.'
    } else {
      error.value = err?.message || 'We could not delete your account. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="account-delete-page">
    <section class="account-delete-card" aria-labelledby="account-delete-title">
      <a class="account-delete-logo" href="/" aria-label="FoodSave home">
        <img src="/assets/images/logo.svg" alt="FoodSave" />
      </a>

      <template v-if="step === 'login'">
        <div class="account-delete-heading">
          <span class="account-delete-eyebrow">Account settings</span>
          <h1 id="account-delete-title">Delete your account</h1>
          <p>Sign in with the email and password you use in the FoodSave mobile app.</p>
        </div>

        <form class="account-delete-form" @submit.prevent="signIn">
          <div class="account-delete-field">
            <label for="delete-account-email">Email address</label>
            <input
              id="delete-account-email"
              v-model="email"
              type="email"
              inputmode="email"
              autocomplete="email"
              placeholder="you@example.com"
              :disabled="loading"
              required
            />
          </div>

          <div class="account-delete-field">
            <label for="delete-account-password">Password</label>
            <div class="account-delete-password">
              <input
                id="delete-account-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                :disabled="loading"
                required
              />
              <button
                class="account-delete-password-toggle"
                type="button"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :aria-pressed="showPassword"
                :disabled="loading"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 5.2 9 5.2a15.7 15.7 0 0 1-2.4 2.9M6.6 6.7A16.3 16.3 0 0 0 3 9.2s3.5 5.2 9 5.2c1.2 0 2.3-.2 3.3-.6"
                  />
                </svg>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 12s3.5-5.2 9-5.2 9 5.2 9 5.2-3.5 5.2-9 5.2S3 12 3 12Z" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              </button>
            </div>
          </div>

          <p v-if="error" class="account-delete-alert" role="alert">{{ error }}</p>

          <button
            class="account-delete-button account-delete-button--primary"
            type="submit"
            :disabled="loading"
          >
            {{ loading ? 'Signing in…' : 'Continue' }}
          </button>
        </form>
      </template>

      <template v-else-if="step === 'confirm'">
        <div class="account-delete-danger-icon" aria-hidden="true">!</div>
        <div class="account-delete-heading">
          <span class="account-delete-eyebrow">Final confirmation</span>
          <h1 id="account-delete-title">Permanently delete your account?</h1>
          <p>
            You are signed in as <strong>{{ displayEmail }}</strong
            >.
          </p>
        </div>

        <div class="account-delete-warning">
          <h2>This action cannot be undone</h2>
          <p>Your FoodSave account and associated profile data will be permanently deleted.</p>
        </div>

        <label class="account-delete-check">
          <input v-model="acknowledged" type="checkbox" :disabled="loading" />
          <span>I understand that deleting my account is permanent.</span>
        </label>

        <p v-if="error" class="account-delete-alert" role="alert">{{ error }}</p>

        <div class="account-delete-actions">
          <button
            class="account-delete-button account-delete-button--danger"
            type="button"
            :disabled="!acknowledged || loading"
            @click="deleteAccount"
          >
            {{ loading ? 'Deleting account…' : 'Delete my account' }}
          </button>
          <button
            class="account-delete-link"
            type="button"
            :disabled="loading"
            @click="useAnotherAccount"
          >
            Sign in with another account
          </button>
        </div>
      </template>

      <template v-else>
        <div class="account-delete-success-icon" aria-hidden="true">✓</div>
        <div class="account-delete-heading">
          <span class="account-delete-eyebrow">Request complete</span>
          <h1 id="account-delete-title">Your account has been deleted</h1>
          <p>You have been signed out. You can now close this page.</p>
        </div>
        <a class="account-delete-button account-delete-button--primary" href="/"
          >Return to FoodSave</a
        >
      </template>

      <p class="account-delete-help">Need help? <a href="/contact">Contact FoodSave support</a></p>
    </section>
  </main>
</template>

<style scoped>
.account-delete-page {
  --delete-teal: #315253;
  --delete-orange: #eb8227;
  --delete-cream: #f7f5f1;
  --delete-sage: #dee3d5;
  --delete-red: #b42318;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 18px;
  background:
    radial-gradient(circle at 12% 10%, rgb(235 130 39 / 16%), transparent 28rem),
    radial-gradient(circle at 88% 90%, rgb(49 82 83 / 15%), transparent 30rem), var(--delete-cream);
  color: var(--delete-teal);
  font-family: 'Rubik', system-ui, sans-serif;
}

.account-delete-card {
  width: min(100%, 540px);
  padding: clamp(28px, 6vw, 48px);
  border: 1px solid rgb(49 82 83 / 12%);
  border-radius: 32px;
  background: rgb(255 255 255 / 92%);
  box-shadow: 0 30px 80px rgb(49 82 83 / 15%);
}

.account-delete-logo {
  display: block;
  width: 180px;
  margin: 0 auto 40px;
}

.account-delete-heading {
  text-align: center;
}

.account-delete-eyebrow {
  display: block;
  margin-bottom: 10px;
  color: var(--delete-orange);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.account-delete-heading h1 {
  margin: 0;
  color: var(--delete-teal);
  font-size: clamp(1.75rem, 5vw, 2.35rem);
  line-height: 1.15;
}

.account-delete-heading p {
  margin: 14px auto 0;
  color: #587072;
  line-height: 1.55;
}

.account-delete-form {
  display: grid;
  gap: 20px;
  margin-top: 32px;
}

.account-delete-field {
  display: grid;
  gap: 8px;
}

.account-delete-field label {
  font-size: 0.9rem;
  font-weight: 600;
}

.account-delete-field input {
  width: 100%;
  min-height: 52px;
  padding: 0 16px;
  border: 1px solid #bdc9c5;
  border-radius: 14px;
  background: #fff;
  color: #203c3d;
  font: inherit;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.account-delete-field input:focus {
  border-color: var(--delete-orange);
  box-shadow: 0 0 0 4px rgb(235 130 39 / 14%);
  outline: none;
}

.account-delete-password {
  position: relative;
}

.account-delete-password input {
  padding-right: 52px;
}

.account-delete-password-toggle {
  position: absolute;
  top: 50%;
  right: 8px;
  display: grid;
  width: 40px;
  height: 40px;
  padding: 9px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #587072;
  cursor: pointer;
  transform: translateY(-50%);
}

.account-delete-password-toggle:hover:not(:disabled) {
  background: rgb(49 82 83 / 8%);
  color: var(--delete-teal);
}

.account-delete-password-toggle:focus-visible {
  outline: 2px solid var(--delete-orange);
  outline-offset: 1px;
}

.account-delete-password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.account-delete-password-toggle svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.account-delete-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 52px;
  padding: 12px 22px;
  border: 0;
  border-radius: 999px;
  color: #fff;
  font: inherit;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  transition:
    transform 160ms ease,
    opacity 160ms ease,
    background 160ms ease;
}

.account-delete-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.account-delete-button:disabled,
.account-delete-link:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.account-delete-button--primary {
  background: var(--delete-teal);
}

.account-delete-button--primary:hover:not(:disabled) {
  background: #243f40;
  color: #fff;
}

.account-delete-button--danger {
  background: var(--delete-red);
}

.account-delete-button--danger:hover:not(:disabled) {
  background: #8f1c13;
}

.account-delete-alert {
  padding: 12px 14px;
  border: 1px solid #f2c0bc;
  border-radius: 12px;
  background: #fff2f0;
  color: #8f1c13;
  font-size: 0.9rem;
  line-height: 1.4;
}

.account-delete-warning {
  margin-top: 28px;
  padding: 18px;
  border-radius: 16px;
  background: #fff3f1;
  color: #70403b;
}

.account-delete-warning h2 {
  margin: 0 0 5px;
  color: var(--delete-red);
  font-size: 1rem;
}

.account-delete-warning p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.account-delete-danger-icon,
.account-delete-success-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin: 0 auto 18px;
  border-radius: 50%;
  font-size: 1.6rem;
  font-weight: 700;
}

.account-delete-danger-icon {
  background: #fee4e2;
  color: var(--delete-red);
}

.account-delete-success-icon {
  background: var(--delete-sage);
  color: var(--delete-teal);
}

.account-delete-check {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin: 22px 0;
  color: #3d5759;
  font-size: 0.92rem;
  line-height: 1.45;
  cursor: pointer;
}

.account-delete-check input {
  width: 19px;
  height: 19px;
  margin-top: 1px;
  accent-color: var(--delete-red);
  flex: 0 0 auto;
}

.account-delete-actions {
  display: grid;
  gap: 14px;
}

.account-delete-link {
  border: 0;
  background: transparent;
  color: var(--delete-teal);
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.account-delete-help {
  margin: 30px 0 0;
  color: #708183;
  font-size: 0.83rem;
  text-align: center;
}

.account-delete-help a {
  color: var(--delete-teal);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 520px) {
  .account-delete-page {
    place-items: start center;
    padding: 18px 12px;
  }

  .account-delete-card {
    padding: 26px 20px;
    border-radius: 24px;
  }

  .account-delete-logo {
    width: 155px;
    margin-bottom: 30px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .account-delete-button,
  .account-delete-field input {
    transition: none;
  }
}
</style>
