import { describe, it, expect, beforeEach } from 'vitest'
import { useRateLimit } from '@/composables/useRateLimit'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

// Helper component to test composable
const TestComponent = defineComponent({
  setup() {
    return useRateLimit()
  },
  template: '<div></div>'
})

describe('composables/useRateLimit.js', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with null values', () => {
    const wrapper = mount(TestComponent)
    expect(wrapper.vm.rateLimitRemaining).toBeNull()
    expect(wrapper.vm.rateLimitReset).toBeNull()
  })

  it('updates values when github:rate-limit-update event is dispatched', async () => {
    const wrapper = mount(TestComponent)
    const event = new CustomEvent('github:rate-limit-update', {
      detail: { remaining: 4999, reset: 1600000000 }
    })
    window.dispatchEvent(event)
    
    await nextTick()
    
    expect(wrapper.vm.rateLimitRemaining).toBe(4999)
    expect(wrapper.vm.rateLimitReset).toBe(1600000000)
  })
})
