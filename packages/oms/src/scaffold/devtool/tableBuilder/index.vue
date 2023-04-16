<template>
  <dev-layout>
    <template #left-aside>
      <el-row style="width: 200px">
        <el-row>
          <el-col
            class="title"
            :data-id="22222"
          >添加搜索条件</el-col>
          <el-col class="ctrl">
            <el-button
              class="ctrl-btn"
              @click="pushFilter('input')"
            >文本框</el-button>
          </el-col>
          <el-col class="ctrl">
            <el-button
              class="ctrl-btn"
              @click="pushFilter('select')"
            >下拉框</el-button>
          </el-col>
          <el-col class="ctrl">
            <el-button
              class="ctrl-btn"
              @click="pushFilter('date')"
            >日期</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="title">添加列表项</el-col>
          <el-col
            v-for="(item, index) in Object.keys(ctrlMap.headers)"
            :key="`column-${index}`"
            class="ctrl"
          >
            <el-button
              class="ctrl-btn"
              @click="pushHeaders(ctrlMap.headers[item].type)"
            >{{ ctrlMap.headers[item].name }}</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="title">添加行按钮</el-col>
          <el-col
            v-for="(item, index) in Object.keys(ctrlMap.buttons)"
            :key="`column-${index}`"
            class="ctrl"
          >
            <el-button
              class="ctrl-btn"
              @click="pushRowButton(ctrlMap.buttons[item].type)"
            >{{ ctrlMap.buttons[item].name }}</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="title">添加常规按钮</el-col>
          <el-col
            v-for="(item, index) in Object.keys(ctrlMap.buttons)"
            :key="`column-${index}`"
            class="ctrl"
          >
            <el-button
              class="ctrl-btn"
              @click="pushNormalButton(ctrlMap.buttons[item].type)"
            >{{ ctrlMap.buttons[item].name }}</el-button>
          </el-col>
          <el-col class="ctrl">
            <el-button class="ctrl-btn">按钮组</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="title">添加批量按钮</el-col>
          <el-col
            v-for="(item, index) in Object.keys(ctrlMap.buttons)"
            :key="`column-${index}`"
            class="ctrl"
          >
            <el-button
              class="ctrl-btn"
              @click="pushBatchButton(ctrlMap.buttons[item].type)"
            >{{ ctrlMap.buttons[item].name }}</el-button>
          </el-col>
          <el-col class="ctrl">
            <el-button class="ctrl-btn">按钮组</el-button>
          </el-col>
        </el-row>
      </el-row>
    </template>
    <template #main>
      <v-table
        ref="table"
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
import { VTable, VForm, VBtn as VButton, JsonView } from '@okiss/vbtf'
import { compactObject } from '@okiss/utils'
import input from './ctrls/input'
import select from './ctrls/select'
import date from './ctrls/date'
import { cloneDeep, merge, get, unset } from 'lodash'
import { baseSchema } from './table'
import { ctrlFormDefaultOptions } from '../base'
import columns from './columns'
import buttons from './btn'
import { eventBus } from '../../../index'

