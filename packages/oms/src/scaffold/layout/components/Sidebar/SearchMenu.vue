<template>
  <el-select
    v-model="selected"
    filterable
    placeholder="搜索菜单..."
    class="search-menu"
    @change="onselected"
  >
    <template
      v-for="group in filterRoutes"
      :key="group.path"
    >
      <template v-if="group.children !== undefined">
        <el-option-group
          v-if="group.meta.menuType !== 0"
          :key="group.path + '-'"
          :label="group.meta.title"
        >
          <template
            v-for="(item, index) in group.children"
            :key="item.path"
          >
            <el-option
              v-if="group.meta.menuType !== 0"
              :label="(index === (group.children.length - 1) ? '└─' : '├─' )+ item.meta.title"
              :value="getJumpPath(item)"
            />
          </template>
        </el-option-group>
      </template>
      <template v-else>
        <el-option
          :label="'' + group.meta.title"
          :value="getJumpPath(group)"
        />
      </template>
    </template>
  </el-select>
</template>
<script>
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'

function filterHidden(arr) {
  return arr.filter(each => {
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

export default {
  data() {
    return {
      selected: ''
    }
  },
  computed: {
    ...mapGetters(['remoteRouter']),
    filterRoutes() {
      let routes = []
      this.remoteRouter.forEach(item => {
        routes = routes.concat(cloneDeep(item.routes))
      })
      return filterHidden(routes)
    }
  },
  methods: {
    getJumpPath: function(route) {
      let _route = route
      if (route.meta.menuType === 1 && route.children && route.children.length > 0) {
        for (let i = 0; i < route.children.length; i++) {
          if (route.children[i].path.indexOf('/:') === -1) {
            _route = route.children[i]
            break
          }
        }
      }
      return this.$router.resolve(_route.redirect ? _route.redirect : _route).fullPath
    },
    onselected: function(to) {
      this.$router.push(to)
      this.selected = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.search-menu {
  width: 100%;
  padding: 15px 20px 0 20px;

  ::v-deep(.el-select__wrapper) {
    background-color: #304156;
    border: 1px dashed gray;
    border-radius: var(--el-input-border-radius,var(--el-border-radius-base));
    box-shadow: none;
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
