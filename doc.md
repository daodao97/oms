# OMS 使用与协作指南（给 AI）

本文档面向后续接手本仓库的 AI / 自动化代理。

目标不是介绍产品，而是帮助你快速判断：

- 这个仓库的真实结构是什么
- `@okiss/oms` 应该如何初始化和扩展
- 常见需求应该改哪里
- 哪些文档/模板是参考，哪些是当前运行时真实实现

## 1. 仓库定位

这是一个 `pnpm workspace` monorepo，当前核心包主要有：

- `packages/oms`
  - 后台运行时核心，负责应用初始化、路由、权限、PageSchema 加载、布局和基础状态管理。
- `packages/vbtf`
  - 低代码基础组件库，承载表单、表格、按钮等配置化渲染能力。
- `packages/utils`
  - 通用工具库，`oms` 和 `vbtf` 都依赖它。
- `packages/create-app`
  - 脚手架模板，用于创建新项目。
- `docs`
  - VitePress 文档站。

结论：

- 如果用户说“改 OMS 初始化 / 菜单 / 权限 / 动态路由 / 页面渲染”，优先看 `packages/oms`。
- 如果用户说“改表单项 / 表格 cell / 按钮行为 / 组件注册”，优先看 `packages/vbtf`。
- 如果用户说“工具函数 / 请求缓存 / 字符串替换 / 通用 helper”，优先看 `packages/utils`。

## 2. 最重要的入口文件

### 2.1 包入口

- `packages/oms/src/index.ts`

当前对外最重要的导出：

- `createAdmin`
- `useHttp`
- `http`
- `Layout`
- `Container`
- `eventBus`
- `Message` / `MessageBox`
- `setCmp` / `getCmp`
- `regViews`
- store 导出
- request / sso / remote route 相关导出

### 2.2 应用初始化

- `packages/oms/src/admin.ts`

这是 `@okiss/oms` 的实际启动核心。`createAdmin(options)` 会做这些事：

1. 合并默认配置和用户配置
2. 创建 Vue 应用
3. 注册 OMS 内置插件和用户插件
4. 初始化 axios 实例并挂到 `app.config.globalProperties.$http`
5. 初始化 Pinia
6. 初始化 router
7. 监听用户 token 变化并同步可访问路由
8. 设置上传组件默认请求头 `X-Token`
9. `router.isReady()` 后挂载 `#app`

### 2.3 默认路由和路由守卫

- `packages/oms/src/router/router.ts`
- `packages/oms/src/router/guard/index.ts`
- `packages/oms/src/router/guard/remote-routes.ts`
- `packages/oms/src/router/permission.ts`

当前实现特点：

- 使用 `createWebHashHistory()`，不是 history 模式。
- 默认内置 `/dashboard`、`/login`、`/404`。
- 白名单路由默认来自 `settings.whiteRoutes`，默认包含 `/login`。
- 远程路由通过 `/user/routes` 获取，再转成 Vue Router 路由。
- 路由权限按 `role` / `meta.role` 过滤。
- 用户角色包含 `root` 时，直接放行全部路由。

注意一个容易误判的点：

- `whiteRoutes` 的类型声明是 `Array<string | RegExp>`
- 但当前守卫实现实际用的是 `indexOf(to.path)`
- 也就是现在真正可靠的是“字符串精确匹配”，不要假设 `RegExp` 已经生效

### 2.4 PageSchema 加载入口

- `packages/oms/src/components/PageLoad.vue`

这是理解 OMS 的关键文件。

页面打开时会：

1. 根据当前 `route.meta.path` 计算 schema API
2. 默认请求 `/schema${route.meta.path}`
3. 将返回的 schema 交给页面自己的 `schemaHandler`
4. 把结果缓存到 `appStore.pages[route.path]`

因此如果用户问：

- “页面 schema 是从哪里拉的？”
- “为什么某个列表页会自动渲染？”
- “如何拦截页面 schema？”

优先看这里。

## 3. 初始化一个 OMS 应用的推荐方式

推荐以 `packages/create-app/template-ts/src/main.ts` 为起点理解用法。

最小示例：

