<template>
  <div class="bg-gray-100 p-4 shadow-md">
    <div class="flex gap-4 items-center">
      <div class="flex items-center gap-2">
        <label for="containerWidth" class="text-sm font-medium text-gray-700">Container Width (px):</label>
        <input
          id="containerWidth"
          v-model="containerWidth"
          type="number"
          min="100"
          max="1200"
          class="w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div class="flex items-center gap-2">
        <label for="containerHeight" class="text-sm font-medium text-gray-700">Container Height (px):</label>
        <input
          id="containerHeight"
          v-model="containerHeight"
          type="number"
          min="100"
          max="800"
          class="w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="flex items-center gap-2">
        <label for="cellSize" class="text-sm font-medium text-gray-700">Cell Size (px):</label>
        <input
          id="cellSize"
          v-model="cellSize"
          type="number"
          min="20"
          max="100"
          class="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const containerWidth = ref(800)
const containerHeight = ref(600)
const cellSize = ref(40)

const emit = defineEmits<{
  (e: 'update:grid', value: { containerWidth: number; containerHeight: number; cellSize: number }): void
}>()

watch([containerWidth, containerHeight, cellSize], ([width, height, size]) => {
  emit('update:grid', {
    containerWidth: Number(width),
    containerHeight: Number(height),
    cellSize: Number(size)
  })
}, { immediate: true })
</script>
