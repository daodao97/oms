<template>
  <el-select v-model="selected" filterable placeholder="搜索菜单..." class="search-menu" @change="onselected">
    <template v-for="group in filterRoutes" :key="group.path">
      <template v-if="group.children !== undefined">
        <el-option-group v-if="group.meta.menuType !== 0" :key="group.path + '-'" :label="group.meta.title">
          <template v-for="(item, index) in group.children" :key="item.path">
            <el-option v-if="group.meta.menuType !== 0"
              :label="(index === (group.children.length - 1) ? '└─' : '├─') + item.meta.title"
              :value="getJumpPath(item)" />
          </template>
        </el-option-group>
      </template>
      <template v-else>
        <el-option :label="'' + group.meta.title" :value="getJumpPath(group)" />
      </template>
    </template>
  </el-select>
</template>
<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { useUserStore } from '../../../../store'
import { useRouter } from 'vue-router'
const userStore = useUserStore()

function filterHidden(arr: any[]) {
  return arr.filter((each: any) => {
    if (each.meta?.menuType === 0) {
      return false
    }
    if (each.children) {
      each.children = filterHidden(each.children)
      if (each.children.length === 0) {
        delete each.children
      }
    }
    return true
  })
}

const selected = ref('')
const remoteRouter = computed(() => userStore.remoteRouter)
const router = useRouter()

const filterRoutes = computed(() => {
  let routes: any[] = []
  remoteRouter.value.forEach(item => { routes = routes.concat(cloneDeep(item.routes)) })
  return filterHidden(routes)
})

function getJumpPath(route: any) {
  let _route = route
  if (route.meta.menuType === 1 && route.children && route.children.length > 0) {
    for (let i = 0; i < route.children.length; i++) {
      if (route.children[i].path.indexOf('/:') === -1) {
        _route = route.children[i]
        break
      }
    }
  }
  return router.resolve(_route.redirect ? _route.redirect : _route).fullPath
}
function onselected(to: string) { router.push(to); selected.value = '' }
</script>
<style lang="scss" scoped>
.search-menu {
  width: 100%;
  padding: 10px 20px;

  ::v-deep(.el-select__wrapper) {
    background-color: transparent;
    border: 1.5px solid var(--border-color);
    border-radius: 12px;
    box-shadow: none;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--sidebar-active-text-color);
      background-color: var(--sidebar-hover-bg);
    }
  }

  //::v-deep(.el-input__wrapper:hover) {
  //  box-shadow: none;
  //}
  //::v-deep(.el-input__wrapper:focus) {
  //  box-shadow: none;
  //}
  //::v-deep(.is-focus) {
  //  border: none;
  //  box-shadow: none;
  //}
}

.filter-tree {
  max-height: 500px;
}
</style>
