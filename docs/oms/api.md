# OMS 核心包

OMS (Okiss Management System) 是一个基于 Vue 3 的配置化后台管理系统核心运行时包,通过后端下发的 PageSchema 自动渲染页面,实现低代码/零代码的后台页面搭建能力。

## 安装

```bash
pnpm add @okiss/oms @okiss/vbtf @okiss/utils
```

## 快速开始

### 1. 创建应用

```bash
pnpm create @okiss/app my-admin
cd my-admin
pnpm install
pnpm dev
```

### 2. 手动配置

```javascript
// main.ts
import { createAdmin } from '@okiss/oms'

createAdmin({
  axios: {
    baseURL: 'http://localhost:8080/api'
  },
  settings: {
    title: '我的后台管理系统',
    logo: '/logo.png',
    fixedHeader: true,
    sidebarLogo: true
  }
})
```

## 核心 API

### createAdmin

创建 OMS 应用实例的核心函数。

**类型签名:**

```typescript
function createAdmin(options?: OmsOptions): void

interface OmsOptions {
  axios?: AxiosRequestConfig      // Axios 配置
  settings?: Settings              // 系统设置
  plugins?: OmsPlugin[]            // 插件列表
  mock?: boolean                   // 是否启用 Mock
  form?: FormOptions               // 表单配置
}
```

**参数说明:**

#### axios (AxiosRequestConfig)

Axios 请求配置,支持所有 Axios 配置项。

```javascript
{
  axios: {
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  }
}
```

#### settings (Settings)

系统全局设置。

```typescript
interface Settings {
  title?: string                    // 系统标题
  fixedHeader?: boolean             // 固定头部
  sidebarLogo?: boolean             // 显示侧边栏 Logo
  logo?: string                     // Logo 图片地址
  closeNavNotice?: boolean          // 关闭导航通知
  navBarNotice?: string             // 导航栏通知内容
  hasNewMessage?: boolean           // 是否有新消息
  showPageJsonSchema?: boolean      // 显示页面 JSON Schema
  loginTips?: string                // 登录提示
  sso?: Record<string, newSso>      // SSO 配置
  activeSsoKey?: string             // 激活的 SSO Key
  ElementPlus?: Object              // Element Plus 配置
  nav?: Nav[]                       // 导航配置
  whiteRoutes?: Array<string | RegExp>  // 白名单路由
  tokenExpire?: number              // Token 过期时间
  defaultAvatar?: string            // 默认头像
  envColor?: Record<string, string> // 环境颜色配置
  serviceOffLineNotice?: string     // 服务离线通知
  formMutex?: boolean               // 表单互斥
  captcha?: boolean                 // 验证码
  themeMode?: 'light' | 'dark'      // 主题模式
}
```

**示例:**

```javascript
{
  settings: {
    title: '管理后台',
    fixedHeader: true,
    sidebarLogo: true,
    logo: '/logo.png',
    themeMode: 'light',
    whiteRoutes: ['/login', '/404'],
    tokenExpire: 7200,
    defaultAvatar: '/default-avatar.png'
  }
}
```

#### plugins (OmsPlugin[])

插件系统,用于扩展 OMS 功能。

```typescript
interface OmsPlugin {
  use?: UsePlugin[]                          // Vue 插件
  components?: Record<string, Component>     // 全局组件
  directives?: Record<string, Directive>     // 全局指令
  mockApis?: MockApi[]                       // Mock API
  routes?: RouteRecordRaw[]                  // 路由
  storeModules?: Record<string, any>         // Store 模块(已废弃)
}
```

**示例:**

```javascript
{
  plugins: [
    {
      components: {
        'MyCustomComponent': MyCustomComponent
      },
      routes: [
        {
          path: '/custom',
          name: 'Custom',
          component: () => import('./views/Custom.vue')
        }
      ],
      directives: {
        'my-directive': myDirective
      }
    }
  ]
}
```

### useHttp

获取 HTTP 请求实例。

**类型签名:**

```typescript
function useHttp(options?: AxiosRequestConfig): AxiosInstance
```

**使用示例:**

```javascript
import { useHttp } from '@okiss/oms'

const http = useHttp()

// 发起请求
const response = await http.get('/api/users')
const data = await http.post('/api/users', { name: 'John' })
```

### http

全局 HTTP 实例,在 `createAdmin` 后可用。

```javascript
import { http } from '@okiss/oms'

// 直接使用全局实例
const users = await http.get('/users')
```

## 组件

### Layout

主布局组件,包含侧边栏、头部、内容区域。

```vue
<template>
  <Layout />
</template>

<script setup>
import { Layout } from '@okiss/oms'
</script>
```

### Container

容器组件,用于包裹页面内容。

```vue
<template>
  <Container>
    <div>页面内容</div>
  </Container>
</template>

<script setup>
import { Container } from '@okiss/oms'
</script>
```

## Store (Pinia)

OMS 使用 Pinia 进行状态管理,提供以下 Store:

### useAppStore

应用全局状态。

```javascript
import { useAppStore } from '@okiss/oms'

const appStore = useAppStore()

// 设置 Base API
appStore.setBaseAPI('http://localhost:8080/api')

// 获取 Base API
const baseAPI = appStore.baseAPI
```

