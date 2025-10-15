import 'vue-router'

declare module 'vue-router' {
    interface _RouteRecordBase {
        hidden?: boolean
        role?: string
    }

    interface RouteMeta {
        pageSchema?: Record<string, any>
        menuType: number,
        id: number
        pageId: number
        title: string
        keepAlive?: boolean
        hidden?: boolean
        path?: string
        role?: string
    }
}
