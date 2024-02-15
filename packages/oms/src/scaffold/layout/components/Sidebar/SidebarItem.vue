<template>
  <div
    v-if="item.hidden !== false"
    class="menu-wrapper"
  >
    <!-- 没有子菜单 -->
    <template v-if="item.meta && item.meta.menuType === 2">
      <app-link
        v-if="item.meta"
        :to="to"
        :new-tab="item.meta.newTab"
      >
        <el-menu-item
          :index="to"
          :class="{ 'submenu-title-noDropdown': !isNest }"
          @click="itemClick"
        >
          <menu-content :meta="item.meta" />
        </el-menu-item>
      </app-link>
    </template>
    <!-- 有子菜单 -->
    <el-sub-menu
      v-else-if="item.meta && item.meta.menuType === 1"
      ref="subMenu"
      :index="to"
      :class="{ 'submenu-title-noDropdown': !isNest }"
    >
      <template #title>
        <app-link
          v-if="item.redirect && item.redirect !== '#'"
          :to="to"
        >
          <menu-content :meta="item.meta" />
        </app-link>
        <menu-content
          v-else
          :meta="item.meta"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :to="getTo(child)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script>
import AppLink from './Link.vue'
import FixiOSBug from './FixiOSBug'
import MenuContent from './MenuContent.vue'
import { Cache } from '@okiss/utils'

export default {
  name: 'SidebarItem',
  components: {
    AppLink,
    MenuContent
  },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: ''
    }
  },
  methods: {
    itemClick() {
      Cache.remove('table_filter:' + this.$props.to)
    },
    getTo(child) {
      try {
        const to = this.$router.resolve(child.redirect ? child.redirect : child)
        return to.fullPath
      } catch (e) {
        console.error('路由解析错误')
        return '/'
      }
    }
  }
}
</script>
