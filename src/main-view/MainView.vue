<template>
  <div class="min-h-screen bg-white flex flex-col">
    <TopBar />
    <div class="flex-grow">
      <Grid />
    </div>
    <BottomBar />
  </div>
</template>

<script setup lang="ts">
import TopBar from './top-bar/TopBar.vue'
import Grid from './grid-visualizer/Grid.vue'
import BottomBar from './bottom-bar/BottomBar.vue'
</script>
