<template>
  <div class="issue-filters">
    
    <!-- State -->
    <div class="filter-group">
      <label>State</label>
      <AppSelect 
        :model-value="filters.state" 
        @update:model-value="val => updateFilters({ state: val })"
        :options="[
          { label: 'Open', value: 'open' },
          { label: 'Closed', value: 'closed' },
          { label: 'All', value: 'all' }
        ]"
      />
    </div>

    <!-- Sort By -->
    <div class="filter-group">
      <label>Sort By</label>
      <AppSelect 
        :model-value="filters.sort" 
        @update:model-value="val => updateFilters({ sort: val })"
        :options="[
          { label: 'Newest', value: 'created' },
          { label: 'Recently Updated', value: 'updated' },
          { label: 'Most Commented', value: 'comments' }
        ]"
      />
    </div>

    <!-- Direction -->
    <div class="filter-group">
      <label>Direction</label>
      <div class="radio-group">
        <label class="radio-label">
          <input type="radio" value="desc" :checked="filters.direction === 'desc'" @change="updateFilters({ direction: 'desc' })" />
          Descending
        </label>
        <label class="radio-label">
          <input type="radio" value="asc" :checked="filters.direction === 'asc'" @change="updateFilters({ direction: 'asc' })" />
          Ascending
        </label>
      </div>
    </div>

    <hr class="divider" />

    <!-- Assignee -->
    <div class="filter-group">
      <label>Assignee</label>
      <AppSelect 
        :model-value="filters.assignee" 
        @update:model-value="val => updateFilters({ assignee: val })"
        :options="assigneeOptions"
      />
    </div>

    <!-- Milestone -->
    <div class="filter-group">
      <label>Milestone</label>
      <AppSelect 
        :model-value="filters.milestone" 
        @update:model-value="val => updateFilters({ milestone: val })"
        :options="milestoneOptions"
      />
    </div>

    <!-- Labels (Multi-select) -->
    <div class="filter-group">
      <label>Labels (Multi-Select)</label>
      <div class="labels-container" v-if="labelsObj.length > 0">
        <button 
          v-for="label in labelsObj" 
          :key="label.name"
          :class="['label-toggle', { 'is-active': filters.labels.includes(label.name) }]"
          @click="toggleLabel(label.name)"
        >
          <span class="color-dot" :style="{ backgroundColor: `#${label.color}` }"></span>
          {{ label.name }}
        </button>
      </div>
      <div v-else-if="isLoadingData" class="text-xs text-muted">Loading labels...</div>
      <div v-else class="text-xs text-muted">No labels found.</div>
    </div>

    <AppButton 
      variant="secondary" 
      size="small" 
      block 
      class="mt-4"
      @click="updateFilters({ state: 'open', sort: 'created', direction: 'desc', labels: [], milestone: '', assignee: '' })"
    >
      Clear All Filters
    </AppButton>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useIssues } from '@/composables/useIssues'
import { useRepo } from '@/composables/useRepo'
import { githubService } from '@/api/github'
import AppSelect from '@/components/common/AppSelect.vue'
import AppButton from '@/components/common/AppButton.vue'
import { storeToRefs } from 'pinia'
import { useIssuesStore } from '@/stores/issues'

defineOptions({ name: 'IssueFilters' })

const { filters, updateFilters } = useIssues()
const issuesStore = useIssuesStore()
const { repoFullName, currentOwner, currentRepo } = useRepo()

const assigneesObj = ref([])
const milestonesObj = ref([])
const labelsObj = ref([])

const isLoadingData = ref(false)

const assigneeOptions = computed(() => {
  const opts = [{ label: 'Any Assignee', value: '' }, { label: 'Unassigned', value: 'none' }]
  return opts.concat(assigneesObj.value.map(a => ({ label: a.login, value: a.login })))
})

const milestoneOptions = computed(() => {
  const opts = [{ label: 'Any Milestone', value: '' }, { label: 'No Milestone', value: 'none' }]
  return opts.concat(milestonesObj.value.map(m => ({ label: m.title, value: m.number })))
})

function toggleLabel(name) {
  issuesStore.toggleLabel(name)
  issuesStore.pagination.page = 1
  // Trigger fetch by updating filter object ref manually but `useIssues` triggers auto refetch anyway wait..
  // The toggleLabel function in useIssues uses store directly and we need to fetchIssues
  updateFilters({ labels: [...filters.value.labels] })
}

async function loadFilterData() {
  if (!currentOwner.value || !currentRepo.value) return
  isLoadingData.value = true
  try {
    const [labelsRes, mkRes, asRes] = await Promise.all([
      githubService.getLabels(currentOwner.value, currentRepo.value),
      githubService.getMilestones(currentOwner.value, currentRepo.value),
      githubService.getAssignees(currentOwner.value, currentRepo.value)
    ])
    labelsObj.value = labelsRes.data
    milestonesObj.value = mkRes.data
    assigneesObj.value = asRes.data
  } catch (e) {
    // Ignore errors for metadata filters
  } finally {
    isLoadingData.value = false
  }
}

watch(repoFullName, loadFilterData, { immediate: true })
</script>

<style scoped>
.issue-filters {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.filter-group label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.radio-group {
  display: flex;
  gap: var(--space-16);
}

.radio-label {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.divider {
  border: 0;
  height: 1px;
  background-color: var(--color-border);
  margin: 0;
}

.labels-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  max-height: 200px;
  overflow-y: auto;
  padding-right: var(--space-8);
}

.label-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-badge);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.label-toggle:hover {
  background-color: var(--color-surface-subtle);
  color: var(--color-text-primary);
}

.label-toggle.is-active {
  background-color: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.text-xs { font-size: var(--text-xs); }
.text-muted { color: var(--color-text-muted); }
.mt-4 { margin-top: var(--space-16); }
</style>