### useUserStore

用户状态管理。

```javascript
import { useUserStore } from '@okiss/oms'

const userStore = useUserStore()

// 用户信息
const userInfo = userStore.userInfo
const token = userStore.token

// 设置用户信息
userStore.setUserInfo({
  id: 1,
  name: 'John',
  avatar: '/avatar.png'
})

// 登出
userStore.logout()
```

### useSettingsStore

系统设置状态。

```javascript
import { useSettingsStore } from '@okiss/oms'

const settingsStore = useSettingsStore()

// 更新设置
settingsStore.updateSettings({
  title: '新标题',
  themeMode: 'dark'
})

// 获取设置
const title = settingsStore.title
const themeMode = settingsStore.themeMode
```

## 路由系统

### 动态路由

OMS 支持从后端动态加载路由配置。

```javascript
import { fetchRemoteRoutes } from '@okiss/oms'

// 获取远程路由
const routes = await fetchRemoteRoutes()
```

### 权限路由

基于角色的路由权限控制。

```javascript
// 路由配置中添加 role 字段
{
  path: '/admin',
  name: 'Admin',
  component: AdminView,
  meta: {
    role: 'admin'  // 只有 admin 角色可访问
  }
}
```

## SSO 单点登录

### BaseSso

SSO 基类,用于实现自定义 SSO。

```typescript
import { BaseSso } from '@okiss/oms'
import type { SsoType } from '@okiss/oms'

class MyCustomSso extends BaseSso implements SsoType {
  async login() {
    // 实现登录逻辑
  }

  async logout() {
    // 实现登出逻辑
  }

  async getUserInfo() {
    // 获取用户信息
  }
}
```

### 配置 SSO

```javascript
createAdmin({
  settings: {
    sso: {
      'custom': () => new MyCustomSso()
    },
    activeSsoKey: 'custom'
  }
})
```

## 工具函数

### Message

消息提示。

```javascript
import { Message } from '@okiss/oms'

Message.success('操作成功')
Message.error('操作失败')
Message.warning('警告信息')
Message.info('提示信息')
```

### MessageBox

消息弹窗。

```javascript
import { MessageBox } from '@okiss/oms'

// 确认框
await MessageBox.confirm('确定要删除吗?', '提示')

// 提示框
await MessageBox.alert('操作成功', '提示')

// 输入框
const value = await MessageBox.prompt('请输入名称', '提示')
```

### eventBus

事件总线。

```javascript
import eventBus from '@okiss/oms'

// 监听事件
eventBus.on('custom-event', (data) => {
  console.log('收到事件:', data)
})

// 触发事件
eventBus.emit('custom-event', { message: 'Hello' })

// 移除监听
eventBus.off('custom-event')
```

## PageSchema

OMS 的核心概念是通过 PageSchema 配置动态生成页面。

### 页面类型 (PageType)

```typescript
enum PageType {
  custom,        // 自定义页面
  list,          // 列表页
  form,          // 表单页
  customSchema,  // 自定义 Schema
  localComp,     // 本地组件
  tree,          // 树形页面
  report,        // 报表页面
  entity         // 实体页面
}
```

### 菜单类型 (MenuType)

```typescript
enum MenuType {
  hidden = 0,    // 隐藏
  dir = 1,       // 目录
  menu = 2,      // 菜单
  page = 3       // 页面
}
```

### PageInfo

页面信息配置。

```typescript
interface PageInfo {
  module_id: number          // 模块 ID
  module_name?: string       // 模块名称
  id: number                 // 页面 ID
  pid: number                // 父页面 ID
  name: string               // 页面名称
  path: string               // 路由路径
  icon?: string              // 图标
  view?: string              // 视图组件
  is_show: number            // 是否显示
  type: number               // 类型
  page_type: PageType        // 页面类型
  role?: string              // 角色权限
  children?: PageInfo[]      // 子页面
  code: string               // 页面代码
}
```

## TypeScript 支持

OMS 提供完整的 TypeScript 类型定义。

```typescript
import type {
  OmsOptions,
  OmsPlugin,
  Settings,
  UserInfo,
  PageInfo,
  PageType,
  MenuType
} from '@okiss/oms'
```

## 最佳实践

### 1. 项目结构

```
src/
├── views/          # 页面组件
├── components/     # 公共组件
├── plugins/        # OMS 插件
├── utils/          # 工具函数
└── main.ts         # 入口文件
```

### 2. 插件开发

```javascript
// plugins/my-plugin.ts
import type { OmsPlugin } from '@okiss/oms'

export const myPlugin: OmsPlugin = {
  components: {
    // 注册全局组件
  },
  routes: [
    // 添加路由
  ],
  directives: {
    // 注册指令
  }
}

// main.ts
createAdmin({
  plugins: [myPlugin]
})
```

### 3. 环境配置

```javascript
// .env.development
VITE_BASE_API=http://localhost:8080/api

// .env.production
VITE_BASE_API=https://api.example.com

// main.ts
createAdmin({
  axios: {
    baseURL: import.meta.env.VITE_BASE_API
  }
})
```
