<script lang="jsx">
import { useStore } from 'vuex'
import { getCmp } from '../utils/container'

export default defineComponent({
  name: 'Dashboard',
  setup() {
    const store = useStore()
    const name = computed(() => store.getters.name)
    const custom = getCmp('test')
    if (custom) {
      return () => <custom/>
    }
    return () => <div class='dashboard-container'>
      <div class='dashboard-text'>Hi { name.value } 😄</div>
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
