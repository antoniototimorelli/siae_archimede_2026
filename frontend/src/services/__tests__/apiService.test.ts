import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    getAuthHeader: () => ({ Authorization: 'Bearer testtoken' }),
  }),
}))

beforeEach(() => {
  setActivePinia(createPinia())
  vi.stubGlobal('fetch', vi.fn())
})

import { login, register, getMe, healthCheck } from '../apiService'

const mockFetch = (status: number, body: unknown) => {
  vi.mocked(fetch).mockResolvedValue({
    ok: status < 400,
    status,
    json: () => Promise.resolve(body),
  } as Response)
}

describe('apiService', () => {
  it('login — richiesta POST a /api/auth/login con email e password', async () => {
    mockFetch(200, { token: 'tok' })
    const result = await login('a@b.com', 'pass')
    expect(result.token).toBe('tok')
    expect(vi.mocked(fetch)).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({ method: 'POST' }))
  })

  it('login — lancia errore se risposta non ok', async () => {
    mockFetch(401, { error: 'Credenziali non valide' })
    await expect(login('a@b.com', 'wrong')).rejects.toThrow('Credenziali non valide')
  })

  it('register — richiesta POST a /api/register', async () => {
    mockFetch(201, { message: 'ok' })
    const result = await register({ firstName: 'M', lastName: 'R', fiscalCode: 'X', email: 'a@b.com', password: 'P1', phone: '123456789', address: 'Via', repertoires: ['musica'], birthDate: '1990-01-01' })
    expect(result.message).toBe('ok')
  })

  it('register — lancia errore 409', async () => {
    mockFetch(409, { error: 'Email già registrata.' })
    await expect(register({ firstName: 'M', lastName: 'R', fiscalCode: 'X', email: 'a@b.com', password: 'P1', phone: '123456789', address: 'Via', repertoires: ['musica'], birthDate: '1990-01-01' })).rejects.toThrow('Email già registrata.')
  })

  it('getMe — invia Authorization header', async () => {
    mockFetch(200, { id: '1', firstName: 'Mario', lastName: 'Rossi', fiscalCode: 'X', email: 'a@b.com', phone: '123', address: 'Via', repertoires: [], birthDate: '1985-01-01', createdAt: '' })
    const user = await getMe()
    expect(user.firstName).toBe('Mario')
    const callArg = vi.mocked(fetch).mock.calls[0][1] as RequestInit
    expect((callArg.headers as Record<string, string>)['Authorization']).toBe('Bearer testtoken')
  })

  it('healthCheck — ritorna true se backend risponde ok', async () => {
    mockFetch(200, { status: 'ok' })
    expect(await healthCheck()).toBe(true)
  })

  it('healthCheck — ritorna false se fetch fallisce', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('network'))
    expect(await healthCheck()).toBe(false)
  })
})
