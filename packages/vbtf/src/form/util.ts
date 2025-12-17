import { merge } from 'lodash'
import { isBool, isString, isDurationStr, duration, isArray, isObject } from '@okiss/utils'
import VSelect from './VSelect.vue'
import VRadio from './VRadio.vue'
import VCheckbox from './VChecbox.vue'
import VNumberRange from './VNumberRange.vue'
import VJson from './VJson.vue'
import VIconSelect from './VIconSelect.vue'
import VSubForm from './VSubForm.vue'
import VUpload from './VUpload.vue'
import VInput from './VInput.vue'
import VCascader from './VCascader.vue'
import VCascaderPanel from './VCascaderPanel.vue'
import VFilter from './VFilter.vue'
import VShow from './VShow.vue'
import VDate from './VDate.vue'
import MonacoEditor from './MonacoEditor.vue'
import { Component } from 'vue'
import VRule from './rule/index.vue'
import VPointCheckbox from './VPointCheckbox.vue'
import VNumber from './VNumber.vue'
import VDuration from './VDuration.vue'
import VTableSelect from './TableSelect/index.vue'
import dayjs from 'dayjs/esm/index.js'
import VSwitch from './VSwitch.vue'
import { ElTransfer } from 'element-plus'
// @ts-ignore

export const componentMap: Record<string, string> = {
  input: 'v-input',
  number: 'v-number',
  radio: 'v-radio',
  checkbox: 'v-checkbox',
  'number-range': 'v-number-range',
  date: 'v-date',
  daterange: 'v-date',
  time: 'el-time-picker',
  datetime: 'el-date-picker',
  datetimerange: 'el-date-picker',
  slider: 'el-slider',
  image: 'v-upload',
  upload: 'v-upload',
  file: 'v-upload',
  transfer: 'el-transfer',
  color: 'el-color-picker',
  rate: 'el-rate',
  select: 'v-select',
  switch: 'v-switch',
  json: 'v-json',
  'icon-select': 'v-icon-select',
  'sub-form': 'v-sub-form',
  cascader: 'v-cascader',
  'cascader-panel': 'v-cascader-panel',
  'rule': 'v-rule',
  'filter': 'v-filter',
  'show': 'v-show',
  'editor': 'monaco-editor',
  'code': 'monaco-editor',
  'textarea': 'el-input',
  'point-checkbox': 'v-point-checkbox',
  'duration': 'v-duration',
  'table-select': 'v-table-select'
}

export const formOptions = {
  inline: false,
  labelPosition: 'right',
  labelWidth: '100px',
  submitButton: {
    show: true,
    type: 'primary',
    showText: '提交'
  },
  cancelButton: {
    show: true,
    type: 'info',
    showText: '取消'
  }
}

export function makeFormOptions(options: Record<string, any>) {
  options = options || {}
  if (isBool(options.submitButton)) {
    options.submitButton = { show: options.submitButton }
  }

  if (isBool(options.cancelButton)) {
    options.cancelButton = { show: options.cancelButton }
  }

  return merge({}, formOptions, options)
}

export const customFormComps: Record<string, Component> = {
  VSelect,
  VRadio,
  VCheckbox,
  VNumberRange,
  VJson,
  VIconSelect,
  VSubForm,
  VUpload,
  VInput,
  VCascader,
  VCascaderPanel,
  VFilter,
  VShow,
  MonacoEditor,
  VRule,
  VPointCheckbox,
  VNumber,
  VDuration,
  VDate,
  VTableSelect,
  VSwitch,
  ElTransfer
}

export const regCustomFormComps = (comps: Record<string, Component>) => {
  Object.keys(comps).forEach(key => {
    customFormComps[key] = comps[key]
  })
}

export const getComponentName = (name: string) => {
  if (!name) {
    name = 'input'
  }
  if (componentMap[name] !== undefined) {
    return componentMap[name]
  }
  if (componentMap['v-' + name] !== undefined) {
    return componentMap['v-' + name]
  }
  return name
}

export const getComponentProps = (item: any, formOptions: Record<string, any>) => {
  const props = item.props || {}
  if (formOptions && formOptions.disabled) {
    props.disabled = true
  }
  if (item.options) {
    props.options = item.options
  }
  if (['file', 'image'].indexOf(item.type) > -1) {
    if (!props.action) props.action = `/upload` // upload action
    // props.headers = { Authorization: '' }
    props.type = item.type
  }
  if (item.readonly !== undefined) {
    props.disabled = !!item.readonly
    delete item['readonly']
  }
  if (item.disabled !== undefined) {
    props.disabled = !!item.disabled
    delete item['disabled']
  }
  if (item.type !== 'color') {
    props.clearable = true
  }
  if (item.type === 'datetime') {
    props.type = 'datetime'
    props.format = 'YYYY-MM-DD HH:mm:ss'
    props.valueFormat = 'YYYY-MM-DD HH:mm:ss'
  }
  if (item.type === 'date') {
    props.type = 'date'
    props.format = props.format || 'YYYY-MM-DD'
    props.valueFormat = props.valueFormat || 'YYYY-MM-DD'
  }
  if (item.type === 'datetimerange') {
    props.type = 'datetimerange'
    props.format = props.format || 'YYYY-MM-DD HH:mm:ss'
    props.valueFormat = props.valueFormat || 'YYYY-MM-DD HH:mm:ss'
    props.startPlaceholder = (item.label || item.field).replace('开始时间', '').replace('时间', '') + '开始时间'
    props.endPlaceholder = (item.label || item.field).replace('结束时间', '').replace('时间', '') + '结束时间'
  }
  if (item.type === 'daterange') {
    props.type = 'daterange'
    props.format = props.format || 'YYYY-MM-DD'
    props.valueFormat = props.valueFormat || 'YYYY-MM-DD'
    props.startPlaceholder = (item.label || item.field).replace('开始日期', '').replace('日期', '') + '开始日期'
    props.endPlaceholder = (item.label || item.field).replace('结束日期', '').replace('日期', '') + '结束日期'
  }
  if (item.type === 'textarea') {
    props.type = 'textarea'
  }
  if (formOptions && !formOptions.labelWidth) {
    props.placeholder = item.label || item.field
  }
  return props
}

export const getComponentValue = (item: any, formOptions: Record<string, any>) => {
  if (item.value === undefined) {
    return undefined
  }
  if (item.type === 'date') {
    if (isString(item.value) && isDurationStr(item.value)) {
      const { format } = getComponentProps(item, formOptions)
      return dayjs(duration(item.value)).format(format)
    }
  }
  return item.value
}

export let uploadHeader : () => {} = () => { return {} }

export function setUploadHeaderHandle(fn: () => {}) {
  uploadHeader = fn
}
