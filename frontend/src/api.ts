const API_BASE_URL =
  'https://backend-seven-lyart-37.vercel.app/api'

  
export type User = {
  id: string
  name: string
  email: string
  role: string
}

export type Task = {
  id: number
  title: string
  description: string
  project: string
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'completed'
  due: string
}

export type AuthResponse = {
  access: string
  refresh: string
  user: User
}

type RequestOptions = RequestInit & {
  auth?: boolean
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    auth = false,
    headers = {},
    ...fetchOptions
  } = options

  const token = localStorage.getItem('access_token')

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(auth && token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...headers,
      },
    }
  )

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        'Something went wrong.'
    )
  }

  return data as T
}

export function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  })
}

export function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  })
}

export function getCurrentUser(): Promise<User> {
  return apiRequest<User>('/auth/me/', {
    method: 'GET',
    auth: true,
  })
}

export function getTasks(): Promise<Task[]> {
  return apiRequest<Task[]>('/tasks/', {
    method: 'GET',
    auth: true,
  })
}

export function createTask(
  task: Omit<Task, 'id'>
): Promise<Task> {
  return apiRequest<Task>('/tasks/', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(task),
  })
}

export function updateTask(
  id: number,
  task: Omit<Task, 'id'>
): Promise<Task> {
  return apiRequest<Task>(`/tasks/${id}/`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(task),
  })
}

export function deleteTask(
  id: number
): Promise<void> {
  return apiRequest<void>(`/tasks/${id}/`, {
    method: 'DELETE',
    auth: true,
  })
}