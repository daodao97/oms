<template>
  <div class="sub-form">
    <draggable
      v-model="sub"
      group="filter"
      :item-key="itemKey"
      :disabled="disabled"
      @start="drag=true"
      @end="drag=false"
    >
      <template #item="{element, index}">
        <el-row>
          <el-col
            class="sub-form-item"
            :span="22"
          >
            <el-row>
              <el-col
                v-if="showLabel"
                :span="4"
              >
                <el-select
                  v-model="sub[index].field"
                  :disabled="$props.disabled || index < sub.length - 1"
                  @change="() => fieldChange(index)"
                >
                  <el-option
                    v-for="each in allowOptions(index)"
                    :key="each.value"
                    :label="each.label"
                    :value="each.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="16">
                <form-item
                  v-if="sub[index].field"
                  v-model="sub[index].value"
                  :item="getFormitem(index)"
                  :form-options="{disabled: $props.disabled}"
                  @update:model-value="onchange"
                />
              </el-col>
            </el-row>
          </el-col>
          <el-col
            v-if="!disabled"
            :span="2"
            class="sub-form-item-action"
          >
            <div>
              <div>
                <el-button
                  v-if="sub.length > 1"
                  class="action"
                  type="danger"
                  :icon="minus"
                  circle
                  @click="remove(index)"
                />
              </div>
              <div v-if="index === sub.length - 1 && index < formItems.length -1">
                <el-button
                  v-if="(allowOptions(index).length > 1)"
                  class="action"
                  type="primary"
                  :icon="plus"
                  circle
                  @click="push"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
    </draggable>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
// todo ts
import { merge, remove, filter } from 'lodash'
import draggable from 'vuedraggable'
import { Plus, Minus } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'VFilter',
  components: {
    FormItem: defineAsyncComponent(() => import('./FormItem.vue')),
    draggable
  },
  inject: ['formData', 'dev'],
  props: {
    formItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    modelValue: {
      type: Array || null,
      default: () => {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue'],
  data() {
    const subData = this.$props.modelValue ? this.$props.modelValue : []
    if (subData.length === 0) {
      subData.push({ field: '', value: undefined })
    }
    const localOptions = []
    this.$props.formItems.forEach(item => {
      localOptions.push({
        value: item.field,
        label: item.label
      })
    })
    return {
      key: 1,
      fApis: [],
      sub: subData,
      localOptions: localOptions,
      formOptions: merge(this.$props.options, {
        submitButton: false,
        cancelButton: false
      }),
      plus: markRaw(Plus),
      minus: markRaw(Minus)
    }
  },
  computed: {
    itemKey() {
      return Object.keys(this.$props.formItems[0] | {})[0]
    }
  },
  methods: {
    push() {
      this.sub.push({ field: undefined, value: undefined })
    },
    remove(index) {
      this.sub = remove(this.sub, (item, key) => {
        return key !== index
      })
      this.key++
      this.$emit('update:modelValue', this.sub)
    },
    onchange() {
      const val = []
      this.sub.forEach(item => {
        if (item.value !== undefined) {
          val.push({ field: item.field, value: item.value })
        }
      })
      this.$emit('update:modelValue', val)
    },
    subMounted(fApi, index) {
      this.fApis[index] = fApi
    },
    validate() {
      let flag = true
      this.fApis.forEach(item => {
        if (!flag) {
          return false
        }
        item.validate(valid => {
          if (!valid) {
            flag = false
          }
        })
      })
      return flag
    },
    getRootData() {
      return this.formData
    },
    getFormitem(index) {
      const field = this.sub[index].field
      let data = {}
      this.$props.formItems.forEach(item => {
        if (item.field === field) {
          data = item
        }
      })
      return data
    },
    fieldChange(index) {
      if (this.sub[index].id === undefined) {
        this.sub[index].id = 1
      } else {
        this.sub[index].id += 1
      }
    },
    onFiledChange() {

    },
    allowOptions(i) {
      const field = []
      this.sub.forEach((item, index) => {
        if (index < i) {
          field.push(item.field)
        }
      })
      return filter(this.localOptions, (o) => {
        return field.indexOf(o.value) < 0
      })
    }
  }
})
</script>
<style lang="scss" scoped>
.sub-form {
  width: 100%;
}

.sub-form-item {
  flex: 1 1 auto;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  padding: 20px 10px 10px 10px;
  margin-bottom: 10px;
}

.sub-form-item-action {
  text-align: center;
}
</style>
