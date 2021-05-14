<template>
  <el-form-item
    v-if="formOptions.submitButton.show || formOptions.cancelButton.show"
  >
    <el-button
      v-if="formOptions.submitButton.show"
      v-bind="formOptions.submitButton"
      @click="action('submit')"
    >{{ formOptions.submitButton.text }}
    </el-button>
    <el-button
      v-if="formOptions.cancelButton.show"
      v-bind="formOptions.cancelButton"
      @click="action('cancel')"
    >{{ formOptions.cancelButton.text }}
    </el-button>
  </el-form-item>
</template>
<script setup lang="ts">
import { defineProps, defineEmit } from 'vue'

const props = defineProps({
  formOptions: {
    type: Object,
    defautl: () => {
    }
  }
})
const emit = defineEmit(['submit', 'cancel'])
type actType = 'submit' | 'cancel'
const action = (type: actType) => emit(type)
</script>
