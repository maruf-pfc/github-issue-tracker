<template>
  <span :class="['app-badge', `app-badge--${variant}`]">
    <slot></slot>
  </span>
</template>

<script setup>
defineOptions({ name: 'AppBadge' })

defineProps({
  variant: {
    type: String,
    default: 'neutral' // default, success, danger, warning, open, closed
  }
})
</script>

<style scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  padding: 0 var(--space-8);
  height: 20px;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  border-radius: var(--radius-badge);
  white-space: nowrap;
}

.app-badge--neutral {
  background-color: var(--color-surface-subtle);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.app-badge--success {
  background-color: var(--color-success);
  color: #fff;
}

.app-badge--danger {
  background-color: var(--color-danger);
  color: #fff;
}

.app-badge--warning {
  background-color: var(--color-warning);
  color: #fff;
}

.app-badge--open {
  background-color: var(--color-open);
  color: #fff;
}

.app-badge--closed {
  background-color: var(--color-closed);
  color: #fff;
}
</style>
