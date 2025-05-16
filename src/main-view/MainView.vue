<template>
  <div class="min-h-screen bg-white flex flex-col">
    <TopBar />
    <div class="flex flex-1 min-h-0">
      <SideBar />
      <div class="flex-1 flex flex-col min-h-0">
        <div class="flex-grow min-h-0">
          <Grid />
        </div>
        <BottomBar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopBar from './top-bar/TopBar.vue'
import Grid from './grid-visualizer/Grid.vue'
import BottomBar from './bottom-bar/BottomBar.vue'
import SideBar from './side-bar/SideBar.vue'
import { useNodes } from '@/composables/useNodes'
import { useEdges } from '@/composables/useEdges'
import { useGridCells } from '@/composables/useGridCells'
import { watch } from 'vue'

const { nodes } = useNodes()
const { outgoingEdges, allEdgeSegments } = useEdges()
const { syncGridCellsFromState } = useGridCells()

watch(
  [nodes, outgoingEdges, allEdgeSegments],
  () => {
    syncGridCellsFromState({
      nodes: nodes.value,
      outgoingEdges: outgoingEdges.value,
      edgeSegments: allEdgeSegments.value
    })
  },
  { deep: true, immediate: true }
)
</script>
