<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import * as apiService from '@/services/apiService'
import { getRepertoireLabel } from '@/constants/repertoires'
import type { User } from '@/types/api'

const authStore = useAuthStore()
const user = ref<User | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    user.value = await apiService.getMe()
  } catch {
    authStore.logout()
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="dashboard">
    <div v-if="isLoading" class="loading">
      <span>Caricamento...</span>
    </div>

    <template v-else-if="user">
      <header class="header">
        <div class="avatar">
          <img v-if="user.photo" :src="user.photo" alt="Foto profilo" class="avatar-img" />
          <span v-else class="avatar-initials">{{ user.firstName[0] }}{{ user.lastName[0] }}</span>
        </div>
        <h1 class="welcome">Benvenuto, {{ user.firstName }} {{ user.lastName }}!</h1>
      </header>

      <section class="card">
        <h2>I tuoi dati</h2>
        <p><b>Email:</b> {{ user.email }}</p>
        <p><b>Codice fiscale:</b> {{ user.fiscalCode }}</p>
        <p><b>Telefono:</b> {{ user.phone }}</p>
        <p><b>Indirizzo:</b> {{ user.address }}</p>
      </section>

      <section class="card">
        <h2>I tuoi repertori</h2>
        <div class="tags">
          <span v-for="id in user.repertoires" :key="id" class="tag">{{ getRepertoireLabel(id) }}</span>
        </div>
      </section>

      <button class="btn-logout" @click="authStore.logout()">Logout</button>
    </template>

    <p v-else class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.dashboard { padding: 24px; display: flex; flex-direction: column; gap: 20px; min-height: 100vh; }
.loading { text-align: center; padding: 48px; color: #6b7280; }
.header { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.avatar { width: 80px; height: 80px; border-radius: 50%; overflow: hidden; background: #003087; display: flex; align-items: center; justify-content: center; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-initials { color: #fff; font-size: 28px; font-weight: 700; }
.welcome { font-size: 20px; font-weight: 700; color: #003087; margin: 0; text-align: center; }
.card { background: #f9fafb; border-radius: 12px; padding: 16px; }
.card h2 { font-size: 16px; font-weight: 700; color: #374151; margin: 0 0 12px; }
.card p { margin: 4px 0; font-size: 14px; color: #1a1a1a; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tag { background: #eff6ff; color: #003087; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; border: 1px solid #bfdbfe; }
.btn-logout { width: 100%; padding: 14px; background: transparent; color: #E30613; border: 1px solid #E30613; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; min-height: 44px; margin-top: auto; }
.error { color: #E30613; text-align: center; }
</style>
