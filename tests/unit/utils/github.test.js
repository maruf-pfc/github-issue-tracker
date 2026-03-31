import { describe, it, expect } from 'vitest'
import { parseRepoUrl } from '@/utils/github'

describe('utils/github.js', () => {
  it('parses full GitHub URLs', () => {
    expect(parseRepoUrl('https://github.com/facebook/react')).toEqual({ owner: 'facebook', repo: 'react' })
    expect(parseRepoUrl('http://github.com/vuejs/core/')).toEqual({ owner: 'vuejs', repo: 'core' })
  })

  it('parses owner/repo shorthand', () => {
    expect(parseRepoUrl('maruf-pfc/github-issue-tracker')).toEqual({ owner: 'maruf-pfc', repo: 'github-issue-tracker' })
  })

  it('handles .git extensions', () => {
    expect(parseRepoUrl('https://github.com/facebook/react.git')).toEqual({ owner: 'facebook', repo: 'react' })
  })

  it('returns null for invalid inputs', () => {
    expect(parseRepoUrl('justatitle')).toBeNull()
    expect(parseRepoUrl('')).toBeNull()
    expect(parseRepoUrl(null)).toBeNull()
  })
})
