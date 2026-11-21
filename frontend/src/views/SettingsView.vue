<script setup lang="ts">
import { reactive, watch } from 'vue'
import { settings, saveUserSettings } from '../stores'

const form = reactive({ ...settings })

watch(form, (value) => {
  Object.assign(settings, value)
  saveUserSettings()
}, { deep: true })
</script>

<template>
  <main class="page settings-page">
    <div class="page-heading">
      <p class="eyebrow">PREFERENCES</p>
      <h1>Settings</h1>
      <p>Manage your workspace preferences.</p>
    </div>
    <section class="settings-card">
      <div class="setting-row">
        <div><strong>Email notifications</strong><p>Preference saved in this browser.</p></div>
        <input v-model="form.emailNotifications" type="checkbox" aria-label="Email notifications">
      </div>
      <div class="setting-row">
        <div><strong>Task reminders</strong><p>Preference saved in this browser.</p></div>
        <input v-model="form.taskReminders" type="checkbox" aria-label="Task reminders">
      </div>
      <div class="setting-row">
        <div><strong>Compact mode</strong><p>Preference saved in this browser.</p></div>
        <input v-model="form.compactMode" type="checkbox" aria-label="Compact mode">
      </div>
    </section>
    <div class="save-note">✓ Preferences are saved automatically in this browser.</div>
  </main>
</template>
