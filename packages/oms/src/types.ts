import { AxiosRequestConfig } from './utils/request'
import type { RouteRecordRaw } from 'vue-router'
import { Component, Directive, Plugin } from 'vue'
import { MockApi } from './mock/types'
import { Sso } from './utils/sso'

export interface Nav {
}

export type newSso = () => Sso

export interface Settings {
    title?: string,
    fixedHeader?: boolean,
    sidebarLogo?: boolean,
    logo?: string,
    closeNavNotice?: boolean,
    navBarNotice?: string,
    hasNewMessage?: boolean,
    showPageJsonSchema?: boolean,
    loginTips?: string,
    sso?: Record<string, newSso>,
    activeSsoKey?: string,
    ElementPlus?: Object,
    nav?: Nav[],
    whiteRoutes?: Array<string | RegExp>,
    tokenExpire?: number,
    defaultAvatar?: string,
    envColor?: Record<string, string>,
    serviceOffLineNotice? : string,
    formMutex?: boolean
    captcha?: boolean
    themeMode?: 'light' | 'dark'
}

export type UsePlugin = Plugin | [Plugin, any]

export interface OmsPlugin {
    use?: UsePlugin[],
    components?: Record<string, Component>,
    directives?: Record<string, Directive>,
    mockApis?: MockApi[],
    routes?: RouteRecordRaw[],
    // Pinia does not support dynamic registration like Vuex modules;
    // this field is deprecated and ignored in Pinia migration.
    // Kept for backward compatibility with type 'any'.
    storeModules?: Record<string, any>
}

export interface OmsOptions {
    axios?: AxiosRequestConfig,
    settings?: Settings,
    plugins?: OmsPlugin[],
    mock?: boolean,
    form?: FormOptions
}

export interface FormOptions {
    vsPath: string
}

export interface LoginForm {
    username: string,
    password: string
}

export interface LoginTicket {
    ticket: string,
    key: string
}

export type ResourceIds = Array<Array<string>>

export interface UserInfo {
    id: number,
    name: string,
    token: string,
    avatar: string,
    nickname: string,
    role_ids: Array<string>,
    resource: ResourceIds
    env: string,
    website?: any
}

export type Resource = Record<string, boolean | Record<string, boolean>>

// eslint-disable-next-line no-unused-vars
export enum PageType { custom, list, form, customSchema, localComp, tree, report, entity }
// eslint-disable-next-line no-unused-vars
export enum MenuType { hidden = 0, dir = 1, menu = 2, page = 3}

export interface PageInfo {
    module_id: number,
    module_name?: string
    id: number,
    pid: number,
    name: string,
    path: string,
    icon?: string,
    view?: string,
    is_show: number,
    type: number,
    page_type: PageType,
    role?: string,
    children?: PageInfo[],
    code: string
}

export interface RemoteModule {
    id: number,
    label: string,
    routes: PageInfo[]
}

export interface OmsModule {
    id: number,
    label: string,
    routes: RouteRecordRaw[]
}

export interface ImportMetaEnv {
    VITE_BASE_API?: string
    VITE_BASE?: string
}
