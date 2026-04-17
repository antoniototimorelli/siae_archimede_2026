<script setup lang="ts">
import { useRegistrationStore } from '@/stores/registrationStore'
import { useRouter } from 'vue-router'

const store = useRegistrationStore()
const router = useRouter()
</script>

<template>
  <div class="step-container">
    <div v-if="store.registrationStatus === 'success'" class="outcome success">
      <span class="icon">✅</span>
      <h2>Registrazione completata!</h2>
      <p>Il tuo account SIAE è stato creato. Puoi ora accedere con le tue credenziali.</p>
      <button class="btn-primary" @click="router.push('/login')">Vai al login</button>
    </div>

    <div v-else class="outcome error">
      <span class="icon">❌</span>
      <h2>Si è verificato un errore</h2>
      <p>{{ store.registrationError || 'Errore imprevisto' }}</p>
      <div class="actions">
        <button class="btn-secondary" @click="store.goToStep(6)">Riprova</button>
        <button class="btn-primary" @click="store.resetRegistration(); router.push('/register')">Torna all'inizio</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-container { padding: 24px; display: flex; flex-direction: column; min-height: 60vh; justify-content: center; }
.outcome { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
.icon { font-size: 56px; }
h2 { font-size: 22px; font-weight: 700; color: #003087; margin: 0; }
p { font-size: 15px; color: #6b7280; margin: 0; }
.actions { display: flex; gap: 12px; width: 100%; }
.btn-primary { flex: 1; padding: 14px; background: #003087; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; }
.btn-secondary { flex: 1; padding: 14px; background: transparent; color: #003087; border: 1px solid #003087; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; }
</style>
