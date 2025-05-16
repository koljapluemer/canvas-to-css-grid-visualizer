import { ref, computed } from 'vue'
import type { CellType, PathCell } from '@/utils/findManhattanPath'

export type EdgeDirection = 'N' | 'S' | 'E' | 'W'

export interface OutgoingEdge {
  nodeId: string
  direction: EdgeDirection
  x: number // grid column
  y: number // grid row
  color: string
}

export interface EdgePath {
  fromNodeId: string
  toNodeId: string
  color: string
  path: PathCell[]
  crossings: Set<string>
}

export interface EdgeSegment {
  x: number
  y: number
  type: CellType
}

const outgoingEdges = ref<OutgoingEdge[]>([])
const edgePaths = ref<EdgePath[]>([])

const allEdgeSegments = computed(() => {
  const segs: EdgeSegment[] = []
  for (const edgePath of edgePaths.value) {
    segs.push(...edgePath.path.map(cell => ({ x: cell.x, y: cell.y, type: cell.type })))
  }
  return segs
})

export function useEdges() {
  const addOutgoingEdge = (edge: OutgoingEdge) => {
    outgoingEdges.value.push(edge)
  }

  const clearOutgoingEdges = () => {
    outgoingEdges.value = []
  }

  const addEdgePath = (edgePath: EdgePath) => {
    edgePaths.value.push(edgePath)
  }

  const clearEdgePaths = () => {
    edgePaths.value = []
  }

  return {
    outgoingEdges,
    addOutgoingEdge,
    clearOutgoingEdges,
    edgePaths,
    addEdgePath,
    clearEdgePaths,
    allEdgeSegments
  }
} 