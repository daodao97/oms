<template>
  <div class="get-rt-at">
    <el-alert title="组件 Props" type="info" :closable="false" class="mt8" />
    <pre class="mono">{{ formattedProps }}</pre>
  </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue'

const attrs = useAttrs()

const formattedProps = computed(() => {
  const entries = Object.entries(attrs)
  if (!entries.length) {
    return '无 props'
  }
  return entries
    .map(([key, value]) => `${key}: ${JSON.stringify(value, null, 2)}`)
    .join('\n\n')
})
</script>

<style scoped>
.mt8 { margin-top: 8px; }
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  background-color: #f7f7f7;
  padding: 12px;
  border-radius: 6px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
