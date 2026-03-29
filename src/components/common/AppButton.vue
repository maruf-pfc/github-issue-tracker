<template>
  <button
    :class="[
      'app-button',
      `app-button--${variant}`,
      `app-button--${size}`,
      { 'app-button--block': block, 'app-button--disabled': disabled }
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineOptions({ name: 'AppButton' })

defineProps({
  variant: {
    type: String,
    default: 'primary', // primary, secondary, ghost, danger
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
  },
  block: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  font-family: var(--font-body);
  font-weight: 500;
  border-radius: var(--radius-input);
  transition: all var(--transition-fast);
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
}

.app-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-button--block {
  width: 100%;
}

/* Sizes */
.app-button--small {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-xs);
}

.app-button--medium {
  padding: var(--space-8) var(--space-16);
  font-size: var(--text-sm);
}

.app-button--large {
  padding: var(--space-12) var(--space-24);
  font-size: var(--text-base);
}

/* Variants - Flat, NO drop shadows */
.app-button--primary {
  background-color: var(--color-text-primary);
  color: var(--color-bg);
  border: 1px solid transparent;
}
.app-button--primary:hover:not(.app-button--disabled) {
  opacity: 0.9;
}

.app-button--secondary {
  background-color: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-strong);
}
.app-button--secondary:hover:not(.app-button--disabled) {
  background-color: var(--color-surface-subtle);
}

.app-button--ghost {
  background-color: transparent;
  color: var(--color-text-secondary);
  border: 1px solid transparent;
}
.app-button--ghost:hover:not(.app-button--disabled) {
  background-color: var(--color-surface-subtle);
  color: var(--color-text-primary);
}

.app-button--danger {
  background-color: var(--color-danger);
  color: #ffffff;
  border: 1px solid transparent;
}
.app-button--danger:hover:not(.app-button--disabled) {
  opacity: 0.9;
}
</style>
