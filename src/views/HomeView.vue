<template>
  <div class="home-container">
    <div class="hero">
      <h1 class="hero-title">Explore GitHub Issues</h1>
      <p class="hero-subtitle">Paste a repository URL or search to quickly manage issues in a focused, fast environment.</p>
      
      <div class="search-box">
        <AppInput 
          v-model="query" 
          placeholder="e.g. facebook/react or https://github.com/vuejs/core"
          @keydown.enter="handleEnterKey"
        />
        <AppButton @click="handleEnterKey" :disabled="isSearching || !query">
          {{ isSearching ? 'Searching...' : 'Go' }}
        </AppButton>
      </div>

      <div class="search-results" v-if="searchResults.length > 0 && !isSearching">
        <h3 class="section-title">Search Results</h3>
        <ul class="repo-list">
          <li v-for="repo in searchResults" :key="repo.id">
            <RepoCard :repo="repo" @select="goToRepo" />
          </li>
        </ul>
      </div>

      <div class="error-state" v-if="error">
        <p class="text-danger">Failed to search repositories.</p>
      </div>
    </div>

    <div class="recent-repos" v-if="recentRepos.length > 0">
      <h2 class="section-title">Recent Repositories</h2>
      <ul class="repo-list">
        <li v-for="repo in recentRepos" :key="repo.id">
          <RepoCard :repo="repo" @select="goToRepo" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { parseRepoUrl } from '@/utils/github'
import { useSearch } from '@/composables/useSearch'
import { githubService } from '@/api/github'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import RepoCard from '@/components/repo/RepoCard.vue'

defineOptions({ name: 'HomeView' })

const router = useRouter()
const recentRepos = useLocalStorage('github_issue_tracker_recent', [])

const searchResults = ref([])

const { query, isSearching, error, debouncedFetch } = useSearch(async (q) => {
  if (!q || q.trim().length < 3) {
    searchResults.value = []
    return
  }
  
  // If it matches owner/repo pattern, don't perform generic search, just let them press Go
  const parsed = parseRepoUrl(q)
  if (parsed) {
    searchResults.value = [] 
    return // Let them hit go or we could auto-fetch that single repo metadata
  }

  // Otherwise perform GitHub repo search
  const response = await githubService.searchRepos(q)
  searchResults.value = response.data.items || []
})

async function handleEnterKey() {
  if (!query.value) return

  const parsed = parseRepoUrl(query.value)
  if (parsed) {
    // If exact owner/repo match
    try {
      const response = await githubService.getRepo(parsed.owner, parsed.repo)
      goToRepo(response.data)
    } catch(e) {
      error.value = new Error('Repository not found')
    }
  } else if (searchResults.value.length > 0) {
    // If no direct match but has search results
    goToRepo(searchResults.value[0])
  } else {
    // Just force a search
    debouncedFetch(query.value)
  }
}

function goToRepo(repo) {
  // Save to recent
  const existingIndex = recentRepos.value.findIndex(r => r.id === repo.id)
  if (existingIndex !== -1) {
    recentRepos.value.splice(existingIndex, 1)
  }
  recentRepos.value.unshift(repo)
  // Keep only last 5
  if (recentRepos.value.length > 5) {
    recentRepos.value = recentRepos.value.slice(0, 5)
  }
  
  // Navigate
  router.push(`/${repo.owner.login}/${repo.name}/issues`)
}
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-48) var(--space-24);
  width: 100%;
}

.hero {
  text-align: center;
  margin-bottom: var(--space-64);
}

.hero-title {
  font-size: var(--text-3xl);
  font-weight: 600;
  margin-bottom: var(--space-16);
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto var(--space-32);
}

.search-box {
  display: flex;
  gap: var(--space-8);
  max-width: 500px;
  margin: 0 auto var(--space-32);
}

.section-title {
  font-size: var(--text-xl);
  font-weight: 600;
  margin-bottom: var(--space-24);
  color: var(--color-text-primary);
  text-align: left;
}

.repo-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.search-results {
  margin-top: var(--space-32);
  text-align: left;
}

.error-state {
  margin-top: var(--space-16);
}
</style>
