<template>
  <el-link
    v-if="link == ''"
    v-bind="linkProps"
  >{{ column.label }}</el-link>
  <el-link
    v-else
    v-bind="linkProps2"
  >{{ data }}</el-link>
</template>
<script lang="ts" setup>
import { merge } from 'lodash'
import { strVarReplace } from '@okiss/utils'

const props = defineProps({
  link: {
    type: String,
    default: ''
  },
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
    default: () => { }
  },
  scope: {
    type: Object,
    default: () => { }
  },
  extraData: {
    type: Object,
    default: () => { }
  }
})

onBeforeMount(() => {
  console.log(props)
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

const linkProps2 = computed(() => {
  return merge(
    {
      type: 'primary',
      href: strVarReplace(props.link, { ...props.row, ...props.extraData }),
      target: '_blank'
    },
    props.column.props || {}
  )
})

</script>
