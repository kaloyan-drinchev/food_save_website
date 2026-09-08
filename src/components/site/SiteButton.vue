<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import SiteArrow from './SiteArrow.vue'

/**
 * One pill button, four looks. Renders <RouterLink>, <a> or <button>
 * depending on which of `to` / `href` is passed.
 *
 *   <SiteButton variant="teal" arrow to="/for-clients">За потребители</SiteButton>
 */
const props = defineProps({
  /** orange | teal | outline | sage */
  variant: { type: String, default: 'orange' },
  /** sm | md | lg */
  size: { type: String, default: 'md' },
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  type: { type: String, default: 'button' },
  /** Trailing long arrow (pushes the label left, arrow right). */
  arrow: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))
const bind = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href }
  return { type: props.type, disabled: props.disabled }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="bind"
    class="fs-btn"
    :class="[
      `fs-btn--${variant}`,
      `fs-btn--${size}`,
      { 'fs-btn--arrow': arrow, 'fs-btn--block': block },
    ]"
  >
    <span class="fs-btn__label"><slot /></span>
    <SiteArrow v-if="arrow" class="fs-btn__arrow" />
  </component>
</template>

<style scoped>
.fs-btn {
  --btn-h: 48px;
  --btn-px: 24px;
  --btn-fs: var(--fs-small);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-height: var(--btn-h);
  padding: 0 var(--btn-px);
  min-width: max-content;
  border: 1.5px solid transparent;
  border-radius: var(--fs-radius-pill);
  font-family: inherit;
  font-size: var(--btn-fs);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.005em;
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;
  transition:
    background var(--fs-transition),
    border-color var(--fs-transition),
    color var(--fs-transition),
    transform var(--fs-transition),
    box-shadow var(--fs-transition);
}

.fs-btn:hover {
  transform: translateY(-1px);
}

.fs-btn:active {
  transform: translateY(0);
}

.fs-btn:disabled {
  opacity: 0.6;
  cursor: default;
  transform: none;
}

.fs-btn--arrow {
  justify-content: space-between;
  gap: 26px;
}

.fs-btn:hover .fs-btn__arrow {
  transform: translateX(4px);
}

/* ── Sizes (desktop reference: 44 / 48 / 64px tall) ── */
.fs-btn--sm {
  --btn-h: 44px;
  --btn-px: 22px;
  --btn-fs: 0.875rem;
}

.fs-btn--md {
  --btn-h: 48px;
  --btn-px: 24px;
  --btn-fs: var(--fs-small);
}

.fs-btn--lg {
  --btn-h: clamp(54px, 3rem + 1vw, 64px);
  --btn-px: clamp(24px, 1.5rem + 0.5vw, 32px);
  --btn-fs: clamp(1rem, 0.95rem + 0.2vw, 1.125rem);
  gap: 24px;
}

.fs-btn--block {
  display: flex;
  width: 100%;
}

/* ── Variants ── */
.fs-btn--orange {
  background: var(--fs-orange);
  color: var(--fs-on-orange);
}

.fs-btn--orange:hover {
  background: var(--fs-orange-deep);
}

.fs-btn--teal {
  background: var(--fs-teal);
  color: var(--fs-on-teal);
}

.fs-btn--teal:hover {
  background: var(--fs-teal-deep);
}

.fs-btn--outline {
  background: transparent;
  border-color: var(--fs-orange);
  color: var(--fs-orange);
}

.fs-btn--outline:hover {
  background: var(--fs-orange);
  color: var(--fs-on-orange);
}

.fs-btn--sage {
  background: var(--fs-sage);
  color: var(--fs-teal);
}

.fs-btn--sage:hover {
  background: var(--fs-sage-deep);
}

@media (max-width: 640px) {
  /* The card columns are narrow here, so a long label has to wrap: without
     this the nowrap text pushes the arrow outside the pill. */
  .fs-btn {
    --btn-h: 42px;
    --btn-px: 18px;
    --btn-fs: 0.8125rem;
    gap: 14px;
    min-width: 0;
    padding: 9px var(--btn-px);
    white-space: normal;
  }

  .fs-btn--arrow {
    gap: 12px;
  }

  .fs-btn__label {
    min-width: 0;
  }

  .fs-btn--lg {
    --btn-h: 50px;
    --btn-px: 22px;
    --btn-fs: 0.9375rem;
    gap: 20px;
  }
}

/* Narrow phones: let a button shrink to its column instead of overflowing. */
@media (max-width: 400px) {
  .fs-btn {
    min-width: 0;
    max-width: 100%;
  }

  .fs-btn--lg {
    --btn-px: 18px;
    --btn-fs: 0.875rem;
    gap: 12px;
  }
}
</style>
