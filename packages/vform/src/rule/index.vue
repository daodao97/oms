<template>
  <!-- 组件最外层标记位 -->
  <div v-if="ruleList.length === 0">
    <el-icon v-if="!disabled" @click="addOne"><CirclePlus /></el-icon>
  </div>
  <div
    v-else
    :class="{'_ruleCreate_root': level === 1}"
  >
    <template
      v-for="(rule, index) in ruleList"
      :key="`root${index}`"
    >
      <el-row class="rule-cell">
        <el-col :span="2">
          <RuleIdent
            v-model="rule.logic"
            :root="index === 0"
            :left="ruleList.length > 1"
            :disabled="disabled"
            @update:model-value="change"
          />
        </el-col>
        <el-col :span="22">
          <!-- 规则组 -->
          <RuleCreate
            v-if="rule.children && rule.children.length > 0"
            :key="`child${factoryKey}`"
            ref="_ruleCreate"
            v-model="rule.children"
            class="_child_root"
            :disabled="disabled"
            :class="{'last-row-child': index === ruleList.length -1}"
            :level="level + 1"
            :factory-items="factorOptions"
            :form-items="realFormItems"
            :deep="deep+1"
            @update:model-value="changeRecursive"
          />
          <!-- 单条规则-->
          <div
            v-else
            class="rule-row"
          >
            <RuleFields
              ref="_ruleForm"
              :key="factoryKey"
              :rule="rule"
              :add-child-visible="level === 1"
              :form-items="realFormItems"
              :factor-options="factorOptions"
              :disabled="disabled"
              :max-depth="maxDepth"
              :deep="deep+1"
              :ctrl="{...{addSub: true, addBrother: true, del: true}, ...ctrl}"
              @addChild="addChild(index, rule, ruleList)"
              @delete="deleteRow(index, ruleList)"
              @add="addRow(index, ruleList)"
              @change="(token) => change(token, index)"
            />
          </div>
        </el-col>
      </el-row>
    </template>
    <div
      v-if="level === 1"
      class="preview"
    >规则预览：{{ previewText }}</div>
    <div
      v-if="level === 1"
      class="el-form-item__error"
    >{{ validateMessage }}</div>
  </div>
</template>

