<template>
  <div class="image-item">
    <v-player :playurl="data" />
  </div>
</template>
<script lang="ts">
import VPlayer from '../../VPlayer.vue'
export default {
  name: 'CellPlayer',
  components: { VPlayer },
  props: {
    data: {
      type: String,
      default: ''
    },
    column: {
      type: Object,
      default: () => {
      }
    },
    row: {
      type: Object,
      default: () => {}
    },
    scope: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
