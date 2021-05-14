<template>
  <el-form-item :label="item.label" :prop="item.field">
    <template #label>
      {{ item.label || item.field }}
      <el-tooltip v-if="item.info && formOptions.inline" placement="top">
        <template #content>
          <span v-html="item.info"/>
        </template>
        <i class="el-icon-warning-outline"/>
      </el-tooltip>
    </template>
    <component
        :is="getComponentName(item.type)"
        :key="item.id || ''"
        ref="ctrl"
        v-model="localValue"
        v-bind="getComponentProps(item)"
        @update:modelValue="onFiledChange"
    />
    <div v-if="item.info && !formOptions.inline" class="form-item-info">
      <i class="el-icon-warning-outline"/> <span v-html="item.info"/>
    </div>
  </el-form-item>
</template>
<script lang="ts">
import {getComponentName, getComponentProps, customFormComps} from './util'
import {merge} from 'lodash'
import {SetupContext} from '@vue/runtime-core'
import {getCurrentInstance, ref} from 'vue'

interface Props {
  item: Array<any>
}

export default {
  name: 'FormItem',
  components: {...customFormComps},
  props: {
    formOptions: {
      type: Object,
      default: () => {
      }
    },
    item: {
      type: Object,
      default: () => {
      }
    },
    modelValue: {
      type: [String, Number, Object, Array, Boolean],
      default: undefined
    },
    components: {
      type: Object,
      default: () => {
      }
    }
  },
  emits: ['update:modelValue'],
  setup(props: Props, {emit}: SetupContext) {
    const localValue = ref(props.modelValue)
    const app = getCurrentInstance()
    const item = ref(props.item)
    if (item.value.type === 'template') {
      item.value.type = 'v-tpl' + item.value.field
      const methods: Record<string, any> = {}
      Object.keys(item.value.comp.methods || []).forEach(name => {
        methods[name] = Function(`return ${item.value.comp.methods[name]}`)()
      })
      app.type.components['VTpl' + item.value.field] = merge({}, item.value.comp, {
        data() {
          return {
            ...item.value.comp.data
          }
        },
        methods
      })
    }
    const onFiledChange = (value: any) => {
      emit('update:modelValue', value)
    }
    return {
      localValue,
      getComponentName,
      getComponentProps,
      onFiledChange
    }
  }
}
</script>
<style lang="scss" scoped>
.form-item-info {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;

  ::v-deep(*) {
    font-size: 12px;
    line-height: 1.5;
  }
}
</style>
