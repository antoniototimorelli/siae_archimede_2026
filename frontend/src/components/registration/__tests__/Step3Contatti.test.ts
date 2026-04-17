import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import Step3Contatti from '../Step3Contatti.vue'
import { useRegistrationStore } from '@/stores/registrationStore'

beforeEach(() => { setActivePinia(createPinia()) })

describe('Step3Contatti', () => {
  it('si renderizza', () => {
    const wrapper = mount(Step3Contatti)
    expect(wrapper.find('h2').text()).toBe('Dati di contatto')
  })

  it('mostra errore su telefono se contiene lettere', async () => {
    const wrapper = mount(Step3Contatti)
    await wrapper.find('#phone').setValue('333abc')
    await wrapper.find('#phone').trigger('blur')
    expect(wrapper.text()).toContain('Il numero di telefono deve contenere almeno 9 cifre')
  })

  it('mostra errore su telefono se meno di 9 cifre', async () => {
    const wrapper = mount(Step3Contatti)
    await wrapper.find('#phone').setValue('12345678')
    await wrapper.find('#phone').trigger('blur')
    expect(wrapper.text()).toContain('Il numero di telefono deve contenere almeno 9 cifre')
  })

  it('Avanti con dati validi chiama nextStep', async () => {
    const store = useRegistrationStore()
    store.goToStep(3)
    const wrapper = mount(Step3Contatti)
    await wrapper.find('#phone').setValue('3331234567')
    await wrapper.find('#address').setValue('Via Roma 1, Milano')
    await wrapper.find('button.btn-primary').trigger('click')
    expect(store.currentStep).toBe(4)
  })
})
