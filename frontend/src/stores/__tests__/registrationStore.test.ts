import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRegistrationStore } from '../registrationStore'

beforeEach(() => { setActivePinia(createPinia()) })

describe('registrationStore', () => {
  it('currentStep inizia a 1', () => {
    expect(useRegistrationStore().currentStep).toBe(1)
  })

  it('nextStep incrementa currentStep', () => {
    const store = useRegistrationStore()
    store.nextStep()
    expect(store.currentStep).toBe(2)
  })

  it('prevStep non va sotto 1', () => {
    const store = useRegistrationStore()
    store.prevStep()
    expect(store.currentStep).toBe(1)
  })

  it('goToStep(3) imposta currentStep a 3', () => {
    const store = useRegistrationStore()
    store.goToStep(3)
    expect(store.currentStep).toBe(3)
  })

  it('updateData aggiorna solo il campo firstName', () => {
    const store = useRegistrationStore()
    store.updateData({ firstName: 'Mario' })
    expect(store.data.firstName).toBe('Mario')
    expect(store.data.lastName).toBe('')
  })

  it('resetRegistration riporta tutto ai valori iniziali', () => {
    const store = useRegistrationStore()
    store.updateData({ firstName: 'Mario' })
    store.nextStep()
    store.resetRegistration()
    expect(store.data.firstName).toBe('')
    expect(store.currentStep).toBe(1)
  })

  it('totalSteps è 8', () => {
    expect(useRegistrationStore().totalSteps).toBe(8)
  })

  it('progressPercentage al step 4 è 50%', () => {
    const store = useRegistrationStore()
    store.goToStep(4)
    expect(store.progressPercentage).toBe(50)
  })

  it('isUnder30 con CF di una persona nata nel 2000 ritorna true', () => {
    const store = useRegistrationStore()
    store.updateData({ fiscalCode: 'TSTMRA00A01H501Z' })
    expect(store.isUnder30()).toBe(true)
  })

  it('isUnder30 con CF di una persona nata nel 1985 ritorna false', () => {
    const store = useRegistrationStore()
    store.updateData({ fiscalCode: 'RSSMRA85M01H501Z' })
    expect(store.isUnder30()).toBe(false)
  })
})
