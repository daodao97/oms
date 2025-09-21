<div align="center">
  <p>
    <img width="100" src="https://gitee.com/daodao97/asset/raw/master/devbox/kegFW7si7Z.png">
  </p>
  <div align="center">

[vue3](https://vue3js.cn/docs/zh/) |
[element-plus](https://element-plus.gitee.io/#/zh-CN/component/quickstart) |
[vite2](https://cn.vitejs.dev/guide/why.html) 

  </div>

  <div align="center">
     <p> golang | <strike>php</strike> | <strike>java</strike> | <strike>python</strike></p>
  </div>
 
  <div>

[体验站点](http://daodao97.gitee.io/oms-demo) |
[详细文档](https://daodao97.gitee.io/oms) |
[表单构建](http://daodao97.gitee.io/oms-demo/#/devtool/gen_from) |
[列表构建](http://daodao97.gitee.io/oms-demo/#/devtool/gen_table)

  </div>

</div>

`oms` 是基于 `Vue3`, `element-plus`, `vue-admin-template` 的配置化后台构建工具, 核心概念是配置化渲染, 页面根据后端下发的 `PageSchema` 自动渲染, 辅助可视化`PageSchema`构造工具, 使常见的后台页面可以无代码实现.

### 目标

`设计完数据库即完成了开发`

打造一套完整的低代码后台构建工具集, 包含前端和后端的完整链路, 通过可视化搭建, 即可实现常见的后台功能.

### 本地启动

```shell
yarn create @okiss/app admin
cd admin
yarn
yarn serve
```

### 常用命令

建议使用 pnpm 进行工作区管理。

安装依赖

```bash
pnpm i
```

开发调试（按包）

```bash
# OMS 核心
pnpm -F @okiss/oms dev

# 低代码基础组件 vbtf
pnpm -F @okiss/vbtf dev

# 表单引擎 vform
pnpm -F @okiss/vform dev

# 工具库 utils
pnpm -F @okiss/utils dev

# 模板应用 template
pnpm -F @okiss/template dev

# 开发者工具插件 plugin-devtool
pnpm -F @okiss/plugin-devtool dev
```

构建与类型检查

```bash
# 构建对应包
pnpm -F @okiss/oms build
pnpm -F @okiss/vbtf build
pnpm -F @okiss/utils build

# 仅生成类型声明（如有）
pnpm -F @okiss/oms ts
pnpm -F @okiss/vbtf ts
pnpm -F @okiss/utils ts
```

发布（内部脚本）

```bash
pnpm -F @okiss/oms release
pnpm -F @okiss/vbtf release
pnpm -F @okiss/utils release
pnpm -F @okiss/plugin-devtool release

# 一键按依赖顺序发布（utils -> vbtf -> vform -> oms）
pnpm release.all
```

升级

```bash
pnpm up @okiss/vbtf --latest
```

文档相关

```bash
# 本地启动文档站点
pnpm docs:dev

# 构建文档
pnpm docs:build

# 本地预览构建后的文档
pnpm docs:serve
```

预览/服务（示例）

```bash
# 模板应用预览
pnpm -F @okiss/template preview

# 插件示例预览
pnpm -F @okiss/plugin-devtool serve
```

### 使用 @okiss/oms 时的 Peer 依赖

为避免重复安装和版本冲突，`@okiss/oms` 将以下依赖声明为 peer（请在你的项目中同时安装）：

```bash
pnpm add vue@^3.5 vue-router@^4.5 element-plus@^2.8 @okiss/utils@^0.0.12 @okiss/vbtf@^0.0.106
```

### 使用 @okiss/vbtf 或 @okiss/vform 的 Peer 依赖

若在项目中直接使用组件库包，需要安装其 peer 依赖：

```bash
# vbtf
pnpm add vue@^3.5 vue-router@^4.5 element-plus@^2.8 @okiss/utils@^0.0.12

# vform
pnpm add vue@^3.5 element-plus@^2.8 @okiss/utils@^0.0.12
```

### 使用 @okiss/plugin-devtool 的 Peer 依赖

`@okiss/plugin-devtool` 依赖于 `@okiss/oms` 与 `vue`，请在宿主项目中安装：

```bash
pnpm add vue@^3.5 @okiss/oms@^0.0.65

# 同时确保已安装 @okiss/oms 所需的 peer 依赖（见上文）
```

### 运行流程

<div align="center">
    <img src="https://gitee.com/daodao97/asset/raw/master/imgs/tgK1ZU.jpg">
</div>

### 插件机制

![Mw8VBC](https://gitee.com/daodao97/asset/raw/master/imgs/Mw8VBC.png)

#### `@okiss/oms` 
  
  核心组件, 用于构建整个后台应用机制, 包括 路由/鉴权/菜单/PageSchema解析等基础能力
  
#### `@okiss/plugin-devtool`
  
  辅助开发组件, 注册页面构建工具的菜单及功能实现

> Don't Repeat Yourself
