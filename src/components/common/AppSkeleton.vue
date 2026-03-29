<template>
  <div :class="['app-skeleton', 'animate-shimmer', `app-skeleton--${type}`]"></div>
</template>

<script setup>
defineOptions({ name: 'AppSkeleton' })

defineProps({
  type: {
    type: String,
    default: 'text' // text, avatar, card
  }
})
</script>

<style scoped>
.app-skeleton {
  border-radius: var(--radius-card);
  width: 100%;
}
.app-skeleton--text {
  height: 16px;
  border-radius: var(--radius-input);
  margin-bottom: var(--space-8);
}
.app-skeleton--avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}
.app-skeleton--card {
  height: 120px;
}
</style>
