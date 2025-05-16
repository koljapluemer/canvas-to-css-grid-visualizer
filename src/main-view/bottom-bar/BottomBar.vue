<template>
  <div class="bg-gray-100 p-4 shadow-md border-t">
    <div class="flex gap-4 items-center">
      <button
        @click="addRandomNode"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Add Random Node
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGrid } from '@/composables/useGrid'
import { useNodes, type Node } from '@/composables/useNodes'

const { columns, rows } = useGrid()
const { addNode, nodes } = useNodes()

function isOverlap(a: Node, b: Node) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

const addRandomNode = () => {
  const maxAttempts = 100
  let attempt = 0
  let placed = false

  // Calculate minimum dimensions (20% of grid)
  const minWidth = Math.max(1, Math.ceil(columns.value * 0.2))
  const minHeight = Math.max(1, Math.ceil(rows.value * 0.2))

  while (attempt < maxAttempts && !placed) {
    // Generate random dimensions (between min and min + 2 cells)
    const width = minWidth + Math.floor(Math.random() * 2)
    const height = minHeight + Math.floor(Math.random() * 2)

    // Generate random position within grid bounds
    const x = Math.floor(Math.random() * (columns.value - width + 1))
    const y = Math.floor(Math.random() * (rows.value - height + 1))

    // Generate random hue, fixed saturation and lightness
    const hue = Math.floor(Math.random() * 360)
    const color = `hsl(${hue}, 80%, 60%)`

    const newNode: Node = {
      id: crypto.randomUUID(),
      x,
      y,
      width,
      height,
      color
    }

    // Check for overlap
    const overlap = nodes.value.some(node => isOverlap(newNode, node))
    if (!overlap) {
      addNode(newNode)
      placed = true
    }
    attempt++
  }
}
</script>
