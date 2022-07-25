<template>
  <div class="sub-form">
    <el-row
      v-for="(item, index) in sub"
      :key="index + '-' + key"
    >
      <el-col
        class="sub-form-item"
        :span="repeat ? 22: 24"
      >
        <v-form
          :ref="'subForm' + index"
          v-model="sub[index]"
          :is-sub="true"
          :options="formOptions"
          :form-items="$props.formItems"
          :root-data="getRootData"
          :disable="disabled"
          :mod="mod"
          @update:model-value="onchange"
          @mounted="fApi => subMounted(fApi, index)"
        />
      </el-col>
      <el-col
        v-if="repeat && !disabled"
        :span="2"
      >
        <div class="box">
          <el-button
            v-if="sub.length > 1"
            type="danger"
            :icon="minus"
            circle
            @click="remove(index)"
          />
        </div>
        <div class="box">
          <el-button
            v-if="(index === sub.length - 1) && sub.length < max"
            type="primary"
            :icon="plus"
            circle
            @click="push"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { cloneDeep, merge, remove } from 'lodash'
import { Plus, Minus } from '@element-plus/icons-vue'
import { isArray, isObject } from '@okiss/utils'

export default defineComponent({
  name: 'VSubForm',
  components: {
    VForm: defineAsyncComponent(() => import('./VForm.vue'))
  },
  inject: ['formData', 'dev', 'mod'],
  props: {
    repeat: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: 100
    },
    formItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    modelValue: {
      type: [Object, Array],
      default: () => {
        return {}
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
    }
  },
  emits: ['update:modelValue'],
  data() {
    let subData = []
    const value = cloneDeep(this.$props.modelValue)

    if (this.$props.repeat === true && isArray(this.$props.modelValue)) {
      subData = value
    } else if (this.$props.repeat === false && isObject(this.$props.modelValue)) {
      subData.push(value)
    } else {
      subData.push({})
    }

    if (subData.length === 0) {
      subData.push({})
    }

    return {
      key: 1,
      fApis: [],
      sub: subData,
      formOptions: merge(this.$props.options, {
        submitButton: false,
        cancelButton: false,
        disabled: this.disabled
      }),
      plus: markRaw(Plus),
      minus: markRaw(Minus)
    }
  },
  watch: {
    $props: {
      immediate: true,
      handler(newProps) {
        if (newProps.repeat === true && !isArray(newProps.modelValue)) {
          console.error('sub-form type is repeat: modelValue must is array')
        }
        if (newProps.repeat === false && !isObject(newProps.modelValue)) {
          console.error('sub-form type is single: modelValue must is Object')
        }
      }
    }
  },
  methods: {
    push() {
      this.sub.push({})
    },
    remove(index) {
      this.sub = remove(this.sub, (item, key) => {
        return key !== index
      })
      this.key++
      this.$emit('update:modelValue', this.repeat ? this.sub : this.sub[0])
    },
    onchange() {
      this.$emit('update:modelValue', this.repeat ? this.sub : this.sub[0])
    },
    subMounted(fApi, index) {
      this.fApis[index] = fApi
    },
    validate: async function() {
      let flag = true
      for (let i = 0; i < this.fApis.length; i++) {
        const item = this.fApis[i]
        if (!flag) {
          return false
        }
        const ret = await item.validate()
        if (!ret) {
          flag = false
        }
      }
      return flag
    },
    getRootData() {
      return this.formData
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

.box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
}
</style>
