<script setup lang="ts">
import { ref } from 'vue'
import { useRegistrationStore } from '@/stores/registrationStore'
import * as apiService from '@/services/apiService'
import { getRepertoireLabel } from '@/constants/repertoires'
import type { RegisterPayload } from '@/types/api'

const store = useRegistrationStore()
const isLoading = ref(false)
const errorMessage = ref('')

async function handleConfirm(): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { confirmPassword: _cp, paymentAccepted: _pa, ...rest } = store.data
    const payload: RegisterPayload = {
      ...rest,
      birthDate: rest.birthDate || extractBirthDate(rest.fiscalCode),
    }
    await apiService.register(payload)
    store.setRegistrationResult('success')
    store.nextStep()
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Errore sconosciuto'
    errorMessage.value = msg
    store.setRegistrationResult('error', msg)
  } finally {
    isLoading.value = false
  }
}

function extractBirthDate(cf: string): string {
  if (cf.length < 16) return ''
  const year = cf.substring(6, 8)
  const yearNum = parseInt(year, 10)
  const fullYear = yearNum <= 25 ? `20${year}` : `19${year}`
  const monthMap: Record<string, string> = { A:'01',B:'02',C:'03',D:'04',E:'05',H:'06',L:'07',M:'08',P:'09',R:'10',S:'11',T:'12' }
  const month = monthMap[cf[8].toUpperCase()] ?? '01'
  const day = String(parseInt(cf.substring(9, 11), 10) % 40).padStart(2, '0')
  return `${fullYear}-${month}-${day}`
}
</script>

<template>
  <div class="step-container">
    <h2 class="step-title">Riepilogo</h2>

    <section class="section">
      <div class="section-header">
        <h3>Dati anagrafici</h3>
        <button class="btn-edit" @click="store.goToStep(1)">Modifica</button>
      </div>
      <p><b>Nome:</b> {{ store.data.firstName }} {{ store.data.lastName }}</p>
      <p><b>Codice fiscale:</b> {{ store.data.fiscalCode }}</p>
    </section>

    <section class="section">
      <div class="section-header">
        <h3>Credenziali</h3>
        <button class="btn-edit" @click="store.goToStep(2)">Modifica</button>
      </div>
      <p><b>Email:</b> {{ store.data.email }}</p>
      <p><b>Password:</b> ●●●●●●●●</p>
    </section>

    <section class="section">
      <div class="section-header">
        <h3>Contatti</h3>
        <button class="btn-edit" @click="store.goToStep(3)">Modifica</button>
      </div>
      <p><b>Telefono:</b> {{ store.data.phone }}</p>
      <p><b>Indirizzo:</b> {{ store.data.address }}</p>
    </section>

    <section class="section">
      <div class="section-header">
        <h3>Foto profilo</h3>
        <button class="btn-edit" @click="store.goToStep(4)">Modifica</button>
      </div>
      <img v-if="store.data.photo" :src="store.data.photo" alt="Foto profilo" class="thumb" />
      <p v-else class="muted">Non caricata</p>
    </section>

    <section class="section">
      <div class="section-header">
        <h3>Repertori</h3>
        <button class="btn-edit" @click="store.goToStep(5)">Modifica</button>
      </div>
      <ul>
        <li v-for="id in store.data.repertoires" :key="id">{{ getRepertoireLabel(id) }}</li>
      </ul>
    </section>

    <span v-if="errorMessage" class="error">{{ errorMessage }}</span>

    <div class="actions">
      <button class="btn-secondary" @click="store.prevStep()">Indietro</button>
      <button class="btn-primary" :disabled="isLoading" @click="handleConfirm">
        <span v-if="isLoading">Invio in corso...</span>
        <span v-else>Conferma registrazione</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.step-container { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.step-title { font-size: 20px; font-weight: 700; color: #003087; margin: 0; }
.section { background: #f9fafb; border-radius: 8px; padding: 16px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.section h3 { margin: 0; font-size: 15px; color: #374151; }
.section p { margin: 4px 0; font-size: 14px; color: #1a1a1a; }
.thumb { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; }
.muted { color: #9ca3af; font-size: 14px; }
ul { margin: 4px 0; padding-left: 20px; font-size: 14px; }
.btn-edit { background: none; border: none; color: #003087; font-size: 13px; cursor: pointer; text-decoration: underline; }
.error { font-size: 13px; color: #E30613; }
.actions { display: flex; gap: 12px; margin-top: 8px; }
.btn-primary { flex: 1; padding: 14px; background: #003087; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { flex: 1; padding: 14px; background: transparent; color: #003087; border: 1px solid #003087; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; }
</style>
