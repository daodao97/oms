<template>
  <span>{{ showData }}</span>
</template>
<script lang="ts" setup name="CellSpan">

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
  render: {
    type: String,
    default: ''
  },
  scope: {
    type: Object,
    default: () => {}
  }
})

const showData = computed(() => {
  if (!props.render) {
    return props.data
  }
  const fun = new Function('return ' + props.render)
  return fun()(props.data, props.row)
})
</script>
