<template>
  <!--  最小单元  -->
  <el-space class="rule-item-sets" direction="vertical" alignment="left">
    <el-space v-for="(item, i) in setNames" :key="i+'-set'">
      <el-tag v-if="i === 0" class="rule-item-prefxi">那么</el-tag>
      <span v-else class="rule-item-prefxi">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <el-space>
        <!--   设置项  -->
        <el-tag>{{ item.label }}</el-tag>
        <el-tag>=</el-tag>
        <!--   设置值   -->
        <el-input />
      </el-space>
    </el-space>
  </el-space>
</template>

<script lang="ts">
import { ref } from 'vue'
import { SetupContext } from '@vue/runtime-core'
interface Option {
  value: any,
  label: string
}
import { isArray } from '../../utils/type'

export default {
  name: 'Rule',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    sets: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }: SetupContext) {
    const setNames : Option[] = []
    props.sets.forEach(item => {
      setNames.push({
        label: item.label,
        value: item.field
      })
    })

    const localValue = ref(props.modelValue)
    return {
      localValue,
      setNames,
      isArray
    }
  }
}
</script>
