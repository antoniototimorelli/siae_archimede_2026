import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

import Step8Conferma from '../Step8Conferma.vue'
import { useRegistrationStore } from '@/stores/registrationStore'

beforeEach(() => { setActivePinia(createPinia()) })

describe('Step8Conferma — successo', () => {
  it('mostra Registrazione completata se status success', () => {
    const store = useRegistrationStore()
    store.setRegistrationResult('success')
    const wrapper = mount(Step8Conferma)
    expect(wrapper.text()).toContain('Registrazione completata!')
  })

  it('pulsante Vai al login è visibile', () => {
    const store = useRegistrationStore()
    store.setRegistrationResult('success')
    const wrapper = mount(Step8Conferma)
    expect(wrapper.text()).toContain('Vai al login')
  })
})

describe('Step8Conferma — errore', () => {
  it('mostra messaggio di errore se status error', () => {
    const store = useRegistrationStore()
    store.setRegistrationResult('error', 'Errore test')
    const wrapper = mount(Step8Conferma)
    expect(wrapper.text()).toContain('Errore test')
  })

  it('pulsante Riprova porta allo step 6', async () => {
    const store = useRegistrationStore()
    store.setRegistrationResult('error', 'err')
    const wrapper = mount(Step8Conferma)
    await wrapper.find('button.btn-secondary').trigger('click')
    expect(store.currentStep).toBe(6)
  })
})
