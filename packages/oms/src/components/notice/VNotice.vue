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
    }
  },
  data() {
    return {
      title: {},
      hasNotice: false
    }
  },
  beforeCreate() {
    this.$http.get(this.$props.dataApi).then(({data}) => {
      this.title = data.title
      this.hasNotice = len(data.title) != 0
    })
  }
}
</script>

<style scoped>

</style>
