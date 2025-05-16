import { ref } from 'vue'

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
  path: { x: number; y: number }[]
  crossings: Set<string>
}

const outgoingEdges = ref<OutgoingEdge[]>([])
const edgePaths = ref<EdgePath[]>([])

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
    clearEdgePaths
  }
} 