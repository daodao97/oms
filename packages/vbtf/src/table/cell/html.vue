<template>
  <span v-html="data" />
</template>
<script lang="ts">
export default {
  name: 'CellSpan',
  props: {
    data: {
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default: () => {}
    },
    scope: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
