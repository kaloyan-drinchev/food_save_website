<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const showModal = ref(false)
const submitting = ref(false)

async function onSubmit(e) {
  const form = e.target
  submitting.value = true
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
    if (res.ok) {
      form.reset()
      showModal.value = true
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section id="waitlist" class="fade-in">
    <div class="container">
      <div class="section-header centered">
        <span class="section-label">{{ t('waitlist.label') }}</span>
        <h2 class="section-title">{{ t('waitlist.title') }}</h2>
        <p class="section-subtitle">{{ t('waitlist.subtitle') }}</p>
      </div>
      <form
        class="waitlist-form"
        action="https://formspree.io/f/xjkjvbbq"
        method="POST"
        @submit.prevent="onSubmit"
      >
        <input type="hidden" name="_subject" value="FoodSave Waitlist Signup" />
        <div class="waitlist-fields">
          <input class="waitlist-input" type="text" name="name" required autocomplete="given-name" :placeholder="t('waitlist.name_placeholder')" />
          <input class="waitlist-input" type="email" name="email" required autocomplete="email" :placeholder="t('waitlist.email_placeholder')" />
        </div>
        <div class="waitlist-role">
          <label class="role-option">
            <input type="radio" name="role" value="customer" checked />
            {{ t('waitlist.role_customer') }}
          </label>
          <label class="role-option">
            <input type="radio" name="role" value="business" />
            {{ t('waitlist.role_business') }}
          </label>
        </div>
        <button type="submit" class="waitlist-submit" :disabled="submitting" :style="submitting ? { opacity: 0.6 } : {}">
          {{ t('waitlist.submit') }}
        </button>
      </form>
    </div>
  </section>

  <!-- Success Modal -->
  <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal-card">
      <div class="modal-icon">🎉</div>
      <h3 class="modal-title">{{ t('waitlist.modal_title') }}</h3>
      <p class="modal-body">{{ t('waitlist.modal_body') }}</p>
      <button class="modal-close-btn" @click="showModal = false">{{ t('waitlist.modal_close') }}</button>
    </div>
  </div>
</template>
