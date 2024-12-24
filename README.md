# mojo-gogo-frontend


> mojo gogo frontend

## 简介

* 前端技术栈 [Vue3](https://v3.cn.vuejs.org) + [Vite](https://cn.vitejs.dev) + [Tailwind css](https://tailwindcss.com/) + [Element Plus](https://element-plus.org/zh-CN) 

## 安装与运行

```bash
# 克隆项目
git clone https://gitlab.com/we_dappworks/mojo-gogo-frontend.git

# 进入项目目录
cd mojo-gogo-frontend

# npm也行，但更推荐使用pnpm。
# 安装依赖
pnpm install

# 启动服务
pnpm run dev

# 访问地址
http://localhost:9001

```

## 构建

```bash

# 构建生产环境 
pnpm run build 或 pnpm run build:prod

# 构建测试环境 
pnpm run build:stage 或 pnpm run build:test

# 预览发布环境效果（要先打包）
pnpm run preview

# 打包资源分析
pnpm run report

# 代码格式检查
pnpm run lint

# 代码格式检查并自动修复
pnpm run lint:fix
```

## 框架目录结构
```bash
# TODO 
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
