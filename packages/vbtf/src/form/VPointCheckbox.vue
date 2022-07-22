<template>
  <el-checkbox-group
    v-model="localValue"
    :max="max"
    :min="min"
    @change="onchange"
  >
    <el-checkbox
      v-for="(item, index) in options"
      :key="index + '-checkbox'"
      :label="item.value"
    >{{ item.label }}
    </el-checkbox>
  </el-checkbox-group>
</template>
<script lang="ts">

// 52 => 110100 => [0, 1, 3]
export default defineComponent({
  name: 'VPointCheckbox',
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    modelValue: {
      type: Number,
      default: 0
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
    }
  },
  emits: ['update:modelValue'],
  data() {
    const binaryArr = (this.$props.modelValue)?.toString(2).split('')
    while (binaryArr.length < 6) {
      binaryArr.unshift('0')
    }
    const localValue: number[] = []
    binaryArr.forEach((item, index) => {
      if (item === '1') {
        localValue.push(index)
      }
    })
    return {
      localValue: localValue
    }
  },
  methods: {
    onchange() {
      const binaryArr = ['0', '0', '0', '0', '0', '0']
      this.localValue.forEach(item => {
        binaryArr[item] = '1'
      })
      this.$emit('update:modelValue', parseInt(binaryArr.join(''), 2))
    }
  }
})
</script>
