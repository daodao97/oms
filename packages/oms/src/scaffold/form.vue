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
import { useRoute } from 'vue-router'
const route = useRoute()

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
</script>
