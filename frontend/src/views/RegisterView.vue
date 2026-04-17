<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue'
import ProgressStepper from '@/components/ProgressStepper.vue'
import { useRegistrationStore } from '@/stores/registrationStore'

const store = useRegistrationStore()

const stepComponents: Record<number, ReturnType<typeof defineAsyncComponent>> = {
  1: defineAsyncComponent(() => import('@/components/registration/Step1Anagrafica.vue')),
  2: defineAsyncComponent(() => import('@/components/registration/Step2Credenziali.vue')),
  3: defineAsyncComponent(() => import('@/components/registration/Step3Contatti.vue')),
  4: defineAsyncComponent(() => import('@/components/registration/Step4Foto.vue')),
  5: defineAsyncComponent(() => import('@/components/registration/Step5Repertorio.vue')),
  6: defineAsyncComponent(() => import('@/components/registration/Step6Riepilogo.vue')),
  7: defineAsyncComponent(() => import('@/components/registration/Step7Pagamento.vue')),
  8: defineAsyncComponent(() => import('@/components/registration/Step8Conferma.vue')),
}

const currentStepComponent = computed(() => stepComponents[store.currentStep])
</script>

<template>
  <div class="register-view">
    <ProgressStepper :current-step="store.currentStep" :total-steps="store.totalSteps" />
    <Suspense>
      <component :is="currentStepComponent" />
      <template #fallback>
        <div class="loading">Caricamento...</div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.loading {
  padding: 32px;
  text-align: center;
  color: #6b7280;
}
</style>
