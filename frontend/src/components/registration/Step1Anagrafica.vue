<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRegistrationStore } from '@/stores/registrationStore'
import { validateNome, validateCognome, validateCodiceFiscale, isFormValid } from '@/composables/useValidation'

const store = useRegistrationStore()

const firstName = ref(store.data.firstName)
const lastName = ref(store.data.lastName)
const fiscalCode = ref(store.data.fiscalCode)

const errors = reactive({ firstName: '', lastName: '', fiscalCode: '' })
const touched = reactive({ firstName: false, lastName: false, fiscalCode: false })

const isValid = computed(() =>
  isFormValid([
    validateNome(firstName.value),
    validateCognome(lastName.value),
    validateCodiceFiscale(fiscalCode.value),
  ])
)

function validateField(field: 'firstName' | 'lastName' | 'fiscalCode'): void {
  touched[field] = true
  if (field === 'firstName') errors.firstName = validateNome(firstName.value).error
  if (field === 'lastName') errors.lastName = validateCognome(lastName.value).error
  if (field === 'fiscalCode') errors.fiscalCode = validateCodiceFiscale(fiscalCode.value).error
}

function handleNext(): void {
  validateField('firstName')
  validateField('lastName')
  validateField('fiscalCode')
  if (!isValid.value) return
  store.updateData({ firstName: firstName.value, lastName: lastName.value, fiscalCode: fiscalCode.value })
  store.nextStep()
}
</script>

<template>
  <div class="step-container">
    <h2 class="step-title">Dati anagrafici</h2>

    <div class="field">
      <label for="firstName">Nome *</label>
      <input
        id="firstName"
        v-model="firstName"
        type="text"
        placeholder="Mario"
        @blur="validateField('firstName')"
      />
      <span v-if="touched.firstName && errors.firstName" class="error">{{ errors.firstName }}</span>
    </div>

    <div class="field">
      <label for="lastName">Cognome *</label>
      <input
        id="lastName"
        v-model="lastName"
        type="text"
        placeholder="Rossi"
        @blur="validateField('lastName')"
      />
      <span v-if="touched.lastName && errors.lastName" class="error">{{ errors.lastName }}</span>
    </div>

    <div class="field">
      <label for="fiscalCode">Codice fiscale *</label>
      <input
        id="fiscalCode"
        v-model="fiscalCode"
        type="text"
        placeholder="RSSMRA85M01H501Z"
        maxlength="16"
        @blur="validateField('fiscalCode')"
      />
      <span v-if="touched.fiscalCode && errors.fiscalCode" class="error">{{ errors.fiscalCode }}</span>
    </div>

    <div class="actions">
      <button class="btn-primary" :disabled="!isValid" @click="handleNext">Avanti</button>
    </div>
  </div>
</template>

<style scoped>
.step-container { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.step-title { font-size: 20px; font-weight: 700; color: #003087; margin: 0; }
.field { display: flex; flex-direction: column; gap: 4px; }
label { font-size: 14px; font-weight: 500; color: #374151; }
input { padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; outline: none; }
input:focus { border-color: #003087; }
.error { font-size: 12px; color: #E30613; }
.actions { margin-top: 8px; }
.btn-primary { width: 100%; padding: 14px; background: #003087; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
