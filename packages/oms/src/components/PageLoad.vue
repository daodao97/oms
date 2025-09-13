<template>
  <el-alert
    v-if="owners.length > 0"
    :title="`该页面功能对应开发: [ ${owners.join(', ')} ] 有问题可直接企微反馈`"
    type="info"
    style="margin: 0 0 20px 0"
    :closable="false"
  />
  <template v-if="env === 'prod' && serviceOffLine">
    <div
      class="offline-notice"
      v-html="serviceOffLine === true ? setting.serviceOffLineNotice : serviceOffLine"
    />
  </template>
  <template v-else>
    <VNotice
      v-if="haveNotice"
      :notice="notice"
      style="margin: 0 0 20px 0"
      :data-api="noticeApi"
    />
    <VLoading v-if="loading" />
    <template v-else>
      <slot v-bind="schema" />
    </template>
  </template>

</template>
<script lang="ts" setup>
import VLoading from './VLoading.vue'
import { isObject, isString, isArray } from '@okiss/utils'
import VNotice from './notice/VNotice.vue'
import { useAppStore, useSettingsStore, useUserStore } from '../store'
import { useRoute } from 'vue-router'

const props = withDefaults(defineProps<{ schemaHandler?: (val: any, project: string) => any, schemaApi?: string }>(), {
  schemaHandler: (val: any) => val,
  schemaApi: ''
})
const appStore = useAppStore(); const settingsStore = useSettingsStore(); const userStore = useUserStore()
const route = useRoute()
const loading = ref(true)
const haveNotice = ref(false)
const notice = ref<any>({})
const noticeApi = ref('')
const schema = ref<any>({})
const owners = ref<string[]>([])
const serviceOffLine = ref<boolean | string>(false)

const env = computed(() => userStore.env)
const setting = computed(() => settingsStore)

onBeforeMount(() => {
  const token = route.path.split('/').filter(item => item)
  const project = token.length > 1 ? token.slice(0, token.length - 1).join('/') : token[0]
  const api = '/schema' + (route.meta as any).path
  const conf = { params: route.params }
  // @ts-ignore
  const http = window?.App?.config?.globalProperties?.$http
  http.get(props.schemaApi || api, conf).then(({ data }) => {
    loading.value = false
    if (isObject(data)) {
      if (data.notice !== undefined) {
        haveNotice.value = true
        if (isString(data.notice)) {
          notice.value = { title: data.notice }
        } else if (isObject(data.notice)) {
          notice.value = data.notice
          // @ts-ignore
          noticeApi.value = data.notice.noticeApi
        }
        delete data['notice']
      }
      owners.value = data.ownerNames || []
      serviceOffLine.value = data.serviceOffLine || false
    }
    schema.value = props.schemaHandler(data, project)
    appStore.SET_PAGE_JSON_SCHEMA({ page: route.path, json: schema.value })
  })
})
</script>

<style lang="scss" scoped>
.offline-notice {
  text-align: center;
  color: red;
  font-size: 250%;
  height: 300px;
  line-height: 300px;
}
</style>
