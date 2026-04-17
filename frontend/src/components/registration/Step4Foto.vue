<script setup lang="ts">
import { ref } from 'vue'
import { useRegistrationStore } from '@/stores/registrationStore'

const store = useRegistrationStore()

const photoBase64 = ref('')
const previewUrl = ref('')
const photoError = ref('')
const isPhotoValid = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function handleFileChange(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  photoError.value = ''
  isPhotoValid.value = false

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    photoError.value = 'Formato non supportato. Usa JPEG, PNG o WebP.'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    photoError.value = 'La foto supera il limite di 5MB.'
    return
  }

  const objectUrl = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => {
    if (img.naturalWidth < 200 || img.naturalHeight < 200) {
      photoError.value = 'La foto è troppo piccola. Usa una foto che mostri chiaramente il tuo viso.'
      URL.revokeObjectURL(objectUrl)
      return
    }
    previewUrl.value = objectUrl
    const reader = new FileReader()
    reader.onload = (e) => {
      photoBase64.value = e.target?.result as string
      isPhotoValid.value = true
    }
    reader.readAsDataURL(file)
  }
  img.src = objectUrl
}

function removePhoto(): void {
  photoBase64.value = ''
  previewUrl.value = ''
  photoError.value = ''
  isPhotoValid.value = false
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function handleNext(): void {
  if (photoBase64.value) store.updateData({ photo: photoBase64.value })
  store.nextStep()
}

function handleSkip(): void {
  store.nextStep()
}
</script>

<template>
  <div class="step-container">
    <h2 class="step-title">Foto profilo <span class="optional">(opzionale)</span></h2>
    <p class="hint">Carica una foto che mostri chiaramente il tuo viso in primo piano</p>

    <div class="photo-area" @click="fileInputRef?.click()">
      <img v-if="previewUrl" :src="previewUrl" alt="Anteprima foto" class="preview" />
      <span v-else class="placeholder">📷</span>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="hidden-input"
      @change="handleFileChange"
    />

    <span v-if="photoError" class="error">{{ photoError }}</span>

    <div class="actions-secondary">
      <button v-if="previewUrl" class="btn-danger" @click="removePhoto">Rimuovi foto</button>
      <button v-else class="btn-outline" @click="fileInputRef?.click()">Carica foto</button>
    </div>

    <div class="actions">
      <button class="btn-secondary" @click="store.prevStep()">Indietro</button>
      <button class="btn-outline" @click="handleSkip">Salta questo step</button>
      <button class="btn-primary" :disabled="previewUrl !== '' && !isPhotoValid" @click="handleNext">Avanti</button>
    </div>
  </div>
</template>

<style scoped>
.step-container { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.step-title { font-size: 20px; font-weight: 700; color: #003087; margin: 0; }
.optional { font-size: 14px; font-weight: 400; color: #6b7280; }
.hint { margin: 0; font-size: 14px; color: #6b7280; }
.photo-area { width: 120px; height: 120px; border: 2px dashed #d1d5db; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; align-self: center; }
.placeholder { font-size: 40px; }
.preview { width: 100%; height: 100%; object-fit: cover; }
.hidden-input { display: none; }
.error { font-size: 12px; color: #E30613; }
.actions-secondary { display: flex; justify-content: center; }
.actions { display: flex; gap: 8px; margin-top: 8px; }
.btn-primary { flex: 1; padding: 14px; background: #003087; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; min-height: 44px; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { flex: 1; padding: 14px; background: transparent; color: #003087; border: 1px solid #003087; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; min-height: 44px; }
.btn-outline { flex: 1; padding: 14px; background: transparent; color: #6b7280; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px; cursor: pointer; min-height: 44px; }
.btn-danger { padding: 8px 16px; background: transparent; color: #E30613; border: 1px solid #E30613; border-radius: 8px; font-size: 14px; cursor: pointer; }
</style>
