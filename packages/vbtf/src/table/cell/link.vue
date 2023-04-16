<template>
  <el-link v-bind="linkProps">{{ column.label }}</el-link>
</template>
<script lang="ts" setup>
import { merge } from 'lodash'

const props = defineProps({
  data: {
    type: String,
    default: ''
  },
  column: {
    type: Object,
    default: () => {
    }
  },
  row: {
    type: Object,
    default: () => {}
  },
  scope: {
    type: Object,
    default: () => {}
  }
})

const linkProps = computed(() => {
  return merge(
    {
      type: 'primary',
      href: props.data,
      target: '_blank'
    },
    props.column.props || {}
  )
})
</script>
