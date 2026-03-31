import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useIssues } from '@/composables/useIssues'
import { createPinia, setActivePinia } from 'pinia'
import { useRepoStore } from '@/stores/repo'
import { githubService } from '@/api/github'

vi.mock('@/api/github', () => ({
  githubService: {
    getIssues: vi.fn()
  },
  parseLinkHeader: vi.fn()
}))

describe('composables/useIssues.js', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('updates issues when fetchIssues is called', async () => {
    const repoStore = useRepoStore()
    repoStore.setRepo('facebook', 'react')
    
    const mockIssues = [{ id: 1, title: 'Test' }]
    githubService.getIssues.mockResolvedValue({ data: mockIssues, headers: {} })
    
    const { issues, fetchIssues } = useIssues()
    await fetchIssues()
    
    expect(issues.value).toEqual(mockIssues)
  })

  it('handles errors gracefully', async () => {
    const repoStore = useRepoStore()
    repoStore.setRepo('facebook', 'react')
    
    githubService.getIssues.mockRejectedValue(new Error('Network error'))
    
    const { issues, hasError, fetchIssues } = useIssues()
    await fetchIssues()
    
    expect(issues.value).toEqual([])
    expect(hasError.value).toBe(true)
  })
})
