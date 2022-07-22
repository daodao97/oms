<template>
  <div>
    <span
      v-if="!loading"
      :key="key"
      v-html="showTpl"
    />
    <el-button
      v-if="!auto"
      :loading="loading"
      @click="() => request({})"
    >{{ text }}</el-button>
  </div>

</template>
<script>
import { strVarReplace, isArray, ruleCompute } from '@okiss/utils'
import { debounce } from 'lodash'

export default defineComponent({
  name: 'VShow',
  inject: ['formData'],
  props: {
    tpl: {
      type: [String, Array, Object],
      default: ''
    },
    dataApi: {
      type: String,
      default: ''
    },
    watch: {
      type: String,
      default: ''
    },
    auto: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: '查询'
    },
    interval: {
      type: Number,
      default: 0
    },
    timeout: {
      type: Number,
      default: 0
    }
  },
  data() {
    if (this.auto) {
      const onwatch = debounce((newVal) => {
        this.request(newVal)
      }, 300)
      this.$watch(
        this.$props.watch ? `formData.${this.$props.watch}` : 'formData',
        onwatch,
        {
          deep: true,
          immediate: true
        }
      )
    }

    return {
      showTpl: '',
      key: 0,
      loading: false,
      instance: undefined,
      usTime: 0
    }
  },
  beforeUnmount() {
    this.instance && clearInterval(this.instance)
  },
  methods: {
    getTpl(data) {
      if (isArray(this.tpl)) {
        for (let i = 0; i < this.tpl.length; i++) {
          if (ruleCompute(this.formData, this.tpl[i].when)) {
            return this.makeTpl(this.tpl[i].tpl, data || this.formData)
          }
        }
        return ''
      }
      return this.makeTpl(this.tpl, data || this.formData)
    },
    makeTpl(tpl, data) {
      const isFunc = (str) => str.indexOf('function(') === 0
      if (!isFunc(tpl)) {
        return tpl
      }
      const fun = new Function('return ' + tpl)
      return fun()(data || this.formData)
    },
    requestApi(newVal, loadState) {
      loadState && (this.loading = true)
      try {
        this.$http({
          method: 'GET',
          url: strVarReplace(this.$props.dataApi, { ...this.formData })
        }).then(({ data }) => {
          const tmp = Object.assign({}, newVal, data)
          this.showTpl = strVarReplace(this.getTpl(tmp), tmp)

          if (this.$props.interval && data.state === 'done') {
            clearInterval(this.instance)
            this.instance = undefined
            this.usTime = 0
            this.loading = false
          }

          loadState && (this.loading = false)
        }).catch(err => {
          console.log(err)
          loadState && (this.loading = false)
          if (this.$props.interval) {
            clearInterval(this.instance)
            this.instance = undefined
            this.usTime = 0
            this.loading = false
          }
        })
      } catch (e) {
        loadState && (this.loading = false)
      }
    },
    request(newVal) {
      if (this.$props.dataApi) {
        if (this.$props.interval) {
          this.loading = true
          this.instance = setInterval(async() => {
            if (this.$props.timeout > 0 && this.usTime >= this.$props.timeout) {
              clearInterval(this.instance)
              this.instance = undefined
              this.$message.error('查询超时, 请重试')
              return
            }
            await this.requestApi(newVal)
            this.usTime += this.$props.interval
          }, this.$props.interval)
        } else {
          this.requestApi(newVal, true)
        }
      } else {
        this.showTpl = strVarReplace(this.getTpl(), newVal)
      }
      this.key++
    }
  }

})
</script>
