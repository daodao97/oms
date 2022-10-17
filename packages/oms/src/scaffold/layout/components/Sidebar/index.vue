<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo
      v-if="showLogo"
      :collapse="isCollapse"
    />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <search-menu v-if="!isCollapse" />
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <template
          v-for="(item, index) in routes"
          :key="index + '-module'"
        >
          <!-- <div v-if="item.routes.length > 0 && item.label" class="menu-section">{{ item.label }}</div>-->
          <sidebar-item
            v-for="route in filterRoute(item.routes)"
            :key="route.path"
            :item="route"
            :to="$router.resolve(route.redirect ? route.redirect : route).fullPath"
          />
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import SearchMenu from './SearchMenu.vue'
import { cloneDeep } from 'lodash'
import { MenuType } from '../../../../types'
import { showEleByClassName } from '@okiss/utils'

export default defineComponent({
  components: { SidebarItem, Logo, SearchMenu },
  computed: {
    ...mapGetters(['sidebar', 'remoteRouter', 'customRouter']),
    routes() {
      let localRoutes = []
      this.$router.options.routes.concat(this.customRouter || []).forEach(item => {
        if (item.path === '/') {
          localRoutes = localRoutes.concat(item.children || [])
        } else {
          localRoutes.push(item)
        }
      })
      console.log(cloneDeep([
        {
          label: '',
          routes: localRoutes
        },
        ...this.remoteRouter
      ]))
      return cloneDeep([
        {
          label: '',
          routes: localRoutes
        },
        ...this.remoteRouter
      ])
    },
    activeMenu() {
      console.log(2222, this.$route)
      let m = this.$route.matched

      for(let i = m.length - 1; i >= 0; i--) {
        let tmp = m[i]
        if (tmp.meta.menuType == MenuType.menu) {
          return this.$router.resolve(tmp.redirect ? tmp.redirect : tmp).fullPath 
        }
      }
      
      return ''
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return {
        menuBg: '#304156',
        menuText: '#bfcbd9',
        menuActiveText: '#409EFF'
      }
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    showEleByClassName('is-active')
  },
  methods: {
    filterRoute(arr) {
      return arr.filter(item => {
        // console.log(item, [1, 2].indexOf(item.meta.menuType) > 0)
        // 1 目录 2 菜单
        return [MenuType.dir, MenuType.menu].indexOf(item.meta.menuType) !== -1
      }).map(item => {
        item = Object.assign({}, item)
        if (item.children) {
          item.children = this.filterRoute(item.children)
        }
        return item
      })
    }
  }
})
</script>
<style scoped>
::v-deep(.el-scrollbar__wrap) {
  overflow: scroll;
}

.menu-section {
  height: 30px;
  font-size: 14px;
  display: table-cell;
  vertical-align: bottom;
  padding-left: 20px;
  color: #97a8be;
  padding-top: 5px;
}
</style>
