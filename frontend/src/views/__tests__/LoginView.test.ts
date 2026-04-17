import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/services/apiService', () => ({
  login: vi.fn(),
}))

import LoginView from '../LoginView.vue'
import * as apiService from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'

beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks() })

describe('LoginView', () => {
  it('si renderizza con form email + password', () => {
    const wrapper = mount(LoginView)
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
  })

  it('cliccando Accedi con campi vuoti non chiama apiService.login', async () => {
    const wrapper = mount(LoginView)
    await wrapper.find('button.btn-primary').trigger('click')
    expect(apiService.login).not.toHaveBeenCalled()
  })

  it('con credenziali valide chiama apiService.login', async () => {
    vi.mocked(apiService.login).mockResolvedValue({ token: 'tok' })
    const wrapper = mount(LoginView)
    await wrapper.find('#email').setValue('mario@example.com')
    await wrapper.find('#password').setValue('Password1')
    await wrapper.find('button.btn-primary').trigger('click')
    expect(apiService.login).toHaveBeenCalledWith('mario@example.com', 'Password1')
  })

  it('se login ha successo chiama authStore.setToken', async () => {
    vi.mocked(apiService.login).mockResolvedValue({ token: 'mytoken' })
    const store = useAuthStore()
    const wrapper = mount(LoginView)
    await wrapper.find('#email').setValue('mario@example.com')
    await wrapper.find('#password').setValue('Password1')
    await wrapper.find('button.btn-primary').trigger('click')
    await new Promise((r) => setTimeout(r, 0))
    expect(store.token).toBe('mytoken')
  })

  it('se login fallisce mostra messaggio generico', async () => {
    vi.mocked(apiService.login).mockRejectedValue(new Error('401'))
    const wrapper = mount(LoginView)
    await wrapper.find('#email').setValue('mario@example.com')
    await wrapper.find('#password').setValue('Password1')
    await wrapper.find('button.btn-primary').trigger('click')
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Credenziali non valide')
  })

  it('il messaggio di errore NON specifica se sbagliata email o password', async () => {
    vi.mocked(apiService.login).mockRejectedValue(new Error('401'))
    const wrapper = mount(LoginView)
    await wrapper.find('#email').setValue('mario@example.com')
    await wrapper.find('#password').setValue('Password1')
    await wrapper.find('button.btn-primary').trigger('click')
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).not.toContain('email')
    expect(wrapper.text()).not.toContain('password')
    expect(wrapper.text()).toContain('Credenziali non valide')
  })
})
