<template>
  <div class="p-4">
    <div
      class="grid gap-0 border border-gray-300 relative"
      :style="{
        width: gridConfig.containerWidth + 'px',
        height: gridConfig.containerHeight + 'px',
        gridTemplateColumns: 'repeat(' + columns + ', ' + gridConfig.cellSize + 'px)',
        gridTemplateRows: 'repeat(' + rows + ', ' + gridConfig.cellSize + 'px)'
      }"
    >
      <!-- Grid cells -->
      <div
        v-for="(_, index) in totalCells"
        :key="'cell-' + index"
        :class="[
          'border border-gray-200',
          isEvenCell(index) ? 'bg-gray-100' : 'bg-white'
        ]"
      ></div>

      <!-- Outgoing edge overlays -->
      <div
        v-for="edge in outgoingEdges"
        :key="'edge-' + edge.nodeId + '-' + edge.direction"
        class="absolute z-20 pointer-events-none"
        :style="{
          left: edge.x * gridConfig.cellSize + 'px',
          top: edge.y * gridConfig.cellSize + 'px',
          width: gridConfig.cellSize + 'px',
          height: gridConfig.cellSize + 'px',
          background: edge.color,
          opacity: 0.85,
          borderRadius: '6px',
          border: '2px solid #222',
          boxShadow: '0 0 6px 2px ' + edge.color
        }"
      ></div>

      <!-- Nodes -->
      <div
        v-for="node in nodes"
        :key="node.id"
        class="absolute rounded cursor-pointer transition-all"
        :class="isHighlighted(node.id) ? 'border-4 border-black border-dashed z-10' : 'border-2 border-blue-600'"
        :style="{
          left: node.x * gridConfig.cellSize + 'px',
          top: node.y * gridConfig.cellSize + 'px',
          width: node.width * gridConfig.cellSize + 'px',
          height: node.height * gridConfig.cellSize + 'px',
          background: node.color,
          opacity: 0.85
        }"
        @click.stop="toggleHighlight(node.id)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGrid } from '@/composables/useGrid'
import { useNodes } from '@/composables/useNodes'
import { useEdges } from '@/composables/useEdges'

const { gridConfig, columns, rows, totalCells } = useGrid()
const { nodes, toggleHighlight, isHighlighted } = useNodes()
const { outgoingEdges } = useEdges()

const isEvenCell = (index: number) => {
  const row = Math.floor(index / columns.value)
  const col = index % columns.value
  return (row + col) % 2 === 0
}
</script>
