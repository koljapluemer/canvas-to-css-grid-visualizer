import { ref } from 'vue'

export interface Node {
  id: string
  x: number
  y: number
  width: number
  height: number
  color: string
}

const nodes = ref<Node[]>([])

export function useNodes() {
  const addNode = (node: Node) => {
    nodes.value.push(node)
  }

  const removeNode = (id: string) => {
    nodes.value = nodes.value.filter(node => node.id !== id)
  }

  const updateNode = (id: string, updates: Partial<Node>) => {
    const index = nodes.value.findIndex(node => node.id === id)
    if (index !== -1) {
      nodes.value[index] = { ...nodes.value[index], ...updates }
    }
  }

  return {
    nodes,
    addNode,
    removeNode,
    updateNode
  }
} 