import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import Step7Pagamento from '../Step7Pagamento.vue'
import { useRegistrationStore } from '@/stores/registrationStore'

beforeEach(() => { setActivePinia(createPinia()) })

describe('Step7Pagamento — under 30', () => {
  it('con isUnder30() true mostra il banner gratuità', () => {
    const store = useRegistrationStore()
    store.updateData({ fiscalCode: 'TSTMRA00A01H501Z' })
    const wrapper = mount(Step7Pagamento)
    expect(wrapper.text()).toContain('gratuita')
  })
})

describe('Step7Pagamento — over 30', () => {
  it('con isUnder30() false mostra avviso quota', () => {
    const store = useRegistrationStore()
    store.updateData({ fiscalCode: 'RSSMRA85M01H501Z' })
    const wrapper = mount(Step7Pagamento)
    expect(wrapper.text()).toContain('quota associativa')
  })

  it('Continua è disabilitato senza checkbox', () => {
    const store = useRegistrationStore()
    store.updateData({ fiscalCode: 'RSSMRA85M01H501Z' })
    const wrapper = mount(Step7Pagamento)
    expect((wrapper.find('button.btn-primary').element as HTMLButtonElement).disabled).toBe(true)
  })

  it('Continua è abilitato con checkbox checked', async () => {
    const store = useRegistrationStore()
    store.updateData({ fiscalCode: 'RSSMRA85M01H501Z' })
    const wrapper = mount(Step7Pagamento)
    await wrapper.find('input[type="checkbox"]').setValue(true)
    expect((wrapper.find('button.btn-primary').element as HTMLButtonElement).disabled).toBe(false)
  })
})
