<template>
  <div class="app-select-wrapper">
    <label v-if="label" class="app-select-label" :for="id">{{ label }}</label>
    <select
      :id="id"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="app-select"
      v-bind="$attrs"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineOptions({ name: 'AppSelect' })

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] }, // { label, value }
  label: { type: String, default: '' },
  id: { type: String, default: () => `select-${Math.random().toString(36).substr(2, 9)}` }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.app-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
}
.app-select-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}
.app-select {
  width: 100%;
  padding: var(--space-8) var(--space-12);
  padding-right: var(--space-32); /* Make room for standard browser dropdown arrow */
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-input);
  transition: border-color var(--transition-fast);
  outline: none;
  appearance: none; /* Hide default arrow to potentially add custom later, but simple for now */
  /* simple custom arrow */
  background-image: url('data:image/svg+xml;utf8,<svg fill="none" stroke="%2352525b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"/></svg>');
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
}
.app-select:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .app-select {
    background-image: url('data:image/svg+xml;utf8,<svg fill="none" stroke="%23a1a1aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"/></svg>');
  }
}

:root[data-theme="dark"] .app-select {
  background-image: url('data:image/svg+xml;utf8,<svg fill="none" stroke="%23a1a1aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"/></svg>');
}
</style>
