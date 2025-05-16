<template>
  <div class="min-h-screen bg-white">
    <TopBar @update:grid="updateGrid" />
    <Grid
      :container-width="gridConfig.containerWidth"
      :container-height="gridConfig.containerHeight"
      :cell-size="gridConfig.cellSize"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TopBar from './top-bar/TopBar.vue'
import Grid from './grid-visualizer/Grid.vue'

interface GridConfig {
  containerWidth: number
  containerHeight: number
  cellSize: number
}

const gridConfig = ref<GridConfig>({
  containerWidth: 800,
  containerHeight: 600,
  cellSize: 40
})

const updateGrid = (config: GridConfig) => {
  gridConfig.value = config
}
</script>
