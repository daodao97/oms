<template>
  <el-alert
    v-if="errMsg"
    type="error"
    style="margin: 20px 40px"
  > {{ errMsg }}</el-alert>
  <el-form
    v-if="formItemsSection.length > 0"
    ref="formData"
    :key="key"
    v-loading="loading"
    class="v-form"
    :model="formData"
    :rules="formRules"
    :label-width="formOptions.labelWidth"
    :inline="formOptions.inline"
    :label-position="formOptions.labelPosition"
    :validate-on-rule-change="false"
    @keyup.enter="onenter"
  >
    <el-row>
      <template
        v-for="(item, index) in formItemsSection"
        :key="'item-' + index"
      >
        <!--   card     -->
        <component
          :is="formOptions.inline ? 'span' : ((index === 0 && formItemsSection.length === 1) ? 'span' : 'el-card')"
          :class="formOptions.inline ? 'form-section-inline' : 'form-section'"
          shadow="never"
        >
          <template
            v-if="item.name"
            #header
          >
            <span>{{ item.name }}</span>
          </template>
          <template
            v-for="(section, num) in item.children"
            :key="'section-' + index + '-' + num"
          >
            <!--    row     -->
            <component :is="formOptions.inline ? 'span' : (section.isRow ? 'el-row' : 'span')">
              <template
                v-for="(each, i) in section.items"
                :key="'each-' + i"
              >
                <!--   col    -->
                <component
                  :is="formOptions.inline ? 'span' : 'el-col'"
                  :span="each.col.span"
                >
                  <form-item
                    v-show="each.type !== 'hidden' && each.show"
                    :key="each.id"
                    :ref="each.field"
                    v-model="formData[each.field]"
                    devtool="{devId: `${prefixPath}${each.index}`, dev: dev}"
                    :form-options="formOptions"
                    :components="components"
                    :item="each"
                    :show-label="!!formOptions.labelWidth"
                    :mod="props.mod"
                    @update:model-value="(val, extra) => onFiledChange(each.field, val, extra)"
                  />
                </component>
              </template>
            </component>
          </template>
        </component>
      </template>
      <template v-if="formOptions.inline === true">
        <form-action
          :submiting="submiting"
          :form-options="formOptions"
          :submit-confirm="submitConfirm"
          @submit="submitForm('formData')"
          @cancel="resetForm('formData')"
        />
      </template>
      <template v-else>
        <el-col :span="24">
          <form-action
            :submiting="submiting"
            :form-options="formOptions"
            :submit-confirm="submitConfirm"
            @submit="submitForm('formData')"
            @cancel="resetForm('formData')"
          />
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script lang="ts">
// @ts-nocheck
// todo ts
import { componentMap, makeFormOptions, getComponentValue } from './util'
import {
  ruleCompute,
  showEleByClassName,
  uuidv4,
  diffKey,
  isArray,
  isFunc,
  isString,
  type,
  parseBool,
  getObjectNodeByKeyTree,
  isAsyncFunc,
  queryParams
} from '@okiss/utils'
// import cache from '../../utils/cache'
import FormAction from './FormAction.vue'
import FormItem from './FormItem.vue'
import transRule from './rule'
import { cloneDeep, merge, sum, findIndex } from 'lodash'
import { PropType, defineComponent } from 'vue'
import { confirmType } from './types'
import { ElCard } from 'element-plus'

