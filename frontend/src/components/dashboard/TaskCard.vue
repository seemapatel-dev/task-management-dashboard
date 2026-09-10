<script setup lang="ts">
import type { Task } from '../../stores'
defineProps<{task:Task}>()
const emit=defineEmits(['delete','edit','toggle-status'])
</script>
<template>
<article class="task-card">
<button class="checkbox" :class="{completed:task.status==='completed'}" @click="emit('toggle-status',task.id)">{{task.status==='completed'?'✓':''}}</button>
<div class="task-content"><div class="title-row"><h3 :class="{done:task.status==='completed'}">{{task.title}}</h3><span class="priority" :class="task.priority">{{task.priority}}</span></div><p class="description">{{task.description}}</p><div class="task-meta"><strong>{{task.project}}</strong><span>•</span><span>Due {{task.due||'No date'}}</span><span class="status" :class="task.status">{{task.status}}</span></div></div>
<div class="actions"><button class="edit-btn" @click="emit('edit',task)">Edit</button><button class="delete-btn" @click="emit('delete',task.id)">Delete</button></div>
</article>
</template>
