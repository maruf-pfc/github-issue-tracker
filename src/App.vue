<template>
  <div class="app-root">
    <AppHeader />
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <AppToast />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppToast from '@/components/common/AppToast.vue'
import { useTheme } from '@/composables/useTheme'

// Initialize theme on app boot
useTheme()
</script>

<style scoped>
.app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
