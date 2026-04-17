import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/services/apiService', () => ({
  register: vi.fn(),
}))

import Step6Riepilogo from '../Step6Riepilogo.vue'
import * as apiService from '@/services/apiService'
import { useRegistrationStore } from '@/stores/registrationStore'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

const fillStore = () => {
  const store = useRegistrationStore()
  store.updateData({
    firstName: 'Mario', lastName: 'Rossi', fiscalCode: 'RSSMRA85M01H501Z',
    email: 'mario@example.com', password: 'Password1',
    phone: '3331234567', address: 'Via Roma 1',
    repertoires: ['musica'], birthDate: '1985-08-01',
  })
  store.goToStep(6)
  return store
}

describe('Step6Riepilogo', () => {
  it('si renderizza mostrando i dati dello store', () => {
    fillStore()
    const wrapper = mount(Step6Riepilogo)
    expect(wrapper.text()).toContain('Mario')
    expect(wrapper.text()).toContain('mario@example.com')
  })

  it('il pulsante Modifica step 1 chiama goToStep(1)', async () => {
    const store = fillStore()
    const wrapper = mount(Step6Riepilogo)
    const btns = wrapper.findAll('button.btn-edit')
    await btns[0].trigger('click')
    expect(store.currentStep).toBe(1)
  })

  it('Conferma registrazione chiama apiService.register', async () => {
    vi.mocked(apiService.register).mockResolvedValue({ message: 'ok' })
    fillStore()
    const wrapper = mount(Step6Riepilogo)
    await wrapper.find('button.btn-primary').trigger('click')
    expect(apiService.register).toHaveBeenCalled()
  })

  it('se apiService.register fallisce con 409 mostra il messaggio errore', async () => {
    vi.mocked(apiService.register).mockRejectedValue(new Error('Email già registrata.'))
    fillStore()
    const wrapper = mount(Step6Riepilogo)
    await wrapper.find('button.btn-primary').trigger('click')
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Email già registrata.')
  })

  it('se apiService.register ha successo chiama nextStep', async () => {
    vi.mocked(apiService.register).mockResolvedValue({ message: 'ok' })
    const store = fillStore()
    const wrapper = mount(Step6Riepilogo)
    await wrapper.find('button.btn-primary').trigger('click')
    await new Promise((r) => setTimeout(r, 0))
    expect(store.currentStep).toBe(7)
  })
})
