<template>
  <ElCard
    v-resize="true"
    shadow="never"
    class="part"
  >
    <component
      :is="comptype()"
      v-bind="compprops(option)"
    />
  </ElCard>
</template>
<script lang="ts">
import { makeOption } from './option'
import { VTable, VChart, JsonView } from '@okiss/vbtf'
import NumberPanel from './NumberPanel.vue'
// @ts-ignore
import Markdown from 'vue3-markdown-it'
import { isArray } from '@okiss/utils'

export default {
  components: {
    Chart: VChart,
    Md: Markdown,
    Json: JsonView,
    Table: VTable,
    Number: NumberPanel,
    Html: ''
  },
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  setup(props: Record<string, any>) {
    const comptype = () => {
      if (props.option.chart === 'num') {
        return 'number'
      }
      return props.option.type
    }
    const compprops = (item: Record<string, any>) => {
      const type = comptype()
      if (type === 'number') {
        return {
          dataList: item.data
        }
      }
      if (type === 'chart') {
        return {
          options: makeOption(item.id, item.chart, item.data)
        }
      }
      if (type === 'md') {
        return {
          source: item.data
        }
      }

      if (type === 'table') {
        if (!isArray(item.data)) {
          return { showPagination: false }
        }
        const headers: { field: string; label: string }[] = []
        item.data[0] && Object.keys(item.data[0]).forEach((key, index) => {
          headers.push({ field: key, label: key })
        })
        return {
          headers: headers,
          list: item.data,
          showPagination: false
        }
      }
      return {}
    }

    return {
      compprops,
      comptype
    }
  }
}

</script>

<style lang="scss" scoped>
.part {
  //height: 350px;
  width: auto;
  margin-bottom: 15px;
  :last-child {
    margin-bottom: 0;
  }
}
::v-deep(.el-card__header) {
  padding: 5px;
}
::v-deep(.el-card__body) {
  padding: 5px;
}
</style>
