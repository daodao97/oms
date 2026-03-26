import type { Router } from 'vue-router'
import guard from './guard'
import createOmsRouter from './router'

const guardedRouters = new WeakSet<Router>()
let defaultRouter: Router | null = null
let activeRouter: Router | null = null

export function ensureOmsRouterGuards(router: Router): Router {
  if (!guardedRouters.has(router)) {
    guard(router)
    guardedRouters.add(router)
  }
  return router
}

export function getDefaultOmsRouter(): Router {
  if (!defaultRouter) {
    defaultRouter = ensureOmsRouterGuards(createOmsRouter())
  }
  return defaultRouter
}

export function resolveOmsRouter(router?: Router | null): Router {
  return ensureOmsRouterGuards(router || getDefaultOmsRouter())
}

export function setActiveOmsRouter(router: Router) {
  activeRouter = router
}

export function getActiveOmsRouter(): Router {
  return activeRouter || getDefaultOmsRouter()
}

export { createOmsRouter }

export default getDefaultOmsRouter()
