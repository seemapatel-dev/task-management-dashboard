<script setup lang="ts">
import { computed, ref } from 'vue'
import { tasks } from '../stores'
const current=ref(new Date(2026,8,1)); const selected=ref('')
const monthLabel=computed(()=>current.value.toLocaleString('en',{month:'long',year:'numeric'}))
const days=computed(()=>{const y=current.value.getFullYear(),m=current.value.getMonth(),first=new Date(y,m,1).getDay(),count=new Date(y,m+1,0).getDate();return [...Array(first).fill(null),...Array.from({length:count},(_,i)=>i+1)]})
const key=(d:number)=>{const y=current.value.getFullYear(),m=String(current.value.getMonth()+1).padStart(2,'0'),day=String(d).padStart(2,'0');return `${y}-${m}-${day}`}
const dayTasks=(d:number)=>tasks.value.filter(t=>t.due===key(d))
function move(n:number){current.value=new Date(current.value.getFullYear(),current.value.getMonth()+n,1)}
</script>
<template><main class="page"><div class="page-heading page-heading-row"><div><p class="eyebrow">PLANNING</p><h1>Calendar</h1><p>See your tasks by due date.</p></div><div class="calendar-nav"><button @click="move(-1)">‹</button><strong>{{monthLabel}}</strong><button @click="move(1)">›</button></div></div><section class="calendar"><div class="weekdays"><span v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d">{{d}}</span></div><div class="calendar-grid"><button v-for="(d,i) in days" :key="i" class="day" :class="{empty:!d,selected:d&&selected===key(d)}" :disabled="!d" @click="d&&(selected=key(d))"><template v-if="d"><b>{{d}}</b><span v-for="t in dayTasks(d).slice(0,2)" :key="t.id" class="calendar-task" :class="t.priority">{{t.title}}</span><em v-if="dayTasks(d).length>2">+{{dayTasks(d).length-2}} more</em></template></button></div></section><section v-if="selected" class="selected-day"><h2>Tasks for {{selected}}</h2><p v-if="!tasks.filter(t=>t.due===selected).length">No tasks due.</p><div v-for="t in tasks.filter(t=>t.due===selected)" :key="t.id" class="selected-task"><span :class="['task-dot',t.priority]"></span><div><strong>{{t.title}}</strong><small>{{t.project}} · {{t.status}}</small></div></div></section></main></template>
