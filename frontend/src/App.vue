<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <RouterView />
  </div>
</template>

<style>
html,
body,
#app {
  margin: 0;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f6f8;
  color: #1a1a1a;
}

.app-shell {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #ffffff;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.04);
}
</style>
