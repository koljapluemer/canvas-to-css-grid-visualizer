<template>
  <div class="w-48 bg-gray-50 border-r h-full flex flex-col p-2 overflow-y-auto">
    <div class="font-bold text-gray-700 mb-2">Nodes</div>
    <div v-for="(node, idx) in nodes" :key="node.id" class="mb-2">
      <div
        class="flex items-center gap-2 cursor-pointer rounded p-1"
        :class="isHighlighted(node.id) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-100'"
        @click="toggleHighlight(node.id)"
      >
        <!-- Thumbnail -->
        <div
          class="flex items-center justify-center border border-gray-300 rounded"
          :style="{
            width: '36px',
            height: '36px',
            background: '#fff'
          }"
        >
          <div
            :style="{
              width: (28 * node.width / node.height) + 'px',
              height: (28 * node.height / node.width) + 'px',
              maxWidth: '28px',
              maxHeight: '28px',
              background: node.color,
              borderRadius: '4px',
              border: isHighlighted(node.id) ? '2px solid #3b82f6' : '1px solid #2563eb',
              opacity: 0.85
            }"
          ></div>
        </div>
        <div class="flex-1 truncate text-xs text-gray-700">
          {{ node.id.slice(0, 6) }} ({{ node.width }}×{{ node.height }})
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNodes } from '@/composables/useNodes'

const { nodes, toggleHighlight, isHighlighted } = useNodes()
</script>
