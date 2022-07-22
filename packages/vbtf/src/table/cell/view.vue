<template>
  <VButton
    type="modal"
    text="查看"
  >
    <JsonView :data="showData" />
  </VButton>
</template>
<script setup>
import VButton from '../../button/VButton.vue'
import JsonView from '../../jsonview/index.vue'

const props = defineProps({
  fields: {
    type: Array,
    default: () => []
  },
  column: {
    type: Object,
    default: () => {}
  },
  row: {
    type: Object,
    default: () => {}
  },
  scope: {
    type: Object,
    default: () => {}
  }
})
const showData = computed(() => {
  if (props.fields?.length === 0) {
    return props.row
  }
  const tmp = {}
  props.fields?.forEach(key => {
    tmp[key] = props.row[key]
  })
  return tmp
})
</script>

<style lang="scss">
.item {
  margin: 10px 0;
}
</style>
