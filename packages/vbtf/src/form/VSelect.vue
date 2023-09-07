<template>
  <span v-if="disabled">
    <template v-if="isArray(localValue)">
      <el-tag
        v-for="(item,index) in localValue"
        :key="index"
        class="select-view"
      >{{ viewLabel(item) }}</el-tag>
    </template>
    <el-tag
      v-else
      class="select-view"
    >{{ viewLabel(localValue) }}</el-tag>
  </span>
  <el-select
    v-else
    ref="select"
    v-model="localValue"
    :placeholder="placeholder"
    :loading="loading"
    :multiple="multiple"
    :filterable="localFilterable"
    :multiple-limit="multipleLimit"
    :allow-create="allowCreate"
    :remote="remote"
    :remote-method="(kw) => kw && search(kw)"
    :style=" fullWidth ? 'width:100%' : '' "
    @change="onchange"
  >
    <el-option
      v-for="item in filteredOptions"
      :key="item[valueKey]"
      :label="getLabel(item)"
      :value="item[valueKey]"
    >
      <el-tooltip
        v-if="item.previewHtml"
        raw-content
        effect="light"
        :content="item.previewHtml"
        placement="right"
      >
        <span style="display:inline-block; width:100%">{{ getLabel(item) }}</span>
      </el-tooltip>
      <span v-else>{{ getLabel(item) }}</span>
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { isArray, isFunc, strVarReplace, ruleCompute } from '@okiss/utils'
import { debounce, find } from 'lodash'
type P = Promise<Array<Record<string, any>>>

export default defineComponent({
  name: 'VSelect',
  inject: ['formData', 'rootData'],
  props: {
    options: {
      type: [Array, Function, Object],
      default: () => {
        return []
      }
    },
    modelValue: {
      type: [Array, String, Number],
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    selectApi: {
      type: [String, Function],
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    multipleLimit: {
      type: Number,
      default: 0
    },
    allowCreate: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    tpl: {
      type: String,
      default: ''
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    effectData: {
      type: [Object, String],
      default: () => {}
    },
    immediate: {
      type: Boolean,
      default: false
    },
    watch: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  data() {
    this.$props.watch && this.$watch(
      `formData.${this.$props.watch}`,
      this.onWatch,
      {
        deep: true,
        immediate: true
      }
    )

    return {
      loading: false,
      localValue: this.$props.modelValue,
      localOptions: []
    }
  },
  computed: {
    filteredOptions() {
      return this.localOptions?.filter((item: any) => {
        if (item.when === undefined) {
          return true
        }
        return ruleCompute(this.formData, item.when)
      })
    },
    remote(): boolean {
      return !!this.$props.selectApi
    },
    localFilterable(): boolean {
      if (this.$props.selectApi) {
        return true
      }
      return this.$props.filterable
    },
    getEffectData() {
      if (Object.keys(this.effectData || {}).length === 0) {
        return {}
      }
      const opt : Record<string, any> = find<Record<string, any>>(this.localOptions, (item: Record<string, any>) => {
        return item[this.valueKey] === this.localValue
      })

      if (!opt) {
        return {}
      }

      if (this.effectData === '*') {
        return opt
      }

      const tmp : Record<string, any> = {}
      Object.keys(this.effectData).forEach(key => {
        if (opt[key] !== undefined) {
          tmp[key] = opt[key]
        }
      })
      return tmp
    }
  },
  beforeMount() {
    if (this.$props.modelValue && this.$props.selectApi) {
      this.search(this.$props.modelValue)
    }
    if (this.$props.immediate && this.$props.selectApi) {
      this.search(this.$props.modelValue)
    }
    if (isArray(this.$props.options)) {
      this.localOptions = this.$props.options as []
    } else if (isFunc(this.$props.options)) {
      const f = this.$props.options as Function
      const res = f()
      if ((res as Record<string, any>).then !== undefined) {
        res.then((data: Array<Record<string, any>>) => {
          this.localOptions = data as []
        })
      } else {
        this.localOptions = res
      }
    } else if ((this.$props.options as Record<string, any>).then !== undefined) {
      const f = this.$props.options as P
      f.then(res => {
        this.localOptions = res as []
      })
    }
  },
  methods: {
    onWatch() {
      if (this.$props.immediate && this.$props.selectApi) {
        this.search(this.$props.modelValue)
      }
    },
    onchange() {
      this.$emit('update:modelValue', this.localValue, this.getEffectData)
    },
    search(kw: any) {
      const api : string = isFunc(this.$props.selectApi) ? (this.$props.selectApi as Function)(kw, this.formData) : this.$props.selectApi
      const url = strVarReplace(api, { ...this.formData, '$': (this.rootData as Function)() })
      this.loading = true
      if (isArray(kw)) {
        kw = kw.join(',')
      }
      debounce(() => {
        this.$http.request({ method: 'GET', url: url, params: { kw }})
          .then(({ data }) => {
            if (!data) {
              return
            }
            this.loading = false
            const list = data.list || data
            if (isArray(list)) {
              this.localOptions = list
              if (data.length > 2000) {
                this.$message.warning('搜索结果的条目过多, 可能会造成页面卡顿, 请优化')
              }
            }
          })
      }, 200)()
    },
    getLabel(item: any) {
      if (this.tpl === '') {
        return item[this.labelKey]
      }
      return strVarReplace(this.tpl, item)
    },
    viewLabel(val: any) {
      let label = val
      this.localOptions?.forEach(item => {
        // @ts-ignore
        if (item[this.valueKey] === val) {
          label = this.getLabel(item)
        }
      })
      return label
    },
    isArray(v: any) {
      return isArray(v)
    }
  }
})
</script>

<style lang="scss">
.select-view {
  margin-right: 10px;
  :last-child {
    margin-right: 0;
  }
}
</style>
