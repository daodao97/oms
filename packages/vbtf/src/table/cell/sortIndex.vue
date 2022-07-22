<template>
  <span
    v-if="!edit"
    style="display: inline-block; width: 100%"
    @click="edit = !edit"
  >{{ index }}</span>
  <span v-else>
    <el-row :gutter="10">
      <el-col :span="18">
        <VNumber
          v-model="index"
          :props="{controls: false}"
          style="width: auto;"
        />
      </el-col>
      <el-col :span="6">
        <ElButton
          :icon="Check"
          type="success"
          circle
          @click="onsubmit"
        />
      </el-col>
    </el-row>
  </span>
</template>
<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
<script lang="ts" setup>
import {
  Check
} from '@element-plus/icons-vue'
import VNumber from '../../form/VNumber.vue'
const props = defineProps({
  data: {
    type: String,
    default: ''
  },
  column: {
    type: Object,
    default: () => {
    }
  },
  row: {
    type: Object,
    default: () => {}
  },
  ctrl: {
    type: Boolean,
    default: false
  },
  scope: {
    type: Object,
    default: () => {}
  }
})

const index = ref(props.scope.$index + 1)
const edit = ref(false)
const emit = defineEmits(['sortIndexChange'])
const onsubmit = () => {
  console.log((new Date()).getTime())
  emit('sortIndexChange', { from: props.scope.$index, to: index.value - 1 })
  edit.value = false
}
</script>
