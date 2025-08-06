<script setup>
import CadreDashboard from '../components/CadreDashboard.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <CadreDashboard />
</template>

<style scoped>
:deep(.router-view-container) {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
