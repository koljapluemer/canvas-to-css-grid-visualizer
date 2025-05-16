export type Point = { x: number; y: number }
export type GridCell = Point
export type PathResult = {
  path: GridCell[]
  crossings: Set<string> // stringified cell keys where crossings occur
}

interface FindPathOptions {
  start: Point
  end: Point
  width: number
  height: number
  obstacles: Set<string> // stringified cell keys
  edgeCells: Set<string> // stringified cell keys (other edges)
}

function cellKey(x: number, y: number) {
  return `${x},${y}`
}

export function findManhattanPath({ start, end, width, height, obstacles, edgeCells }: FindPathOptions): PathResult | null {
  // Directions: [dx, dy, name]
  const DIRS: [number, number, string][] = [
    [0, -1, 'N'],
    [0, 1, 'S'],
    [1, 0, 'E'],
    [-1, 0, 'W']
  ]

  // Priority queue: [cost, turns, crossings, x, y, path, prevDir]
  const queue: [number, number, number, number, number, GridCell[], string | null][] = []
  const visited = new Set<string>()

  // Helper to check if a cell is a crossing (used by another edge)
  const isCrossing = (x: number, y: number) => edgeCells.has(cellKey(x, y))

  queue.push([0, 0, 0, start.x, start.y, [start], null])

  while (queue.length) {
    // Sort by cost (lowest first)
    queue.sort((a, b) => a[0] - b[0])
    const [cost, turns, crossings, x, y, path, prevDir] = queue.shift()!
    const key = cellKey(x, y) + '|' + (prevDir ?? '')
    if (visited.has(key)) continue
    visited.add(key)

    if (x === end.x && y === end.y) {
      // Collect crossings
      const crossingSet = new Set<string>(
        path.filter(cell => isCrossing(cell.x, cell.y)).map(cell => cellKey(cell.x, cell.y))
      )
      return { path, crossings: crossingSet }
    }

    for (const [dx, dy, dir] of DIRS) {
      const nx = x + dx
      const ny = y + dy
      const nkey = cellKey(nx, ny)
      if (
        nx < 0 || nx >= width || ny < 0 || ny >= height ||
        obstacles.has(nkey)
      ) continue
      // Don't allow path to start or end on a crossing
      if ((nx !== end.x || ny !== end.y) && edgeCells.has(nkey)) continue
      // Don't revisit
      if (visited.has(nkey + '|' + dir)) continue
      // Cost: 1 per move, +10 per turn, +100 per crossing
      const isTurn = prevDir && prevDir !== dir
      const isCross = isCrossing(nx, ny)
      const nCost = cost + 1 + (isTurn ? 10 : 0) + (isCross ? 100 : 0)
      queue.push([
        nCost,
        turns + (isTurn ? 1 : 0),
        crossings + (isCross ? 1 : 0),
        nx,
        ny,
        [...path, { x: nx, y: ny }],
        dir
      ])
    }
  }
  return null // No path found
} 