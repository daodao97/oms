<template>
  <video
    v-if="!!localPlayUrl"
    :key="localPlayUrl"
    :src="localPlayUrl"
    controls="controls"
    preload=""
    autoplay="autoplay"
    style="width: 100%; height: 500px"
  />
</template>
<script lang="ts">

export default defineComponent({
  name: 'VPlayer',
  props: {
    playurl: {
      type: String,
      default: ''
    },
    playApi: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      localPlayUrl: this.$props.playurl
    }
  },
  beforeCreate() {
    this.$props.playApi && this.$http.request({
      url: this.$props.playApi
    }).then(({ data } : Record<string, any>) => {
      console.log(data)
      this.localPlayUrl = data.playurl
    })
  }
})
</script>
