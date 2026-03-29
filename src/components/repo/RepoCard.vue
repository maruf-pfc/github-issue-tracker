<template>
  <div class="repo-card" @click="$emit('select', repo)">
    <div class="repo-card-header">
      <h3 class="repo-name">{{ repo.full_name }}</h3>
      <span class="repo-updated">Updated {{ formatRelative(repo.updated_at) }}</span>
    </div>
    
    <p class="repo-description" v-if="repo.description">{{ repo.description }}</p>
    
    <div class="repo-stats">
      <span class="repo-stat" title="Language" v-if="repo.language">
        <span class="language-dot" :style="{ backgroundColor: getLanguageColor(repo.language) }"></span>
        {{ repo.language }}
      </span>
      
      <span class="repo-stat" title="Stars">
        <svg fill="currentColor" width="14" height="14" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="m8 1-2.5 5-5.5.8 4 4-1 5.2L8 13l5 3-1-5.2 4-4-5.5-.8z"></path>
        </svg>
        {{ formatNumber(repo.stargazers_count) }}
      </span>

      <span class="repo-stat" title="Forks">
        <svg fill="currentColor" width="14" height="14" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm3-8.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"></path>
        </svg>
        {{ formatNumber(repo.forks_count) }}
      </span>
      
      <span class="repo-stat" title="Open Issues">
        <svg fill="currentColor" width="14" height="14" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path>
        </svg>
        {{ formatNumber(repo.open_issues_count) }} open issues
      </span>
    </div>
  </div>
</template>

<script setup>
import { formatRelative } from '@/utils/date'

defineOptions({ name: 'RepoCard' })

defineProps({
  repo: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])

function formatNumber(num) {
  if (num === undefined || num === null) return '0'
  if (num > 999) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num
}

function getLanguageColor(language) {
  // Common github language colors approximation
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Vue: '#41b883',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    Ruby: '#701516',
    Java: '#b07219',
    Rust: '#dea584',
    Go: '#00ADD8'
  }
  return colors[language] || '#a1a1aa'
}
</script>

<style scoped>
.repo-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: var(--space-16);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.repo-card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.repo-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-8);
}

.repo-name {
  margin: 0;
  font-size: var(--text-lg);
  color: var(--color-accent);
  font-weight: 600;
  word-break: break-word;
}

.repo-updated {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.repo-description {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.repo-stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-16);
  margin-top: var(--space-4);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.repo-stat {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.language-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
</style>
