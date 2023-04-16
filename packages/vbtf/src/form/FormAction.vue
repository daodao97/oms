<template>
  <el-form-item
    v-if="show"
  >
    <el-button
      v-if="formOptions.submitButton && formOptions.submitButton.show"
      :loading="submiting"
      v-bind="formOptions.submitButton"
      @click="submitConfirm ? confirmAct() : action('submit')"
    >{{ formOptions.submitButton.showText }}
    </el-button>
    <el-button
      v-if="formOptions.cancelButton && formOptions.cancelButton.show"
      v-bind="formOptions.cancelButton"
      @click="action('cancel')"
    >{{ formOptions.cancelButton.showText }}
    </el-button>
  </el-form-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ElMessageBox } from 'element-plus'
import type { confirmType, Confirm } from './types'

type actType = 'submit' | 'cancel'

const props = defineProps({
  submiting: {
    type: Boolean,
    default: false
  },
  formOptions: {
    type: Object,
    default: () => {}
  },
  submitConfirm: {
    type: [Boolean, Object] as PropType<confirmType>,
    default: false
  }
})

const emits = defineEmits(['submit', 'cancel'])
const action = (t: actType) => emits(t)
const show = computed(() => {
  return props.formOptions?.submitButton?.show === true || props.formOptions?.cancelButton?.show === true
})
const confirmAct = () => {
  const info : Confirm = {
    title: props.submitConfirm === true ? '确认提示' : (props.submitConfirm as Confirm).title,
    message: props.submitConfirm === true ? '确认要提交吗?' : (props.submitConfirm as Confirm).message
  }
  ElMessageBox.confirm(info.message, info.title).then(() => {
    action('submit')
  }, () => {
    // action('cancel')
  })
}
</script>
