<template>
  <span v-if="loading">
    <el-icon class="is-loading"><Loading /></el-icon>
  </span>
  <span
    v-else
    v-html="show"
  />
</template>
<script lang="ts" setup>
import { strVarReplace, isArray } from '@okiss/utils'
import { Loading } from '@element-plus/icons-vue'
import { globalProperties } from '../../func'

const { $http } = globalProperties()

const props = defineProps({
  data: {
    type: [String, Number, Array, Object],
    default: ''
  },
  column: {
    type: Object,
    default: () => {}
  },
  row: {
    type: Object,
    default: () => {}
  },
  tpl: {
    type: String,
    default: ''
  },
  interval: {
    type: Number,
    default: 0
  },
  api: {
    type: Object,
    default: undefined
  },
  scope: {
    type: Object,
    default: () => {}
  },
  extraData: {
    type: Object,
    default: () => {}
  }
})

const show = ref('')
let interval : number
const loading = ref(false)
onBeforeMount(() => {
  show.value = strVarReplace(props.tpl, { ...props.row, ...props.extraData })
  if (props.api === undefined) {
    return
  }
  const extra = { url: '', method: 'GET', ...props.api, data: props.row }
  extra.url = strVarReplace(extra.url, { ...props.row, ...props.extraData })
  const fn = () => {
    loading.value = true
    $http?.request(extra).then((res: any) => {
      show.value = strVarReplace(props.tpl, { ...res.data, ...props.extraData, resp: res.data })
      loading.value = false
    }).catch((e : any) => {
      loading.value = false
    })
  }
  fn()
  if (props.interval > 0) {
    interval = setInterval(fn, props.interval)
  }
})

onBeforeUnmount(() => {
  clearInterval(interval)
})

</script>
