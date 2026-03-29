<template>
  <div class="issues-view">
    <!-- Repo Header Bar -->
    <div class="repo-header" v-if="hasSelectedRepo">
      <div class="repo-header-content">
        <h2 class="repo-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          {{ repoFullName }}
        </h2>
        <div class="repo-stats" v-if="metadata">
          <AppBadge variant="neutral">
            <svg fill="currentColor" width="14" height="14" viewBox="0 0 16 16"><path fill-rule="evenodd" d="m8 1-2.5 5-5.5.8 4 4-1 5.2L8 13l5 3-1-5.2 4-4-5.5-.8z"></path></svg>
            {{ Number(metadata.stargazers_count).toLocaleString() }}
          </AppBadge>
          <AppBadge variant="neutral">
            <svg fill="currentColor" width="14" height="14" viewBox="0 0 16 16"><path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm3-8.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"></path></svg>
            {{ Number(metadata.forks_count).toLocaleString() }}
          </AppBadge>
        </div>
      </div>
    </div>

    <div class="issues-layout">
      <!-- AppSidebar handles mobile slide-in vs desktop fixed -->
      <AppSidebar title="Filters">
        <IssueFilters />
      </AppSidebar>

      <div class="issues-main">
        <div class="list-toolbar">
          <div class="toolbar-left">
            <AppButton variant="ghost" size="small" class="mobile-filter-trigger" @click="uiStore.toggleSidebar(true)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              Filters
            </AppButton>

            <div class="state-toggles" v-if="!isLoading">
              <button 
                :class="['state-btn', { 'is-active': filters.state === 'open' }]" 
                @click="updateFilters({ state: 'open' })"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="icon-open">
                  <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path>
                </svg>
                Open
              </button>
              <button 
                :class="['state-btn', { 'is-active': filters.state === 'closed' }]"
                @click="updateFilters({ state: 'closed' })"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="icon-closed">
                  <path d="M11.28 6.78a.75.75 0 00-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3.5-3.5z"></path>
                  <path fill-rule="evenodd" d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"></path>
                </svg>
                Closed
              </button>
            </div>
          </div>
          <div class="toolbar-right">
            <AppInput 
              v-model="searchQuery" 
              placeholder="Filter by title..." 
              class="client-search" 
            />
          </div>
        </div>

        <!-- Issue List -->
        <div class="issues-list" v-if="isLoading">
          <AppSkeleton type="card" v-for="i in 5" :key="i" class="mb-4" />
        </div>
        
        <div class="issues-list" v-else-if="filteredIssues.length > 0">
          <IssueCard 
            v-for="issue in filteredIssues" 
            :key="issue.id" 
            :issue="issue" 
            @click="router.push(`/${repoFullName}/issues/${issue.number}`)"
          />
        </div>

        <div class="empty-state" v-else-if="filteredIssues.length === 0 && !hasError">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>No results matched your search.</h3>
          <p class="text-muted">You could search via the API or try different filters.</p>
          <AppButton variant="secondary" @click="updateFilters({ state: 'all', labels: [], milestone: '', assignee: '' })">Clear Filters</AppButton>
        </div>

        <div class="error-state" v-if="hasError">
          <p class="text-danger">Failed to load issues. Check rate limit or permissions.</p>
        </div>

        <AppPagination 
          :current-page="pagination.page"
          :total-pages="pagination.totalPages"
          :links="pagination.links"
          @change="changePage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { useRepo } from '@/composables/useRepo'
import { useIssues } from '@/composables/useIssues'
import { useUiStore } from '@/stores/ui'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import IssueCard from '@/components/issue/IssueCard.vue'
import IssueFilters from '@/components/issue/IssueFilters.vue'

defineOptions({ name: 'IssuesView' })

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()

const { fetchRepoMetadata, repoFullName, metadata, hasSelectedRepo } = useRepo()
const { issues, filters, pagination, isLoading, hasError, fetchIssues, changePage, updateFilters } = useIssues()

