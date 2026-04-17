<script setup lang="ts">
defineProps<{ currentStep: number; totalSteps: number }>()
</script>

<template>
  <div class="progress-stepper">
    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
      />
    </div>
    <p class="progress-label">Step {{ currentStep }} di {{ totalSteps }}</p>
  </div>
</template>

<style scoped>
.progress-stepper {
  padding: 16px 24px 0;
}
.progress-bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #003087;
  border-radius: 2px;
  transition: width 0.3s ease;
}
.progress-label {
  margin: 6px 0 0;
  font-size: 12px;
  color: #6b7280;
  text-align: right;
}
</style>
