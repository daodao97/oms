<template>
  <el-row>
    <el-col
      v-if="_filter.length > 0"
      :span="24"
    >
      <ElCard
        shadow="never"
        class="part-filter"
      >
        <VForm
          v-model="formData"
          :form-items="_filter"
          :options="formOptions"
          @submit="onsubmit"
        />
      </ElCard>
    </el-col>
    <el-col :span="24">
      <el-row :gutter="20">
        <el-col
          v-for="(item,index) in _dataPart"
          :key="index"
          :span="item.col || 24"
        >
          <Part
            v-if="!item.errMsg"
            :key="key"
            :option="item"
          />
          <el-alert
            v-else
            :title="item.id+' 片段执行出错'"
            type="error"
          >{{ item.errMsg }}</el-alert>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { VForm } from '@okiss/vbtf'
import Part from './part.vue'
// import store from '../../store'
import http from '../../utils/request'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  // store.dispatch('app/toggleSideBar')
})

const props = defineProps({
  filter: {
    type: Array,
    default: () => []
  },
  dataPart: {
    type: Array,
    default: () => []
  }
})

const formData = ref<Record<string, any>>({})
onBeforeMount(() => {
  props.filter?.forEach((item: any) => {
    if (item.default !== null) {
      formData.value[item.field] = item.default
    }
  })
})
const formOptions = {
  inline: true,
  labelPosition: 'right',
  labelWidth: 'auto',
  submitButton: {
    text: '查询'
  },
  cancelButton: {
    text: '重置'
  }
}
const key = ref(1)
const _filter = ref(props.filter)
const _dataPart = ref(props.dataPart)

const schemaapi = computed(() => {
  let id = route.params.id
  if (!id) {
    const token = route.path.split('/')
    id = token[token.length - 1]
  }
  return '/focusbi_report/view/' + id
})

const onsubmit = (data: any) => {
  http.get(schemaapi.value, { params: data }).then(({ data }) => {
    _filter.value = data.filter
    _dataPart.value = data.dataPart
    key.value++
  })
}
</script>

<style lang="scss">
.part-filter {
  margin-bottom: 15px;
}

</style>
