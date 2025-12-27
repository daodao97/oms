# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 常用命令速查

本仓库是一个基于 pnpm workspace 的多包前端 monorepo，所有命令默认在仓库根目录执行。

### 0. 快速创建新应用

```bash
# 使用脚手架创建新的应用项目
yarn create @okiss/app admin
cd admin
yarn
yarn serve
```

### 1. 依赖安装

```bash
# 推荐使用 pnpm（部分包通过 only-allow 强制）
pnpm install

# 升级特定包到最新版本
pnpm up @okiss/vbtf --latest
```

### 2. 文档站（VitePress）

```bash
# 本地开发文档站
pnpm docs:dev

# 构建文档
pnpm docs:build

# 预览已构建文档
pnpm docs:serve
```

### 3. 各包开发命令

各包统一通过 `pnpm -F <package-name> <script>` 运行。

```bash
# OMS 核心包
pnpm -F @okiss/oms dev
pnpm -F @okiss/oms build
pnpm -F @okiss/oms ts      # 仅生成类型声明（如有）

# 低代码基础组件库 vbtf
pnpm -F @okiss/vbtf dev
pnpm -F @okiss/vbtf build
pnpm -F @okiss/vbtf ts

# 工具库 utils
pnpm -F @okiss/utils dev
pnpm -F @okiss/utils build
pnpm -F @okiss/utils ts

# 模板应用（示例/脚手架模板）
pnpm -F @okiss/template dev
pnpm -F @okiss/template build
pnpm -F @okiss/template preview
pnpm -F @okiss/template serve
pnpm -F @okiss/template export
```

> 提示：若未来新增包，优先保持相同的 `dev/build/preview/serve` 命名风格，并通过 `pnpm -F` 调用。

### 4. Lint / 代码风格

本仓库使用 ESLint（含 `eslint-plugin-vue` / `@typescript-eslint`）。当前主要通过直接调用 eslint 完成检查：

```bash
# 在各包内（示例：template 包中）
pnpm -F @okiss/template eslint
# 等价于
eslint --fix --ext .tsx --ext .ts --ext .js --ext .vue core/ src/
```

> 建议：新增代码时优先放在 `core/` 或 `src/` 目录，确保被现有 eslint 命令覆盖。

### 5. 发布相关

```bash
# 单包发布（内部脚本）
pnpm -F @okiss/oms release
pnpm -F @okiss/vbtf release
pnpm -F @okiss/utils release
# 其他包如 @okiss/plugin-devtool 如在 workspace 中，遵循相同模式

# 按依赖顺序整体发布（utils -> vbtf -> vform -> oms）
pnpm release.all
```

> 注意：`vform` 包目前可能不在本仓库，但发布顺序在语义上仍然生效，后续扩展需要遵守依赖链顺序。

### 6. 测试

当前仓库未配置显式的测试框架（未找到 jest / vitest / cypress 等脚本）。

- 若需要新增测试，请显式选型测试框架，并在对应包内新增 `test` 脚本（同时更新本文件）。
- 在修改与构建流程耦合较强的代码时，优先通过示例应用（`@okiss/template`）和文档站进行手动验证。


## 高层架构与包关系

本仓库是一个围绕“配置化后台构建工具（OMS）”的多包前端 monorepo，采用 **Vue 3 + Element Plus + Vite** 技术栈，通过后端下发的 `PageSchema` 自动渲染页面，实现低代码/零代码的典型后台页面搭建能力。

整体结构主要包括：核心运行时包、低代码组件库、工具库、模板应用与文档站。

### 1. 包结构概览（/packages）

- `@okiss/oms` (`packages/oms`)
  - 角色：**核心运行时 / 业务骨架包**。
  - 职责：路由、权限、菜单、`PageSchema` 解析与页面渲染等，是整套系统的中枢。
  - 依赖：将 `@okiss/utils`、`@okiss/vbtf` 以及 `element-plus`、`vue`、`vue-router` 等声明为 peerDependencies。
  - 构建：入口统一为 `src/index.ts`，使用 Vite lib 模式 + Rollup 输出 `dist/index.es.js`、`dist/style.css` 和 `dist/types/...`。

- `@okiss/vbtf` (`packages/vbtf`)
  - 角色：**低代码基础组件库**（表单、表格、拖拽等）。
  - 职责：提供丰富的可复用 UI 组件和交互能力，如导出、拖拽排序、掩码输入等。
  - 依赖：依赖 `file-saver`、`inputmask`、`sortablejs`、`vuedraggable`、`xlsx` 等；将 `@okiss/utils`、`vue`、`vue-router`、`element-plus` 声明为 peerDependencies。
  - 构建：同样以 `src/index.ts` 为入口，输出到 `dist` 目录，结构与 `oms` 保持一致。

- `@okiss/utils` (`packages/utils`)
  - 角色：**通用工具库**。
  - 职责：封装通用工具函数和基础能力，供 `oms` 与 `vbtf` 共同复用，是前端 peer 依赖链最底层的一环。
  - 依赖：`dayjs`、`handlebars`、`lodash`、`element-plus` 等。
  - 构建：同样遵循 `src/index.ts` -> `dist` 的模式，并输出 types。

- `@okiss/template` (`packages/tpl`)
  - 角色：**模板应用 / 示例项目**。
  - 职责：演示如何使用 `@okiss/oms`、`@okiss/vbtf`、`@okiss/utils` 搭建实际后台应用，同时也可作为脚手架模板。
  - 命令：提供 `dev / build / preview / serve / export` 等脚本，配合脚手架（`create-app` 包）使用。

