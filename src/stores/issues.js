import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useIssuesStore = defineStore('issues', () => {
  // Application State
  const issues = ref([])
  const totalOpenCount = ref(0)
  const totalClosedCount = ref(0)
  
  // Active Filters
  const filters = ref({
    state: 'open',       // open, closed, all
    sort: 'created',     // created, updated, comments
    direction: 'desc',   // asc, desc
    labels: [],          // array of strings
    milestone: '',
    assignee: ''
  })
  
  // Pagination State
  const pagination = ref({
    page: 1,
    perPage: 30,
    totalPages: null,
    links: {} // From Link header (next, prev, first, last)
  })

  const isLoading = ref(false)
  const hasError = ref(false)

  // Getters
  const allIssues = computed(() => issues.value)
  const activeFilters = computed(() => filters.value)
  
  // Actions
  function setIssues(newIssues) {
    issues.value = newIssues
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function toggleLabel(labelName) {
    const list = filters.value.labels
    if (list.includes(labelName)) {
      filters.value.labels = list.filter(l => l !== labelName)
    } else {
      filters.value.labels.push(labelName)
    }
  }

  function setPaginationContext(linksObj) {
    pagination.value.links = linksObj || {}
    if (linksObj?.last) {
      // Parse last page number from url
      try {
        const url = new URL(linksObj.last)
        const lastPage = url.searchParams.get('page')
        if (lastPage) {
          pagination.value.totalPages = parseInt(lastPage, 10)
        }
      } catch {
        // failed to parse
      }
    }
  }

  function clearState() {
    issues.value = []
    pagination.value = { page: 1, perPage: 30, totalPages: null, links: {} }
    hasError.value = false
    isLoading.value = false
  }

  return {
    issues,
    totalOpenCount,
    totalClosedCount,
    filters,
    pagination,
    isLoading,
    hasError,
    
    allIssues,
    activeFilters,
    
    setIssues,
    setFilters,
    toggleLabel,
    setPaginationContext,
    clearState
  }
})
