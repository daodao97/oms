<template>
  <dev-layout>
    <template #main>
      <v-form
        v-if="builderSchema.formItems"
        ref="form"
        :key="key"
        :dev="true"
        v-bind="builderSchema"
      />
      <el-divider />
      <ElButton
        type="primary"
        @click="saveSchema"
      >保存页面配置</ElButton>
      &nbsp;&nbsp;
      <VButton
        text="PageSchema"
        type="modal"
      >
        <JsonView :data="getSaveSchema" />
      </VButton>
    </template>
    <template #right-aside>
      <el-form v-if="activeIndex">
        <el-form-item label="控件类型">
          <el-select v-model="currentCtrlType">
            <el-option
              v-for="(item,index) in types"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <v-form
        :key="ctrlKey"
        v-model="ctrlOptions"
        v-bind="ctrlSchema"
      />
    </template>
  </dev-layout>
</template>
<script>
import DevLayout from '../DevLayout.vue'
import { VForm, VBtn as VButton, JsonView } from '@okiss/vbtf'
import { compactObject } from '@okiss/utils'
import { cloneDeep, get, merge, set, unset } from 'lodash'
import { baseSchema, ctrls } from './form'
import { eventBus } from '../../../index'

export const ctrlFormDefaultOptions = {
  labelPosition: 'top',
  submitButton: false,
  cancelButton: false
}

const typs = []

Object.keys(ctrls).forEach(item => {
  typs.push({ value: item, label: ctrls[item].name })
})

const sqlSchema = {
  options: {
    submitButton: false,
    cancelButton: false
  },
  formItems: [
    {
      type: 'sub-form',
      field: 'columns',
      props: {
        repeat: true,
        formItems: [
          {
            type: 'input',
            field: 'field',
            label: '字段key'
          },
          {
            type: 'select',
            field: 'type',
            label: '类型',
            options: cloneDeep(typs)
          },
          {
            type: 'input',
            field: 'label',
            label: '字段label'
          }
        ]
      }
    }
  ]
}

export default {
  components: { DevLayout, VForm, VButton, JsonView },
  props: {
    schema: {
      type: Object,
      default: _ => {}
    }
  },
  data() {
    return {
      sqlOptions: {},
      sqlSchema: sqlSchema,
      baseSchema: baseSchema,
      activeTab: 'base',
      builderSchema: Object.assign(
        {},
        this.$props.schema,
        {
          options: {
            submitButton: false,
            cancelButton: false
          }
        }
      ),
      baseOptions: {},
      key: 0,
      ctrlKey: 0,
      activeCtrl: undefined,
      ctrlOptions: {},
      ctrlSchema: {},
      ctrlName: '',
      activeIndex: undefined,
      ctrlMap: ctrls,
      activeIndexReg: /(formItems)?\[(\d+)\]/,
      tableStruct: '',
      activeName: '1',
      currentCtrlType: 'input',
      types: cloneDeep(typs)
    }
  },
  computed: {
    getSaveSchema() {
      return {
        formItems: this.builderSchema.formItems
      }
    }
  },
  watch: {
    baseOptions: {
      deep: true,
      immediate: true,
      handler(val) {
        const tmp = cloneDeep(val)
        if (val.showSubmitButton === false) {
          tmp.submitButton = false
        }
        if (val.cancelSubmitButton === false) {
          tmp.cancelButton = false
        }
        delete tmp.showSubmitButton
        delete tmp.showCancelButton
        if (Object.keys(tmp).length > 0) {
          this.builderSchema = merge(this.builderSchema, { options: tmp })
          this.key++
        }
      }
    },
    ctrlOptions: {
      deep: true,
      // immediate: true,
      handler(val) {
        const current = get(this.builderSchema, this.activeIndex)
        if (!current) {
          return
        }
        const type = current ? current.type : ''
        const ctrl = this.ctrlMap[type]
        const transData = ctrl.trans ? ctrl.trans(val) : val
        if (transData && Object.keys(transData).length > 0) {
          transData.type = type
          // update `builderSchema` nested data
          if (this.activeIndex.indexOf('[') > -1) {
            // format like: `headers[0]`
            const [_, key, keyIndex] = this.activeIndex.match(/(\w+)\[(\d+)\]/)
            _
            this.builderSchema[key][keyIndex] = { ...transData }
          } else {
            this.builderSchema[this.activeIndex] = transData
          }
          // set(this.builderSchema, this.activeIndex, transData)
          this.key++
        }
      }
    },
    currentCtrlType: {
      handler(val) {
        const ctrl = this.ctrlMap[val]
        this.ctrlSchema = cloneDeep({
          options: cloneDeep(ctrlFormDefaultOptions),
          formItems: cloneDeep(ctrl.builder)
        })
        const sourceCtrlOptions = get(this.builderSchema, this.activeIndex)
        this.ctrlOptions = cloneDeep(sourceCtrlOptions)
        this.ctrlOptions.type = val
        this.ctrlKey++
        this.key++
      }
    }
  },
  beforeCreate() {
    eventBus.on('dev-action', ({ event, data }) => {
      this.onDevAction(data.type, data.devId)
    })
  },
  unmounted() {
    eventBus.off('dev-action')
  },
  methods: {
    onDevAction(btnType, path) {
      this.activeIndex = 'formItems' + path
      if (btnType === 'edit') {
        this.activeTab = 'ctrl'
        this.clicklabel()
      }
      if (btnType === 'del') {
        this.activeTab = 'base'
        this.removeOne()
      }
      this.ctrlKey++
    },
    push(name) {
      const target = 'formItems'
      this.ctrlOptions = {}
      this.builderSchema[target] = this.builderSchema[target] || []
      const ctrl = this.ctrlMap[name]
      this.activeCtrl = ctrl
      this.builderSchema[target].push(cloneDeep(ctrl.default))
      this.ctrlSchema = cloneDeep({
        options: cloneDeep(ctrlFormDefaultOptions),
        formItems: cloneDeep(ctrl.builder)
      })
      this.ctrlKey++
      this.key++
      this.activeIndex = `${target}[${this.builderSchema[target].length - 1}]`
      this.activeTab = 'ctrl'
    },
    removeOne() {
      unset(this.builderSchema, this.activeIndex)
      this.builderSchema = cloneDeep(compactObject(this.builderSchema))
      this.activeIndex = ''
      this.ctrlOptions = {}
      this.ctrlSchema = {}
      this.key++
      this.ctrlKey++
    },
    clicklabel() {
      const p = this.activeIndex
      const m = p.match(this.activeIndexReg)
      if (m) {
        const ctrlOptions = cloneDeep(get(this.builderSchema, p))
        const type = ctrlOptions.type
        const ctrl = this.ctrlMap[type]
        if (!ctrl) {
          this.$message({ type: 'warning', message: '尚未支持该组件的UI编辑' })
          return
        }
        this.currentCtrlType = type
        this.ctrlOptions = ctrlOptions
        this.ctrlSchema = cloneDeep({
          options: cloneDeep(ctrlFormDefaultOptions),
          formItems: cloneDeep(ctrl.builder)
        })
        this.ctrlKey++
      }
    },
    saveSchema() {
      this.$http.request({
        method: 'POST',
        url: '/devtool/page_schema',
        data: { formItems: this.builderSchema.formItems }
      }).then(({ data }) => {
        if (data) {
          this.$message({ type: 'success', message: '保存成功, 请刷新页面查看效果' })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  size: 2em;
  padding: 5px 20px;
}
.ctrl {
  padding: 5px 20px;
  .ctrl-btn {
    width: 100%;
  }
}
</style>
