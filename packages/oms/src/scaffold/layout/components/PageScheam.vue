<template>
  <VIcon
    name="ra-code"
    @click="show = !show"
  />
  <el-drawer
    v-model="show"
    title="PageSchema"
    class="my-drawer"
    :direction="direction"
    size="50%"
    destroy-on-close
    append-to-body
  >
    <json-view
      :key="key"
      :data="pageSchema"
      v-bind="{
        theme: '',
        fontSize: 14,
        lineHeight: 24,
        deep: 3,
        closed: false,
        iconStyle: 'circle',
        closed: false
      }"
    />
  </el-drawer>
</template>
<script>
import JsonView from '../../../components/jsonview/index.vue'
import store from '../../store'

export default {
  name: 'PageScheme',
  components: { JsonView },
  setup() {
    const show = ref(false)
    const key = ref(1)
    const direction = 'rtl'
    const route = useRoute()
    const pageSchema = computed(() => {
      return store.state.app.pages[route.path]
    })
    return { show, key, direction, pageSchema }
  }
}
</script>
