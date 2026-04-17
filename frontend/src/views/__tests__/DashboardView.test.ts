import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/services/apiService', () => ({
  getMe: vi.fn(),
}))

import DashboardView from '../DashboardView.vue'
import * as apiService from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types/api'

const mockUser: User = {
  id: '1',
  firstName: 'Mario',
  lastName: 'Rossi',
  fiscalCode: 'RSSMRA85M01H501Z',
  email: 'mario@example.com',
  phone: '3331234567',
  address: 'Via Roma 1',
  repertoires: ['musica'],
  birthDate: '1985-08-01',
  createdAt: new Date().toISOString(),
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('DashboardView', () => {
  it('chiama apiService.getMe all\'avvio', async () => {
    vi.mocked(apiService.getMe).mockResolvedValue(mockUser)
    mount(DashboardView)
    expect(apiService.getMe).toHaveBeenCalled()
  })

  it('mostra nome e cognome dell\'utente', async () => {
    vi.mocked(apiService.getMe).mockResolvedValue(mockUser)
    const wrapper = mount(DashboardView)
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Mario')
    expect(wrapper.text()).toContain('Rossi')
  })

  it('mostra lista repertori', async () => {
    vi.mocked(apiService.getMe).mockResolvedValue(mockUser)
    const wrapper = mount(DashboardView)
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Musica')
  })

  it('se user.photo è presente mostra img', async () => {
    vi.mocked(apiService.getMe).mockResolvedValue({ ...mockUser, photo: 'data:image/png;base64,abc' })
    const wrapper = mount(DashboardView)
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.find('.avatar-img').exists()).toBe(true)
  })

  it('cliccando Logout chiama authStore.logout', async () => {
    vi.mocked(apiService.getMe).mockResolvedValue(mockUser)
    const store = useAuthStore()
    store.setToken('tok')
    const wrapper = mount(DashboardView)
    await new Promise((r) => setTimeout(r, 0))
    await wrapper.find('button.btn-logout').trigger('click')
    expect(store.token).toBe(null)
  })
})