```ts
import { createAdmin, regViews, setCmp, type OmsOptions } from '@okiss/oms'
import '@okiss/oms/style.css'
import { defineAsyncComponent } from 'vue'

setCmp('dashboard', defineAsyncComponent(() => import('./views/dashboard/index.vue')))
regViews(import.meta.globEager('./views/**/**.vue'))

const options: OmsOptions = {
  axios: {
    baseURL: import.meta.env.VITE_BASE_API + ''
  },
  settings: {
    title: 'OmsAdmin',
    showPageJsonSchema: !import.meta.env.PROD
  },
  plugins: [],
  form: {
    vsPath: import.meta.env.PROD
      ? location.pathname + 'assets/monaco-editor/vs'
      : 'node_modules/monaco-editor/min/vs'
  }
}

createAdmin(options)
```

说明：

- `setCmp(name, cmp)` 用于注册按名字引用的本地组件。
- `regViews(import.meta.globEager(...))` 用于注册本地自定义页面视图，供远程 PageSchema 的 `custom` / `localComp` 类型页面加载。
- `form.vsPath` 主要给 Monaco Editor 使用；涉及代码编辑器时要留意它。

## 4. `OmsOptions` 真正可配什么

定义在：

- `packages/oms/src/types.ts`
- `packages/oms/src/default.ts`

常用字段：

```ts
interface OmsOptions {
  axios?: AxiosRequestConfig
  settings?: Settings
  plugins?: OmsPlugin[]
  mock?: boolean
  form?: {
    vsPath: string
  }
}
```

### 4.1 `settings`

当前有实际效果的常见字段：

- `title`
- `fixedHeader`
- `sidebarLogo`
- `logo`
- `whiteRoutes`
- `tokenExpire`
- `defaultAvatar`
- `serviceOffLineNotice`
- `formMutex`
- `captcha`
- `themeMode`
- `ElementPlus`
- `showPageJsonSchema`

注意：

- 类型里有些字段来自历史版本或后端配置透传，不代表每个字段都在前端所有位置被消费。
- 修改设置项时，先搜索字段名确认真实消费点，不要只看类型定义。

### 4.2 `plugins`

这是 OMS 的主要扩展机制。

类型：

```ts
interface OmsPlugin {
  use?: UsePlugin[]
  components?: Record<string, Component>
  directives?: Record<string, Directive>
  mockApis?: MockApi[]
  routes?: RouteRecordRaw[]
  storeModules?: Record<string, any>
}
```

其中最常用的是：

- `routes`
- `components`
- `directives`
- `use`

注意一个重要事实：

- 当前运行时已经迁移到 `Pinia`
- `storeModules` 还保留在类型里，但在 `packages/oms/src/admin.ts` 中已经被明确标记为 `deprecated and ignored`
- 如果用户要求“动态注册 store module”，要先说明当前实现不会生效

## 5. 后端接口契约

如果你要排查“为什么页面空白 / 菜单没出来 / schema 拉不到 / 登录后没权限”，先看这些接口：

### 5.1 登录

- `POST /user/login`

位置：

- `packages/oms/src/store/modules/user.ts`

成功后会把返回的 `token` 写入 cookie：

- key: `oms:token`

### 5.2 用户信息

- `GET /user/info`

会消费这些字段：

- `name`
- `nickname`
- `role_ids`
- `env`
- `website`

其中：

- `role_ids` 用于路由权限过滤
- `website` 会 merge 到 settings store

但是当前真实实现里还有一个坑：

- 路由权限过滤并不是读取 `/user/info` 返回的 `role_ids`
- 而是读取当前 token 的 JWT payload 里的 `role` 字符串
- 解析逻辑在 `packages/oms/src/utils/jwt.ts`

如果后端 token 不是标准 JWT，或者角色只放在 `/user/info.role_ids` 而没放进 token payload，动态路由权限会异常

### 5.3 远程路由

- `GET /user/routes`

返回 `RemoteModule[]`，再通过：

- `packages/oms/src/router/remote.ts`

转换成前端路由。

### 5.4 页面 Schema

- `GET /schema${route.meta.path}`

这是列表/表单/树/报表/自定义 schema 页面真正的数据源。

### 5.5 通用响应格式

请求拦截逻辑在：

- `packages/oms/src/utils/request/interceptors.ts`

当前默认假设后端返回：

```ts
{
  code: number
  data: any
  message?: string
}
```

行为要点：

- `code === 0` 视为成功
- `code === 401` 会弹窗提示重新登录
- 其他非 0 code 默认弹错误消息并 reject

请求头默认会自动追加：

- `X-Token`
- `X-Path`

其中 `X-Path` 来自当前路由的 `meta.path`。

## 6. PageType 和页面落地方式

远程路由到页面组件的映射逻辑在：

