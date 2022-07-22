import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@okiss/oms'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: []
  }
]
