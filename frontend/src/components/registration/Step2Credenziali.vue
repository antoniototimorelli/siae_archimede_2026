<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRegistrationStore } from '@/stores/registrationStore'
import { validateEmail, validatePassword, validateConfirmPassword, isFormValid } from '@/composables/useValidation'

const store = useRegistrationStore()

const email = ref(store.data.email)
const password = ref(store.data.password)
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)

const errors = reactive({ email: '', password: '', confirmPassword: '' })
const touched = reactive({ email: false, password: false, confirmPassword: false })

const isValid = computed(() =>
  isFormValid([
    validateEmail(email.value),
    validatePassword(password.value),
    validateConfirmPassword(password.value, confirmPassword.value),
  ])
)

watch(password, () => {
  if (touched.confirmPassword) errors.confirmPassword = validateConfirmPassword(password.value, confirmPassword.value).error
})

function validateField(field: 'email' | 'password' | 'confirmPassword'): void {
  touched[field] = true
  if (field === 'email') errors.email = validateEmail(email.value).error
  if (field === 'password') errors.password = validatePassword(password.value).error
  if (field === 'confirmPassword') errors.confirmPassword = validateConfirmPassword(password.value, confirmPassword.value).error
}

function handleNext(): void {
  validateField('email')
  validateField('password')
  validateField('confirmPassword')
  if (!isValid.value) return
  store.updateData({ email: email.value, password: password.value })
  store.nextStep()
}
</script>

<template>
  <div class="step-container">
    <h2 class="step-title">Credenziali di accesso</h2>

    <div class="field">
      <label for="email">Email *</label>
      <input id="email" v-model="email" type="email" placeholder="mario@example.com" @blur="validateField('email')" />
      <span v-if="touched.email && errors.email" class="error">{{ errors.email }}</span>
    </div>

    <div class="field">
      <label for="password">Password *</label>
      <div class="input-wrap">
        <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Min 8 caratteri" @blur="validateField('password')" />
        <button class="toggle-eye" type="button" @click="showPassword = !showPassword">{{ showPassword ? '🙈' : '👁️' }}</button>
      </div>
      <span v-if="touched.password && errors.password" class="error">{{ errors.password }}</span>
    </div>

    <div class="field">
      <label for="confirmPassword">Conferma password *</label>
      <div class="input-wrap">
        <input id="confirmPassword" v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'" placeholder="Ripeti la password" @blur="validateField('confirmPassword')" />
        <button class="toggle-eye" type="button" @click="showConfirm = !showConfirm">{{ showConfirm ? '🙈' : '👁️' }}</button>
      </div>
      <span v-if="touched.confirmPassword && errors.confirmPassword" class="error">{{ errors.confirmPassword }}</span>
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
.input-wrap { position: relative; }
input { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; outline: none; box-sizing: border-box; }
input:focus { border-color: #003087; }
.toggle-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 18px; }
.error { font-size: 12px; color: #E30613; }
.actions { display: flex; gap: 12px; margin-top: 8px; }
.btn-primary { flex: 1; padding: 14px; background: #003087; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { flex: 1; padding: 14px; background: transparent; color: #003087; border: 1px solid #003087; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; }
</style>