- `create-app` (`packages/create-app`)
  - 角色：**脚手架工具**。
  - 职责：提供 `template-js`、`template-ts` 等模板，配合 `yarn create @okiss/app` 命令快速生成新项目。
  - 包名：`@okiss/create-app`

> 以上包均通过 pnpm workspace 进行依赖管理和联调开发，新增包时应保持相同的结构与构建模式（`src/index.ts` 入口、`dist` 输出、`publishConfig` 指向 dist）。
>
> **注意**：`@okiss/vform` 和 `@okiss/plugin-devtool` 在文档中被提及但当前不在此仓库的 packages 目录中，可能作为独立仓库维护或计划未来添加。

### 2. 运行与依赖关系（高层视角）

1. **工具层（底层）**：`@okiss/utils`
   - 提供通用工具能力，被其它所有业务包作为 peerDependency 使用。

2. **组件层（中间层）**：`@okiss/vbtf`
   - 基于 `utils` 和 Vue / Element Plus 封装通用业务组件（表单、表格等）。

3. **运行时与业务框架层（上层）**：`@okiss/oms`
   - 依赖 `vbtf` 与 `utils`，负责路由、权限、菜单体系及 `PageSchema` 执行逻辑，是真正“后台应用”的核心运行时。

4. **应用 / 模板层**：`@okiss/template` & `create-app`
   - `template` 使用 `oms` + `vbtf` + `utils` 构建可运行的示例/模板应用；
   - `create-app` 则为最终用户提供快速创建应用的脚手架模板能力。

5. **文档与演示**：`docs`（VitePress）
   - 文档与示例紧密依赖上述包的 API 与行为，修改公共 API 时需要同步更新文档与示例。


## 仓库约定与注意事项

### 1. 包管理与命令约定

- 全局统一使用 **pnpm**，并通过 `pnpm -F <package> <script>` 方式运行各包脚本。
- 新增脚本时：
  - 优先使用已有命名风格（`dev`/`build`/`preview`/`serve`/`release`/`ts` 等）；
  - 在需要跨包调用的场景中，尽量通过 workspace filter 实现，而不是手写多级路径。

### 2. 构建与导出结构

对 `@okiss/oms`、`@okiss/vbtf`、`@okiss/utils` 等核心包：

- 保持以下约定：
  - 入口：`src/index.ts`；
  - 输出：`dist/index.es.js`、`dist/style.css`、`dist/types/...`；
  - `package.json` 中：
    - 开发态 `module`/`types` 指向 `src`；
    - `publishConfig` 指向 `dist`，对外只暴露构建产物与类型。
- 新增导出或内部模块时，确保：
  - 入口文件导出清晰、按功能分组；
  - 不破坏现有对外 API（如需破坏性变更，应在文档中体现并考虑版本策略）。

### 3. Peer Dependencies 策略

- `@okiss/oms`：
  - peerDependencies：`@okiss/utils`、`@okiss/vbtf`、`element-plus`、`vue`、`vue-router`。
- `@okiss/vbtf`：
  - peerDependencies：`@okiss/utils`、`vue`、`vue-router`、`element-plus`。

在维护依赖关系时：

- 避免在这些包中直接安装上述 peerDependencies 的具体版本，保持由最终应用（例如使用模板创建的项目）来决定确切版本；
- 在文档或模板中给出推荐的安装命令和版本范围，而不是在库内强行锁死版本。

### 4. 发布流程与顺序

- 根目录脚本 `release.all` 规定了发布顺序：
  - `utils` -> `vbtf` -> `vform` -> `oms`；
- 当前仓库中可能尚未包含 `vform` 包，但**顺序语义是重要约定**：
  - 先发布工具和基础组件，再发布依赖它们的上层包；
  - 任何未来新增依赖链上的包都应遵守“先底层、后上层”的发布策略。

在修改会影响对外 API 或依赖关系的代码时，请：

- 同步检查 `release` 相关脚本；
- 如有必要，更新 README 与文档中对版本和依赖的描述。

### 5. 文档与示例站

- 文档目录：`docs`（VitePress）。
- 所有重要 API 变更、用法调整，需要同步更新：
  - VitePress 文档中的使用说明、示例代码；
  - 模板应用（`@okiss/template`）的示例页面。

> 当你在 oms/vbtf/utils 中新增组件或能力时，优先考虑：
> 1. 是否需要在 `docs` 中加入示例与说明；
> 2. 是否需要在 `@okiss/template` 中添加一个真实场景页面进行演示。

### 6. 质量与架构风格（与全局 CLAUDE.md 的衔接）

在本仓库内进行开发时，需要额外注意以下几点，以契合用户在全局 CLAUDE.md 中的要求：

- 保持单文件行数与目录内文件数量的上限约束：
  - 对于 TypeScript / JavaScript / Vue 组件文件，尽量控制在 ~200 行以内；
  - 单个目录下文件数尽量不超过 ~8 个，如有膨胀倾向，主动拆分子目录。
- 在阅读或修改现有代码时，如发现以下“坏味道”，请：
  - 先向用户确认是否需要进行重构；
  - 再提出针对性的重构建议（而不是直接大改）：
    - 僵化、冗余、循环依赖、脆弱性、晦涩性、数据泥团、不必要的复杂性等。
- HTML / 模板相关代码保持关注点分离：
  - 结构（HTML / 模板）、样式（CSS/预处理器）、行为（JS/TS）尽量分离；
  - 文件过大时优先拆分为多个组件，而非继续堆叠逻辑。

---

后续若在仓库中新增测试框架、统一 lint 脚本或更多子包，请同步更新本文件中对应章节（命令速查 / 架构概览 / 约定与注意事项），以便未来的 Claude Code 实例更高效地协作。