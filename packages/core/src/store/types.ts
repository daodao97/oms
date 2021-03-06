import { AxiosInstance } from 'axios'
import { Settings, RemoteModule, Resource } from '../types'
import { RouteRecordRaw } from 'vue-router'

export type strOrNum = string | number

export interface User {
    name: string,
    token: string,
    avatar: string,
    isLodeRemoteRoutes: boolean,
    remoteRouter: RemoteModule[],
    customRouter: RouteRecordRaw[],
    menuRoutes: RouteRecordRaw[]
    roleIds: strOrNum[],
    resource: Resource
}

export interface RootState {
    http: AxiosInstance,
    user: User,
    settings: Settings,
    app: App
}

export interface Sidebar {
    opened: boolean,
    withoutAnimation: boolean
}

export interface App {
    pages: Record<string, any>;
    sidebar: Sidebar,
    device: string,
}

export interface PageSchema {
    page: string
    json: Record<string, any>
}
