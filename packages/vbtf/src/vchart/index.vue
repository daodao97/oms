<template>
  <div
    ref="chartDom"
    class="chart"
    style="height:100%;width:100%;"
  />
</template>

<script lang="ts">
// @ts-nocheck
// todo ts
// import * as echarts from 'echarts'
import { debounce } from '@okiss/utils'

export default {
  name: 'VChart',
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  setup(props: { options: any }) {
    const chartDom = ref(null)
    const chart = null

    onMounted(() => {
      // chart = shallowRef(echarts.init(chartDom.value))
      // chart.value.setOption(props.options)
      // window.addEventListener('resize', resize)
      resize()
    })

    const resize = debounce(() => chart.value.resize(), 200)

    onUnmounted(() => {
      window.removeEventListener('resize', resize)
    })

    return {
      chartDom,
      chart
    }
  }
}
</script>

<style>
.chart {
  width: 100%;
  height: 100%;
  min-height: 350px;
  /*min-width: 600px;*/
}
</style>
