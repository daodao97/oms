<script lang="jsx">
import { useUserStore } from '../store'
import { getCmp } from '../utils/container'
import { computed } from 'vue'

export default defineComponent({
  name: 'Dashboard',
  setup() {
    // use global store shim
    // const roleIds = computed(() => store.state.settings.loginTips)
    const custom = getCmp('dashboard')
    if (custom) {
      return () => <span>
        <custom/>
      </span>
    }
    const name = computed(() => useUserStore().name)
    return () => <div class='dashboard-container'>
      <div class='dashboard-text'>Hi { name.value } 😄</div>
    </div>
  }
})
</script>
