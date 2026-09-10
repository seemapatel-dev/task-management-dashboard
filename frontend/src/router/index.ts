
import { createRouter, createWebHistory } from 'vue-router'

import { restoreSession } from '../stores'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

import DashboardView from '../views/DashboardView.vue'
import MyTasksView from '../views/MyTasksView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import CalendarView from '../views/CalendarView.vue'
import SettingsView from '../views/SettingsView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({

  history: createWebHistory(),

  routes: [

    {
      path: '/',
      redirect: '/dashboard'
    },

    {
      path: '/login',
      component: Login,
      meta: {
        title: 'Login',
        requiresGuest: true
      }
    },

    {
      path: '/register',
      component: Register,
      meta: {
        title: 'Register',
        requiresGuest: true
      }
    },

    {
      path: '/dashboard',
      component: DashboardView,
      meta: {
        title: 'Dashboard',
        requiresAuth: true
      }
    },

    {
      path: '/tasks',
      component: MyTasksView,
      meta: {
        title: 'My Tasks',
        requiresAuth: true
      }
    },

    {
      path: '/projects',
      component: ProjectsView,
      meta: {
        title: 'Projects',
        requiresAuth: true
      }
    },

    {
      path: '/calendar',
      component: CalendarView,
      meta: {
        title: 'Calendar',
        requiresAuth: true
      }
    },

    {
      path: '/settings',
      component: SettingsView,
      meta: {
        title: 'Settings',
        requiresAuth: true
      }
    },

    {
      path: '/profile',
      component: ProfileView,
      meta: {
        title: 'Profile',
        requiresAuth: true
      }
    }

  ]

})

router.beforeEach(async (to) => {

  const hasToken =
    !!localStorage.getItem('access_token')

  if (to.meta.requiresAuth && !hasToken) {
    return '/login'
  }

  if (
    (to.path === '/login' ||
      to.path === '/register') &&
    hasToken
  ) {
    const restored = await restoreSession()

    if (restored) {
      return '/dashboard'
    }
  }

  if (hasToken) {
    await restoreSession()
  }

})

export default router
