# mojo-frontend

> mojogogo h5手机端代码

## 简介

* 前端技术栈 [Vue3](https://v3.cn.vuejs.org) + [Vite](https://cn.vitejs.dev) + [Tailwind css](https://tailwindcss.com/)

* public/config.js 用于配置各环境。

## 运行

```bash
# 启动服务
pnpm run dev:h5

```

## 构建

```bash

# 构建生产环境 
pnpm run build:h5 

# 预览发布环境效果（要先打包）
pnpm run preview:h5

# 打包资源分析
pnpm run report:h5

# 代码格式检查
pnpm run lint

# 代码格式检查并自动修复
pnpm run lint:fix
```

## 框架目录结构

```bash
  |-- .env.development #开发环境
  |-- .env.production #生成环境
  |-- .env.staging  #测试环境
  |-- CHANGELOG.md #发布日志
  |-- index.html
  |-- package.json
  |-- README.md #帮助文档
  |-- vite.config.js #vite相关配置项
  |-- public
  |   |-- favicon.ico
  |   |-- config.js # 环境配置
  |-- src
  |   |-- App.vue
  |   |-- main.js
  |   |-- permission.js
  |   |-- assets # 图片，字体等资源目录
  |   |-- components # 通用组件
  |   |-- layout # 框架布局组件目录
  |   |-- plugins # 插件封装
  |   |-- router # 页面路由配置项
  |   |-- store # 状态管理pinia
  |   |-- utils #  封装方法库
  |   |-- views # 页面，以业务功能区分
  |       |-- index.vue
  |       |-- login.vue
  |       |-- register.vue
  |-- vite
      |-- plugins # vite 相关插件引入
          |-- index.js
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
