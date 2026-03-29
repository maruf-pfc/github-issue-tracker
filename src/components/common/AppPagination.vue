<template>
  <div class="app-pagination" v-if="hasPages">
    <AppButton 
      variant="secondary" 
      size="small" 
      :disabled="!links.prev"
      @click="$emit('change', currentPage - 1)"
      title="Previous Page"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      Prev
    </AppButton>
    
    <span class="app-pagination-info" v-if="totalPages">
      Page {{ currentPage }} of {{ totalPages }}
    </span>
    <span class="app-pagination-info" v-else>
      Page {{ currentPage }}
    </span>

    <AppButton 
      variant="secondary" 
      size="small" 
      :disabled="!links.next"
      @click="$emit('change', currentPage + 1)"
      title="Next Page"
    >
      Next
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </AppButton>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppButton from './AppButton.vue'

defineOptions({ name: 'AppPagination' })

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    default: null
  },
  links: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['change'])

const hasPages = computed(() => {
  return props.links.next || props.links.prev || props.totalPages > 1
})
</script>

<style scoped>
.app-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-16);
  padding: var(--space-24) 0;
  border-top: 1px solid var(--color-border);
}

.app-pagination-info {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
</style>
