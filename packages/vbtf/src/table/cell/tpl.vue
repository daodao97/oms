<template>
  <span v-if="loading">
    <el-icon class="is-loading"><Loading /></el-icon>
  </span>
  <span v-else v-html="show" />
</template>
<script lang="ts" setup>
import { strVarReplace } from '@okiss/utils'
import { extractDateFormat } from 'element-plus';
import { getCurrentInstance } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { fa } from 'element-plus/es/locale';

const app = getCurrentInstance()
const root = app.appContext.config.globalProperties

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
let interval : NodeJS.Timer | undefined = undefined
const loading = ref(false)
onBeforeMount(() => {
  show.value = strVarReplace(props.tpl, props.row)
  if (props.interval === 0 || props.api === undefined) {
    return
  }
  const extra = {url: '', method: 'GET', ...props.api, data: props.row}
  extra.url = strVarReplace(extra.url, {...props.row, ...props.extraData})
  const fn = () => {
    loading.value = true
    app && root.$http.request(extra).then(res => {
      show.value = strVarReplace(props.tpl, {...res.data, ...props.extraData}) 
      loading.value = false
    })
  }
  fn()
  interval = setInterval(fn, props.interval)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})


</script>
