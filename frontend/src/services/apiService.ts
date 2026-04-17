import type { User, LoginResponse, RegisterPayload } from '@/types/api'
import { useAuthStore } from '@/stores/authStore'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function register(payload: RegisterPayload): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/api/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getMe(): Promise<User> {
  const authStore = useAuthStore()
  return apiFetch<User>('/api/users/me', {
    headers: authStore.getAuthHeader(),
  })
}

export async function healthCheck(): Promise<boolean> {
  try {
    await apiFetch<{ status: string }>('/api/health')
    return true
  } catch {
    return false
  }
}
