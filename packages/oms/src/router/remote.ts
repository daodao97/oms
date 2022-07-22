import type { RouteRecordRaw } from 'vue-router'
import { MenuType, OmsModule, PageInfo, PageType, RemoteModule } from '../types'
import { Component } from 'vue'
import { Container, Form, Report, Table, Tree } from '../scaffold'

let bu: Record<string, any> = {}
export function regViews(_bu: Record<string, any>) {
  bu = _bu
}

const getComponent = (item: PageInfo): Component => {
  const loadCustom = (path: string): any => {
    const _path = './views/' + path + '.vue'
    if (bu && bu[_path] && bu[_path].default) {
      return bu[_path].default
    }
    console.error(`自定义组件不存在 ${item.name} ${item.view}`)
    return Container
  }
  if (item.path === '#') {
    return Container
  }
  switch (item.page_type) {
    case PageType.list:
      return Table
    case PageType.form:
      return Form
    case PageType.custom:
    case PageType.localComp:
      return loadCustom(item.view || '')
    case PageType.tree:
      return Tree
    case PageType.report:
      return Report
    case PageType.customSchema:
      return Container
  }
  return Container
}

function getPath(item: PageInfo) {
  let path = item.path
  if (item.type === MenuType.menu && item.page_type === PageType.entity) {
    path = '#'
  }
  // :id 默认转换为数字型匹配模式
  if (path.indexOf(':id') > -1 && path.indexOf(':id') + 3 === path.length) {
    path = path.replace(':id', ':id(\\d+)')
  }
  return path === '#'
    ? '/' + item.id + '_DIR_' + item.name
    : path[0] !== '/'
      ? '/' + path
      : path
}

function getName(item: PageInfo): string {
  return (item.path + item.name).split('/').filter(v => v).join('_')
}

const transRoute = (item: PageInfo): RouteRecordRaw => {
  const isShow = item.type !== MenuType.page
  const route: RouteRecordRaw = {
    path: getPath(item),
    name: item.id + '_' + getName(item) + '_' + item.path.replaceAll('/', '_'),
    component: getComponent(item),
    meta: {
      id: item.id,
      pageId: item.id,
      title: item.name,
      icon: item.icon,
      hidden: !isShow,
      path: item.path,
      menuType: item.type,
      keepAlive: false
    },
    children: item.children ? item.children.map(each => transRoute(each)) : []
  }
  if (item.page_type === PageType.entity) {
    const createList = item.path + '/list'
    const createForm = item.path + '/form'
    const createEdit = item.path + '/:id'
    const children : Array<RouteRecordRaw> = [{
      path: createList,
      name: item.name + '列表' + item.id,
      component: Table,
      meta: {
        id: item.id + 99999,
        title: '列表',
        hidden: true,
        menuType: MenuType.hidden,
        keepAlive: false,
        pageId: item.id
      }
    }, {
      path: createForm,
      name: item.name + '新建' + item.id,
      component: Form,
      meta: {
        id: item.id + 99999 + 1,
        title: '新建',
        hidden: true,
        menuType: MenuType.hidden,
        keepAlive: false,
        pageId: item.id
      }
    }, {
      path: createEdit,
      name: item.name + '编辑' + item.id,
      component: Form,
      meta: {
        id: item.id + 99999 + 2,
        title: '编辑',
        hidden: true,
        menuType: MenuType.hidden,
        keepAlive: false,
        pageId: item.id
      }
    }]
    route.children = [...children, ...route.children as RouteRecordRaw[]]
  }
  if (route.children && route.children.length > 0) {
    let allChildHidden = true
    route.children.forEach(each => {
      if (each.meta && !each.meta.hidden) {
        allChildHidden = false
      }
    })
    if (route.meta) {
      route.meta.menuType = isShow ? MenuType.dir : MenuType.hidden
    }
    if (allChildHidden) {
      if (route.meta) {
        route.meta.menuType = MenuType.menu
      }
      let redirect = '/'
      for (let i = 0; i < route.children.length; i++) {
        if (route.children[i].path.indexOf('/:') === -1) {
          redirect = route.children[i].path
          break
        }
      }
      route.redirect = redirect
      route.path = '/' + item.id + '_DIR' + route.redirect.replaceAll('/', '_').toUpperCase()
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
