import { useGrid } from './useGrid'
import { useNodes } from './useNodes'
import { useEdges } from './useEdges'
import { useGridCells } from './useGridCells'

export function useGridPrune() {
  const { gridConfig } = useGrid()
  const { nodes } = useNodes()
  const { outgoingEdges, edgePaths } = useEdges()
  const { syncGridCellsFromState } = useGridCells()

  function pruneAndSync() {
    const width = gridConfig.value.containerWidth
    const height = gridConfig.value.containerHeight

    // Prune nodes
    nodes.value = nodes.value.filter(n =>
      n.x >= 0 && n.y >= 0 &&
      n.x + n.width <= width &&
      n.y + n.height <= height
    )

    // Prune outgoing edges
    outgoingEdges.value = outgoingEdges.value.filter(e =>
      e.x >= 0 && e.x < width && e.y >= 0 && e.y < height
    )

    // Prune edge paths
    edgePaths.value = edgePaths.value.filter(ep =>
      ep.path.every(cell =>
        cell.x >= 0 && cell.x < width && cell.y >= 0 && cell.y < height
      )
    )

    // Sync SSoT
    syncGridCellsFromState({
      nodes: nodes.value,
      outgoingEdges: outgoingEdges.value,
      edgePaths: edgePaths.value
    })
  }

  return { pruneAndSync }
} 