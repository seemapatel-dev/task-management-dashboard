    const API_BASE_URL = 'http://127.0.0.1:8000/api'

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

  const data = await response.json().catch(
    () => null
  )

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      'Something went wrong.'
    )
  }

  return data
}


export function register(
  name: string,
  email: string,
  password: string
) {
  return apiRequest('/auth/register/', {
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
) {
  return apiRequest('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  })
}


export function getCurrentUser() {
  return apiRequest('/auth/me/', {
    method: 'GET',
    auth: true,
  })
}


export function getTasks() {
  return apiRequest('/tasks/', {
    method: 'GET',
    auth: true,
  })
}

export function createTask(task: {
  title: string
  description: string
  project: string
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'completed'
  due: string
}) {
  return apiRequest('/tasks/', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(task),
  })
}

export function updateTask(
  id: number,
  task: {
    title: string
    description: string
    project: string
    priority: 'high' | 'medium' | 'low'
    status: 'active' | 'completed'
    due: string
  }
) {
  return apiRequest(`/tasks/${id}/`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(task),
  })
}

export function deleteTask(id: number) {
  return apiRequest(`/tasks/${id}/`, {
    method: 'DELETE',
    auth: true,
  })
}