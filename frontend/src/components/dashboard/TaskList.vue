<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskFilters from './TaskFilters.vue'
import TaskCard from './TaskCard.vue'
import TaskModal from './TaskModal.vue'
import type { Task } from '../../stores'

const props = defineProps<{ tasks: Task[] }>()
const emit = defineEmits(['add-task','update-task','delete-task','toggle-status'])
const search=ref(''); const statusFilter=ref('all'); const priorityFilter=ref('all'); const showModal=ref(false); const editingTask=ref<Task|null>(null)
const filteredTasks=computed(()=>props.tasks.filter(t=>{const q=search.value.trim().toLowerCase();return (!q||t.title.toLowerCase().includes(q)||t.description.toLowerCase().includes(q))&&(statusFilter.value==='all'||t.status===statusFilter.value)&&(priorityFilter.value==='all'||t.priority===priorityFilter.value)}))
function createTask(){editingTask.value=null;showModal.value=true}
function editTask(t:Task){editingTask.value={...t};showModal.value=true}
function saveTask(t:Task){editingTask.value?emit('update-task',t):emit('add-task',t);showModal.value=false;editingTask.value=null}
</script>
<template>
<section class="tasks-section">
  <div class="section-header"><div><h2>My Tasks</h2><p>{{ filteredTasks.length }} {{ filteredTasks.length===1?'task':'tasks' }} found</p></div><button class="create-btn" @click="createTask">＋ New Task</button></div>
  <TaskFilters :search="search" :status="statusFilter" :priority="priorityFilter" @update:search="search=$event" @update:status="statusFilter=$event" @update:priority="priorityFilter=$event" />
  <div v-if="filteredTasks.length" class="task-list"><TaskCard v-for="task in filteredTasks" :key="task.id" :task="task" @edit="editTask" @delete="emit('delete-task',$event)" @toggle-status="emit('toggle-status',$event)" /></div>
  <div v-else class="empty-state"><div class="empty-icon">✓</div><h3>No tasks found</h3><p>Change your filters or create a new task.</p><button class="empty-btn" @click="createTask">Create Task</button></div>
  <TaskModal v-if="showModal" :task="editingTask" @save="saveTask" @close="showModal=false;editingTask=null" />
</section>
</template>
