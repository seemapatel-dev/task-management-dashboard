<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter(); const route = useRoute(); const open = ref(false)
const items = [
  ['Dashboard','/dashboard','⌂'], ['My Tasks','/tasks','✓'], ['Projects','/projects','▦'], ['Calendar','/calendar','□'], ['Settings','/settings','⚙']
]
function go(path:string){ router.push(path); open.value=false }
</script>
<template>
  <button v-if="open" class="mobile-overlay" @click="open=false" aria-label="Close menu"></button>
  <aside class="sidebar" :class="{ open }">
    <div class="brand"><span class="brand-mark">✓</span><strong>TaskFlow</strong><button class="close-mobile" @click="open=false">×</button></div>
    <nav class="navigation" aria-label="Main navigation">
      <button v-for="item in items" :key="item[1]" class="nav-item" :class="{active: route.path===item[1]}" @click="go(item[1] as string)"><span class="nav-icon">{{ item[2] }}</span>{{ item[0] }}</button>
    </nav>
    <div class="sidebar-bottom">
      <button class="profile" :class="{active: route.path==='/profile'}" @click="go('/profile')">
        <span class="avatar">SP</span><span class="profile-info"><strong>Seema Patel</strong><small>Developer</small></span><span class="chevron">›</span>
      </button>
    </div>
  </aside>
  <button class="mobile-menu" @click="open=true" aria-label="Open menu">☰</button>
</template>