const title = useTitle()

// Client-side filtering by title
const searchQuery = ref('')
const filteredIssues = computed(() => {
  if (!searchQuery.value) return issues.value
  const q = searchQuery.value.toLowerCase()
  return issues.value.filter(i => i.title.toLowerCase().includes(q))
})

// Sync URL Query to Store State
function syncQueryToFilters() {
  const query = route.query
  if (query.state) filters.value.state = query.state
  if (query.sort) filters.value.sort = query.sort
  if (query.direction) filters.value.direction = query.direction
  if (query.labels) {
    filters.value.labels = Array.isArray(query.labels) ? query.labels : query.labels.split(',')
  } else {
    filters.value.labels = []
  }
  if (query.milestone) filters.value.milestone = query.milestone
  if (query.assignee) filters.value.assignee = query.assignee
  if (query.page) pagination.value.page = parseInt(query.page, 10) || 1
}

// Sync Store State to URL Query
// Deep linkable
watch([filters, () => pagination.value.page], () => {
  const newQuery = { ...route.query }
  
  if (filters.value.state !== 'open') newQuery.state = filters.value.state
  else delete newQuery.state
  
  if (filters.value.sort !== 'created') newQuery.sort = filters.value.sort
  else delete newQuery.sort

  if (filters.value.direction !== 'desc') newQuery.direction = filters.value.direction
  else delete newQuery.direction
  
  if (filters.value.labels.length) newQuery.labels = filters.value.labels.join(',')
  else delete newQuery.labels

  if (filters.value.milestone) newQuery.milestone = filters.value.milestone
  else delete newQuery.milestone

  if (filters.value.assignee) newQuery.assignee = filters.value.assignee
  else delete newQuery.assignee

  if (pagination.value.page > 1) newQuery.page = pagination.value.page
  else delete newQuery.page

  // Only push if different to prevent infinite loop
  if (JSON.stringify(route.query) !== JSON.stringify(newQuery)) {
    router.replace({ ...route, query: newQuery })
  }
}, { deep: true })

watch(() => route.params, async (newParams) => {
  const { owner, repo } = newParams
  if (!owner || !repo) return
  syncQueryToFilters()
  await fetchRepoMetadata(owner, repo)
  await fetchIssues()
  title.value = `${repoFullName.value} - Issues`
}, { immediate: true })

</script>

<style scoped>
.issues-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

.repo-header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-16) var(--space-24);
}

.repo-header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-16);
}

.repo-title {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  margin: 0;
  font-size: var(--text-lg);
  font-weight: 500;
  color: var(--color-accent);
}

.repo-stats {
  display: flex;
  gap: var(--space-8);
}

.issues-layout {
  display: flex;
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
}

.issues-main {
  flex: 1;
  padding: var(--space-24);
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.list-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-16);
  gap: var(--space-16);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: var(--space-8) var(--space-16);
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-16);
}

.mobile-filter-trigger {
  display: none;
}
@media (max-width: 768px) {
  .mobile-filter-trigger { display: flex; }
}

.state-toggles {
  display: flex;
  gap: var(--space-16);
}

.state-btn {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  background: none;
  border: none;
  padding: var(--space-4) 0;
  cursor: pointer;
}
.state-btn:hover {
  color: var(--color-text-primary);
}
.state-btn.is-active {
  font-weight: 600;
  color: var(--color-text-primary);
}
.icon-open { color: var(--color-open); }
.icon-closed { color: var(--color-closed); }

.client-search {
  max-width: 200px;
}

.issues-list {
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.issues-list > * {
  border-bottom: 1px solid var(--color-border);
}
.issues-list > *:last-child {
  border-bottom: none;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-64) var(--space-24);
  text-align: center;
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-card);
  gap: var(--space-16);
}
.empty-icon {
  color: var(--color-text-muted);
}
.mb-4 { margin-bottom: var(--space-16); }
</style>
