<script setup lang="ts">
import { currentUser } from '../stores'

function initials() {
  if (!currentUser.value?.name) {
    return 'U'
  }

  return currentUser.value.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
</script>

<template>
  <main class="page">

    <div class="page-heading">
      <p class="eyebrow">ACCOUNT</p>

      <h1>My Profile</h1>

      <p>Your workspace identity.</p>
    </div>

    <section class="profile-card">

      <div class="large-avatar">
        {{ initials() }}
      </div>

      <div>

        <h2>
          {{ currentUser?.name }}
        </h2>

        <p>
          {{ currentUser?.role }}
        </p>

        <span>
          {{ currentUser?.email }}
        </span>

        <span>
          TaskFlow workspace member
        </span>

      </div>

    </section>

  </main>
</template>