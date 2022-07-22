<template>
  <PageLoad :schema-handler="schemaHandler">
    <template #default="slotProps">
      <VTable v-bind="slotProps" />
    </template>
  </PageLoad>
</template>
<script setup name="ScaffoldName">
import { VTable } from '@okiss/vbtf'
import PageLoad from '../components/PageLoad.vue'
import { merge } from 'lodash'

const schemaHandler = (schema, project) => {
  if (schema.orderBy) {
    const defaultSort = {
      prop: schema.orderBy.field,
      order: schema.orderBy.mod === 'desc' ? 'descending' : 'ascending'
    }
    schema.tableProps = merge(schema.tableProps, { defaultSort })
  }
  const allowedProps = Object.keys(VTable.props)
  Object.keys(schema).forEach(key => {
    if (allowedProps.indexOf(key) === -1) {
      delete schema[key]
    }
  })
  if (schema.listApi === undefined) {
    schema.listApi = `/${project}/list`
  }

  return schema
}
</script>
