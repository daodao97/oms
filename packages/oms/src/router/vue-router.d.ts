import 'vue-router'

declare module 'vue-router' {
    interface _RouteRecordBase {
        hidden?: boolean
    }

    interface RouteLocationNormalized {
        preHash: string
    }

    interface RouteMeta {
        pageSchema?: Record<string, any>
        menuType: number,
        id: number
        pageId: number
        title: string
        keepAlive?: boolean
        hidden?: boolean
    }
}
