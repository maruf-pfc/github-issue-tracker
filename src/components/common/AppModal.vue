<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="app-modal-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="app-modal-container" role="dialog" aria-modal="true" :aria-labelledby="titleId">
          <header class="app-modal-header">
            <h2 :id="titleId" class="app-modal-title" v-if="title">{{ title }}</h2>
            <button class="app-modal-close" @click="$emit('update:modelValue', false)" aria-label="Close dialog">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </header>
          
          <div class="app-modal-body">
            <slot></slot>
          </div>
          
          <footer class="app-modal-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

defineOptions({ name: 'AppModal' })

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`

function handleEscape(e) {
  if (e.key === 'Escape' && props.modelValue) {
    emit('update:modelValue', false)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.app-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-24);
}

.app-modal-container {
  background-color: var(--color-surface);
  border-radius: var(--radius-modal);
  box-shadow: var(--shadow-float);
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - var(--space-48));
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
}

.app-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-16) var(--space-24);
  border-bottom: 1px solid var(--color-border);
}

.app-modal-title {
  margin: 0;
  font-size: var(--text-lg);
  color: var(--color-text-primary);
}

.app-modal-close {
  color: var(--color-text-muted);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.app-modal-close:hover {
  color: var(--color-text-primary);
}

.app-modal-body {
  padding: var(--space-24);
  overflow-y: auto;
  color: var(--color-text-secondary);
  font-size: var(--text-base);
}

.app-modal-footer {
  padding: var(--space-16) var(--space-24);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-8);
  background-color: var(--color-surface-subtle);
  border-bottom-left-radius: var(--radius-modal);
  border-bottom-right-radius: var(--radius-modal);
}
</style>
