<template>
  <el-alter
      v-if="hasNotice"
      :title = "title"
  />
</template>

<script>
export default {
  name: 'VNotice',
  props: {
    dataApi: {
      type: String,
      default: ''
    },
    notice: {}
  },
  data() {
    return {
      title: {},
      hasNotice: false
    }
  },
  beforeCreate() {
    if (len(this.$props.dataApi) != 0) {
      this.$http.get(this.$props.dataApi).then(({ data }) => {
        this.title = data.title
        this.hasNotice = len(data.title) != 0
      })
      return
    }
    this.title = this.notice.title
  }
}
</script>

<style scoped>

</style>
