<template>
  <div class="app-toast-container">
    <TransitionGroup name="slide">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        :class="['app-toast', `app-toast--${toast.type}`]"
      >
        <div class="app-toast-content">
          <strong v-if="toast.title" class="app-toast-title">{{ toast.title }}</strong>
          <span class="app-toast-message">{{ toast.message }}</span>
        </div>
        <button class="app-toast-close" @click="uiStore.removeToast(toast.id)" aria-label="Close Toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'

defineOptions({ name: 'AppToast' })

const uiStore = useUiStore()
const { toasts } = storeToRefs(uiStore)
</script>

<style scoped>
.app-toast-container {
  position: fixed;
  bottom: var(--space-24);
  right: var(--space-24);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  z-index: 1000;
  max-width: 320px;
  pointer-events: none; /* Let clicks pass through container */
}

.app-toast {
  pointer-events: auto; /* Enable clicks on actual toasts */
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--space-12) var(--space-16);
  background-color: var(--color-surface);
  border-left: 4px solid var(--color-accent);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-lg);
  color: var(--color-text-primary);
  width: 100%;
}

.app-toast--success { border-color: var(--color-success); }
.app-toast--error,
.app-toast--danger { border-color: var(--color-danger); }
.app-toast--warning { border-color: var(--color-warning); }

.app-toast-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-right: var(--space-16);
}

.app-toast-title {
  font-size: var(--text-sm);
  font-weight: 600;
}

.app-toast-message {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.app-toast-close {
  background: none;
  border: none;
  padding: 0;
  color: var(--color-text-muted);
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
}
.app-toast-close:hover {
  color: var(--color-text-primary);
}
</style>
