<template>
  <div>
    <el-alert
      v-if="hasNotice"
      :title="title"
    />
  </div>
</template>

<script>
export default {
  name: 'VNotice',
  props: {
    dataApi: {
      type: String,
      default: ''
    },
    notice: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      title: '',
      hasNotice: false
    }
  },
  beforeCreate() {
    if (this.$props.dataApi) {
      this.$http.get(this.$props.dataApi).then(({ data }) => {
        this.title = data.title
        this.hasNotice = !!data.title
      })
      return
    } else {
      this.title = this.notice.title
    }
  }
}
</script>