- `packages/oms/src/router/remote.ts`

核心映射关系：

- `PageType.list` -> `packages/oms/src/scaffold/table.vue`
- `PageType.form` -> `packages/oms/src/scaffold/form.vue`
- `PageType.tree` -> `packages/oms/src/scaffold/tree.vue`
- `PageType.report` -> `packages/oms/src/scaffold/report.vue`
- `PageType.customSchema` -> `packages/oms/src/scaffold/custom.vue`
- `PageType.custom` / `PageType.localComp` -> 通过 `regViews()` 注册的本地视图

如果是 `entity` 页面，还会自动生成三个子路由：

- `/path/list`
- `/path/form`
- `/path/:id`

## 7. 表单 / 表格真实渲染链路

如果用户反馈的是“页面 schema 下发了，但渲染不符合预期”，优先沿这个链路排查：

### 7.1 表格页

- `packages/oms/src/scaffold/table.vue`
- `packages/vbtf/src/table/VTable.vue`

OMS 的 `table.vue` 只是包装层：

- 会做 schema 清洗
- 如果没传 `listApi`，默认补成 `/${project}/list`
- 最终真正渲染交给 `VTable`

### 7.2 表单页

- `packages/oms/src/scaffold/form.vue`
- `packages/vbtf/src/form/VForm.vue`

OMS 的 `form.vue` 会根据是否带 `route.params.id` 自动推导：

- 新建：`/${project}/create`
- 编辑保存：`/${project}/update/:id`
- 编辑获取详情：`/${project}/get/:id`

还会默认设置：

- `afterSubmit: 'goback'`
- `afterReset: 'goback'`
- `mod: 'create' | 'edit'`

### 7.3 自定义 schema 页

- `packages/oms/src/scaffold/custom.vue`
- `packages/oms/src/render/index.tsx`

这条链路不是 `VForm` / `VTable`，而是自定义 schema 渲染器。

## 8. 常见需求应该改哪里

### 8.1 改应用初始化 / 插件注册 / axios / token

看：

- `packages/oms/src/admin.ts`
- `packages/oms/src/utils/request/index.ts`
- `packages/oms/src/utils/request/interceptors.ts`
- `packages/oms/src/utils/token.ts`

### 8.2 改登录、用户信息、远程菜单、权限

看：

- `packages/oms/src/store/modules/user.ts`
- `packages/oms/src/router/guard/remote-routes.ts`
- `packages/oms/src/router/permission.ts`

### 8.3 改布局、侧边栏、导航栏、面包屑

看：

- `packages/oms/src/scaffold/layout/index.vue`
- `packages/oms/src/scaffold/layout/components/*`

### 8.4 改 PageSchema 获取逻辑、页面 notice、离线提示

看：

- `packages/oms/src/components/PageLoad.vue`

### 8.5 改表单字段、表格 cell、按钮行为

看：

- `packages/vbtf/src/form/*`
- `packages/vbtf/src/table/*`
- `packages/vbtf/src/button/*`

特别说明：

- `oms` 负责页面级编排
- `vbtf` 负责字段/按钮/单元格级渲染
- 如果问题已经落到具体表单项、表格 cell、按钮弹窗，就不要继续在 `oms` 里兜圈子

### 8.6 改本地自定义页面注册

看：

- `packages/oms/src/utils/container/index.ts`
- `packages/oms/src/router/remote.ts`

涉及 API：

- `setCmp(name, cmp)`
- `regViews(modules)`

## 9. 与 `vbtf` 的协作边界

`@okiss/oms` 依赖 `@okiss/vbtf` 作为 UI 低代码运行时。

AI 在处理需求时要先判断层级：

- 页面 schema 如何加载、路由如何生成、权限怎么判定：`oms`
- 表格怎么渲染、按钮怎么弹窗、表单组件怎么注册：`vbtf`

当前仓库里已经有这些常用注册能力：

- 表单自定义组件：`packages/vbtf/src/form/index.ts`
- 按钮容器/子组件注册：`packages/vbtf/src/button/index.ts`
- 表格 cell 自定义组件：`packages/vbtf/src/table/index.ts`

如果用户提的是“单元格里使用自定义组件”“表单里挂自定义字段组件”，高概率要同时改 `oms` 和 `vbtf` 的衔接，但最终渲染落点通常在 `vbtf`。

## 10. 当前仓库里值得注意的历史痕迹

### 10.1 现在是 Pinia，不是 Vuex

