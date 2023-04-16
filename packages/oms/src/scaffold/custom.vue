<template>
  <PageLoad :schema-handler="schemaHandler">
    <render :schema="schema" />
  </PageLoad>
</template>
<script setup name="Custom">
import PageLoad from '../components/PageLoad.vue'
import { render } from '../render'
import { toRaw } from 'vue'
const schema = ref([])
const schemaHandler = (_schema, project) => {
  schema.value = toRaw(_schema)
  return _schema
}
</script>
