<template>
  <div class="app-input-wrapper">
    <label v-if="label" class="app-input-label" :for="id">{{ label }}</label>
    <input 
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="app-input"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'AppInput' })

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  id: { type: String, default: () => `input-${Math.random().toString(36).substr(2, 9)}` }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.app-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
}
.app-input-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}
.app-input {
  width: 100%;
  padding: var(--space-8) var(--space-12);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-input);
  transition: border-color var(--transition-fast);
  outline: none;
}
.app-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent);
}
.app-input::placeholder {
  color: var(--color-text-muted);
}
</style>
