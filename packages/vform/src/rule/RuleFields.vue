<template>
  <div class="ruleFields">
    <el-form
      ref="_form"
      :key="rule.field"
      :model="rule"
      :rules="rules"
      inline
      size="small"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item prop="field">
            <el-select
              v-model="rule.field"
              placeholder="请选择"
              filterable
              :disabled="disabled"
              @change="() => change('field')"
            >
              <el-option
                v-for="(item, index) in factorOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="operator">
            <el-select
              v-model="rule.operator"
              placeholder="符号"
              :disabled="disabled"
              @change="() => change('operator')"
            >
              <el-option
                v-for="(item, index) in operatorOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="value">
            <FormItem
              :key="valueKey"
              v-model="rule.value"
              :show-label="false"
              :item="getFormItem()"
              :disabled="disabled"
              @update:model-value="() => change('value')"
            />
          </el-form-item>
        </el-col>
        <el-col
          v-if="!disabled"
          :span="6"
          style="text-align: right"
        >
          <el-icon
            v-if="deep <= maxDepth && ctrl.addSub"
            size="mini"
            color="#67C23A"
          >
            <el-tooltip
              placement="top-start"
              content="添加规则组"
            >
              <SvgGroup
                style="color: green; padding: 2px"
                @click="addChild"
              />
            </el-tooltip>
          </el-icon>
          <el-icon
            v-if="ctrl.del"
            size="mini"
            color="#F56C6C"
          >
            <el-tooltip
              placement="top-start"
              content="删除"
            >
              <SvgRemove
                style="color: red; padding: 2px"
                @click="deleteRow"
              />
            </el-tooltip>
          </el-icon>
          <el-icon
            v-if="ctrl.addBrother"
            size="mini"
            color="#909399"
          >
            <el-tooltip
              placement="top-start"
              content="添加同层规则"
            >
              <SvgAdd
                style="color: gray; padding: 2px"
                @click="addRow"
              />
            </el-tooltip>
          </el-icon>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import SvgGroup from './svg/group.svg?component'
import SvgAdd from './svg/add.svg?component'
import SvgRemove from './svg/remove.svg?component'
export default defineComponent({
  components: {
    SvgGroup,
    SvgAdd, SvgRemove,
    FormItem: defineAsyncComponent(() => import('../FormItem.vue'))
  },
  props: {
    rule: { type: Object, default: _ => {} },
    formItems: {
      type: Array,
      default: _ => []
    },
    factorOptions: { type: Array, default: _ => [] },
    addChildVisible: { type: Boolean, default: true },
    maxDepth: { type: Number, default: 3 },
    deep: { type: Number, default: 1 },
    disabled: {
      type: Boolean,
      default: false
    },
    ctrl: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['add', 'addChild', 'delete', 'change'],
  data() {
    const rules = {
      field: [
        { required: true, message: '请选择', trigger: 'change' }
      ],
      operator: [
        { required: true, message: '请选择', trigger: 'change' }
      ],
      value: [
        { required: true, message: '请输入', trigger: ['blur', 'change'] }
      ]
    }
    return {
      rules,
      defaultOperatorOptions: [
        { value: '=', label: '等于' },
        { value: '>', label: '大于' },
        { value: '<', label: '小于' },
        { value: '>=', label: '大于等于' },
        { value: '<=', label: '小于等于' },
        { value: '!=', label: '不等于' },
        { value: 'in', label: '在其中' },
        { value: 'not in', label: '不在其中' },
        { value: 'has', label: '包含' },
        { value: 'not has', label: '不包含' }
      ],
      operatorOptions: [],
      valueKey: 0
    }
  },
  watch: {
    rule: {
      handler(val) {
        this.operatorOptions = []
        this.formItems.forEach(item => {
          if (item.field === val.field && item.operatorOptions !== undefined) {
            this.operatorOptions = item.operatorOptions
          }
        })
        if (this.operatorOptions.length === 0) {
          this.operatorOptions = this.defaultOperatorOptions
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async validate() {
      return this.$refs._form.validate()
    },
    addRow() {
      this.$emit('add')
    },
    addChild() {
      this.$emit('addChild')
    },
    deleteRow() {
      this.$emit('delete')
    },
    change(token) {
      this.$emit('change', token)
      // this.valueKey++
    },
    getFormItem() {
      const field = this.rule.field
      let data = {}
      this.$props.formItems.forEach(item => {
        if (item.field === field) {
          data = { ...item }
        }
      })
      data.props = data.props || {}
      data.props.disabled = this.disabled
      // if (this.rule.operator === 'between') {
      //   data.type = `${data.type}-range`
      // }
      return data
    }
  }
})
</script>
<style scoped lang="scss">
.ruleFields {
  width: 100%;
  padding: 5px 12px 9px;
  background: #f3f3f4;
  display: inline-block;
  border-radius: 4px;

  ::v-deep( .el-form-item){
    margin-bottom: 0
  }
  ::v-deep(.el-form-item__content){
    line-height: 40px;
  }
}
i {
  font-size: 30px;
  color: #999;
  vertical-align: middle;
  cursor: pointer;
  &.icon-child{
    color: #ccc;

    &.addChildVisible{
      visibility: hidden;
    }
  }
  &.icon-remove {
    color: #f56c6c;
  }
  &.icon-add {
    color: #67c23a;
  }
}
</style>
