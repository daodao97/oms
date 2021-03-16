import Form from '../scaffold/form.vue'
import Container from '../scaffold/container.vue'
import Table from '../scaffold/table.vue'
import { RouteRecordRaw } from 'vue-router'
import { PageType, RemoteModule, PageInfo, OmsModule } from '../types'
import { Component } from '@vue/runtime-core'

const getComponent = (item: PageInfo): Component => {
  if (item.view) {
    return () => {
      return new Promise((resolve) => {
        resolve(require('@/views/' + item.view))
      })
    }
  }
  if (item.path === '#') {
    return Container
  }
  switch (item.page_type) {
    case PageType.list:
      return Table
    case PageType.form:
      // @ts-ignore
      return Form
    case PageType.custom:
      return () => {
        return new Promise((resolve) => {
          resolve(require('@/views/' + item.view))
        })
      }
    case PageType.customSchema:
      return Container
  }
  return Container
}

function getPath(item: PageInfo) {
  let path = item.path
  // :id 默认转换为数字型匹配模式
  if (path.indexOf(':id') > -1 && path.indexOf(':id') + 3 === path.length) {
    path = path.replace(':id', ':id(\\d+)')
  }
  return path === '#'
    ? '/DIR_' + item.name
    : path[0] !== '/'
      ? '/' + path
      : path
}

function getName(item: PageInfo) : string {
  return (item.path + item.name).split('/').filter(v => v).join('_')
}

const transRoute = (item: PageInfo): RouteRecordRaw => {
  const isShow = item.is_show !== undefined ? !!item.is_show : true
  const route: RouteRecordRaw = {
    path: getPath(item),
    name: getName(item),
    component: getComponent(item),
    meta: {
      id: item.id,
      title: item.name,
      icon: item.icon,
      hidden: !isShow,
      pageSchema: item.page_schema || {},
      menuType: isShow ? 2 : 0 // 0 隐藏, 1 目录 2 菜单
    },
    children: item.children ? item.children.map(each => transRoute(each)) : []
  }
  if (route.children && route.children.length > 0) {
    let allChildHidden = true
    route.children.forEach(each => {
      if (each.meta && !each.meta.hidden) {
        allChildHidden = false
      }
    })
    if (route.meta) {
      route.meta.menuType = isShow ? 1 : 0
    }
    if (allChildHidden) {
      if (route.meta) {
        route.meta.menuType = 2
      }
      route.redirect = route.children[0].path
      route.path = '/DIR' + route.redirect.replaceAll('/', '_').toUpperCase()
    }
  }

  return route
}

export const transRemoteModules = (data: RemoteModule[]): OmsModule[] => {
  const vueRouteModule: OmsModule[] = []
  data.forEach(item => {
    const m: OmsModule = {
      id: item.id,
      label: item.label,
      routes: []
    }
    item.routes.forEach(each => {
      m.routes.push(transRoute(each))
    })
    vueRouteModule.push(m)
  })

  return vueRouteModule
}
