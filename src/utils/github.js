/**
 * Parses user input into a GitHub owner and repo.
 * Handles patterns:
 * - https://github.com/owner/repo
 * - github.com/owner/repo
 * - owner/repo
 * - https://github.com/owner/repo/issues/...
 * 
 * @param {string} input 
 * @returns {{ owner: string, repo: string } | null}
 */
export function parseRepoUrl(input) {
  if (!input || typeof input !== 'string') return null
  
  const trimmed = input.trim()

  // Match full URLs or just owner/repo
  // Examples: owner/repo, http://github.com/owner/repo, github.com/owner/repo.git
  const regex = /^(?:https?:\/\/)?(?:github\.com\/)?([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:\.git|\/.*)?$/i
  
  const match = trimmed.match(regex)
  if (match && match.length >= 3) {
    return {
      owner: match[1],
      // Remove trailing .git if the regex didn't catch it correctly in grouping
      repo: match[2].replace(/\.git$/, '')
    }
  }

  return null
}
