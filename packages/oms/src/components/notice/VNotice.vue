<template>
  <div>
    <el-alert
      v-if="hasNotice"
      v-bind="noticeProps"
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
      noticeProps: {},
      hasNotice: false
    }
  },
  mounted() {
    console.log('dataApi', !!this.$props.dataApi)
    if (this.$props.dataApi) {
      this.$http.get(this.$props.dataApi).then(({ data }) => {
        this.noticeProps = data
        this.hasNotice = !!data
      })
      return
    } else {
      this.hasNotice = Object.keys(this.$props.notice).length > 0
      this.noticeProps = this.$props.notice
    }
  }
}
</script>
