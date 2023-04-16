<template>
  <el-row>
    <el-col v-if="ctrl">
      <el-button
        text
        type="primary"
        @click="selectAll"
      >全选</el-button>
      <el-button
        text
        type="primary"
        @click="unSelectAll"
      >全不选</el-button>
      <el-button
        text
        type="primary"
        @click="invertSelect"
      >反选</el-button>
    </el-col>
    <el-col>
      <el-checkbox-group
        v-model="localValue"
        :max="max"
        :min="min"
        :disabled="disabled"
        @change="onchange"
      >
        <el-checkbox
          v-for="(item, index) in localOptions"
          :key="index + '-checkbox'"
          :label="item[props.valueKey]"
        >{{ item[props.labelKey] }}
        </el-checkbox>
      </el-checkbox-group>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import { AxiosInstance } from 'axios'
import { globalProperties } from '../func'

const props = defineProps({
  options: {
    type: Array as PropType<Array<Record<string, any>>>,
    default: () => {
      return []
    }
  },
  modelValue: {
    type: [Array, undefined] as PropType<undefined | Array<any>>,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  min: {
    type: Number,
    default: undefined
  },
  max: {
    type: Number,
    default: undefined
  },
  optionsApi: {
    type: String,
    default: ''
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  ctrl: {
    type: Boolean,
    default: false
  }
})

const localValue = ref<Array<any>>(props.modelValue ?? [])
const localOptions = ref<Array<Record<string, any>>>(props.options ?? [])

const emits = defineEmits(['update:modelValue'])
const onchange = () => {
  emits('update:modelValue', localValue.value)
}

const gp = globalProperties()
const axios: AxiosInstance | undefined = (gp as Record<string, any>).$http

if (props.optionsApi !== '') {
  axios?.get(props.optionsApi).then(({ data }) => {
    localOptions.value = data || []
  })
}

const selectAll = () => {
  const all : Array<any> = []
  localOptions.value.forEach((item) => {
    all.push(item[props.valueKey])
  })
  localValue.value = all
  onchange()
}
const unSelectAll = () => {
  localValue.value = []
  onchange()
}
const invertSelect = () => {
  const all : Array<any> = []
  localOptions.value.forEach((item) => {
    all.push(item[props.valueKey])
  })

  localValue.value = all.filter(x => !(new Set(localValue.value).has(x)))
  onchange()
}
</script>
