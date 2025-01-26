# mojo-frontend

> mojogogo 通用组件库代码

## 简介

* 前端技术栈 [Vue3](https://v3.cn.vuejs.org) + [Vite](https://cn.vitejs.dev) + [Tailwind css](https://tailwindcss.com/) + [Element Plus](https://element-plus.org/zh-CN)

* 核心的组件就是chat组件（pc,h5共用）。

## 构建

```bash

# 组件库打包，修改组件后需打包，引入的地方才生效
pnpm run build:comp

# 打包资源分析
pnpm run report:comp

# 代码格式检查
pnpm run lint

# 代码格式检查并自动修复
pnpm run lint:fix
```

## 框架目录结构

```bash
  |-- build-lib.js # 打包脚本
  |-- index.html
  |-- package.json
  |-- README.md #帮助文档
  |-- vite.config.js #vite相关配置项
  |-- src
  |   |-- App.vue
  |   |-- main.js
  |   |-- assets # 图片，字体等资源目录
  |   |-- components # 组件
  |   |-- plugins # 常用插件封装
  |   |-- store # 状态管理pinia
  |-- vite
      |-- plugins # vite 相关插件引入
          |-- index.js
```

Copyright (c) 2022-present [www.dappworks.com](https://www.dappworks.com)
