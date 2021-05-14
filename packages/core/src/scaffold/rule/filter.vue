<template>
  <el-space>
    <el-tag v-if="!isSub">如果</el-tag>
    <!--  最小单元  -->
    <div ref="navRef" class="box"><span class="logic">{{ relLogic }}</span></div>
    <div ref="filterRef">
      <el-space v-for="(each, index) in localValue" :key="index+'-each'" direction="vertical" alignment="left" class="rule-item">
        <el-space>
          <template v-if="!isArray(each[0])">
            <!--   条件项   -->
            <el-select v-model="each[0]" class="rule-item-filter">
              <el-option
                v-for="item in filterNames"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!--   操作符   -->
            <el-select v-model="each[1]" class="rule-item-optrator">
              <el-option
                v-for="item in operators"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!--   比对值   -->
            <el-input v-model="each[2]" />
            <el-button type="primary" icon="el-icon-plus" circle />
            <el-button type="danger" icon="el-icon-minus" circle />
          </template>
          <template v-else>
            <div>
              <!--   递归  -->
              <Filter :model-value="each" :filters="$props.filters" :is-sub="true" />
            </div>
          </template>
        </el-space>
      </el-space>
    </div>
  </el-space>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { SetupContext } from '@vue/runtime-core'
interface Option {
  value: any,
  label: string
}
import { isArray } from '../../utils/type'

export default {
  name: 'Filter',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    filters: {
      type: Array,
      default: () => []
    },
    operators: {
      type: Array,
      default: () => [{ value: '=', lable: '=' }]
    },
    logic: {
      type: String,
      default: 'and'
    },
    isSub: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }: SetupContext) {
    const filterNames : Option[] = []
    props.filters.forEach(item => {
      filterNames.push({
        label: item.label,
        value: item.field
      })
    })

    const localValue = ref(props.modelValue)
    const relLogic = localValue.value['__logic'] || 'and'
    delete localValue.value['__logic']
    const filterRef = ref(null)
    const navRef = ref(null)
    onMounted(() => {
      console.log(filterRef.value.clientHeight)
      navRef.value.style.height = filterRef.value.clientHeight + 'px'
      navRef.value.style.lineHeight = filterRef.value.clientHeight + 'px'
      console.log(navRef.value)
    })

    return {
      filterNames,
      localValue,
      isArray,
      filterRef,
      navRef,
      relLogic
    }
  }
}
</script>

<style scoped>
.rule-item {
  display: flex;
}
.dliver {
  font-size: 12px;
  color: #606266;
  margin-left: 5px;
  padding-left: 5px;
  border-left: 1px solid black;
}
.box {
  border-right: 1px solid hotpink;
  display: block;
  height: initial;
  position:relative;
}
.logic {
  /*position:absolute;*/
}
</style>
