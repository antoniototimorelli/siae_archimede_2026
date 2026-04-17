import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import Step5Repertorio from '../Step5Repertorio.vue'
import { useRegistrationStore } from '@/stores/registrationStore'

beforeEach(() => { setActivePinia(createPinia()) })

describe('Step5Repertorio', () => {
  it('si renderizza con 6 repertori', () => {
    const wrapper = mount(Step5Repertorio)
    expect(wrapper.findAll('.card').length).toBe(6)
  })

  it('cliccando su un repertorio lo aggiunge alla selezione', async () => {
    const wrapper = mount(Step5Repertorio)
    await wrapper.findAll('.card')[0].trigger('click')
    expect(wrapper.findAll('.card.selected').length).toBe(1)
  })

  it('Avanti è disabilitato se nessun repertorio è selezionato', () => {
    const wrapper = mount(Step5Repertorio)
    expect((wrapper.find('button.btn-primary').element as HTMLButtonElement).disabled).toBe(true)
  })

  it('Avanti è abilitato se almeno un repertorio è selezionato', async () => {
    const wrapper = mount(Step5Repertorio)
    await wrapper.findAll('.card')[0].trigger('click')
    expect((wrapper.find('button.btn-primary').element as HTMLButtonElement).disabled).toBe(false)
  })

  it('cliccando due volte lo stesso repertorio lo deseleziona', async () => {
    const wrapper = mount(Step5Repertorio)
    await wrapper.findAll('.card')[0].trigger('click')
    await wrapper.findAll('.card')[0].trigger('click')
    expect(wrapper.findAll('.card.selected').length).toBe(0)
  })

  it('Avanti con repertori validi salva nello store e chiama nextStep', async () => {
    const store = useRegistrationStore()
    store.goToStep(5)
    const wrapper = mount(Step5Repertorio)
    await wrapper.findAll('.card')[0].trigger('click')
    await wrapper.find('button.btn-primary').trigger('click')
    expect(store.data.repertoires.length).toBeGreaterThan(0)
    expect(store.currentStep).toBe(6)
  })
})
