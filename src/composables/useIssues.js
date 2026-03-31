import { storeToRefs } from 'pinia'
import { useIssuesStore } from '@/stores/issues'
import { useRepoStore } from '@/stores/repo'
import { useUiStore } from '@/stores/ui'
import { githubService, parseLinkHeader } from '@/api/github'
// No router needed here

export function useIssues() {
  const issuesStore = useIssuesStore()
  const repoStore = useRepoStore()
  const uiStore = useUiStore()
  const { issues, filters, pagination, isLoading, hasError } = storeToRefs(issuesStore)

  /**
   * Fetches issues for the current repo and updates the store
   */
  async function fetchIssues() {
    if (!repoStore.hasSelectedRepo) return

    issuesStore.isLoading = true
    issuesStore.hasError = false

    try {
      // Build params mapped to API spec
      const params = {
        state: filters.value.state,
        sort: filters.value.sort,
        direction: filters.value.direction,
        per_page: pagination.value.perPage,
        page: pagination.value.page
      }

      if (filters.value.labels.length > 0) {
        params.labels = filters.value.labels.join(',')
      }
      if (filters.value.milestone) {
        params.milestone = filters.value.milestone
      }
      if (filters.value.assignee) {
        params.assignee = filters.value.assignee
      }

      const response = await githubService.getIssues(repoStore.currentOwner, repoStore.currentRepo, params)
      
      issuesStore.setIssues(response.data)
      
      const linkParsed = parseLinkHeader(response.headers['link'])
      issuesStore.setPaginationContext(linkParsed)

    } catch (error) {
      issuesStore.hasError = true
      issuesStore.setIssues([])
      uiStore.addToast({ type: 'error', title: 'Error', message: 'Failed to fetch issues' })
      console.error(error)
    } finally {
      issuesStore.isLoading = false
    }
  }

  function changePage(newPage) {
    if (newPage === pagination.value.page) return
    issuesStore.pagination.page = newPage
    fetchIssues()
  }

  function updateFilters(newFilters) {
    issuesStore.setFilters(newFilters)
    issuesStore.pagination.page = 1 // reset to first page
    fetchIssues()
  }

  return {
    issues,
    filters,
    pagination,
    isLoading,
    hasError,
    
    fetchIssues,
    changePage,
    updateFilters
  }
}