export default defineComponent({
  name: 'VForm',
  components: { FormAction, FormItem, ElCard },
  provide() {
    return {
      formData: this.formData,
      rootData: this.$props.rootData,
      dev: this.dev,
      mod: this.mod
    }
  },
  inheritAttrs: false,
  props: {
    prefixPath: {
      type: String,
      default: ''
    },
    isSub: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Object,
      default: _ => {
      }
    },
    formItems: {
      type: [Array, Function],
      default: () => {
        return []
      }
    },
    infoApi: {
      type: String,
      default: ''
    },
    getApi: {
      type: String,
      default: ''
    },
    saveApi: {
      type: [String, Boolean],
      default: ''
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    afterSubmit: {
      type: [String, Function],
      default: ''
    },
    afterReset: {
      type: [String, Function],
      default: ''
    },
    components: {
      type: Object,
      default: () => {
        return {}
      }
    },
    rootData: {
      type: Function,
      default: () => {
        return {}
      }
    },
    dev: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    enableCache: {
      type: Boolean,
      default: false
    },
    initQueryParams: {
      type: Boolean,
      default: true
    },
    mod: {
      type: String,
      default: '' // create or edit, create 是 readonly=true 不起作用
    },
    submitPreCheck: {
      type: Function,
      default: () => ''
    },
    submitConfirm: {
      type: [Boolean, Object] as PropType<confirmType>,
      default: false
    }
  },
  emits: ['submit', 'reset', 'fieldchange', 'update:modelValue', 'mounted', 'devAction'],
  data() {
    return {
      key: 0,
      loading: false,
      submiting: false,
      errMsg: '',
      props: cloneDeep(this.$props),
      formData: Object.assign({}, this.$props.modelValue), // 表单数据
      cacheFormData: Object.assign({}, this.$props.modelValue),
      tmpFormData: Object.assign({}, this.$props.modelValue), // canShow 计算是为避免频繁改动 formData 导致渲染的临时变量
      fieldMap: {}, // field -> item map
      computeRules: [], // 动态计算规则
      formItemsSource: [], // 原始数据
      cacheItems: [],
      formOptions: {},
      dependMap: {
        fieldDependFields: {},
        dependFieldSourceFields: {}
      }
    }
  },
  computed: {
    formRules() {
      const formRules = {}
      let formItems = this.$props.formItems
      if (isFunc(this.$props.formItems)) {
        formItems = this.$props.formItems(this.formData)
      }
      formItems.forEach(item => {
        if (item.rules !== undefined && this.canShow(item)) {
          formRules[item.field] = transRule(item.rules, this.formData, () => this.$refs['formData'])
        }
      })
      return formRules
    },
    formItemsSection() {
      const sectionIndex = []
      const source = this.formItemsSource.map(function(val, index) {
        if (val.index === undefined) {
          val.index = `[${index}]`
        }
        if (val.type === 'sub-form' && val.props && val.props['form-items']) {
          val.props['form-items'] = val.props['form-items'].map((item, i) => {
            if (item.index === undefined) {
              item.index = `[${index}].props.form-items[${i}]`
            }
            return item
          })
        }
        return val
      })
      source.forEach((item, index) => {
        if (index === 0 || item.section !== undefined) {
          sectionIndex.push(index)
        }
      })
      const sections = []
      for (let i = 0, j = 1; sectionIndex[i] !== undefined; i++, j++) {
        sections.push(source.slice(sectionIndex[i], sectionIndex[j] || source.length))
      }
      return sections.map(each => {
        const children = this.layoutItem(each)
        return {
          name: children[0].items[0].section,
          children
        }
      })
    }
  },
  watch: {
    props: {
      handler() {
        const { formItems, options } = this.props
        const initData = this.init(cloneDeep(isFunc(formItems) ? formItems(this.$props.modelValue) : formItems))
        Object.keys(initData).forEach((key) => {
          if (key === 'formData') {
            this[key] = merge(this.formData, initData[key])
            this['cacheFormData'] = cloneDeep(this.formData)
          } else {
            this[key] = initData[key]
          }
        })
        this.formOptions = makeFormOptions(options || this.$props.options)
        setTimeout(this.computedInit, 50) // fixme 是否有更好的方式?
      },
      immediate: true
    }
  },
  mounted() {
    this.$watch(
      () => this.rootData(),
      () => {
        this.formItemsSource.forEach(item => {
          if (item.depend?.field?.indexOf('.') !== 0) {
            return
          }
          const show = this.canShow(item)
          if (item.show !== show) {
            item.show = this.canShow(item)
            item.id = uuidv4()
          }
        })
      },
      {
        deep: true,
        immediate: true
      }
    )
    if (this.$props.infoApi) {
      this.loading = true
      this.$http.request({ method: 'GET', url: this.$props.infoApi }).then(({ data }) => {
        if (this.$props.infoApi !== '') {
          delete data['infoApi']
        }
        if (this.$props.saveApi !== '') {
          delete data['saveApi']
        }
        this.props = merge({}, this.$props, data)
        this.loading = false
        this.key++
        this.$emit('mounted', this.$refs.formData)
      })
    } else {
      this.$emit('mounted', this.$refs.formData)
    }

    if (!this.$props.dev && this.$props.getApi) {
      this.$http.request({ method: 'GET', url: this.$props.getApi }).then(({ data }) => {
        const diff = diffKey(data, this.formData)
        this.formData = Object.assign(this.formData, data)
        diff.forEach(field => {
          this.canShowPop(field, this.dependMap.dependFieldSourceFields[field] || [])
        })
        this.key++
      })
    }
  },
  methods: {
    async onenter() {
      if (this.$props.options?.inline) {
        await this.submitForm()
      }
    },
    layoutItem(section) {
      const items = []
      const cell = {
        isCard: false,
        isRow: true,
        items: []
      }
      section.forEach((item, index) => {
        item.col = item.col || { span: 24 }
        if (item.col.span === 24) {
          items.push(Object.assign({}, cell, { items: [item] }))
        } else {
          if (items.length > 0) {
            const sumRes = sum(items[items.length - 1].items.map(each => each.col.span))
            if (sumRes < 24 && sumRes + item.col.span <= 24) {
              items[items.length - 1].items.push(item)
            } else {
              items.push(Object.assign({}, cell, { items: [item] }))
            }
          } else {
            items.push(Object.assign({}, cell, { items: [item] }))
          }
        }
      })
      return items
    },
    defaultValue(formItems) {
      const tmp = {}
      formItems.forEach(item => {
        if (item.value !== undefined) {
          tmp[item.field] = item.value
        }
        if (item.type === 'sub-form') {
          const subDefault = this.defaultValue(item?.props?.formItems || [])
          tmp[item.field] = item?.props?.repeat === true ? [subDefault] : subDefault
        }
      })
      return tmp
    },
    getQueryParams() {
      return queryParams(location.href)
    },
    getQueryObject(formItems) {
      const query: Record<string, any> = this.initQueryParams ? this.getQueryParams() : {}
      Object.keys(query).forEach(key => {
        if (key.indexOf('[]') > -1) {
          query[key.replace('[]', '')] = query[key]
          delete query[key]
        }
      })

      const formData = {}
      formItems.forEach((item) => {
        if (query[item.field] !== undefined) {
          formData[item.field] = this.parseType(item, query[item.field])
        }
      })

      return formData
    },
    getFormData(formItems) {
      const source = {
        'query': this.getQueryObject(formItems),
        'default': this.defaultValue(formItems),
        'model': this.$props.modelValue
      }
      const priority = ['model', 'query', 'default']
      const _source = []
      priority.reverse().forEach(key => {
        _source.push(source[key])
      })
      const data = merge(_source[0], _source[1], _source[2])
      formItems.forEach((item) => {
        if (data[item.field] !== undefined) {
          data[item.field] = this.parseType(item, data[item.field])
        }
      })
      return data
    },
    init(formItems) {
      const formData = this.getFormData(formItems)
      const fieldMap = {}
      const computeRules = {}
      formItems.forEach((item) => {
        if (formData[item.field] === undefined) {
          formData[item.field] = getComponentValue(item)
        }
        fieldMap[item.field] = item
        if (item.computed !== undefined) {
          computeRules[item.field] = item.computed
        }
        item.props = this.getComponentProps(item)
        if (this.formOptions.column !== undefined) {
          item.col = { span: 24 / this.formOptions.column }
        }
        if (this.$props.disabled) {
          item.props.disabled = true
        }
        if (item.depend) {
          const depend = isArray(item.depend) ? item.depend : [item.depend]
          depend.forEach(each => {
            this.dependMap.fieldDependFields[item.field] = this.dependMap.fieldDependFields[item.field] || []
            this.dependMap.fieldDependFields[item.field].push(each.field)

            this.dependMap.dependFieldSourceFields[each.field] = this.dependMap.dependFieldSourceFields[each.field] || []
            this.dependMap.dependFieldSourceFields[each.field].push(item.field)
          })
        }
      })

      // const data = cache.get('form_cache:' + this.$route.fullPath)
      const data = null
      this.formData = formData

      formItems.forEach(item => {
        item.show = this.canShow(item)
      })

      return {
        initData: cloneDeep(merge(formData, data)),
        fieldMap,
        computeRules,
        formItemsSource: formItems,
        cacheItems: cloneDeep(formItems)
      }
    },
    parseType(item, value) {
      const val = value || item.value
      const currentValType = type(val)
      let targetValType = item.valueType

      if (item.options && item.options[item.options.length - 1] !== undefined) {
        targetValType = type(item.options[item.options.length - 1]?.value)
      }

      if (item.type === 'switch') {
        targetValType = 'boolean'
      }
      switch (targetValType) {
        case 'number':
          if (currentValType === 'array') {
            return value.map(each => {
              if ((each + '').indexOf('.') > -1) {
                return parseFloat(each)
              }
              return parseInt(each)
            })
          }
          if ((val + '').indexOf('.') > -1) {
            return parseFloat(val)
          }
          return parseInt(val)
        case 'string':
          return val + ''
        case 'boolean':
          return parseBool(val)
        default:
          return val
      }
    },
    async validate() {
      try {
        const err = this.$props.submitPreCheck(this.formData)
        if (err) {
          this.errMsg = err
          return false
        }
        if (!(await this.$refs['formData'].validate())) {
          return false
        }
        for (let i = 0; i < this.formItemsSource.length; i++) {
          const item = this.formItemsSource[i]
          const validate = this.$refs[item.field] ? this.$refs[item.field][0]?.$refs?.ctrl?.validate : undefined
          if (!item.show || !validate) {
            continue
          }
          if (isAsyncFunc(validate) && !(await validate())) {
            return false
          }
          if (isFunc(validate) && !validate()) {
            return false
          }
        }
        return true
      } catch (e) {
        console.error(e)
        return false
      }
    },
    async submitForm(formName) {
      const flag = await this.validate()
      if (!flag) {
        showEleByClassName('is-error')
        console.warn('form validate result : false')
        return false
      }
      if (!this.$props.saveApi) {
        this.$emit('submit', this.formData)
        return
      }
      this.submiting = true
      const tmp = { ...this.formData }
      try {
        const response = await this.$http.request({ method: 'POST', url: this.$props.saveApi, data: tmp })
        console.log('response', response)
        let message = response.message
        if (message === '0') {
          message = undefined
        }
        this.$message({ type: 'success', message: message || '保存成功' })
        this.submiting = false
        setTimeout(_ => this.execAfter('afterSubmit'), 1000)
        console.log(111, response, message)
        this.$emit('submit', this.formData, response)
      } catch (e) {
        console.log('submit err', e)
        this.submiting = false
      }
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields()
      this.formData = cloneDeep(this.initData)
      this.$emit('update:modelValue', cloneDeep(this.initData))
      this.$emit('reset')
      setTimeout(_ => this.execAfter('afterReset'), 1000)
    },
    getComponentName(name) {
      return componentMap[name] || name
    },
    getComponentProps(item) {
      const props = item.props || {}
      if (item.options) {
        props.options = item.options
      }
      // Object.keys(props).forEach((item) => {
      //   const tmp = props[item]
      //   delete props[item]
      //   props[camelToSnake(item, '-')] = tmp
      // })
      return props
    },
    canShow(item) {
      let show = true
      const depend = item.depend
      if (depend) {
        const _depend = isArray(depend) ? depend : [depend]
        _depend.forEach(each => {
          let data = this.formData
          if (each.field.indexOf('.') !== -1) {
            data = this.rootData()
          }
          const key = each.field.replace(/^\.+/, '')
          const nowValue = getObjectNodeByKeyTree(key, data)

          let check = (dependVale, nowValue) => dependVale === nowValue
          if (isArray(each.value)) {
            if (isArray(nowValue)) {
              check = (dependVale, nowValue) => {
                const tmp = dependVale.filter(function(v) { return nowValue.indexOf(v) > -1 })
                return tmp.length > 0
              }
            } else {
              check = (dependVale, nowValue) => dependVale.indexOf(nowValue) > -1
            }
          }
          if (!check(each.value, nowValue)) {
            show = false
          }
        })
      }
      if (item.hide) {
        // todo
      }
      return show
    },
    // c -> b -> a
    // 串联依赖时的显示问题
    canShowPop(field, arr) {
      arr.forEach(item => {
        const i = this.formItemsSource.findIndex(e => e.field === item)
        const show = this.canShow(this.formItemsSource[i])
        this.formItemsSource[i].show = show
        this.formItemsSource[i].id = uuidv4()
        if (!show) {
          this.formData[item] = this.initData[item];

          (this.dependMap.dependFieldSourceFields[item] || []).forEach(line => {
            this.canShowPop(line, this.dependMap.dependFieldSourceFields[item] || [])
          })
        }
      })
    },
    onFiledChange(field, value, extra) {
      this.formData[field] = value
      if (extra) {
        let needupdate = false
        Object.keys(extra).forEach(key => {
          if (key !== field && this.formData[key] !== extra[key]) {
            this.formData[key] = extra[key]
            needupdate = true
          }
        })
        if (needupdate) {
          this.key++
        }
      }

      this.canShowPop(field, this.dependMap.dependFieldSourceFields[field] || [])

      var iTime
      clearTimeout(iTime)
      iTime = setTimeout(() => {
        this.computedWhen(field, value)
      }, 300)
      this.$emit('fieldchange', { field, value })
      const data = toRaw(this.formData)
      delete data.__test__
      this.$emit('update:modelValue', data)

      // cache.set('form_cache:' + this.$route.fullPath, this.formData, 86400)
    },
    computedInit() {
      Object.keys(this.formData).forEach(field => {
        this.computedWhen(field, this.formData[field])
      })
    },
    execComputeRule(field, value, when, set, m = false) {
      let _when = []
      if (!isArray(when)) {
        _when = [field, '=', when]
      } else {
        if (!isArray(when[0])) {
          _when = [field, ...when]
        }
      }
      const obj = {}
      obj[field] = value
      Object.keys(set || []).forEach((field) => {
        const index = findIndex(this.formItemsSource, { field: field })
        console.log(obj, _when)
        if (ruleCompute(obj, _when)) {
          this.formItemsSource[index] = merge(
            this.formItemsSource[index],
            set[field],
            { id: uuidv4() }
          )
          if (set[field].value !== undefined) {
            this.formData[field] = set[field].value
            this.key++
          }
        } else if (!m) {
          const cacheIndex = findIndex(this.cacheItems, { field: field })
          this.formItemsSource[index] = cloneDeep(
            this.cacheItems[cacheIndex],
            { id: (this.formItemsSource[index] || 0) + 1 }
          )
          const resetVal = this.cacheFormData[field] || this.cacheItems[cacheIndex].value
          if (set[field].value !== undefined && resetVal) {
            this.formData[field] = resetVal
            this.key++
          }
        }
      })
    },
    computedWhen(field, value) {
      const rule = this.computeRules[field]
      if (rule === undefined) {
        return
      }
      if (isArray(rule)) {
        rule.forEach(item => {
          this.execComputeRule(field, value, item.when, item.set || [], true)
        })
        return
      }
      this.execComputeRule(field, value, rule.when, rule.set || [])
    },
    execAfter(type) {
      const action = this.props[type]
      if (action === undefined) {
        return
      }
      if (isString(action)) {
        switch (this.props[type]) {
          case 'goback':
            if (this.$route && this.$route.preHash) {
              this.$router.push(this.$route.preHash)
            } else {
              history.state.back && history.back()
            }
            break
          case 'reload':
            location.reload()
            break
        }
      }
      if (isFunc(action)) {
        action()
      }
    },
    onDevAction(btnType, path) {
      this.$emit('devAction', btnType, path)
    }
  }
})
</script>
<style lang="scss">
.el-form-item .el-form-item {
  margin-bottom: 15px !important;
}
</style>
<style lang="scss" scoped>
.form-section {
  margin-bottom: 15px;
  width: 100%;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.form-section-inline {
  margin-bottom: 0;
}

.dev-box:hover {
  position: relative;
  border: 1px dashed var(--el-color-primary);

  .dev-actions {
    //position: relative;
    right: 2px;
    bottom: 40px;
    height: 20px;
    float: right;
    display: flex;

    .dev-action {
      padding: 2px;
      margin-right: 5px;
    }

    .dev-action-edit {
      background: #99a9bf;
    }

    .dev-action-del {
      background: red;
    }
  }

  .dev-actions-relative {
    position: relative;
  }
}

.dev-actions {
  display: none;
}

.dev-box-inline {
  display: inline-block;
}

.dev-box-block {
  display: block;
}

.drag-item {
  :deep(.devtool-item-wrapper) {
    cursor: move;
  }

  &.sortable-chosen {
    :deep(.devtool-item-wrapper) {
      display: none;
    }
  }
}
</style>
