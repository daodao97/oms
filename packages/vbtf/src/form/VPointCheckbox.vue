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

function binaryToDecimal(str: string[]): number {
  if (str.length === 0) {
    return 0
  }
  return parseInt(str.join(''), 2)
}

function decimalToBinary(num: number): string[] {
  return (num).toString(2).split('')
}

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
    const binaryArr = decimalToBinary(this.$props.modelValue).reverse()
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
      const indexs = this.$props.options.map((e: any) => e.value)
      let binaryArr = Array(Math.max(...indexs)).fill('0')
      this.localValue.forEach(item => {
        binaryArr[item] = '1'
      })
      binaryArr = binaryArr.reverse()
      console.log(12333, binaryArr.join(''), binaryToDecimal(binaryArr))
      this.$emit('update:modelValue', binaryToDecimal(binaryArr))
    }
  }
})
</script>
