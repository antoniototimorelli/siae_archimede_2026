<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRegistrationStore } from '@/stores/registrationStore'
import { REPERTOIRES } from '@/constants/repertoires'

const store = useRegistrationStore()

const selectedRepertoires = ref<string[]>([...store.data.repertoires])
const isValid = computed(() => selectedRepertoires.value.length > 0)

function toggleRepertoire(id: string): void {
  const idx = selectedRepertoires.value.indexOf(id)
  if (idx >= 0) selectedRepertoires.value.splice(idx, 1)
  else selectedRepertoires.value.push(id)
}

function getDescription(r: unknown): string {
  return (r as { description?: string }).description ?? ''
}

function handleNext(): void {
  store.updateData({ repertoires: selectedRepertoires.value })
  store.nextStep()
}
</script>

<template>
  <div class="step-container">
    <h2 class="step-title">Scegli i tuoi repertori</h2>
    <p class="hint">Seleziona uno o più repertori per i quali vuoi essere tutelato da SIAE</p>

    <div class="grid">
      <button
        v-for="r in REPERTOIRES"
        :key="r.id"
        class="card"
        :class="{ selected: selectedRepertoires.includes(r.id) }"
        @click="toggleRepertoire(r.id)"
      >
        <span class="emoji">{{ r.emoji }}</span>
        <span class="label">{{ r.label }}</span>
        <span v-if="'description' in r" class="desc">{{ getDescription(r) }}</span>
      </button>
    </div>

    <span v-if="!isValid" class="warning">Seleziona almeno un repertorio</span>

    <div class="actions">
      <button class="btn-secondary" @click="store.prevStep()">Indietro</button>
      <button class="btn-primary" :disabled="!isValid" @click="handleNext">Avanti</button>
    </div>
  </div>
</template>

<style scoped>
.step-container { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.step-title { font-size: 20px; font-weight: 700; color: #003087; margin: 0; }
.hint { margin: 0; font-size: 14px; color: #6b7280; }
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.card { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 16px 8px; border: 2px solid #e5e7eb; border-radius: 12px; background: #fff; cursor: pointer; transition: border-color 0.2s; min-height: 44px; }
.card.selected { border-color: #003087; background: #eff6ff; }
.emoji { font-size: 28px; }
.label { font-size: 14px; font-weight: 600; color: #1a1a1a; }
.desc { font-size: 11px; color: #6b7280; }
.warning { font-size: 13px; color: #E30613; text-align: center; }
.actions { display: flex; gap: 12px; margin-top: 8px; }
.btn-primary { flex: 1; padding: 14px; background: #003087; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { flex: 1; padding: 14px; background: transparent; color: #003087; border: 1px solid #003087; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; }
</style>
