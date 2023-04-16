<template>
  <MonacoEditor
    ref="editor"
    v-model="localValue"
    mod="json"
    @update:model-value="onchange"
  />
</template>
<script setup lang="ts">
import MonacoEditor from './MonacoEditor.vue'
import { isString } from '@okiss/utils'

const props = defineProps({
  modelValue: {
    type: [String, Object, Array],
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  validateEvent: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const value = props.modelValue || ''
const isStr = isString(value)

const localValue = ref(isStr ? value : JSON.stringify(value, null, 2))

const onchange = () => {
  emit('update:modelValue', isStr ? localValue.value : JSON.parse(localValue.value as string))
}

const editor = ref()
const validate = () => {
  return editor.value.validate()
}

defineExpose({ validate })
</script>
