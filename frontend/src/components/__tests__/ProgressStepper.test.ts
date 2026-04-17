import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressStepper from '../ProgressStepper.vue'

describe('ProgressStepper', () => {
  it('mostra step corrente su totale', () => {
    const wrapper = mount(ProgressStepper, { props: { currentStep: 3, totalSteps: 8 } })
    expect(wrapper.text()).toContain('Step 3 di 8')
  })

  it('la larghezza della barra riflette la percentuale corretta', () => {
    const wrapper = mount(ProgressStepper, { props: { currentStep: 4, totalSteps: 8 } })
    const fill = wrapper.find('.progress-fill')
    expect(fill.attributes('style')).toContain('50%')
  })
})
