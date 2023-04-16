import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@okiss/oms'
import { MenuType } from '@okiss/oms'
import Test from '../views/test/index.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/test',
        name: 'Test',
        component: Test,
        meta: { menuType: MenuType.hidden }
      }
      // {
      //   path: '/test',
      //   name: 'Test',
      //   component: Test,
      //   meta: { title: '自定义目录', icon: 'el-icon-s-tools', menuType: MenuType.dir },
      //   children: [
      //     {
      //       path: '/test1',
      //       name: 'Test1',
      //       component: Test,
      //       meta: { title: '自定义路由', icon: 'el-icon-s-tools', menuType: MenuType.menu }
      //     }
      //   ]
      // }
    ]
  }
]
