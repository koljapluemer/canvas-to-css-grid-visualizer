import { ref, computed } from 'vue'

const STORAGE_KEY = 'grid-config'

interface GridConfig {
  containerWidth: number
  containerHeight: number
  cellSize: number
}

const DEFAULT_CONFIG: GridConfig = {
  containerWidth: 800,
  containerHeight: 600,
  cellSize: 40
}

// Initialize with saved values or defaults
const savedConfig = localStorage.getItem(STORAGE_KEY)
const initialConfig = savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIG

const gridConfig = ref<GridConfig>(initialConfig)

export function useGrid() {
  const updateGrid = (config: GridConfig) => {
    gridConfig.value = config
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }

  const columns = computed(() => Math.floor(gridConfig.value.containerWidth / gridConfig.value.cellSize))
  const rows = computed(() => Math.floor(gridConfig.value.containerHeight / gridConfig.value.cellSize))
  const totalCells = computed(() => columns.value * rows.value)

  return {
    gridConfig,
    updateGrid,
    columns,
    rows,
    totalCells
  }
} 