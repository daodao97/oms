<template>
  <span class="cell-span" :class="{ 'cell-span--mask': isMaskMode }">
    <span class="cell-span__text">{{ displayText }}</span>
    <el-icon v-if="isMaskMode && showData" class="cell-span__copy" @click="handleCopy">
      <DocumentCopy />
    </el-icon>
  </span>
</template>

<script lang="ts" setup name="CellSpan">
import { DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  data: {
    type: [String, Number, Array, Object],
    default: ''
  },
  column: {
    type: Object,
    default: () => { }
  },
  row: {
    type: Object,
    default: () => { }
  },
  render: {
    type: String,
    default: ''
  },
  scope: {
    type: Object,
    default: () => { }
  },
  // mask mode configuration
  mask: {
    type: [Boolean, Object],
    default: false
  }
})

// Get mask configuration
const maskConfig = computed(() => {
  if (typeof props.mask === 'boolean') {
    return props.mask ? { prefix: 3, suffix: 3, char: '*' } : null
  }
  if (typeof props.mask === 'object' && props.mask) {
    return {
      prefix: props.mask.prefix ?? 3,
      suffix: props.mask.suffix ?? 3,
      char: props.mask.char ?? '*'
    }
  }
  return null
})

const isMaskMode = computed(() => !!maskConfig.value)

const showData = computed(() => {
  if (!props.render) {
    return props.data
  }
  const fun = new Function('return ' + props.render)
  return fun()(props.data, props.row)
})

const displayText = computed(() => {
  const value = showData.value
  if (!maskConfig.value || !value) {
    return value
  }

  const str = String(value)
  const { prefix, suffix, char } = maskConfig.value

  // If string is too short, just mask middle
  if (str.length <= prefix + suffix) {
    if (str.length <= 2) {
      return char.repeat(str.length)
    }
    return str[0] + char.repeat(str.length - 2) + str[str.length - 1]
  }

  const maskLength = Math.min(str.length - prefix - suffix, 6)
  return str.slice(0, prefix) + char.repeat(maskLength) + str.slice(-suffix)
})

const handleCopy = async () => {
  const value = String(showData.value || '')
  if (!value) return

  try {
    await navigator.clipboard.writeText(value)
    ElMessage.success('已复制')
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('已复制')
  }
}
</script>

<style lang="scss" scoped>
.cell-span {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &--mask {
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  }

  &__copy {
    cursor: pointer;
    color: var(--el-color-primary, #409eff);
    opacity: 0.6;
    transition: opacity 0.2s ease;
    font-size: 14px;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
