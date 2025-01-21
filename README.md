# mojo-frontend

> mojogogo frontend

## 代码说明

* 技术栈 [Vue3](https://v3.cn.vuejs.org) + [Vite](https://cn.vitejs.dev) + [Tailwind css](https://tailwindcss.com/) + [Element Plus](https://element-plus.org/zh-CN)
* 采用monorepo的项目代码管理架构，即单个仓库中管理多个项目，具体通过 [pnpm的workspace](https://pnpm.io/zh/next/workspaces)功能实现。monorepo架构下每个子项既相互独立，又可相互引用。参考：[Monorepo](https://juejin.cn/post/7454035377106599963)。

* 本项目使用lint-staged 和 simple-git-hooks进行代码提交前的eslint代码格式检查。**eslint报错将不能提交代码**（警告可以提交）。 建议使用vscode编辑器并安装 eslint插件，方便提示代码格式问题。

* packages/components 子项是通用的组件库，修改组件需打包后（pnpm run build:comp），引入的地方才生效。

* 建议使用 vscode编辑器，并安装 [i18n-ally](https://github.com/lokalise/i18n-ally/blob/main/README.zh-CN.md)插件，用于管理和编辑翻译文案。

* public/config.js 用于配置各环境。

## 安装与运行

> 注意：命令行添加后缀 ‘:h5’或‘:comp’区分各子项，不加默认是pc端

```bash
# 克隆项目
git clone XXX

# 进入项目目录
cd XXX

# 若没有pnpm, 先安装
npm install pnpm -g 

# 安装依赖
pnpm install

# 启动服务
pnpm run dev
pnpm run dev:h5

```

## 构建

```bash

# pc和h5页面打包 （已经实现CI/CD，实际上并不会用到）
pnpm run build
pnpm run build:h5 

# 组件库打包，修改组件后需打包，引入的地方才生效
pnpm run build:comp

```

## 其他

```bash
# 代码格式检查(全局执行，包含h5和pc)
pnpm run lint

# 代码格式检查并自动修复(全局执行，包含h5和pc)
pnpm run lint:fix

# 预览发布环境效果（要先打包）
pnpm run preview
pnpm run preview:h5

# 打包资源分析
pnpm run report
pnpm run report:h5
pnpm run report:comp

```

## 目录结构说明

```bash
  |-- .github # CI/CD脚本
  |-- .vscode # vscode编辑器配置
  |-- packages # 子项目录
  |   |-- base # api接口定义，i18n翻译文案，公共方法等（pc,h5共用）
  |   |-- components # 通用组件库，核心的组件就是chat组件（pc,h5共用）
  |   |-- portal-h5 # h5端页面
  |   |-- portal-pc # pc端页面
  |-- .eslintrc-auto-import.json
  |-- .gitignore # git忽略配置
  |-- .prettierrc # prettier代码风格配置
  |-- eslint.config.js # eslint代码语法检查配置
  |-- package.json
  |-- pnpm-lock.yaml
  |-- pnpm-workspace.yaml
  |-- README.md # 帮助文档
  |-- tailwind.config.js # tailwind 配置
```

## 浏览器兼容性

* 由于本项目使用vite构建，按照官方说法：默认的构建目标是能支持 原生 ESM 语法的 script 标签、原生 ESM 动态导入 和 import.meta 的浏览器。所以原则上支持：
  * Chrome >=87
  * Firefox >=78
  * Safari >=14
  * Edge >=88

* 更旧的浏览器可通过 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 来支持, [参考](https://juejin.cn/post/7165493414048301070)。

* 通过环境变量 **VITE_LEGACY** 来控制是否使用@vitejs/plugin-legacy（默认为false）。如无要求，不建议开启，以减少打包后的冗余代码。 太旧的浏览器没有全面测试，无法保证完全兼容。

* **注意：本项目不支持IE** 。vue3官方不支持 IE，参考：[vuejs/rfcs](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0038-vue3-ie11-support.md) 和 [cn.vuejs](https://cn.vuejs.org/about/faq.html#what-browsers-does-vue-support)。 目前没有任何工具可以使 vue3 支持 IE 浏览器。

  > 误区：@vitejs/plugin-legacy是可以做到支持IE，但它是vite 插件，只对非 vue3 的框架进行支持。

Copyright (c) 2022-present [www.dappworks.com](https://www.dappworks.com)
