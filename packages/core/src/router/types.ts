import { RouteMeta } from 'vue-router'

export interface OmsRouteMeta extends RouteMeta {
    menuType: number,
    keepAlive?: boolean
}
