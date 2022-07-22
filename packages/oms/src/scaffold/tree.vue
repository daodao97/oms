<template>
  <PageLoad :schema-handler="schemaHandler">
    <template #default="slotProps">
      <VTree v-bind="slotProps" />
    </template>
  </PageLoad>
</template>
<script setup>
import VTree from '../components/VTree.vue'
import PageLoad from '../components/PageLoad.vue'
const schemaHandler = (schema, project) => {
  const allowedProps = Object.keys(VTree.props)
  Object.keys(schema).forEach(key => {
    if (allowedProps.indexOf(key) === -1) {
      delete schema[key]
    }
  })

  return schema
}
</script>
