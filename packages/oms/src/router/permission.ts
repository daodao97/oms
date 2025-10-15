import type { RouteRecordRaw } from 'vue-router'

const SUPER_ROLE = 'root'

const splitRoles = (roleValue: string | undefined): string[] => {
  if (!roleValue) {
    return []
  }
  return roleValue
    .split(',')
    .map(item => item.trim())
    .filter(item => !!item)
}

const getRouteRoles = (route: RouteRecordRaw): string[] => {
  const directRole = typeof (route as any).role === 'string' ? (route as any).role : ''
  const metaRole = route.meta && typeof (route.meta as any).role === 'string' ? (route.meta as any).role : ''
  const roles = [...splitRoles(directRole), ...splitRoles(metaRole)]
  if (!roles.length && route.children && route.children.length) {
    return []
  }
  return Array.from(new Set(roles))
}

const cloneRoute = (route: RouteRecordRaw): RouteRecordRaw => {
  const cloned: RouteRecordRaw = { ...route }
  if (route.meta) {
    cloned.meta = { ...route.meta }
  }
  if (route.children && route.children.length) {
    cloned.children = route.children.map(item => cloneRoute(item))
  }
  return cloned
}

const hasPermission = (routeRoles: string[], userRoles: string[]): boolean => {
  if (!routeRoles.length) {
    return true
  }
  if (!userRoles.length) {
    return false
  }
  return routeRoles.some(role => userRoles.includes(role))
}

export const filterRoutesByRole = (routes: RouteRecordRaw[] = [], userRoles: string[]): RouteRecordRaw[] => {
  if (userRoles.includes(SUPER_ROLE)) {
    return routes.map(route => cloneRoute(route))
  }
  return routes.reduce<RouteRecordRaw[]>((acc, route) => {
    const routeRoles = getRouteRoles(route)
    if (!hasPermission(routeRoles, userRoles)) {
      return acc
    }
    const cloned: RouteRecordRaw = { ...route }
    if (route.meta) {
      cloned.meta = { ...route.meta }
    }
    if (route.children && route.children.length) {
      const children = filterRoutesByRole(route.children, userRoles)
      if (children.length) {
        cloned.children = children
      } else {
        delete cloned.children
      }
    }
    acc.push(cloned)
    return acc
  }, [])
}
