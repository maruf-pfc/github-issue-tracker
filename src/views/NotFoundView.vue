<template>
  <div class="not-found-view">
    <div class="content">
      <h1>404 Not Found</h1>
      <p class="text-muted">The repository or issue you're looking for doesn't exist.</p>
      <router-link to="/">
        <AppButton>Back to Home</AppButton>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import AppButton from '@/components/common/AppButton.vue'

defineOptions({ name: 'NotFoundView' })
</script>

<style scoped>
.not-found-view {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex: 1;
}

.content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-16);
}

.content h1 {
  font-size: var(--text-3xl);
  margin-bottom: var(--space-8);
}
</style>
