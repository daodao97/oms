import { AxiosInstance } from 'axios'
import { RemoteModule, Resource, Settings } from '../types'
import { RouteRecordRaw } from 'vue-router'

export type strOrNum = string | number

export interface User {
    name: string,
    nickname: string,
    token: string,
    avatar: string,
    isLodeRemoteRoutes: boolean,
    remoteRouter: RemoteModule[],
    customRouter: RouteRecordRaw[],
    menuRoutes: RouteRecordRaw[]
    roleIds: strOrNum[],
    resource: Resource,
    path: string
    env: string
}

export interface RootState {
    http: AxiosInstance,
    user: User,
    settings: Settings,
    app: App,
    builderSchema: BuilderSchema,
}

export interface Sidebar {
    opened: boolean,
    withoutAnimation: boolean
}

export interface App {
    pages: Record<string, any>;
    sidebar: Sidebar,
    device: string,
    currentRouteMeta: Record<string, any>;
    builderSchema: Record<string, any>;
}

export interface PageSchema {
    page: string
    json: Record<string, any>
}

export interface BuilderSchema {
    currentCellItem: Record<string, any>
}
