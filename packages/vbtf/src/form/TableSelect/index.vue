<template>
  <div>

    <el-tag
      v-for="(tag, index) in localValue"
      :key="tag"
      class="mx-1"
      closable
      :disable-transitions="false"
      @close="handleDel(index)"
    >
      {{ tag }}
    </el-tag>
    <el-button
      v-if="multiple || localValue.length === 0"
      class="button-new-tag ml-1"
      size="small"
      @click="showSelect = true"
    >
      + 添加
    </el-button>

    <el-dialog
      ref="dialog"
      v-model="showSelect"
      :append-to-body="true"
      :destroy-on-close="true"
      :before-close="closeDialog"
      title="选择"
      width="80%"
    >
      <sub-select
        ref="selectDom"
        :source="tableSchema"
        :on-selection="onSelection"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showSelect = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSelectConfirm"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, PropType, watch } from 'vue'
import SubSelect from './select.vue'
import { ElMessage } from 'element-plus'
import { effectDataTrans, isString } from '@okiss/utils'

const emits = defineEmits(['update:modelValue'])

type valueKey = string | Array<string> | Record<string, string>

interface TableSchema {
  id: number,
  label: string,
  valueKey: valueKey, // string or []string or map[string]string
  infoApi: string,
  listApi: string
}

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: undefined
  },
  tableSchema: {
    type: Array as PropType<Array<TableSchema>>,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  multipleLimit: {
    type: Number,
    default: 0
  },
  effectData: {
    type: [String, Array, Object] as PropType<valueKey>,
    default: () => {}
  }
})

const localValue = ref<Array<any>>([])
watch(() => props.modelValue, (newVal) => {
  newVal && (localValue.value = props.multiple ? [...newVal as Array<string|number>] : [newVal])
}, { immediate: true })

const handleDel = (index: number) => {
  localValue.value.splice(index, 1)
}

const showSelect = ref(false)

const handleSelectConfirm = () => {
  if (props.multiple === false && localValue.value.length > 1) {
    ElMessage.error('只允许选择一个')
    return
  }
  showSelect.value = false
  localValue.value.length > 0 && emits(
    'update:modelValue',
    props.multiple ? localValue.value : localValue.value[0],
    effectDataTrans(props.effectData, { tab_id: selectedTabIndex.value })
  )
}

const selectedTabIndex = ref<number>()
const onSelection = (tabIndex: number, rows: Array<Record<string, any>>) => {
  selectedTabIndex.value = props.tableSchema[tabIndex].id
  localValue.value = rows.map(item => {
    const data = effectDataTrans(props.tableSchema[tabIndex].valueKey, item)
    if (isString(props.tableSchema[tabIndex].valueKey)) {
      return data[props.tableSchema[tabIndex].valueKey as string]
    }
    return data
  }).filter(item => item)
}

const closeDialog = () => {
  showSelect.value = false
  localValue.value = []
  selectedTabIndex.value = undefined
}
</script>

<style scoped>
.mx-1 {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}
</style>
