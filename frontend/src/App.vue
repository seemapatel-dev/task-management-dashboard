<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Navbar from './components/dashboard/Navbar.vue'

const route = useRoute()

const pageName = computed(() =>
  String(route.meta.title || 'Dashboard')
)

const isAuthPage = computed(() =>
  route.path === '/login' ||
  route.path === '/register'
)
</script>

<template>
  <!-- Login/Register layout -->
  <RouterView v-if="isAuthPage" />

  <!-- Dashboard layout -->
  <div v-else class="app-layout">
    <Sidebar />

    <div class="content-area">
      <Navbar :active-page="pageName" />

      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>