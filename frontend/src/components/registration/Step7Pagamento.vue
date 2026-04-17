<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRegistrationStore } from '@/stores/registrationStore'

const store = useRegistrationStore()
const under30 = store.isUnder30()
const paymentAccepted = ref(false)
const isValid = computed(() => under30 || paymentAccepted.value)

function handleNext(): void {
  store.updateData({ paymentAccepted: paymentAccepted.value })
  store.nextStep()
}
</script>

<template>
  <div class="step-container">
    <h2 class="step-title">Quota associativa</h2>

    <div v-if="under30" class="banner-free">
      <span class="icon">🎉</span>
      <p>Ottima notizia! Hai meno di 30 anni: l'iscrizione a SIAE è <b>gratuita</b> per te.</p>
    </div>

    <div v-else class="banner-paid">
      <p>L'iscrizione a SIAE prevede il pagamento di una quota associativa. L'importo esatto ti verrà comunicato entro 30 giorni dall'iscrizione.</p>
      <label class="checkbox-label">
        <input v-model="paymentAccepted" type="checkbox" />
        <span>Ho letto e accetto le condizioni di pagamento</span>
      </label>
    </div>

    <div class="actions">
      <button class="btn-secondary" @click="store.prevStep()">Indietro</button>
      <button class="btn-primary" :disabled="!isValid" @click="handleNext">Continua</button>
    </div>
  </div>
</template>

<style scoped>
.step-container { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
.step-title { font-size: 20px; font-weight: 700; color: #003087; margin: 0; }
.banner-free { background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 12px; padding: 20px; display: flex; gap: 12px; align-items: flex-start; }
.banner-free .icon { font-size: 28px; }
.banner-free p { margin: 0; font-size: 15px; color: #065f46; }
.banner-paid { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.banner-paid p { margin: 0; font-size: 15px; color: #92400e; }
.checkbox-label { display: flex; gap: 10px; align-items: flex-start; cursor: pointer; font-size: 14px; color: #1a1a1a; }
.checkbox-label input { margin-top: 2px; width: 18px; height: 18px; }
.actions { display: flex; gap: 12px; }
.btn-primary { flex: 1; padding: 14px; background: #003087; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { flex: 1; padding: 14px; background: transparent; color: #003087; border: 1px solid #003087; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; }
</style>
