<template>
  <div class="p-4">
    <div
      class="grid gap-0 border border-gray-300"
      :style="{
        width: containerWidth + 'px',
        height: containerHeight + 'px',
        gridTemplateColumns: 'repeat(' + columns + ', ' + cellSize + 'px)',
        gridTemplateRows: 'repeat(' + rows + ', ' + cellSize + 'px)'
      }"
    >
      <div
        v-for="(_, index) in totalCells"
        :key="index"
        :class="[
          'border border-gray-200',
          isEvenCell(index) ? 'bg-gray-100' : 'bg-white'
        ]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  containerWidth: number
  containerHeight: number
  cellSize: number
}

const props = defineProps<Props>()

const columns = computed(() => Math.floor(props.containerWidth / props.cellSize))
const rows = computed(() => Math.floor(props.containerHeight / props.cellSize))
const totalCells = computed(() => columns.value * rows.value)

const isEvenCell = (index: number) => {
  const row = Math.floor(index / columns.value)
  const col = index % columns.value
  return (row + col) % 2 === 0
}
</script>
