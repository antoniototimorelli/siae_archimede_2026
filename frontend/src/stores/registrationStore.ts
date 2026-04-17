import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'

export interface RegistrationData {
  firstName: string
  lastName: string
  fiscalCode: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  address: string
  photo: string
  repertoires: string[]
  birthDate: string
  paymentAccepted: boolean
}

const INITIAL_DATA: RegistrationData = {
  firstName: '',
  lastName: '',
  fiscalCode: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address: '',
  photo: '',
  repertoires: [],
  birthDate: '',
  paymentAccepted: false,
}

export const useRegistrationStore = defineStore('registration', () => {
  const currentStep = ref(1)
  const data = reactive<RegistrationData>({ ...INITIAL_DATA })
  const registrationStatus = ref<'idle' | 'success' | 'error'>('idle')
  const registrationError = ref('')

  const totalSteps = computed(() => 8)
  const progressPercentage = computed(() => (currentStep.value / totalSteps.value) * 100)

  function goToStep(step: number): void {
    currentStep.value = Math.max(1, Math.min(step, totalSteps.value))
  }

  function nextStep(): void {
    if (currentStep.value < totalSteps.value) currentStep.value++
  }

  function prevStep(): void {
    if (currentStep.value > 1) currentStep.value--
  }

  function updateData(partial: Partial<RegistrationData>): void {
    Object.assign(data, partial)
  }

  function resetRegistration(): void {
    Object.assign(data, INITIAL_DATA)
    currentStep.value = 1
    registrationStatus.value = 'idle'
    registrationError.value = ''
  }

  function setRegistrationResult(status: 'success' | 'error', error?: string): void {
    registrationStatus.value = status
    registrationError.value = error ?? ''
  }

  function isUnder30(): boolean {
    const cf = data.fiscalCode
    if (cf.length < 8) return false
    const yearDigits = parseInt(cf.substring(6, 8), 10)
    const birthYear = yearDigits <= 25 ? 2000 + yearDigits : 1900 + yearDigits
    return new Date().getFullYear() - birthYear < 30
  }

  return {
    currentStep,
    data,
    registrationStatus,
    registrationError,
    totalSteps,
    progressPercentage,
    goToStep,
    nextStep,
    prevStep,
    updateData,
    resetRegistration,
    setRegistrationResult,
    isUnder30,
  }
})
