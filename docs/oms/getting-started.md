# 快速开始

## 前置准备

请预先配置好本地的开发环境:

- Node.js >= v16.11.0
- pnpm >= 7.0.0 (推荐使用 pnpm)
- Golang >= 1.14 (如需运行后端)

## 使用脚手架创建项目

### 1. 创建前端项目

使用官方脚手架快速创建新项目:

```bash
pnpm create @okiss/app my-admin
```

按照提示选择模板:
- `template-js` - JavaScript 模板
- `template-ts` - TypeScript 模板 (推荐)

### 2. 安装依赖

```bash
cd my-admin
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173 查看应用。

## 手动集成到现有项目

### 1. 安装依赖

```bash
pnpm add @okiss/oms @okiss/vbtf @okiss/utils
pnpm add vue vue-router element-plus axios -D
```

### 2. 创建入口文件

```javascript
// main.ts
import { createAdmin } from '@okiss/oms'

createAdmin({
  axios: {
    baseURL: import.meta.env.VITE_BASE_API || 'http://localhost:8080/api',
    timeout: 10000
  },
  settings: {
    title: '我的管理后台',
    logo: '/logo.png',
    fixedHeader: true,
    sidebarLogo: true,
    themeMode: 'light'
  }
})
```

### 3. 创建 HTML 模板

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>管理后台</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### 4. 配置 Vite

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

## 后端服务

### 1. 克隆后端仓库

```bash
git clone git@github.com:daodao97/goms.git
cd goms
```

### 2. 配置数据库

创建数据库并导入初始化 SQL:

```bash
mysql -u root -p < init.sql
```

### 3. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件,配置数据库连接等信息
```

### 4. 启动后端服务

```bash
go run .
```

后端服务默认运行在 http://localhost:8080

## 使用 OMS CLI (可选)

OMS CLI 提供了一些便捷的命令行工具。

### 1. 安装 CLI

```bash
go get github.com/daodao97/oms-cli
```

### 2. 创建项目

```bash
oms create myapp
```

### 3. 无前端化启动

```bash
oms dev
```

这将启动一个包含前端和后端的完整开发环境。

## 开发模式

### 前端开发

```bash
# 在前端项目目录
pnpm dev
```

### 后端开发

```bash
# 在后端项目目录
go run .
```

### 同时开发前后端

推荐使用两个终端窗口分别运行前端和后端服务。

## 构建生产版本

### 前端构建

```bash
pnpm build
```

构建产物将输出到 `dist` 目录。

### 预览构建结果

```bash
pnpm preview
```

## 目录结构

```
my-admin/
├── public/              # 静态资源
├── src/
│   ├── views/          # 页面组件
│   ├── components/     # 公共组件
│   ├── plugins/        # OMS 插件
│   ├── utils/          # 工具函数
│   └── main.ts         # 入口文件
├── index.html          # HTML 模板
├── vite.config.ts      # Vite 配置
├── package.json        # 项目配置
└── tsconfig.json       # TypeScript 配置
```

## 环境变量

创建 `.env` 文件配置环境变量:

```bash
# .env.development (开发环境)
VITE_BASE_API=http://localhost:8080/api

# .env.production (生产环境)
VITE_BASE_API=https://api.example.com
```

在代码中使用:

```javascript
const baseAPI = import.meta.env.VITE_BASE_API
```

## 常见问题

### 1. 端口被占用

修改 `vite.config.ts` 中的端口配置:

```javascript
export default defineConfig({
  server: {
    port: 3000  // 修改为其他端口
  }
})
```

### 2. 跨域问题

在 `vite.config.ts` 中配置代理:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 3. 依赖安装失败

尝试清除缓存后重新安装:

```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

## 下一步

- 查看 [API 文档](./api.md) 了解核心 API
- 查看 [PageSchema 文档](./page-schema.md) 了解页面配置
- 查看 [VBTF 组件库](../btf/index.md) 了解可用组件
