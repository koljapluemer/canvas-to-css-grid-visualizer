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
const highlighted = ref<Set<string>>(new Set())

export function useNodes() {
  const addNode = (node: Node) => {
    nodes.value.push(node)
  }

  const removeNode = (id: string) => {
    nodes.value = nodes.value.filter(node => node.id !== id)
    highlighted.value.delete(id)
  }

  const updateNode = (id: string, updates: Partial<Node>) => {
    const index = nodes.value.findIndex(node => node.id === id)
    if (index !== -1) {
      nodes.value[index] = { ...nodes.value[index], ...updates }
    }
  }

  const toggleHighlight = (id: string) => {
    if (highlighted.value.has(id)) {
      highlighted.value.delete(id)
    } else {
      highlighted.value.add(id)
    }
  }

  const isHighlighted = (id: string) => highlighted.value.has(id)

  return {
    nodes,
    addNode,
    removeNode,
    updateNode,
    highlighted,
    toggleHighlight,
    isHighlighted
  }
} 