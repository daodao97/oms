<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Hi {{ name }} 😄</div>
    <i class="el-icon-edit"></i>
    <i class="el-icon-share"></i>
    <i class="el-icon-delete"></i>
    <el-button type="primary" icon="el-icon-search">搜索</el-button>
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
