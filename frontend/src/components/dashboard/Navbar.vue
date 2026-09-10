<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser, logoutUser } from '../../stores'

defineProps<{
  activePage?: string
}>()

const router = useRouter()

const menu = ref(false)
const notifications = ref(false)

const initials = () => {
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

function signOut() {
  menu.value = false

  logoutUser()

  router.push('/login')
}
</script>

<template>
  <header class="navbar">

    <div class="breadcrumb">
      <span>Workspace</span>
      <span>/</span>
      <strong>{{ activePage }}</strong>
    </div>

    <div class="navbar-actions">

      <!-- Notifications -->
      <div class="nav-popover-wrap">

        <button
          class="icon-btn"
          @click="notifications = !notifications"
          aria-label="Notifications"
        >
          ♧
          <i></i>
        </button>

        <div
          v-if="notifications"
          class="popover"
        >
          <strong>Notifications</strong>
          <p>No new notifications.</p>
        </div>

      </div>

      <!-- User -->
      <div class="nav-popover-wrap">

        <button
          class="profile-btn"
          @click="menu = !menu"
        >
          <span class="mini-avatar">
            {{ initials() }}
          </span>

          <span class="profile-name">
            {{ currentUser?.name || 'User' }}
          </span>

          <span>⌄</span>
        </button>

        <div
          v-if="menu"
          class="popover profile-menu"
        >

          <div class="menu-user">

            <span class="mini-avatar">
              {{ initials() }}
            </span>

            <div>
              <strong>
                {{ currentUser?.name }}
              </strong>

              <small>
                {{ currentUser?.role }}
              </small>
            </div>

          </div>

          <button
            @click="
              router.push('/profile');
              menu = false
            "
          >
            My Profile
          </button>

          <button
            @click="
              router.push('/settings');
              menu = false
            "
          >
            Settings
          </button>

          <button @click="signOut">
            Sign out
          </button>

        </div>

      </div>

    </div>

  </header>
</template>