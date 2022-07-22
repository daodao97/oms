<template>
  <el-cascader-panel
    ref="cas"
    v-model="localVal"
    :options="optionsTree"
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
import { globalProperties } from '../func'

type value = number | string

interface Cell {
  value: value,
  label: string,
  children: Array<Cell>
}

const allChildren = (options : Array<Cell>): Array<value> => {
  let vals : Array<value> = []
  options.forEach(item => {
    vals.push(item.value)
    if (item.children !== undefined) {
      vals = vals.concat(allChildren(item.children))
    }
  })
  return vals
}

const transTreeNode = (val : value, options : Array<Cell>) : Array<value> => {
  let vals : Array<value> = []
  for (let i = 0; i < options.length; i++) {
    const item = options[i]
    if (item.value === val) {
      if (item.children !== undefined) {
        vals = vals.concat(allChildren(item.children))
      } else {
        vals.push(item.value)
      }
      continue
    }
    if (item.children !== undefined) {
      vals = vals.concat(transTreeNode(val, item.children))
    }
  }
  return vals
}

const nodes = (vals : Array<value>, options : Array<Cell>) : Array<value> => {
  let tmp : Array<value> = []
  vals.forEach(val => {
    tmp = tmp.concat(transTreeNode(val, options))
  })
  return tmp
}

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
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
      default: _ => {}
    },
    size: {
      type: String,
      default: ''
    },
    optionsApi: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const { $http } = globalProperties()

    const optionsTree = ref<Array<Cell>>([])
    const localVal = ref([])
    onBeforeMount(async() => {
      if (props.optionsApi) {
        const { data } = await $http.get(props.optionsApi)
        optionsTree.value = data || []
      } else {
        optionsTree.value = props.options
      }

      if (!props.props.emitPath) {
        localVal.value = nodes(props.modelValue, optionsTree.value)
      } else {
        localVal.value = props.modelValue
      }
    })

    const onchange = (val: any) => {
      if (!props.props.emitPath) {
        const tmp : Array<value> = []
        cas.value.getCheckedNodes().forEach(item => {
          if (item.parent && item.parent.checked) {
            return
          }
          tmp.push(item.value)
        })
        ctx.emit('update:modelValue', tmp)
      } else {
        ctx.emit('update:modelValue', val)
      }
    }

    const cas = ref(null)

    return {
      localVal,
      onchange,
      cas,
      optionsTree
    }
  }
})
</script>
