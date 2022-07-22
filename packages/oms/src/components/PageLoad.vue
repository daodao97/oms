<template>
  <el-alert
    v-if="owners.length > 0"
    :title="`该页面功能对应开发: [ ${owners.join(', ')} ] 有问题可直接企微反馈`"
    type="info"
    style="margin: 0 0 20px 0"
    :closable="false"
  />
  <ElAlert
    v-if="haveNotice"
    v-bind="notice"
    style="margin: 0 0 20px 0"
  />
  <VLoading v-if="loading" />
  <template v-else>
    <slot v-bind="schema" />
  </template>
</template>
<script lang="ts">
import VLoading from './VLoading.vue'
import { isObject, isString } from '@okiss/utils'
import store from '../store'

export default defineComponent({
  components: { VLoading },
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
      schema: {},
      owners: []
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
      if (data.notice !== undefined) {
        this.haveNotice = true
        if (isString(data.notice)) {
          this.notice = {
            title: data.notice
          }
        } else if (isObject(data.notice)) {
          this.notice = data.notice
        }
        delete data['notice']
      }
      this.owners = data.ownerNames || []
      this.schema = this.$props.schemaHandler(data, project)
      store.commit('app/SET_PAGE_JSON_SCHEMA', { page: this.$route.path, json: this.schema })
    })
  }
})
</script>
