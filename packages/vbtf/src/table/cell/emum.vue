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

const allowed = ['success', 'info', 'warning', 'danger', 'primary'] as const
type TagType = typeof allowed[number]
const type = (val: any): TagType => {
  const state = (column.value as any)?.state || {}
  const v = state[val] ?? val
  const s = String(v)
  return (allowed as readonly string[]).includes(s) ? (s as TagType) : 'info'
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
