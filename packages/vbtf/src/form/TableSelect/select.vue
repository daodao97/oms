<template>
  <ElTabs
    v-model="active"
    type="card"
  >
    <ElTabPane
      v-for="(item, index) in props.source"
      :key="index"
      :label="item.label"
      :name="item.label"
      :lazy="true"
    >
      <VTable
        :ref="table[item.value]"
        :show-pagination="false"
        :show-normal-button="false"
        :show-batch-button="false"
        :show-row-button="false"
        :show-selection="true"
        :sync-url="false"
        :info-api="item.infoApi"
        :list-api="item.listApi"
        @selection="selection"
      />
    </ElTabPane>
  </ElTabs>
</template>

<script lang="ts" setup>
import { PropType, ref, computed } from 'vue'

const VTable = defineAsyncComponent(() => import('../../table/VTable.vue'))

interface TableSchema {
  id: number,
  label: string,
  valueKey: string | Array<string> | Record<string, string>, // string or []string or map[string]string
  infoApi: string,
  listApi: string
}

const table = ref({})
const active = ref('')
const props = defineProps({
  source: {
    type: Array as PropType<Array<TableSchema>>,
    default: () => []
  },
  onSelection: {
    type: Function,
    default: () => {}
  }
})

if (props.source.length > 0) {
  active.value = props.source[0].label + ''
}

const tabIndex = computed(() => {
  let i = -1
  props.source.forEach((item, index) => {
    if (item.label === active.value) {
      i = index
    }
  })
  return i
})

const selection = (rows: Array<Record<string, any>>) => {
  props.onSelection(tabIndex.value, rows)
}

</script>
