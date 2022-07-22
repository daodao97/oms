<template>
  <VIcon
    name="ra-set"
    @click="show = !show"
  />
  <el-drawer
    v-model="show"
    title="页面设计"
    custom-class="my-drawer"
    :direction="direction"
    size="90%"
    destroy-on-close
    append-to-body
  >
    <form-builder
      v-if="pageSchema.formItems !== undefined"
      :schema="pageSchema"
    />
    <table-builder
      v-if="pageSchema.headers !== undefined"
      :schema="pageSchema"
    />
  </el-drawer>
</template>
<script>
import FormBuilder from '../../devtool/formBuilder/index.vue'
import TableBuilder from '../../devtool/tableBuilder/index.vue'
import store from '../../../store'
import { useRoute } from 'vue-router'

export default {
  name: 'PageEditor',
  components: { FormBuilder, TableBuilder },
  setup() {
    const show = ref(false)
    const key = ref(1)
    const direction = 'rtl'
    const route = useRoute()
    const pageSchema = computed(() => {
      return store.state.app.pages[route.path]
    })

    return { show, key, direction, pageSchema: pageSchema }
  }
}
</script>
