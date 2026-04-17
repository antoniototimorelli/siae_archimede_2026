<script setup lang="ts">
import { DsButton } from '@itsiae/siae-design-system'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="home">
    <header class="home__hero">
      <h1 class="home__title">SIAE+</h1>
      <p class="home__subtitle">Dalla parte di chi crea</p>
    </header>

    <section class="home__actions">
      <DsButton variant="primary" size="lg" @click="router.push({ name: 'register' })">
        Iscriviti
      </DsButton>
      <DsButton variant="secondary" size="lg" @click="router.push({ name: 'login' })">
        Accedi
      </DsButton>
    </section>
  </main>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  padding: 48px 24px 32px;
  box-sizing: border-box;
}

.home__hero {
  text-align: center;
  margin-top: 10vh;
}

.home__title {
  font-size: 48px;
  font-weight: 800;
  color: #003399;
  margin: 0;
  letter-spacing: -1px;
}

.home__subtitle {
  margin-top: 8px;
  color: #6b7280;
  font-size: 16px;
}

.home__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}
</style>
