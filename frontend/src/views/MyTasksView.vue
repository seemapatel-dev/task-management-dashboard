<script setup lang="ts">
import { onMounted } from 'vue'
import TaskList from '../components/dashboard/TaskList.vue'
import {
  tasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTask,
  loadTasks
} from '../stores'

onMounted(async () => {
  await loadTasks()
})
</script>

<template>
  <main class="page">
    <div class="page-heading">
      <div>
        <p class="eyebrow">WORKSPACE</p>
        <h1>My Tasks</h1>
        <p>Create, organize and track everything you need to get done.</p>
      </div>
    </div>

    <TaskList
      :tasks="tasks"
      @add-task="addTask"
      @update-task="updateTask"
      @delete-task="deleteTask"
      @toggle-status="toggleTask"
    />
  </main>
</template>