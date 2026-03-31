import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IssueCard from '@/components/issue/IssueCard.vue'

describe('components/issue/IssueCard.vue', () => {
  const mockIssue = {
    number: 123,
    title: 'Test Issue',
    state: 'open',
    created_at: '2023-10-12T12:00:00Z',
    user: { login: 'user1', avatar_url: 'url' },
    labels: [],
    comments: 5
  }

  it('renders issue title and number', () => {
    const wrapper = mount(IssueCard, {
      props: { issue: mockIssue }
    })
    expect(wrapper.text()).toContain('Test Issue')
    expect(wrapper.text()).toContain('#123')
  })

  it('emits click event with issue when clicked', async () => {
    const wrapper = mount(IssueCard, {
      props: { issue: mockIssue }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')[0]).toEqual([mockIssue])
  })
})
