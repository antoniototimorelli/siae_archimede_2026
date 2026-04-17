import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../authStore'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

beforeEach(() => { setActivePinia(createPinia()) })

describe('authStore', () => {
  it('isAuthenticated è false all\'avvio', () => {
    expect(useAuthStore().isAuthenticated).toBe(false)
  })

  it('setToken imposta il token', () => {
    const store = useAuthStore()
    store.setToken('abc')
    expect(store.token).toBe('abc')
  })

  it('isAuthenticated è true dopo setToken', () => {
    const store = useAuthStore()
    store.setToken('abc')
    expect(store.isAuthenticated).toBe(true)
  })

  it('logout imposta token a null', () => {
    const store = useAuthStore()
    store.setToken('abc')
    store.logout()
    expect(store.token).toBe(null)
  })

  it('getAuthHeader ritorna {} se non autenticato', () => {
    expect(useAuthStore().getAuthHeader()).toEqual({})
  })

  it('getAuthHeader ritorna Authorization header se autenticato', () => {
    const store = useAuthStore()
    store.setToken('abc')
    expect(store.getAuthHeader()).toEqual({ Authorization: 'Bearer abc' })
  })
})
