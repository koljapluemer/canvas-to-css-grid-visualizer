import { ref } from 'vue'

export type EdgeDirection = 'N' | 'S' | 'E' | 'W'

export interface OutgoingEdge {
  nodeId: string
  direction: EdgeDirection
  x: number // grid column
  y: number // grid row
  color: string
}

const outgoingEdges = ref<OutgoingEdge[]>([])

export function useEdges() {
  const addOutgoingEdge = (edge: OutgoingEdge) => {
    outgoingEdges.value.push(edge)
  }

  const clearOutgoingEdges = () => {
    outgoingEdges.value = []
  }

  return {
    outgoingEdges,
    addOutgoingEdge,
    clearOutgoingEdges
  }
} 