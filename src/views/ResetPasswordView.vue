<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services/api'
import { setLocale } from '@/i18n'

/**
 * Landing page for the password-reset email
 * (/reset-password?token=…). Opening the page sends nothing, so email link
 * scanners cannot use up the token; it is only sent when the form is
 * submitted. The token is kept in memory and removed from the address bar
 * straight away so it is not left in history or shared by accident.
 */

const MIN_LENGTH = 12
// bcrypt only reads the first 72 bytes; the backend rejects anything longer.
const MAX_BYTES = 72
// The backend issues 256-bit tokens as 43 URL-safe characters.
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/
// The backend's message for an expired, used or replaced link (EN and BG).
const INVALID_LINK = /reset link|линкът за възстановяване/i

const { t, locale } = useI18n()

const token = ref('')
const step = ref('form') // form | invalid | done
const password = ref('')
const confirm = ref('')
const showPassword = ref(false)
const submitted = ref(false)
const loading = ref(false)
const error = ref('')

const passwordError = computed(() => {
  if (!submitted.value) return ''
  if (password.value.length < MIN_LENGTH) return t('resetPassword.errTooShort')
  if (new TextEncoder().encode(password.value).length > MAX_BYTES) {
    return t('resetPassword.errTooLong')
  }
  return ''
})

const confirmError = computed(() =>
  submitted.value && confirm.value !== password.value ? t('resetPassword.errMismatch') : '',
)

watchEffect(() => {
  document.title = t('resetPassword.pageTitle')
})

function readToken() {
  const query = new URLSearchParams(window.location.search).get('token')
  // Older links put the token in the hash.
  const hash = new URLSearchParams(window.location.hash.slice(1)).get('token')
  return query || hash || ''
}

function messageFor(err) {
  if (err?.status === 429) {
    const minutes = Math.ceil(Number(err.retryAfter) / 60)
    return minutes > 0
      ? t('resetPassword.errRateLimitIn', { minutes })
      : t('resetPassword.errRateLimit')
  }
  return t('resetPassword.errGeneric')
}

onMounted(() => {
  token.value = readToken()
  window.history.replaceState(window.history.state, '', window.location.pathname)
  if (!TOKEN_PATTERN.test(token.value)) step.value = 'invalid'
})

