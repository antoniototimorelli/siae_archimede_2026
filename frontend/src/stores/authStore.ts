import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => token.value !== null)

  function setToken(t: string): void {
    token.value = t
  }

  function logout(): void {
    token.value = null
    const router = useRouter()
    router.push('/login')
  }

  function getAuthHeader(): { Authorization: string } | Record<string, never> {
    if (!token.value) return {}
    return { Authorization: `Bearer ${token.value}` }
  }

  return { token, isAuthenticated, setToken, logout, getAuthHeader }
})