<script>
import RuleFields from './RuleFields.vue'
import RuleIdent from './RuleIdent.vue'
// import { testJson } from './test'
import { strVarReplace, strVars } from '@okiss/utils'
import { CirclePlus } from '@element-plus/icons-vue'
export default {
  name: 'RuleCreate',
  components: {
    CirclePlus,
    RuleFields,
    RuleIdent
  },
  inject: [
    'formData'
  ],
  props: {
    modelValue: { type: Array, default: _ => [] },
    // 递归层级，从1开始
    level: { type: Number, default: _ => 1 },
    formItems: { type: Array, default: _ => [] },
    factoryItems: { type: Array, default: _ => [] },
    optionsApi: { type: String, default: '' },
    deep: { type: Number, default: 1 },
    maxDepth: { type: Number, default: 3 },
    disabled: {
      type: Boolean,
      default: false
    },
    initValue: {
      type: Boolean,
      default: true
    },
    ctrl: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['update:modelValue', 'ruleTextChange'],
  data() {
    const defaultConfig = { logic: 'and', field: '', operator: '' }

    if (this.$props.optionsApi !== '') {
      const keys = strVars(this.$props.optionsApi)
      if (keys.length > 0) {
        keys.forEach(item => {
          this.$watch(
            `formData.${item}`,
            () => {
              this.realOptionsApi = strVarReplace(this.$props.optionsApi, this.formData)
              this.ruleList = [{ ...this.defaultConfig }]
            },
            {
              deep: true,
              immediate: true
            }
          )
        })
      }
    }

    return {
      validateMessage: '',
      defaultConfig,
      previewText: '',
      ruleList: [],
      factorOptions: this.$props.factoryItems,
      factoryKey: 0,
      realOptionsApi: strVarReplace(this.$props.optionsApi, this.formData),
      realFormItems: this.$props.formItems
    }
  },
  watch: {
    modelValue: {
      handler(val) {
        if (Array.isArray(val) && val.length > 0) {
          this.ruleList = val
        } else {
          this.initValue && (this.ruleList = [{ ...this.defaultConfig }])
        }
      },
      immediate: true,
      deep: true
    },
    previewText() {
      this.$emit('ruleTextChange', this.previewText)
    },
    realOptionsApi: {
      handler(val) {
        this.$props.deep === 1 && val && this.$http.get(val).then(({ data }) => {
          const opts = data || []
          this.realFormItems = opts
          this.makeFactory(opts)
          this.change()
        })
      },
      immediate: true,
      deep: true
    },
    formItems: {
      handler(val) {
        // this.factoryItems.length === 0 && this.makeFactory(val)
      },
      immediate: true,
      deep: true
    },
    realFormItems: {
      handler(val) {
        // this.factoryItems.length === 0 && this.makeFactory(val)
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.change()
  },
  methods: {
    addOne() {
      this.ruleList.push({ ...this.defaultConfig })
    },
    makeFactory(val) {
      const factorOptions = []
      val.forEach(item => {
        factorOptions.push({ value: item.field || '', label: item.label })
      })
      this.factorOptions = factorOptions
      this.factoryKey++
    },
    getKey() {
      return Math.random().toString(16).slice(2)
    },
    addRow(key, list) {
      // TODO 插入当前行后面
      list.push({ ...this.defaultConfig })
      this.change()
    },
    // 删除节点
    deleteRow(key, list) {
      if (list.length === 1 && this.level === 1) {
        return this.$message.warning('最少要保留一条！')
      }
      list.splice(key, 1)
      // this.$delete(list, key)
      this.change()
    },
    // 添加子节点
    addChild(key, item, list) {
      list.push({ ...this.defaultConfig, children: [{ ...this.defaultConfig }] })
      this.change()
    },
    validate: async function() {
      if (this.$refs._ruleForm) {
        for (let i = 0; i < this.$refs._ruleForm?.length; i++) {
          if (!await this.$refs._ruleForm[i].validate()) {
            return false
          }
        }
      }
      if (this.$refs._ruleCreate) {
        for (let i = 0; i < this.$refs._ruleCreate?.length; i++) {
          if (!await this.$refs._ruleCreate[i].validate()) {
            return false
          }
        }
      }

      return true
    },
    getPreviewText() {
      const getStr = (list, level = 1) => {
        const str = []
        list.forEach((item, index) => {
          if (item.children && item.children.length > 0) {
            str.push([item.logic, '(', getStr(item.children, level + 1), ')'].join(' '))
            return
          }
          const label = this.realFormItems.filter(each => each.field === item.field)[0]
          str.push([index === 0 ? '' : item.logic, label ? label.label : '', item.operator, item.value].filter(each => each !== '').join(' '))
        })
        return str.join(' ')
      }
      this.previewText = getStr(this.ruleList, 1)
    },
    change(token, index) {
      if (this.level === 1) {
        this.getPreviewText()
      }
      if (token === 'field' && index !== undefined) {
        this.ruleList[index].operator = ''
        this.ruleList[index].value = undefined
      }
      this.$emit('update:modelValue', this.ruleList)
    },
    changeRecursive(val) {
      // 递归组件的change 注意层级事件的区别
      this.change()
    }
  }
}
</script>
<style scoped lang="scss">
._ruleCreate_root{
  width: 100%;
}
i {
  font-size: 30px;
  color: #999;
  vertical-align: middle;
  cursor: pointer;
  &.icon-child{
    color: #ccc;
  }
  &.icon-remove {
    color: #f56c6c;
  }
  &.icon-add {
    color: #67c23a;
  }
}
::v-deep(._child_root.last-row-child) {
  .indent{
    border-left-color:#fff;
  }
}
.preview {
  border-top: 1px dashed #999;
  margin-top: 10px;
  padding: 10px 0;
  line-height: 18px;
  font-size: 14px;
}
.rule-cell {
  width: 100%;
  padding-bottom: 5px;
  &:last-child {
    padding-bottom: 0;
  }
}
</style>
