<template>
  <el-form-item
    v-show="item.type !== 'hidden'"
    :prop="item.field"
  >
    <template
      v-if="showLabel"
      #label
    >
      {{ item.label || item.field }}
      <el-tooltip
        v-if="item.info && formOptions.inline"
        placement="top"
      >
        <template #content>
          <span v-html="item.info" />
        </template>
        <i class="el-icon-warning-outline" />
      </el-tooltip>
    </template>
    <component
      :is="getComponentName(item.type)"
      :key="item.id || ''"
      ref="ctrl"
      v-model="localValue"
      v-bind="compProps(item, $props.formOptions)"
      @update:model-value="onFiledChange"
    />
    <div
      v-if="item.info && !formOptions.inline"
      class="form-item-info"
    >
      <i class="el-icon-warning-outline" /> <span v-html="item.info" />
    </div>
  </el-form-item>
</template>
<script lang="ts">
import { getComponentName, getComponentProps, customFormComps } from './util'
import { merge } from 'lodash'
import { SetupContext } from 'vue'

export default defineComponent({
  name: 'FormItem',
  components: customFormComps,
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
    showLabel: {
      type: Boolean,
      default: true
    },
    components: {
      type: Object,
      default: () => {
      }
    },
    mod: {
      type: String,
      default: '' // create or edit, create 是 readonly=true 不起作用
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }: SetupContext) {
    const localValue = ref(props.modelValue)
    const app = getCurrentInstance()
    const item = ref(props.item)
    if (item.value.type === 'template') {
      item.value.type = 'v-tpl' + item.value.field
      const methods: Record<string, any> = {}
      Object.keys(item.value.comp.methods || []).forEach(name => {
        methods[name] = Function(`return ${item.value.comp.methods[name]}`)()
      })
      if (app !== null) {
        app.type.components['VTpl' + item.value.field] = merge({}, item.value.comp, {
          data() {
            return {
              ...item.value.comp.data
            }
          },
          methods
        })
      }
    }
    const onFiledChange = (value: any, extra: any) => {
      emit('update:modelValue', value, extra)
    }

    const compProps = (item: any, options: any) => {
      const op = getComponentProps(item, options)
      // 如果是新建模式 并且没有默认值时 disable 重置为 false, 允许用户输入
      if (props.mod === 'create' && item.value === undefined) {
        op.disabled = false
      }
      return op
    }
    return {
      localValue,
      getComponentName,
      onFiledChange,
      compProps
    }
  }
})
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
