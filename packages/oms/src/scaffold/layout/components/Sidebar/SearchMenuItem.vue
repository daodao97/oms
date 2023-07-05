<template>
  <template
    v-for="(group, index) in groups"
    :key="group.path"
  >
    <template v-if="group.children !== undefined">
      <el-option-group
        v-if="group.meta.menuType !== 0"
        :key="group.path + '-'"
        :label="group.meta.title"
      >
        <SearchMenuItemVue
          :groups="group.children"
          :deep="deep + 1"
        />
      </el-option-group>
    </template>
    <template v-else>
      <el-option
        :label="prefix(index === (groups.length -1)) + group.meta.title"
        :value="getJumpPath(group)"
      />
    </template>
  </template>
</template>
<script setup>
import router from '../../../../router'
const SearchMenuItemVue = defineAsyncComponent(() => import('./SearchMenuItem.vue'))
const props = defineProps({
  deep: {
    type: Number,
    default: 1
  },
  groups: {
    type: Array,
    default: () => []
  }
})

const prefix = (isLast) => {
  if (props.deep === 1) {
    return ''
  }
  return (isLast ? '└' : '├') + '─'.repeat(props.deep)
}

const getJumpPath = function(route) {
  let _route = route
  if (route.meta.menuType === 1 && route.children.length > 0) {
    for (let i = 0; i < route.children.length; i++) {
      if (route.children[i].path.indexOf('/:') === -1) {
        _route = route.children[i]
        break
      }
    }
  }
  return router.resolve(_route.redirect ? _route.redirect : _route).fullPath
}
</script>
