<template>
  <VButton
    type="modal"
    text="查看"
  >
    <JsonView :data="showData" />
  </VButton>
</template>
<script lang="ts" setup>
import VButton from '../../button/VButton.vue'
import JsonView from '../../jsonview/index.vue'
import { isString } from '@okiss/utils'

const props = defineProps({
  data: {
    type: [Object, String, Array],
    default: () => {}
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
  if (isString(props.data)) {
    return JSON.parse(props.data)
  }
  return props.data
})
</script>

<style lang="scss">
.item {
  margin: 10px 0;
}
</style>
