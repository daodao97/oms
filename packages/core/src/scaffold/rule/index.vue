<template>
  <!--  最小单元  -->
  <el-space class="rule-container">
    <Filter v-model="localFilters" :filters="$props.filters" :operators="$props.operators" />
    <Set v-model="localSets" :sets="$props.sets" />
  </el-space>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { SetupContext } from '@vue/runtime-core'
import { isArray } from '../../utils/type'
import Filter from './filter.vue'
import Set from './set.vue'

export default defineComponent({
  name: 'Rule',
  components: { Filter, Set },
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
    sets: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }: SetupContext) {
    const length = ref(props.modelValue.length)
    const localFilters = ref(props.modelValue.slice(0, length.value - 1))
    const localSets = ref(props.modelValue.slice(length.value - 1))

    return {
      localFilters,
      localSets,
      isArray
    }
  }
})
</script>

<style scoped>
.rule-container {
  display: block;
  padding: 10px;
  border: 1px dotted pink;
}
.rule-item {
  display: flex;
}
</style>
