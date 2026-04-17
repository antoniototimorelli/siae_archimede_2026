<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRegistrationStore } from '@/stores/registrationStore'
import { validateTelefono, validateIndirizzo, isFormValid } from '@/composables/useValidation'

const store = useRegistrationStore()

const phone = ref(store.data.phone)
const address = ref(store.data.address)

const errors = reactive({ phone: '', address: '' })
const touched = reactive({ phone: false, address: false })

const isValid = computed(() =>
  isFormValid([validateTelefono(phone.value), validateIndirizzo(address.value)])
)

function validateField(field: 'phone' | 'address'): void {
  touched[field] = true
  if (field === 'phone') errors.phone = validateTelefono(phone.value).error
  if (field === 'address') errors.address = validateIndirizzo(address.value).error
}

function handleNext(): void {
  validateField('phone')
  validateField('address')
  if (!isValid.value) return
  store.updateData({ phone: phone.value, address: address.value })
  store.nextStep()
}
</script>

<template>
  <div class="step-container">
    <h2 class="step-title">Dati di contatto</h2>

    <div class="field">
      <label for="phone">Telefono *</label>
      <div class="phone-wrap">
        <span class="prefix">+39</span>
        <input id="phone" v-model="phone" type="tel" placeholder="3331234567" @blur="validateField('phone')" />
      </div>
      <span v-if="touched.phone && errors.phone" class="error">{{ errors.phone }}</span>
    </div>

    <div class="field">
      <label for="address">Indirizzo *</label>
      <textarea id="address" v-model="address" placeholder="Via Roma 1, Milano" @blur="validateField('address')" />
      <span v-if="touched.address && errors.address" class="error">{{ errors.address }}</span>
    </div>

    <div class="actions">
      <button class="btn-secondary" @click="store.prevStep()">Indietro</button>
      <button class="btn-primary" :disabled="!isValid" @click="handleNext">Avanti</button>
    </div>
  </div>
</template>

<style scoped>
.step-container { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.step-title { font-size: 20px; font-weight: 700; color: #003087; margin: 0; }
.field { display: flex; flex-direction: column; gap: 4px; }
label { font-size: 14px; font-weight: 500; color: #374151; }
.phone-wrap { display: flex; align-items: center; border: 1px solid #d1d5db; border-radius: 8px; overflow: hidden; }
.prefix { padding: 12px; background: #f3f4f6; font-size: 16px; color: #6b7280; border-right: 1px solid #d1d5db; }
.phone-wrap input { flex: 1; padding: 12px; border: none; font-size: 16px; outline: none; }
textarea { padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; outline: none; min-height: 80px; resize: none; font-family: inherit; }
textarea:focus { border-color: #003087; }
.error { font-size: 12px; color: #E30613; }
.actions { display: flex; gap: 12px; margin-top: 8px; }
.btn-primary { flex: 1; padding: 14px; background: #003087; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { flex: 1; padding: 14px; background: transparent; color: #003087; border: 1px solid #003087; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; }
</style>
