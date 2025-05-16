import { ref, computed } from 'vue'

export type CellType =
  | 'empty'
  | 'node'
  | 'edge-straight-h' // ─
  | 'edge-straight-v' // │
  | 'edge-elbow-nw'   // ┌
  | 'edge-elbow-ne'   // ┐
  | 'edge-elbow-sw'   // └
  | 'edge-elbow-se'   // ┘
  | 'edge-cross'      // ┼
  | 'edge-arrow-n'    // ↑
  | 'edge-arrow-s'    // ↓
  | 'edge-arrow-e'    // →
  | 'edge-arrow-w'    // ←

export interface CellOccupant {
  type: CellType
  nodeId?: string
  edgeId?: string
}

function cellKey(x: number, y: number) {
  return `${x},${y}`
}

const gridCells = ref(new Map<string, CellOccupant>())

export function useGridCells() {
  const getCell = (x: number, y: number): CellOccupant | undefined => {
    return gridCells.value.get(cellKey(x, y))
  }

  const setCell = (x: number, y: number, occupant: CellOccupant) => {
    gridCells.value.set(cellKey(x, y), occupant)
  }

  const clearCell = (x: number, y: number) => {
    gridCells.value.delete(cellKey(x, y))
  }

  // Returns allowed types for a cell based on current occupancy
  const getAllowedForCell = (x: number, y: number): CellType[] => {
    const occ = getCell(x, y)
    if (!occ) return ['node', 'edge-straight-h', 'edge-straight-v', 'edge-elbow-nw', 'edge-elbow-ne', 'edge-elbow-sw', 'edge-elbow-se', 'edge-cross', 'edge-arrow-n', 'edge-arrow-s', 'edge-arrow-e', 'edge-arrow-w']
    if (occ.type === 'node' || occ.type.startsWith('edge-arrow') || occ.type.startsWith('edge-elbow')) return []
    if (occ.type === 'edge-straight-h' || occ.type === 'edge-straight-v') return ['edge-cross'] // allow crossing
    if (occ.type === 'edge-cross') return [] // already a cross
    return []
  }

  // Now edgeSegments is a flat array of {x, y, type}
  interface SyncOptions {
    nodes: { id: string; x: number; y: number; width: number; height: number }[]
    outgoingEdges: { nodeId: string; direction: string; x: number; y: number }[]
    edgeSegments?: { x: number; y: number; type: CellType }[]
  }

  const syncGridCellsFromState = (opts: SyncOptions) => {
    gridCells.value.clear()
    // Mark node cells
    for (const node of opts.nodes) {
      for (let dx = 0; dx < node.width; dx++) {
        for (let dy = 0; dy < node.height; dy++) {
          setCell(node.x + dx, node.y + dy, { type: 'node', nodeId: node.id })
        }
      }
    }
    // Mark outgoing edge cells (arrows)
    for (const edge of opts.outgoingEdges) {
      let arrowType: CellType = 'edge-arrow-n'
      if (edge.direction === 'N') arrowType = 'edge-arrow-n'
      if (edge.direction === 'S') arrowType = 'edge-arrow-s'
      if (edge.direction === 'E') arrowType = 'edge-arrow-e'
      if (edge.direction === 'W') arrowType = 'edge-arrow-w'
      setCell(edge.x, edge.y, { type: arrowType, edgeId: edge.nodeId })
    }
    // Mark edge segments
    if (opts.edgeSegments) {
      for (const seg of opts.edgeSegments) {
        // If cell already has a straight edge, mark as cross
        const occ = getCell(seg.x, seg.y)
        if (occ && (occ.type === 'edge-straight-h' || occ.type === 'edge-straight-v')) {
          setCell(seg.x, seg.y, { type: 'edge-cross' })
        } else if (!occ) {
          setCell(seg.x, seg.y, { type: seg.type })
        }
      }
    }
  }

  return {
    gridCells,
    getCell,
    setCell,
    clearCell,
    getAllowedForCell,
    syncGridCellsFromState
  }
}

function dirFromDelta(dx: number, dy: number): 'U' | 'D' | 'L' | 'R' {
  if (dx === 0 && dy === -1) return 'U'
  if (dx === 0 && dy === 1) return 'D'
  if (dx === -1 && dy === 0) return 'L'
  if (dx === 1 && dy === 0) return 'R'
  throw new Error('Invalid delta for direction')
} 