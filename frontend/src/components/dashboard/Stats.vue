```vue
<script setup>
import { computed } from 'vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

const totalTasks = computed(() => props.tasks.length)

const activeTasks = computed(() =>
  props.tasks.filter(task => task.status === 'active').length
)

const completedTasks = computed(() =>
  props.tasks.filter(task => task.status === 'completed').length
)

const highPriorityTasks = computed(() =>
  props.tasks.filter(
    task =>
      task.priority === 'high' &&
      task.status !== 'completed'
  ).length
)
</script>

<template>
  <section class="stats">

    <div class="stat-card">
      <div class="icon purple">▦</div>

      <div>
        <p>Total Tasks</p>
        <h2>{{ totalTasks }}</h2>
      </div>
    </div>

    <div class="stat-card">
      <div class="icon blue">◷</div>

      <div>
        <p>Active Tasks</p>
        <h2>{{ activeTasks }}</h2>
      </div>
    </div>

    <div class="stat-card">
      <div class="icon green">✓</div>

      <div>
        <p>Completed</p>
        <h2>{{ completedTasks }}</h2>
      </div>
    </div>

    <div class="stat-card">
      <div class="icon red">!</div>

      <div>
        <p>High Priority</p>
        <h2>{{ highPriorityTasks }}</h2>
      </div>
    </div>

  </section>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.stat-card {
  min-width: 0;

  background: white;

  border: 1px solid #e8ebf2;
  border-radius: 14px;

  padding: 20px;

  display: flex;
  align-items: center;
  gap: 15px;
}

.icon {
  width: 45px;
  height: 45px;

  flex-shrink: 0;

  border-radius: 11px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
  font-size: 18px;
}

.purple {
  background: #eeeeff;
  color: #5b5ce2;
}

.blue {
  background: #edf6ff;
  color: #3d8bd9;
}

.green {
  background: #edf9f2;
  color: #3b9860;
}

.red {
  background: #fff0f0;
  color: #d34f4f;
}

.stat-card p {
  margin: 0 0 5px;

  color: #858da0;

  font-size: 12px;
  font-weight: 600;
}

.stat-card h2 {
  margin: 0;

  color: #252b38;

  font-size: 26px;
}

@media (max-width: 1000px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .stats {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .stat-card {
    padding: 15px;
  }
}
</style>
```
