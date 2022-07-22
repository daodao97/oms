<template>
  <el-date-picker :disabled-date="disabledDate" />
</template>
<script lang="ts" setup>
import { isArray, isFunc, runRule, strToDate } from '@okiss/utils'

type cell = string | Array<string>

const props = defineProps({
  disabledDate: {
    type: [Function, Array],
    default: () => {
      return (d: Date) => false
    }
  }
})

const disabledDate = (date :Date) => {
  if (isFunc(props.disabledDate)) {
    return (props.disabledDate as Function)(date)
  }
  const disable = props.disabledDate as Array<cell>
  if (isArray(disable[0])) {
    for (let i = 0; i < disable.length; i++) {
      if (runRule(date, strToDate(disable[i][1]), disable[i][0])) {
        return true
      }
    }
  } else {
    const _disable = disable as Array<string>
    if (runRule(date, strToDate(_disable[1]), _disable[0])) {
      return true
    }
  }

  return false
}

</script>
