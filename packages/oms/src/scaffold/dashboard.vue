<script lang="jsx">
import { useStore } from 'vuex'
import { getCmp } from '../utils/container'
import { computed } from 'vue'
import EmptyRole from './EmptyRole.vue'

export default defineComponent({
  name: 'Dashboard',
  setup() {
    const store = useStore()
    const roleIds = computed(() => store.state.settings.loginTips)
    const custom = getCmp('dashboard')
    if (custom) {
      return () => <span>
        <custom/>
        { roleIds.value.length === 0 ? <EmptyRole/> : undefined }
      </span>
    }
    const name = computed(() => store.getters.name)
    return () => <div class='dashboard-container'>
      <div class='dashboard-text'>Hi { name.value } 😄</div>
      { roleIds.value.length === 0 ? <EmptyRole/> : undefined }
    </div>
  }
})
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
