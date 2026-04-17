import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import Step1Anagrafica from '../Step1Anagrafica.vue'
import { useRegistrationStore } from '@/stores/registrationStore'

beforeEach(() => { setActivePinia(createPinia()) })

describe('Step1Anagrafica', () => {
  it('si renderizza senza errori', () => {
    const wrapper = mount(Step1Anagrafica)
    expect(wrapper.find('h2').text()).toBe('Dati anagrafici')
  })

  it('il pulsante Avanti è disabilitato se i campi sono vuoti', () => {
    const wrapper = mount(Step1Anagrafica)
    const btn = wrapper.find('button.btn-primary')
    expect((btn.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('il pulsante Avanti è abilitato con tutti i campi validi', async () => {
    const wrapper = mount(Step1Anagrafica)
    await wrapper.find('#firstName').setValue('Mario')
    await wrapper.find('#lastName').setValue('Rossi')
    await wrapper.find('#fiscalCode').setValue('RSSMRA85M01H501Z')
    const btn = wrapper.find('button.btn-primary')
    expect((btn.element as HTMLButtonElement).disabled).toBe(false)
  })

  it('mostra errore su blur per nome con numeri', async () => {
    const wrapper = mount(Step1Anagrafica)
    await wrapper.find('#firstName').setValue('Mario1')
    await wrapper.find('#firstName').trigger('blur')
    expect(wrapper.text()).toContain('Il nome può contenere solo lettere')
  })

  it('cliccando Avanti con dati validi aggiorna lo store', async () => {
    const store = useRegistrationStore()
    const wrapper = mount(Step1Anagrafica)
    await wrapper.find('#firstName').setValue('Mario')
    await wrapper.find('#lastName').setValue('Rossi')
    await wrapper.find('#fiscalCode').setValue('RSSMRA85M01H501Z')
    await wrapper.find('button.btn-primary').trigger('click')
    expect(store.data.firstName).toBe('Mario')
    expect(store.data.lastName).toBe('Rossi')
  })

  it('cliccando Avanti con dati validi chiama nextStep', async () => {
    const store = useRegistrationStore()
    const wrapper = mount(Step1Anagrafica)
    await wrapper.find('#firstName').setValue('Mario')
    await wrapper.find('#lastName').setValue('Rossi')
    await wrapper.find('#fiscalCode').setValue('RSSMRA85M01H501Z')
    await wrapper.find('button.btn-primary').trigger('click')
    expect(store.currentStep).toBe(2)
  })
})
