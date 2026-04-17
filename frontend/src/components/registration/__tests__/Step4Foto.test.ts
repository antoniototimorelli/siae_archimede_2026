import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import Step4Foto from '../Step4Foto.vue'
import { useRegistrationStore } from '@/stores/registrationStore'

beforeEach(() => { setActivePinia(createPinia()) })

describe('Step4Foto', () => {
  it('si renderizza', () => {
    const wrapper = mount(Step4Foto)
    expect(wrapper.find('h2').text()).toContain('Foto profilo')
  })

  it('il pulsante Salta chiama nextStep senza aggiornare la foto nello store', async () => {
    const store = useRegistrationStore()
    store.goToStep(4) // ensure we're on step 4 so nextStep goes to 5
    const wrapper = mount(Step4Foto)
    // btn-outline text is "Salta questo step" — it's the second btn-outline (first is "Carica foto" before photo loads)
    const btns = wrapper.findAll('button')
    const skipBtn = btns.find((b) => b.text() === 'Salta questo step')
    expect(skipBtn).toBeDefined()
    await skipBtn!.trigger('click')
    expect(store.currentStep).toBe(5)
    expect(store.data.photo).toBe('')
  })

  it('il pulsante Avanti è abilitato anche senza foto', () => {
    const wrapper = mount(Step4Foto)
    const btn = wrapper.find('button.btn-primary')
    expect((btn.element as HTMLButtonElement).disabled).toBe(false)
  })
})
