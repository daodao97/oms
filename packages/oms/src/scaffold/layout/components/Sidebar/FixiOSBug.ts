export default {
  computed: {
    // @ts-ignore
    device() {
      // Access device from Pinia state without importing
      // @ts-ignore
      return this.$pinia?.state?.value?.app?.device || 'desktop'
    }
  },
  mounted() {
    // In order to fix the click on menu on the ios device will trigger the mouseleave bug
    // https://github.com/PanJiaChen/vue-element-admin/issues/1135
    // @ts-ignore
    this.fixBugIniOS()
  },
  methods: {
    fixBugIniOS() {
      // @ts-ignore
      const $subMenu = this.$refs.subMenu
      if ($subMenu) {
        const handleMouseleave = $subMenu.handleMouseleave
        // @ts-ignore
        $subMenu.handleMouseleave = e => {
          // @ts-ignore
          if (this.device === 'mobile') {
            return
          }
          handleMouseleave(e)
        }
      }
    }
  }
}
