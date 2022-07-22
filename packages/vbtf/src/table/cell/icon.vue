<template>
  <v-icon :name="data" />
</template>
<script lang="ts" setup>
defineProps<{
  data: string,
  row: {
    type: Object,
    default: () => {}
  },
  scope: {
    type: Object,
    default: () => {}
  }
}>()
</script>