async function submit() {
  submitted.value = true
  error.value = ''
  if (passwordError.value || confirmError.value || loading.value) return

  loading.value = true
  try {
    await api.resetPassword(token.value, password.value, locale.value)
    password.value = ''
    confirm.value = ''
    token.value = ''
    step.value = 'done'
  } catch (err) {
    if (err?.status === 400 && INVALID_LINK.test(err.message || '')) {
      step.value = 'invalid'
    } else {
      // A 400 for the password itself carries the backend's reason.
      error.value = err?.status === 400 && err.message ? err.message : messageFor(err)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="reset-page">
    <section class="reset-card" aria-labelledby="reset-title" aria-live="polite">
      <div class="reset-top">
        <a class="reset-logo" href="/" aria-label="FoodSave">
          <img src="/assets/images/logo.svg" alt="FoodSave" />
        </a>
        <div class="reset-lang" role="group" aria-label="Language">
          <button
            type="button"
            :class="{ 'is-active': locale === 'bg' }"
            :aria-pressed="locale === 'bg'"
            @click="setLocale('bg')"
          >
            BG
          </button>
          <button
            type="button"
            :class="{ 'is-active': locale === 'en' }"
            :aria-pressed="locale === 'en'"
            @click="setLocale('en')"
          >
            EN
          </button>
        </div>
      </div>

      <template v-if="step === 'form'">
        <div class="reset-heading">
          <span class="reset-eyebrow">{{ t('resetPassword.eyebrow') }}</span>
          <h1 id="reset-title">{{ t('resetPassword.title') }}</h1>
          <p>{{ t('resetPassword.subtitle') }}</p>
        </div>

        <form class="reset-form" novalidate @submit.prevent="submit">
          <!-- Lets password managers save the new password against the account. -->
          <input type="text" name="username" autocomplete="username" hidden />

          <div class="reset-field">
            <label for="reset-new">{{ t('resetPassword.newPassword') }}</label>
            <div class="reset-password">
              <input
                id="reset-new"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                :aria-invalid="!!passwordError"
                aria-describedby="reset-new-hint"
                :disabled="loading"
                required
              />
              <button
                class="reset-toggle"
                type="button"
                :aria-label="showPassword ? t('resetPassword.hide') : t('resetPassword.show')"
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
            <p v-if="passwordError" id="reset-new-hint" class="reset-field-error">
              {{ passwordError }}
            </p>
            <p v-else id="reset-new-hint" class="reset-field-hint">{{ t('resetPassword.hint') }}</p>
          </div>

          <div class="reset-field">
            <label for="reset-confirm">{{ t('resetPassword.confirmPassword') }}</label>
            <input
              id="reset-confirm"
              v-model="confirm"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              :aria-invalid="!!confirmError"
              :aria-describedby="confirmError ? 'reset-confirm-error' : undefined"
              :disabled="loading"
              required
            />
            <p v-if="confirmError" id="reset-confirm-error" class="reset-field-error">
              {{ confirmError }}
            </p>
          </div>

          <p v-if="error" class="reset-alert" role="alert">{{ error }}</p>

          <button class="reset-button" type="submit" :disabled="loading">
            {{ loading ? t('resetPassword.submitting') : t('resetPassword.submit') }}
          </button>
        </form>
      </template>

      <template v-else-if="step === 'invalid'">
        <div class="reset-icon reset-icon--warn" aria-hidden="true">!</div>
        <div class="reset-heading">
          <h1 id="reset-title">{{ t('resetPassword.invalidTitle') }}</h1>
          <p>{{ t('resetPassword.invalidBody') }}</p>
        </div>
        <a class="reset-button" href="/">{{ t('resetPassword.home') }}</a>
      </template>

      <template v-else>
        <div class="reset-icon reset-icon--ok" aria-hidden="true">✓</div>
        <div class="reset-heading">
          <h1 id="reset-title">{{ t('resetPassword.doneTitle') }}</h1>
          <p>{{ t('resetPassword.doneBody') }}</p>
        </div>
        <a class="reset-button" href="/">{{ t('resetPassword.home') }}</a>
      </template>

      <p class="reset-help">
        {{ t('resetPassword.help') }} <a href="/contact">{{ t('resetPassword.contact') }}</a>
      </p>
    </section>
  </main>
</template>

<style scoped>
.reset-page {
  --reset-teal: #315253;
  --reset-orange: #eb8227;
  --reset-cream: #f7f5f1;
  --reset-sage: #dee3d5;
  --reset-red: #b42318;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 18px;
  background:
    radial-gradient(circle at 12% 10%, rgb(235 130 39 / 16%), transparent 28rem),
    radial-gradient(circle at 88% 90%, rgb(49 82 83 / 15%), transparent 30rem), var(--reset-cream);
  color: var(--reset-teal);
  font-family: 'Rubik', system-ui, sans-serif;
}

.reset-card {
  width: min(100%, 500px);
  padding: clamp(28px, 6vw, 44px);
  border: 1px solid rgb(49 82 83 / 12%);
  border-radius: 32px;
  background: rgb(255 255 255 / 92%);
  box-shadow: 0 30px 80px rgb(49 82 83 / 15%);
}

.reset-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 36px;
}

.reset-logo {
  display: block;
  width: 150px;
}

.reset-logo img {
  display: block;
  width: 100%;
}

.reset-lang {
  display: inline-flex;
  padding: 3px;
  border-radius: 999px;
  background: rgb(49 82 83 / 8%);
}

.reset-lang button {
  min-width: 40px;
  padding: 6px 10px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #587072;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.reset-lang button.is-active {
  background: var(--reset-teal);
  color: #fff;
}

.reset-heading {
  text-align: center;
}

.reset-eyebrow {
  display: block;
  margin-bottom: 10px;
  color: var(--reset-orange);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.reset-heading h1 {
  margin: 0;
  color: var(--reset-teal);
  font-size: clamp(1.6rem, 5vw, 2.1rem);
  line-height: 1.15;
}

.reset-heading p {
  margin: 14px auto 0;
  color: #587072;
  line-height: 1.55;
}

.reset-form {
  display: grid;
  gap: 20px;
  margin-top: 30px;
}

.reset-field {
  display: grid;
  gap: 8px;
}

.reset-field label {
  font-size: 0.9rem;
  font-weight: 600;
}

.reset-field input {
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

.reset-field input:focus {
  border-color: var(--reset-orange);
  box-shadow: 0 0 0 4px rgb(235 130 39 / 14%);
  outline: none;
}

.reset-field input[aria-invalid='true'] {
  border-color: var(--reset-red);
}

.reset-field-hint,
.reset-field-error {
  margin: 0;
  font-size: 0.82rem;
}

.reset-field-hint {
  color: #708183;
}

.reset-field-error {
  color: var(--reset-red);
}

.reset-password {
  position: relative;
}

.reset-password input {
  padding-right: 52px;
}

.reset-toggle {
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

.reset-toggle:hover:not(:disabled) {
  background: rgb(49 82 83 / 8%);
  color: var(--reset-teal);
}

.reset-toggle:focus-visible,
.reset-lang button:focus-visible {
  outline: 2px solid var(--reset-orange);
  outline-offset: 1px;
}

.reset-toggle svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.reset-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 52px;
  margin-top: 4px;
  padding: 12px 22px;
  border: 0;
  border-radius: 999px;
  background: var(--reset-teal);
  color: #fff;
  font: inherit;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 160ms ease,
    background 160ms ease;
}

.reset-icon + .reset-heading + .reset-button {
  margin-top: 28px;
}

.reset-button:hover:not(:disabled) {
  background: #243f40;
  color: #fff;
  transform: translateY(-1px);
}

.reset-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.reset-alert {
  margin: 0;
  padding: 12px 14px;
  border: 1px solid #f2c0bc;
  border-radius: 12px;
  background: #fff2f0;
  color: #8f1c13;
  font-size: 0.9rem;
  line-height: 1.4;
}

.reset-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin: 0 auto 18px;
  border-radius: 50%;
  font-size: 1.6rem;
  font-weight: 700;
}

.reset-icon--warn {
  background: #fff1e5;
  color: var(--reset-orange);
}

.reset-icon--ok {
  background: var(--reset-sage);
  color: var(--reset-teal);
}

.reset-help {
  margin: 30px 0 0;
  color: #708183;
  font-size: 0.83rem;
  text-align: center;
}

.reset-help a {
  color: var(--reset-teal);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 520px) {
  .reset-page {
    place-items: start center;
    padding: 18px 12px;
  }

  .reset-card {
    padding: 26px 20px;
    border-radius: 24px;
  }

  .reset-logo {
    width: 130px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reset-button,
  .reset-field input {
    transition: none;
  }
}
</style>
