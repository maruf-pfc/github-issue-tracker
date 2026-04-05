<template>
  <header class="app-header">
    <div class="container header-inner">
      <div class="app-header-left">
        <router-link to="/" class="app-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
          </svg>
          <span class="app-logo-text">Issues</span>
        </router-link>
      </div>

      <div class="app-header-right">
        <!-- Star on GitHub Button -->
        <a href="https://github.com/blackstart-labs/github-issue-tracker" target="_blank" class="star-button" title="Star on GitHub">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          <span>Star</span>
        </a>

        <div v-if="rateLimitRemaining !== null" class="app-rate-limit" title="API Requests Remaining">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          <span class="rate-limit-count" :class="{ 'rate-limit-warning': rateLimitRemaining < 100 }">
            {{ rateLimitRemaining }}
          </span>
        </div>

        <button class="icon-button" @click="toggleTheme" aria-label="Toggle Theme">
          <svg v-if="mode === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <button class="icon-button" @click="uiStore.toggleSettingsPanel()" aria-label="Settings">
          <img v-if="currentUser" :src="currentUser.avatar_url" class="user-avatar" alt="Avatar"/>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Settings Panel (Slide-in) -->
    <Transition name="panel">
      <div v-if="uiStore.isSettingsPanelOpen" class="settings-panel">
        <div class="settings-panel-header">
          <h3>Settings</h3>
          <button class="icon-button" @click="uiStore.toggleSettingsPanel(false)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="settings-panel-content">
          <div v-if="currentUser" class="user-profile">
            <img :src="currentUser.avatar_url" class="profile-avatar" />
            <div class="profile-info">
              <strong>{{ currentUser.login }}</strong>
              <span class="text-muted">Authenticated</span>
            </div>
            <AppButton variant="ghost" size="small" @click="logout" block>Clear Token</AppButton>
          </div>

          <div v-else class="auth-box">
            <label>Personal Access Token</label>
            <AppInput v-model="tempToken" type="password" placeholder="ghp_..." />
            <p class="text-xs text-muted">Stored locally. Used for higher rate limits.</p>
            <AppButton @click="handleTokenSave" block>Save Token</AppButton>
          </div>

          <div class="rate-limit-stats" v-if="rateLimitRemaining !== null">
            <h4>API Rate Limit</h4>
            <p>{{ rateLimitRemaining }} remaining</p>
            <p class="text-xs text-muted" v-if="rateLimitReset">Resets at {{ new Date(rateLimitReset * 1000).toLocaleTimeString() }}</p>
          </div>
        </div>
      </div>
    </Transition>
    <!-- Overlay for Panel -->
    <Transition name="fade">
      <div v-if="uiStore.isSettingsPanelOpen" class="settings-overlay" @click="uiStore.toggleSettingsPanel(false)"></div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/composables/useTheme'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { useGitHubAuth } from '@/composables/useGitHubAuth'
import { useRateLimit } from '@/composables/useRateLimit'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'

defineOptions({ name: 'AppHeader' })

const { mode, toggleTheme } = useTheme()
const uiStore = useUiStore()
const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)
const { login, logout } = useGitHubAuth()

const { rateLimitRemaining, rateLimitReset, fetchLiveStatus } = useRateLimit()

const tempToken = ref(authStore.token)

function handleTokenSave() {
  login(tempToken.value)
}

onMounted(() => {
  fetchLiveStatus()
  if (authStore.token) {
    authStore.fetchUser()
  }
})
</script>

<style scoped>
.app-header {
  height: 60px;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.app-header-left, .app-header-right {
  display: flex;
  align-items: center;
  gap: var(--space-12);
}

.app-logo {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-primary);
  text-decoration: none;
  transition: opacity var(--transition-fast);
}
.app-logo:hover {
  opacity: 0.8;
}

.app-logo-text {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--text-lg);
  letter-spacing: -0.02em;
}

/* Star Button */
.star-button {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-4) var(--space-12);
  height: 28px;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  text-decoration: none;
  transition: all var(--transition-fast);
}
.star-button:hover {
  background-color: var(--color-surface-subtle);
  border-color: var(--color-border-strong);
  text-decoration: none;
}
.star-button svg {
  color: #eab308; /* Star yellow */
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-input);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}
.icon-button:hover {
  background-color: var(--color-surface-subtle);
  color: var(--color-text-primary);
}

.user-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.app-rate-limit {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  padding: var(--space-4) var(--space-8);
  background-color: var(--color-surface-subtle);
  border-radius: var(--radius-input);
}
.rate-limit-count {
  line-height: 1;
}
.rate-limit-warning {
  color: var(--color-danger);
  font-weight: 500;
}

/* Settings Panel */
.settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  background-color: var(--color-surface);
  border-left: 1px solid var(--color-border);
  box-shadow: var(--shadow-2xl);
  z-index: 200;
  display: flex;
  flex-direction: column;
}

.settings-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(1px);
  z-index: 150;
}

.settings-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-16) var(--space-24);
  border-bottom: 1px solid var(--color-border);
}
.settings-panel-header h3 {
  margin: 0;
  font-size: var(--text-base);
}

.settings-panel-content {
  padding: var(--space-24);
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
}

.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-12);
  padding-bottom: var(--space-24);
  border-bottom: 1px solid var(--color-border);
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
}

.profile-info {
  text-align: center;
  display: flex;
  flex-direction: column;
}

.auth-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding-bottom: var(--space-24);
  border-bottom: 1px solid var(--color-border);
}

.auth-box label {
  font-size: var(--text-sm);
  font-weight: 500;
}

.rate-limit-stats h4 {
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
}

.text-xs { font-size: var(--text-xs); }
.text-muted { color: var(--color-text-muted); }
</style>
