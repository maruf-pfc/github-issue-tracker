import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppBadge from '@/components/common/AppBadge.vue'

describe('components/common/AppBadge.vue', () => {
  it('renders correct variant class', () => {
    const wrapper = mount(AppBadge, {
      props: { variant: 'success' }
    })
    expect(wrapper.classes()).toContain('app-badge--success')
  })

  it('renders slot content', () => {
    const wrapper = mount(AppBadge, {
      slots: { default: 'Test Content' }
    })
    expect(wrapper.text()).toBe('Test Content')
  })
})
