<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Hi {{ name }} 😄</div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name']),
    admin() {
      return this.$store.state.settings
    }
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
