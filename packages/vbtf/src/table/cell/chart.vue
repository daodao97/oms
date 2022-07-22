<template>
  <VButton
    v-if="props.data.length > 0"
    type="modal"
    text="查看"
  >
    <el-row>
      <el-col>
        <VChart
          :options="o"
        />
      </el-col>
    </el-row>

  </VButton>
</template>
<script lang="ts" setup>
import VButton from '../../button/VButton.vue'
import VChart from '../../vchart/index.vue'
import { cloneDeep, merge } from 'lodash'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  column: {
    type: Object,
    default: () => {}
  },
  scope: {
    type: Object,
    default: () => {}
  },
  options: {
    type: Object,
    default: () => {}
  },
  noDataText: {
    type: String,
    default: '暂无数据'
  },
  row: {
    type: Object,
    default: () => {}
  }
})

const base = {
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '2%',
    right: '2%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  }
}

const o = computed(() => {
  const opt = cloneDeep(merge({ series: [] }, props.options, base))
  props.data?.forEach((item) => {
    opt.xAxis.data.push(item[0])
    item.forEach((item, index) => {
      if (index > 0) {
        opt.series[index - 1].data = opt.series[index - 1].data || []
        opt.series[index - 1].data.push(item)
      }
    })
  })
  return opt
})
</script>

<style lang="scss">
.item {
  margin: 10px 0;
}
</style>
