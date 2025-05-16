<template>
  <div class="bg-gray-100 p-4 shadow-md">
    <div class="flex gap-4 items-center">
      <div class="flex items-center gap-2">
        <label for="containerWidth" class="text-sm font-medium text-gray-700">Container Width (px):</label>
        <input
          id="containerWidth"
          v-model="localWidth"
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
          v-model="localHeight"
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
          v-model="localCellSize"
          type="number"
          min="20"
          max="100"
          class="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        @click="applyUpdate"
        class="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Update
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useGrid } from '@/composables/useGrid'

const { gridConfig, updateGrid } = useGrid()

const localWidth = ref(gridConfig.value.containerWidth)
const localHeight = ref(gridConfig.value.containerHeight)
const localCellSize = ref(gridConfig.value.cellSize)

watch(gridConfig, (newConfig) => {
  localWidth.value = newConfig.containerWidth
  localHeight.value = newConfig.containerHeight
  localCellSize.value = newConfig.cellSize
})

function applyUpdate() {
  updateGrid({
    containerWidth: Number(localWidth.value),
    containerHeight: Number(localHeight.value),
    cellSize: Number(localCellSize.value)
  })
}
</script>
