<template>
  <el-input-number
    v-model="localValue"
    :min="realMin"
    @update:model-value="onchange"
  />
</template>
<script lang="ts" setup>

import { isString } from '@okiss/utils'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  min: {
    type: [Number, String],
    default: -Infinity
  }
})

const realMin = computed(() => {
  if (isString(props.min)) {
    switch (props.min) {
      case 'current':
        return props.modelValue
    }
  }
  return props.min
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

const onchange = () => {
  emit('update:modelValue', localValue.value)
}
</script>
