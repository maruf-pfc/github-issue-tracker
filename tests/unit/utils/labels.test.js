import { describe, it, expect } from 'vitest'
import { getContrastColor } from '@/utils/labels'

describe('utils/labels.js', () => {
  it('returns white for dark colors', () => {
    expect(getContrastColor('000000')).toBe('#ffffff')
    expect(getContrastColor('#3178c6')).toBe('#ffffff')
  })

  it('returns black for light colors', () => {
    expect(getContrastColor('ffffff')).toBe('#000000')
    expect(getContrastColor('#f1e05a')).toBe('#000000')
  })

  it('handles missing input gracefully', () => {
    expect(getContrastColor('')).toBe('#000000')
  })
})
