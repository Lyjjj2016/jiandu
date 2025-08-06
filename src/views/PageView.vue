<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="page-container">
    <h1 class="page-title">{{ route.meta.title || route.name }}</h1>
  </div>
</template>

<style scoped>
.page-container {
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  margin: 20px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 150px);
}

.page-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 500;
  text-align: center;
}
</style> 