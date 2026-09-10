<script setup lang="ts">
import { reactive, watch } from 'vue'
import { settings } from '../stores'
const form=reactive({...settings}); watch(form,v=>Object.assign(settings,v),{deep:true})
</script>
<template><main class="page settings-page"><div class="page-heading"><p class="eyebrow">PREFERENCES</p><h1>Settings</h1><p>Manage your workspace preferences.</p></div><section class="settings-card"><div class="setting-row"><div><strong>Email notifications</strong><p>Receive updates about tasks and projects.</p></div><input v-model="form.emailNotifications" type="checkbox"></div><div class="setting-row"><div><strong>Task reminders</strong><p>Show reminders for upcoming due dates.</p></div><input v-model="form.taskReminders" type="checkbox"></div><div class="setting-row"><div><strong>Compact mode</strong><p>Use tighter spacing across the workspace.</p></div><input v-model="form.compactMode" type="checkbox"></div><div class="setting-row"><div><strong>Dark mode</strong><p>Dark mode can be enabled when the theme system is added.</p></div><input v-model="form.darkMode" type="checkbox"></div></section><div class="save-note">✓ Settings are saved automatically.</div></main></template>
