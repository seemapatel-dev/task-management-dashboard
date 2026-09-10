<script setup lang="ts">
import Stats from '../components/dashboard/Stats.vue'
import TaskList from '../components/dashboard/TaskList.vue'
import { tasks, addTask, updateTask, deleteTask, toggleTask } from '../stores'
</script>
<template><main class="page"><div class="page-heading"><div><p class="eyebrow">OVERVIEW</p><h1>Good morning, Seema</h1><p>Here is what's happening with your work today.</p></div></div><Stats :tasks="tasks"/><TaskList :tasks="tasks" @add-task="addTask" @update-task="updateTask" @delete-task="deleteTask" @toggle-status="toggleTask"/></main></template>
