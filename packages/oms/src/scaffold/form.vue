<template>
  <PageLoad :schema-handler="schemaHandler">
    <template #default="slotProps">
      <VForm v-bind="slotProps" />
    </template>
  </PageLoad>
</template>
<script setup name="ScaffoldForm">
import { VForm } from '@okiss/vbtf'
import PageLoad from '../components/PageLoad.vue'
import { strVarReplace } from '@okiss/utils'
import { merge } from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import http from '../utils/request'
import { ElMessageBox } from 'element-plus'
import { useSettingsStore } from '../store'

const route = useRoute()
const router = useRouter()

const schemaHandler = (schema, project) => {
  const allowedProps = Object.keys(VForm.props)
  Object.keys(schema).forEach(key => {
    if (allowedProps.indexOf(key) === -1) {
      delete schema[key]
      return
    }

    if (/.*Api$/.test(key)) {
      schema[key] = strVarReplace(schema[key], route.params)
    }
  })

  if (schema.saveApi === undefined) {
    if (route.params.id !== undefined) {
      schema.saveApi = `/${project}/update/${route.params.id}`
      if (!schema.getApi) {
        schema.getApi = `/${project}/get/${route.params.id}`
      }
    } else {
      delete schema['getApi']
      schema.saveApi = `/${project}/create`
    }
  }

  schema = merge({
    saveApi: project + '/save',
    afterSubmit: 'goback',
    afterReset: 'goback',
    mod: route.params.id ? 'edit' : 'create'
  }, schema)

  return schema
}

const mutexId = ref(0)
const mutex = () => {
  http.request({
    url: '/form_mutex',
    method: 'get',
    params: {
      path: route.fullPath
    }
  }).then(res => {
    console.log(res)
    if (res.data) {
      clearInterval(mutexId.value)
      ElMessageBox.alert(`${res.data}`, '操作提醒', {
        showClose: false,
        showCancelButton: true,
        confirmButtonText: '返回',
        cancelButtonText: '刷新',
        callback: (action) => {
          if (action === 'cancel') {
            location.reload()
          } else {
            goBack()
          }
        }
      })
    }
  })
}

onMounted(() => {
  const settings = useSettingsStore()
  if (route.params.id !== undefined && settings.formMutex) {
    mutex()
    mutexId.value = setInterval(mutex, 2000)
  }
})
onUnmounted(() => {
  clearInterval(mutexId.value)
})

function goBack() {
  if (route.query?.goback) {
    router.push(route.query?.goback)
  } else {
    history.state.back && history.back()
  }
}
</script>
