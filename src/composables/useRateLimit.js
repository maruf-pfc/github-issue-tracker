import { ref, onMounted, onUnmounted } from 'vue'
import { githubService } from '@/api/github'
import { useUiStore } from '@/stores/ui'

const rateLimitRemaining = ref(null)
const rateLimitReset = ref(null)

export function useRateLimit() {
  const uiStore = useUiStore()

  function handleRateLimitUpdate(event) {
    rateLimitRemaining.value = event.detail.remaining
    rateLimitReset.value = event.detail.reset

    if (rateLimitRemaining.value === 0) {
      uiStore.addToast({
        type: 'danger',
        title: 'Rate Limited',
        message: 'GitHub API rate limit exceeded.',
        timeout: 10000
      })
    }
  }

  function handleRateLimited() {
    uiStore.addToast({
      type: 'danger',
      title: 'Action Blocked',
      message: 'Rate limit has been reached. Please wait or authenticate.',
      timeout: 10000
    })
  }

  async function fetchLiveStatus() {
    try {
      const response = await githubService.getRateLimit()
      rateLimitRemaining.value = response.data.rate.remaining
      rateLimitReset.value = response.data.rate.reset
    } catch {
      // Ignore initial load failure silently
    }
  }

  onMounted(() => {
    window.addEventListener('github:rate-limit-update', handleRateLimitUpdate)
    window.addEventListener('github:rate-limited', handleRateLimited)
  })

  onUnmounted(() => {
    window.removeEventListener('github:rate-limit-update', handleRateLimitUpdate)
    window.removeEventListener('github:rate-limited', handleRateLimited)
  })

  return {
    rateLimitRemaining,
    rateLimitReset,
    fetchLiveStatus
  }
}
