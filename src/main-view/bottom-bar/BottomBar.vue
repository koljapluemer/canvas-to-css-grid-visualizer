<template>
  <div class="bg-gray-100 p-4 shadow-md border-t">
    <div class="flex gap-4 items-center">
      <button
        @click="addRandomNode"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Add Random Node
      </button>
      <button
        @click="emitOutgoingEdge"
        :disabled="highlightedCount !== 1"
        class="px-4 py-2 rounded transition-colors text-white"
        :class="highlightedCount === 1 ? 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2' : 'bg-gray-400 cursor-not-allowed'"
      >
        Add Outgoing Edge
      </button>
      <button
        @click="emitConnect"
        :disabled="highlightedCount !== 2"
        class="px-4 py-2 rounded transition-colors text-white"
        :class="highlightedCount === 2 ? 'bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2' : 'bg-gray-400 cursor-not-allowed'"
      >
        Connect
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGrid } from '@/composables/useGrid'
import { useNodes, type Node } from '@/composables/useNodes'
import { useEdges, type EdgeDirection } from '@/composables/useEdges'
import { findManhattanPath } from '@/utils/findManhattanPath'
import { computed } from 'vue'

const { columns, rows } = useGrid()
const { addNode, nodes, highlighted, highlightedCount } = useNodes()
const { addOutgoingEdge, outgoingEdges, addEdgePath } = useEdges()

const emit = defineEmits<{
  (e: 'add-outgoing-edge', nodeId: string): void
}>()

function cellKey(x: number, y: number) {
  return `${x},${y}`
}

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

function addRandomEdgeForNode(node: Node, color: string) {
  const directions: EdgeDirection[] = ['N', 'S', 'E', 'W']
  let found = false
  let tries = 0
  let outX = node.x, outY = node.y, outDir: EdgeDirection = 'N'
  while (!found && tries < 4 && directions.length > 0) {
    const dirIdx = Math.floor(Math.random() * directions.length)
    const dir = directions[dirIdx]
    let x = node.x, y = node.y
    if (dir === 'N') {
      x = node.x + Math.floor(node.width / 2)
      y = node.y - 1
    } else if (dir === 'S') {
      x = node.x + Math.floor(node.width / 2)
      y = node.y + node.height
    } else if (dir === 'E') {
      x = node.x + node.width
      y = node.y + Math.floor(node.height / 2)
    } else if (dir === 'W') {
      x = node.x - 1
      y = node.y + Math.floor(node.height / 2)
    }
    // Check bounds
    if (x >= 0 && x < columns.value && y >= 0 && y < rows.value) {
      // Not inside the node
      if (!(x >= node.x && x < node.x + node.width && y >= node.y && y < node.y + node.height)) {
        // Not on another outgoing edge
        if (!outgoingEdges.value.some(e => e.x === x && e.y === y)) {
          addOutgoingEdge({ nodeId: node.id, direction: dir, x, y, color })
          outX = x; outY = y; outDir = dir
          found = true
        } else {
          directions.splice(dirIdx, 1)
        }
      } else {
        directions.splice(dirIdx, 1)
      }
    } else {
      directions.splice(dirIdx, 1)
    }
    tries++
  }
  return { x: outX, y: outY, dir: outDir }
}

const emitOutgoingEdge = () => {
  if (highlightedCount.value === 1) {
    const nodeId = Array.from(highlighted.value)[0]
    const node = nodes.value.find(n => n.id === nodeId)
    if (!node) return
    const hue = Math.floor(Math.random() * 360)
    const color = `hsl(${hue}, 90%, 55%)`
    addRandomEdgeForNode(node, color)
  }
}

const emitConnect = () => {
  if (highlightedCount.value === 2) {
    const nodeIds = Array.from(highlighted.value)
    const nodeA = nodes.value.find(n => n.id === nodeIds[0])
    const nodeB = nodes.value.find(n => n.id === nodeIds[1])
    if (!nodeA || !nodeB) return
    const hue = Math.floor(Math.random() * 360)
    const color = `hsl(${hue}, 90%, 55%)`
    // Generate outgoing points for both nodes
    const outA = addRandomEdgeForNode(nodeA, color)
    const outB = addRandomEdgeForNode(nodeB, color)
    // Prepare obstacles: all node cells
    const obstacles = new Set<string>()
    nodes.value.forEach(n => {
      for (let dx = 0; dx < n.width; dx++) {
        for (let dy = 0; dy < n.height; dy++) {
          obstacles.add(cellKey(n.x + dx, n.y + dy))
        }
      }
    })
    // Prepare edge cells: all outgoing and path cells except the endpoints
    const edgeCells = new Set<string>()
    outgoingEdges.value.forEach(e => {
      if (!(e.x === outA.x && e.y === outA.y) && !(e.x === outB.x && e.y === outB.y)) {
        edgeCells.add(cellKey(e.x, e.y))
      }
    })
    // Add all path cells from existing edge paths
    // (for now, allow crossings, but penalize in pathfinder)
    // TODO: add path cells from edgePaths if you want to avoid them more strictly
    // --- Two-pass pathfinding ---
    // First pass: crossings forbidden
    let result = findManhattanPath({
      start: { x: outA.x, y: outA.y },
      end: { x: outB.x, y: outB.y },
      width: columns.value,
      height: rows.value,
      obstacles: new Set([...obstacles, ...edgeCells]),
      edgeCells: new Set() // no crossings allowed
    })
    // Second pass: allow crossings with penalty if needed
    if (!result) {
      result = findManhattanPath({
        start: { x: outA.x, y: outA.y },
        end: { x: outB.x, y: outB.y },
        width: columns.value,
        height: rows.value,
        obstacles,
        edgeCells
      })
    }
    if (result) {
      // The path cells already have their types from the pathfinder
      addEdgePath({
        fromNodeId: nodeA.id,
        toNodeId: nodeB.id,
        color,
        path: result.path,
        crossings: result.crossings
      })
    }
  }
}
</script>
