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
      <!-- Grid cells with Unicode SSoT rendering -->
      <div
        v-for="index in totalCells"
        :key="'cell-' + index"
        class="relative flex items-center justify-center"
        :style="{ width: gridConfig.cellSize + 'px', height: gridConfig.cellSize + 'px' }"
      >
        <div
          :class="[
            'absolute inset-0',
            'border border-gray-200',
            isEvenCell(index - 1) ? 'bg-gray-100' : 'bg-white'
          ]"
        ></div>
        <span v-if="cellUnicode(index - 1)" class="relative z-10 text-lg select-none">
          {{ cellUnicode(index - 1) }}
        </span>
      </div>

      <!-- Edge path arrow heads -->
      <template v-for="edgePath in edgePaths">
        <span
          v-if="edgePath.path.length > 1"
          :key="'arrowhead-start-' + edgePath.fromNodeId + '-' + edgePath.toNodeId"
          class="absolute z-30 text-lg select-none"
          :style="{
            left: edgePath.path[0].x * gridConfig.cellSize + 'px',
            top: edgePath.path[0].y * gridConfig.cellSize + 'px',
            width: gridConfig.cellSize + 'px',
            height: gridConfig.cellSize + 'px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: edgePath.color
          }"
        >
          {{ arrowHeadUnicode(edgePath.path[0], edgePath.path[1]) }}
        </span>
        <span
          v-if="edgePath.path.length > 1"
          :key="'arrowhead-end-' + edgePath.fromNodeId + '-' + edgePath.toNodeId"
          class="absolute z-30 text-lg select-none"
          :style="{
            left: edgePath.path[edgePath.path.length-1].x * gridConfig.cellSize + 'px',
            top: edgePath.path[edgePath.path.length-1].y * gridConfig.cellSize + 'px',
            width: gridConfig.cellSize + 'px',
            height: gridConfig.cellSize + 'px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: edgePath.color
          }"
        >
          {{ arrowHeadUnicode(edgePath.path[edgePath.path.length-1], edgePath.path[edgePath.path.length-2]) }}
        </span>
      </template>

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
import { useGridCells } from '@/composables/useGridCells'
import { computed } from 'vue'

const { gridConfig, columns, rows, totalCells } = useGrid()
const { nodes, toggleHighlight, isHighlighted } = useNodes()
const { edgePaths } = useEdges()
const { getCell } = useGridCells()

const unicodeMap: Record<string, string> = {
  'edge-straight-h': '─',
  'edge-straight-v': '│',
  'edge-elbow-nw': '┌',
  'edge-elbow-ne': '┐',
  'edge-elbow-sw': '└',
  'edge-elbow-se': '┘',
  'edge-cross': '┼',
  'edge-arrow-n': '↑',
  'edge-arrow-s': '↓',
  'edge-arrow-e': '→',
  'edge-arrow-w': '←'
}

function cellUnicode(index: number): string | undefined {
  const x = index % columns.value
  const y = Math.floor(index / columns.value)
  const occ = getCell(x, y)
  if (!occ || occ.type === 'node') return undefined
  return unicodeMap[occ.type] || undefined
}

function arrowHeadUnicode(cell: {x: number, y: number}, nextCell: {x: number, y: number}): string {
  if (!cell || !nextCell) return ''
  const dx = nextCell.x - cell.x
  const dy = nextCell.y - cell.y
  if (dx === 1) return '→'
  if (dx === -1) return '←'
  if (dy === 1) return '↓'
  if (dy === -1) return '↑'
  return ''
}

const isEvenCell = (index: number) => {
  const row = Math.floor(index / columns.value)
  const col = index % columns.value
  return (row + col) % 2 === 0
}
</script>
