import { computed, reactive, ref } from 'vue'

import {
  register as apiRegister,
  login as apiLogin,
  getCurrentUser,
  getTasks,
  createTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask
} from './api'

import type {
  User,
  Task
} from './api'


export type { User, Task } from './api'

// export type User = {
//   id: string
//   name: string
//   email: string
//   role: string
// }

// export type Task = {
//   id: number
//   title: string
//   description: string
//   project: string
//   priority: 'high' | 'medium' | 'low'
//   status: 'active' | 'completed'
//   due: string
// }

export type Project = {
  id: number
  name: string
  description: string
  color: string
  status: 'active' | 'completed' | 'on-hold'
}

const defaultTasks: Task[] = [
  {
    id: 1,
    title: 'Learn Vue',
    description: 'Practice Vue 3 composition API and component patterns.',
    project: 'Frontend',
    priority: 'high',
    status: 'active',
    due: '2026-09-12'
  },
  {
    id: 2,
    title: 'Build Task App',
    description: 'Create a production-style task management dashboard.',
    project: 'Frontend',
    priority: 'high',
    status: 'completed',
    due: '2026-09-10'
  },
  {
    id: 3,
    title: 'Practice JavaScript',
    description: 'Review modern JavaScript concepts and coding problems.',
    project: 'Backend',
    priority: 'medium',
    status: 'active',
    due: '2026-09-15'
  }
]

const defaultProjects: Project[] = [
  {
    id: 1,
    name: 'Frontend',
    description: 'Vue dashboard and user interface work.',
    color: '#4f46e5',
    status: 'active'
  },
  {
    id: 2,
    name: 'Backend',
    description: 'APIs, services and application logic.',
    color: '#0891b2',
    status: 'active'
  },
  {
    id: 3,
    name: 'Documentation',
    description: 'Project documentation and learning notes.',
    color: '#16a34a',
    status: 'on-hold'
  }
]

const defaultSettings = {
  compactMode: false,
  emailNotifications: true,
  taskReminders: true,
  darkMode: false
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/* ---------------- AUTH ---------------- */

export const currentUser = ref<User | null>(null)

export function getUserKey() {
  return currentUser.value?.id || null
}

export function getUserTasksKey() {
  return `taskflow.tasks.${getUserKey()}`
}

export function getUserProjectsKey() {
  return `taskflow.projects.${getUserKey()}`
}

export function getUserSettingsKey() {
  return `taskflow.settings.${getUserKey()}`
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  try {
    const data = await apiRegister(
      name,
      email,
      password
    )

    localStorage.setItem(
      'access_token',
      data.access
    )

    localStorage.setItem(
      'refresh_token',
      data.refresh
    )

    currentUser.value = data.user

    initializeUserData(data.user.id)

    return {
      success: true,
      message: 'Account created successfully.'
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Registration failed.'
    }
  }
}

export async function loginWithCredentials(
  email: string,
  password: string
) {
  try {
    const data = await apiLogin(
      email,
      password
    )

    localStorage.setItem(
      'access_token',
      data.access
    )

    localStorage.setItem(
      'refresh_token',
      data.refresh
    )

    currentUser.value = data.user

    initializeUserData(data.user.id)

    return {
      success: true,
      message: 'Login successful.'
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Invalid email or password.'
    }
  }
}

export function logoutUser() {
  currentUser.value = null

  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('taskflow.currentUser')
}

export async function restoreSession() {
  const accessToken =
    localStorage.getItem('access_token')

  if (!accessToken) {
    currentUser.value = null
    return false
  }

  try {
    const user = await getCurrentUser()

    currentUser.value = user

    initializeUserData(user.id)

    return true
  } catch {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    currentUser.value = null

    return false
  }
}

function initializeUserData(userId: string) {
  const projectKey = `taskflow.projects.${userId}`
  const settingsKey = `taskflow.settings.${userId}`

  if (!localStorage.getItem(projectKey)) {
    localStorage.setItem(
      projectKey,
      JSON.stringify(defaultProjects)
    )
  }

  if (!localStorage.getItem(settingsKey)) {
    localStorage.setItem(
      settingsKey,
      JSON.stringify(defaultSettings)
    )
  }

  loadUserData()
  loadTasks()
}

/* ---------------- USER DATA ---------------- */

export const tasks = ref<Task[]>([])

export const projects = ref<Project[]>([])

export const settings = reactive({
  ...defaultSettings
})

export function loadUserData() {
  if (!currentUser.value) {
    tasks.value = []
    projects.value = []

    Object.assign(settings, defaultSettings)

    return
  }

  // tasks.value = load<Task[]>(
  //   getUserTasksKey(),
  //   defaultTasks
  // )
  tasks.value = []
  

  projects.value = load<Project[]>(
    getUserProjectsKey(),
    defaultProjects
  )

  Object.assign(
    settings,
    load(getUserSettingsKey(), defaultSettings)
  )
}



/* ---------------- STATS ---------------- */

export const stats = computed(() => ({
  total: tasks.value.length,

  active: tasks.value.filter(
    t => t.status === 'active'
  ).length,

  completed: tasks.value.filter(
    t => t.status === 'completed'
  ).length,

  high: tasks.value.filter(
    t =>
      t.priority === 'high' &&
      t.status !== 'completed'
  ).length
}))

/* ---------------- TASKS ---------------- */

export async function loadTasks() {
  if (!currentUser.value) {
    tasks.value = []
    return
  }

  try {
    const data = await getTasks()

    tasks.value = data
  } catch (error) {
    console.error('Failed to load tasks:', error)
  }
}

export async function addTask(
  task: Omit<Task, 'id'>
) {
  try {
    const createdTask = await createTask(task)

    tasks.value.unshift(createdTask)

    return {
      success: true,
      task: createdTask
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to create task.'
    }
  }
}

export async function updateTask(
  task: Task
) {
  try {
    const updatedTask =
      await apiUpdateTask(
        task.id,
        {
          title: task.title,
          description: task.description,
          project: task.project,
          priority: task.priority,
          status: task.status,
          due: task.due
        }
      )

    const i = tasks.value.findIndex(
      t => t.id === task.id
    )

    if (i !== -1) {
      tasks.value[i] = updatedTask
    }

    return {
      success: true,
      task: updatedTask
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to update task.'
    }
  }
}

export async function deleteTask(
  id: number
) {
  try {
    await apiDeleteTask(id)

    tasks.value = tasks.value.filter(
      t => t.id !== id
    )

    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to delete task.'
    }
  }
}

export async function toggleTask(
  id: number
) {
  const task = tasks.value.find(
    t => t.id === id
  )

  if (!task) {
    return
  }

  await updateTask({
    ...task,
    status:
      task.status === 'completed'
        ? 'active'
        : 'completed'
  })
}

/* ---------------- PROJECTS ---------------- */

export function addProject(
  project: Omit<Project, 'id'>
) {
  projects.value.unshift({
    ...project,
    id: Date.now()
  })
}

export function updateProject(project: Project) {
  const i = projects.value.findIndex(
    p => p.id === project.id
  )

  if (i !== -1) {
    projects.value[i] = { ...project }
  }
}

export function deleteProject(id: number) {
  projects.value = projects.value.filter(
    p => p.id !== id
  )
}