仓库里仍然能看到旧模板或旧类型提到 `vuex` / `storeModules`，但当前核心运行时已经是 Pinia。

结论：

- 新代码按 Pinia 心智写
- 不要再往 `storeModules` 上追加新能力，当前不会生效

### 10.2 脚手架模板可以参考，但以 `packages/oms/src` 实现为准

模板是理解用法的好入口，但不是绝对真理。

做判断优先级：

1. `packages/oms/src/*` 当前源码
2. `packages/oms/dev/*` 本地开发示例
3. `packages/create-app/template-ts/*` 脚手架模板
4. `docs/*` 文档站

当前已知漂移：

- 根 README 仍提到部分历史包名
- 文档站有部分空页面
- `create-app` 模板的依赖声明和当前 `@okiss/oms` peer 依赖并不完全同步
- 脚手架生成后的命令提示仍偏向 `npm/yarn`，而当前仓库实际以 `pnpm` 为中心

### 10.3 `ts` 脚本当前有路径问题

当前仓库内执行：

```bash
pnpm -F @okiss/oms ts
```

会因为 `tsconfig.build.json` 相对路径解析失败而报：

```text
TS5058: The specified path does not exist: 'tsconfig.build.json'
```

因此在没有先修复脚本之前：

- 优先用 `pnpm -F @okiss/oms build` 验证构建链路
- 类型检查若必须执行，需要单独修脚本或改执行方式

### 10.4 有一些全局副作用

当前运行时会做这些全局操作：

- 修改 `String.prototype.format`
- 写入 `window.App`
- 写入 `window.OmsOptions`

排查“为什么全局对象里多了东西”或“为什么字符串多了 format 方法”时，要记得看：

- `packages/oms/src/init.ts`
- `packages/oms/src/admin.ts`

### 10.5 默认配置合并是可变的

`createAdmin()` 和 `useHttp()` 内部使用 `lodash/merge` 合并默认配置。

这意味着：

- 某些默认对象可能被后续调用污染
- 做多实例或反复初始化时要谨慎
- 看到奇怪的“配置串味”时，优先检查默认配置对象是否被复用

## 11. 常用命令

在仓库根目录执行：

```bash
pnpm install
```

开发：

```bash
pnpm -F @okiss/oms dev
pnpm -F @okiss/vbtf dev
pnpm docs:dev
```

构建：

```bash
pnpm -F @okiss/oms build
pnpm -F @okiss/vbtf build
pnpm docs:build
```

## 12. AI 接手任务时的建议流程

建议按这个顺序判断：

1. 先确认问题属于 `oms` 还是 `vbtf`
2. 再定位是“路由/权限/PageSchema”还是“表单/表格/按钮渲染”
3. 从入口文件追到实际消费点，不要只改类型或导出层
4. 如果牵涉远程页面，顺手检查后端契约是否满足 `/user/info`、`/user/routes`、`/schema*`
5. 修改后优先跑对应包的 `build`

## 13. 快速索引

### OMS 核心

- `packages/oms/src/index.ts`
- `packages/oms/src/admin.ts`
- `packages/oms/src/types.ts`
- `packages/oms/src/default.ts`

### 路由与权限

- `packages/oms/src/router/router.ts`
- `packages/oms/src/router/guard/remote-routes.ts`
- `packages/oms/src/router/permission.ts`
- `packages/oms/src/router/remote.ts`

### 页面 schema

- `packages/oms/src/components/PageLoad.vue`
- `packages/oms/src/scaffold/table.vue`
- `packages/oms/src/scaffold/form.vue`
- `packages/oms/src/scaffold/custom.vue`

### 状态与请求

- `packages/oms/src/store/modules/user.ts`
- `packages/oms/src/store/modules/app.ts`
- `packages/oms/src/store/modules/settings.ts`
- `packages/oms/src/utils/request/interceptors.ts`
- `packages/oms/src/utils/token.ts`

### 组件注册与本地视图

- `packages/oms/src/utils/container/index.ts`
- `packages/oms/src/router/remote.ts`
- `packages/create-app/template-ts/src/main.ts`

---

如果你是后续 AI，最短路径是：

先读 `packages/oms/src/admin.ts`、`packages/oms/src/components/PageLoad.vue`、`packages/oms/src/router/remote.ts`、`packages/vbtf/src/table/VTable.vue`。

这四个文件基本覆盖了这个仓库 80% 的真实运行路径。
