import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import Step2Credenziali from '../Step2Credenziali.vue'
import { useRegistrationStore } from '@/stores/registrationStore'

beforeEach(() => { setActivePinia(createPinia()) })

describe('Step2Credenziali', () => {
  it('si renderizza', () => {
    const wrapper = mount(Step2Credenziali)
    expect(wrapper.find('h2').text()).toBe('Credenziali di accesso')
  })

  it('Avanti disabilitato con campi vuoti', () => {
    const wrapper = mount(Step2Credenziali)
    expect((wrapper.find('button.btn-primary').element as HTMLButtonElement).disabled).toBe(true)
  })

  it('mostra errore password se manca la maiuscola dopo blur', async () => {
    const wrapper = mount(Step2Credenziali)
    await wrapper.find('#password').setValue('password1')
    await wrapper.find('#password').trigger('blur')
    expect(wrapper.text()).toContain('Password deve avere almeno 8 caratteri')
  })

  it('mostra errore su confirmPassword se non coincide', async () => {
    const wrapper = mount(Step2Credenziali)
    await wrapper.find('#password').setValue('Password1')
    await wrapper.find('#confirmPassword').setValue('Password2')
    await wrapper.find('#confirmPassword').trigger('blur')
    expect(wrapper.text()).toContain('Le password non coincidono')
  })

  it('Avanti con dati validi salva email e password nel store (senza confirmPassword)', async () => {
    const store = useRegistrationStore()
    const wrapper = mount(Step2Credenziali)
    await wrapper.find('#email').setValue('mario@example.com')
    await wrapper.find('#password').setValue('Password1')
    await wrapper.find('#confirmPassword').setValue('Password1')
    await wrapper.find('button.btn-primary').trigger('click')
    expect(store.data.email).toBe('mario@example.com')
    expect(store.data.password).toBe('Password1')
    expect(store.data.confirmPassword).toBe('')
  })
})
