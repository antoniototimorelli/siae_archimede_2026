<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import * as apiService from '@/services/apiService'
import { validateEmail, validatePassword } from '@/composables/useValidation'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errors = reactive({ email: '', password: '' })
const touched = reactive({ email: false, password: false })
const isLoading = ref(false)
const loginError = ref('')

const isValid = computed(
  () => !errors.email && !errors.password && email.value !== '' && password.value !== ''
)

function validateField(field: 'email' | 'password'): void {
  touched[field] = true
  if (field === 'email') errors.email = validateEmail(email.value).error
  if (field === 'password') errors.password = validatePassword(password.value).error
}

async function handleLogin(): Promise<void> {
  validateField('email')
  validateField('password')
  if (!isValid.value) return
  isLoading.value = true
  loginError.value = ''
  try {
    const response = await apiService.login(email.value, password.value)
    authStore.setToken(response.token)
    router.push('/dashboard')
  } catch {
    loginError.value = 'Credenziali non valide'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-view">
    <div class="logo">
      <span class="logo-text">SIAE+</span>
    </div>
    <h1 class="title">Accedi a SIAE+</h1>

    <div class="field">
      <label for="email">Email</label>
      <input id="email" v-model="email" type="email" placeholder="mario@example.com" @blur="validateField('email')" />
      <span v-if="touched.email && errors.email" class="error">{{ errors.email }}</span>
    </div>

    <div class="field">
      <label for="password">Password</label>
      <div class="input-wrap">
        <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="La tua password" @blur="validateField('password')" />
        <button class="toggle-eye" type="button" @click="showPassword = !showPassword">{{ showPassword ? '🙈' : '👁️' }}</button>
      </div>
      <span v-if="touched.password && errors.password" class="error">{{ errors.password }}</span>
    </div>

    <span v-if="loginError" class="login-error">{{ loginError }}</span>

    <button class="btn-primary" :disabled="isLoading" @click="handleLogin">
      <span v-if="isLoading">Accesso in corso...</span>
      <span v-else>Accedi</span>
    </button>

    <p class="register-link">
      Non hai un account?
      <button class="link-btn" @click="router.push('/register')">Registrati</button>
    </p>
  </div>
</template>

<style scoped>
.login-view { padding: 32px 24px; display: flex; flex-direction: column; gap: 20px; min-height: 100vh; }
.logo { text-align: center; }
.logo-text { font-size: 32px; font-weight: 800; color: #003087; }
.title { font-size: 22px; font-weight: 700; color: #1a1a1a; margin: 0; text-align: center; }
.field { display: flex; flex-direction: column; gap: 4px; }
label { font-size: 14px; font-weight: 500; color: #374151; }
.input-wrap { position: relative; }
input { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; outline: none; box-sizing: border-box; }
input:focus { border-color: #003087; }
.toggle-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 18px; }
.error { font-size: 12px; color: #E30613; }
.login-error { font-size: 14px; color: #E30613; text-align: center; font-weight: 500; }
.btn-primary { width: 100%; padding: 14px; background: #003087; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.register-link { text-align: center; font-size: 14px; color: #6b7280; margin: 0; }
.link-btn { background: none; border: none; color: #003087; font-size: 14px; cursor: pointer; text-decoration: underline; }
</style>
