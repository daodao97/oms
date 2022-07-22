import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Dashboard from '../scaffold/dashboard.vue'
import Layout from '../scaffold/layout/index.vue'
import Login from '../scaffold/login.vue'
import NotFoundPage from '../scaffold/404.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Root',
    meta: {
      menuType: 1
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: 'Dashboard', icon: 'el-icon-help', menuType: 2, keepAlive: true }
      }
    ]
  },
  {
    path: '/login',
    component: Login,
    meta: { title: '用户登录', menuType: 0 },
    hidden: true
  },
  {
    path: '/404',
    component: NotFoundPage,
    meta: { menuType: 0 },
    hidden: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
