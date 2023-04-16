<template>
  <template v-if="show">
    <el-tag
      v-for="(item, index) in _data.filter(e => getLabel(e) !== '')"
      :key="index"
      :type="type(item)"
    >{{ getLabel(item) }}</el-tag>
  </template>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
import { findIndex } from 'lodash'
import { isArray, ruleCompute } from '@okiss/utils'

type dataType = String | Number | Array<String | Number>

const props = defineProps({
  data: {
    type: [String, Number, Array] as PropType<dataType>,
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
  scope: {
    type: Object,
    default: () => {}
  },
  when: {
    type: Array,
    default: () => []
  }
})

const { column, data } = toRefs(props)

const _data = computed<Array<String|Number>>(() => {
  if (!isArray(data?.value)) {
    return [data?.value] as Array<String|Number>
  }
  return data?.value as Array<String|Number>
})

const type = (val: any) => {
  const allowed = ['success', 'info', 'warning', 'danger']
  const state = column.value?.state ? column.value?.state : allowed
  const v = state[val] ? state[val] : val
  return allowed.indexOf(v) > -1 ? v + '' : ''
}
const getLabel = (val: any) => {
  if (val === '') {
    return ''
  }
  const index = findIndex(column.value?.options, {
    value: val
  })
  const obj = column.value.options ? column.value.options[index] : false
  return obj ? obj.label : val
}
const show = computed(() => {
  const when = props.when as Array<any>
  if (when.length === 0) {
    return true
  }
  return ruleCompute({ data: data?.value }, ['data', ...when])
})
</script>
