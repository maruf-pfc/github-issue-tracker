import { describe, it, expect } from 'vitest'
import { formatRelative, formatAbsolute } from '@/utils/date'

describe('utils/date.js', () => {
  it('formats relative dates correctly', () => {
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    expect(formatRelative(yesterday)).toContain('day ago')
  })

  it('formats absolute dates correctly', () => {
    const date = new Date('2023-10-12T12:00:00Z')
    // Result depends on locale, but checking for year and month
    expect(formatAbsolute(date)).toContain('2023')
    expect(formatAbsolute(date)).toContain('Oct')
  })

  it('handles invalid dates gracefully', () => {
    expect(formatRelative('invalid')).toBe('')
    expect(formatAbsolute(null)).toBe('')
  })
})
