<template>
  <el-radio-group
    v-model="localValue"
    :disabled="disabled"
    @change="onchange"
  >
    <el-radio
      v-for="(item, index) in options"
      :key="index + '-radio'"
      :label="item.value"
      :disabled="!!item.disabled"
    >{{ item.label }}
    </el-radio>
  </el-radio-group>
</template>
<script lang="ts" setup>

const props = defineProps({
  modelValue: {
    type: [Number, String, Boolean],
    required: true,
    default: 0
  },
  options: {
    type: Array,
    default: () => {
      return []
    }
  },
  disabled: {
    type: Boolean,
    default: false
  }}
)

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

const onchange = () => {
  emit('update:modelValue', localValue.value)
}
</script>
