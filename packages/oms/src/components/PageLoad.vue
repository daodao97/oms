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
      v-bind="notice"
      style="margin: 0 0 20px 0"
      :dataApi = "noticeApi"
    />
    <VLoading v-if="loading" />
    <template v-else>
      <slot v-bind="schema" />
    </template>
  </template>

</template>
<script lang="ts">
import VLoading from './VLoading.vue'
import { isObject, isString, isArray } from '@okiss/utils'
import store from '../store'
import VNotice from './notice/VNotice.vue'

export default defineComponent({
  components: { VLoading, VNotice },
  props: {
    schemaHandler: {
      type: Function,
      default: function(val: any, project: string) { return val }
    },
    schemaApi: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: true,
      haveNotice: false,
      notice: {},
      noticeApi: "",
      schema: {},
      owners: [],
      serviceOffLine: false
    }
  },
  computed: {
    env() {
      return this.$store.state.user.env
    },
    setting() {
      return this.$store.state.settings
    }
  },
  beforeCreate() {
    const token = this.$route.path.split('/').filter(item => item)
    const project = token.length > 1 ? token.slice(0, token.length - 1).join('/') : token[0]
    const api = '/schema' + this.$route.meta.path
    // const conf = { cacheTime: 10 * 60 * 1000, params: this.$route.params }
    const conf = { params: this.$route.params }
    this.$http.get(this.$props.schemaApi || api, conf).then(({ data }) => {
      this.loading = false
      if (isObject(data)) {
        if (data.notice !== undefined) {
          this.haveNotice = true
          if (isString(data.notice)) {
            this.notice = {
              title: data.notice
            }
          } else if (isObject(data.notice)) {
            this.notice = data.notice
            this.noticeApi = data.notice.noticeApi
          }
          delete data['notice']
        }
        this.owners = data.ownerNames || []
        this.serviceOffLine = data.serviceOffLine || false

      }
      this.schema = this.$props.schemaHandler(data, project)
      store.commit('app/SET_PAGE_JSON_SCHEMA', { page: this.$route.path, json: this.schema })
    })
  }
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
