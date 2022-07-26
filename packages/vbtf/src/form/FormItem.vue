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
    <template #default>
      <div style="display:flex;flex-direction: column; width: 100%">
        <div :class="{ 'my-inline-form-item': formOptions.inline }">
          <component
            :is="getComponentName(item.type)"
            :key="item.id || ''"
            ref="ctrl"
            v-model="localValue"
            v-bind="compProps(item, $props.formOptions)"
            @update:model-value="onFiledChange"
          />
        </div>
        <div
          v-if="item.info && !formOptions.inline"
          class="form-item-info"
        >
          <el-icon color="#E6A23C"><Warning /></el-icon> <span v-html="item.info" />
        </div>
      </div>
    </template>
  </el-form-item>
</template>
<script lang="ts">
import { getComponentName, getComponentProps, customFormComps } from './util'
import { merge } from 'lodash'
import { SetupContext } from 'vue'
import { Warning } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'FormItem',
  components: { ...customFormComps, Warning },
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
  color: var(--el-color-info);
  font-size: 12px;
  line-height: 1.5;
  display: flex;
  align-items: center;

  ::v-deep(*) {
    font-size: 12px;
    line-height: 1.5;
  }
}
.my-inline-form-item {
  width: 120px;
}
</style>
