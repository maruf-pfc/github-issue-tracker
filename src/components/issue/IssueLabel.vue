<template>
  <span 
    class="issue-label" 
    :style="{ backgroundColor: `#${label.color}`, color: textColor }"
    :title="label.description"
  >
    {{ label.name }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { getContrastColor } from '@/utils/labels'

defineOptions({ name: 'IssueLabel' })

const props = defineProps({
  label: {
    type: Object,
    required: true
  }
})

const textColor = computed(() => getContrastColor(props.label.color))
</script>

<style scoped>
.issue-label {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 var(--space-8);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  border-radius: var(--radius-badge);
  white-space: nowrap;
  border: 1px solid rgba(0,0,0,0.1); /* Subtle dark border for light labels */
}

/* For dark mode, add a subtle white border. Use CSS custom prop trick */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .issue-label {
    border: 1px solid rgba(255,255,255,0.1);
  }
}
:root[data-theme="dark"] .issue-label {
  border: 1px solid rgba(255,255,255,0.1);
}
</style>
