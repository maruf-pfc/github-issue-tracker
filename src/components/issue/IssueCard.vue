<template>
  <div class="issue-card-container" @click="$emit('click', issue)">
    <div :class="['issue-card', `issue-card--${issue.state}`]">
      <div class="card-icon">
        <svg v-if="issue.state === 'open'" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="icon-open">
          <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="icon-closed">
          <path d="M11.28 6.78a.75.75 0 00-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3.5-3.5z"></path>
          <path fill-rule="evenodd" d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"></path>
        </svg>
      </div>
      
      <div class="card-content">
        <div class="card-title-row">
          <span class="issue-title">{{ issue.title }}</span>
          <div class="labels-list" v-if="issue.labels && issue.labels.length > 0">
            <IssueLabel v-for="label in issue.labels" :key="label.id" :label="label" />
          </div>
        </div>
        
        <div class="card-metadata">
          <span class="issue-number">#{{ issue.number }}</span>
          <span class="text-separator">•</span>
          <span class="issue-opened">opened {{ formatRelative(issue.created_at) }}</span>
          <span class="text-separator">by</span>
          <div class="issue-author">
            <img :src="issue.user.avatar_url" class="author-avatar" alt="Avatar"/>
            <span>{{ issue.user.login }}</span>
          </div>
        </div>
      </div>

      <div class="card-comments" v-if="issue.comments > 0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path fill-rule="evenodd" d="M2.75 2.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25H2.75zM1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0113.25 12H9.06l-2.573 2.573A1.457 1.457 0 014 13.543V12H2.75A1.75 1.75 0 011 10.25v-7.5z"></path>
        </svg>
        <span>{{ issue.comments }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatRelative } from '@/utils/date'
import IssueLabel from './IssueLabel.vue'

defineOptions({ name: 'IssueCard' })

defineProps({
  issue: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])
</script>

<style scoped>
.issue-card-container {
  display: flex;
  cursor: pointer;
  background-color: transparent;
  width: 100%;
}

.issue-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-12);
  padding: var(--space-16);
  width: 100%;
  border-left: 2px solid transparent;
  transition: all var(--transition-fast);
}

.issue-card-container:hover .issue-card {
  border-left: 2px solid var(--color-accent);
  background-color: var(--color-surface-subtle);
}

.card-icon {
  margin-top: 2px;
  flex-shrink: 0;
}
.icon-open { color: var(--color-open); }
.icon-closed { color: var(--color-closed); }

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

.card-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.issue-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.issue-card-container:hover .issue-title {
  color: var(--color-accent);
}

.labels-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.card-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.issue-number {
  font-family: var(--font-mono);
}

.text-separator {
  color: var(--color-text-muted);
}

.issue-author {
  display: flex;
  align-items: center;
  gap: 6px;
}
.author-avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.card-comments {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  font-weight: 500;
  flex-shrink: 0;
  margin-left: var(--space-16);
}
</style>
