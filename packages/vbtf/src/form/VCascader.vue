<template>
  <el-cascader
    :key="key"
    v-model="localValue"
    :options="optionTree"
    :disabled="disabled"
    :clearable="clearable"
    :show-all-levels="showAllLevels"
    :collapse-tags="collapseTags"
    :filterable="filterable"
    :props="props"
    :size="size"
    @change="onchange"
  />
</template>
<script lang="ts">
import { searchTreeValues, isNumber } from '@okiss/utils'
import { cloneDeep } from 'lodash'
import { SetupContext } from 'vue'

interface Props {
  options: Array<Record<string, any>>,
  modelValue: Array<Number> | Number,
  disables: Boolean,
  clearable: Boolean,
  showAllLevels: Boolean,
  collapseTags: Boolean,
  filterable: Boolean,
  props: Record<any, any>,
  size: string,
  optionsApi: string,
  saveAs: string
}

export default defineComponent({
  name: 'VCascader',
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    modelValue: {
      type: [Array, Number],
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: true
    },
    props: {
      type: Object,
      default: _ => {
      }
    },
    size: {
      type: String,
      default: ''
    },
    optionsApi: {
      type: String,
      default: ''
    },
    saveAs: {
      type: String,
      default: 'array'
    }
  },
  emits: ['update:modelValue'],
  setup(props: Props, { emit }: SetupContext) {
    const localValue = ref(cloneDeep(isNumber(props.modelValue) ? [props.modelValue] : props.modelValue))
    const optionTree = ref(props.options)
    const key = ref(0)

    const app = getCurrentInstance()
    const http = app?.appContext.config.globalProperties.$http
    onBeforeMount(() => {
      props.optionsApi && http.request({
        method: 'GET',
        url: props.optionsApi
      }).then(({ data }: any) => {
        optionTree.value = data || []
        if (isNumber(props.modelValue)) {
          localValue.value = searchTreeValues(optionTree.value, props.modelValue, props.props.value || 'value')
        }
        key.value++
      })
    })

    const onchange = () => {
      let val = localValue

      if (isNumber(props.modelValue)) {
        val = localValue.value[localValue.value.length - 1]
      }
      if (props.saveAs === 'array') {
        val = localValue.value
      } else if (props.saveAs === 'number') {
        val = localValue.value[localValue.value.length - 1]
      }

      emit('update:modelValue', val)
    }

    return {
      localValue,
      optionTree,
      onchange,
      key
    }
  }
})
</script>
