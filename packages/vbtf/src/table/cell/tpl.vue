<template>
  <span v-html="show" />
</template>
<script lang="ts" setup>
import { strVarReplace } from '@okiss/utils'
const props = defineProps({
  data: {
    type: [String, Number, Array, Object],
    default: ''
  },
  column: {
    type: Object,
    default: () => {}
  },
  row: {
    type: Object,
    default: () => {}
  },
  tpl: {
    type: String,
    default: ''
  },
  scope: {
    type: Object,
    default: () => {}
  }
})
const show = computed(() => {
  return strVarReplace(props.tpl, props.row)
})
</script>