export default {
  components: { JsonView, DevLayout, VTable, VForm, VButton },
  props: {
    schema: {
      type: Object,
      default: _ => {}
    }
  },
  data() {
    const schema = toRefs(this.$props.schema)
    delete schema.listApi
    schema.list = [{}]
    return {
      baseSchema: baseSchema,
      activeTab: 'base',
      builderSchema: Object.assign(
        {},
        baseSchema,
        schema
      ),
      baseOptions: {},
      key: 0,
      ctrlKey: 0,
      activeCtrl: undefined,
      activeBrick: undefined,
      ctrlOptions: {},
      ctrlSchema: {},
      ctrlName: '',
      activeIndex: undefined,
      ctrlMap: {
        filter: { input, select, date },
        headers: columns,
        buttons: buttons
      },
      activeIndexReg: /(filter|headers|normalButton|batchButton|rowButton)?\[(\d+)\]/,
      currentCtrlType: 'input'
    }
  },
  computed: {
    types() {
      const typs = []
      const ctrls = this.ctrlMap[this.activeBrick]
      Object.keys(ctrls).forEach(item => {
        typs.push({ value: item, label: ctrls[item].name })
      })

      return typs
    },
    getSaveSchema() {
      return {
        filter: this.builderSchema.filter,
        headers: this.builderSchema.headers,
        rowButton: this.builderSchema.rowButton,
        normalButton: this.builderSchema.normalButton,
        batchButton: this.builderSchema.batchButton
      }
    },
    currentBuilderSchema() {
      return this.$store.state.app.builderSchema
    }
  },
  watch: {
    baseOptions: {
      deep: true,
      immediate: true,
      handler(val) {
        this.builderSchema = merge(this.builderSchema, val)
        this.key++
        this.updateBuilderSchema()
      }
    },
    ctrlOptions: {
      deep: true,
      // immediate: true,
      handler(val) {
        const m = this.activeIndex.match(this.activeIndexReg)
        if (!m) {
          return
        }
        let type = this.builderSchema[m[1]][parseInt(m[2])].type

        if (m[1] === 'headers' && type === undefined) {
          type = 'span'
        }
        const ctrl = this.ctrlMap[this.activeBrick][type]
        if (!ctrl) {
          return
        }

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
          this.key++
        }

        this.updateBuilderSchema()
      }
    },
    currentCtrlType: {
      handler(val) {
        const ctrl = this.ctrlMap[this.activeBrick][val]
        this.ctrlSchema = cloneDeep({
          options: cloneDeep(ctrlFormDefaultOptions),
          formItems: cloneDeep(ctrl.builder)
        })
        const sourceCtrlOptions = get(this.builderSchema, this.activeIndex)
        sourceCtrlOptions.type = val
        const ctrlOptions = cloneDeep(sourceCtrlOptions)
        this.ctrlOptions = ctrlOptions
        if (ctrlOptions.text) {
          this.ctrlOptions.text = ctrlOptions.text
          this.ctrlOptions.props = ctrlOptions.props || {}
        }
        this.ctrlKey++
        this.key++
        this.updateBuilderSchema()
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
    updateBuilderSchema() {
      this.$store.dispatch('app/setBuilderSchema', this.builderSchema)
    },
    onDevAction(btnType, path) {
      this.activeIndex = path
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
    pushFilter(name) {
      this.push(name, 'filter', 'filter', 'filter')
    },
    pushHeaders(name) {
      this.push(name, 'headers', 'headers', 'headers')
    },
    pushNormalButton(name) {
      this.push(name, 'normalButton', 'buttons', 'buttons')
    },
    pushBatchButton(name) {
      this.push(name, 'batchButton', 'buttons', 'buttons')
    },
    pushRowButton(name) {
      this.push(name, 'rowButton', 'buttons', 'buttons')
    },
    push(name, target, ctrlMapName, brick) {
      const ctrl = this.ctrlMap[ctrlMapName]
      if (!ctrl[name]) {
        this.$message({ type: 'warning', message: '尚未支持此组件的UI编辑' })
        return
      }
      this.activeCtrl = ctrl[name]
      this.activeBrick = brick
      this.ctrlOptions = {}
      this.builderSchema[target] = this.builderSchema[target] || []
      this.builderSchema[target].push(cloneDeep(ctrl[name].default))
      this.ctrlSchema = cloneDeep({
        options: cloneDeep(ctrlFormDefaultOptions),
        formItems: cloneDeep(ctrl[name].builder)
      })
      this.key++
      this.ctrlKey++
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
        this.activeBrick = m[1]
        if (['normalButton', 'batchButton', 'rowButton'].indexOf(m[1]) > -1) {
          this.activeBrick = 'buttons'
        }
        let type = this.builderSchema[m[1]][parseInt(m[2])].type
        if (m[1] === 'headers' && type === undefined) {
          type = 'span'
        }
        const ctrl = this.ctrlMap[this.activeBrick][type]
        if (!ctrl) {
          console.log(this.activeBrick, type, m)
          this.$message({ type: 'warning', message: '尚未支持此组件的UI编辑' })
          return
        }
        this.ctrlOptions = ctrlOptions
        this.currentCtrlType = type
        this.ctrlSchema = cloneDeep({
          options: cloneDeep(ctrlFormDefaultOptions),
          formItems: cloneDeep(ctrl.builder)
        })
        this.ctrlKey++
      }
    },
    saveSchema() {
      const { filter, headers, rowButton, normalButton, batchButton } = this.currentBuilderSchema
      this.$http.request({
        method: 'POST',
        url: '/devtool/page_schema',
        data: {
          filter,
          headers,
          rowButton,
          normalButton,
          batchButton
        }
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
