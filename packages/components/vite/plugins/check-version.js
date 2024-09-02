// Custom vite plugin--check the local Node environment

import chalk from 'chalk'
import semver from 'semver'
import shell from 'shelljs'
import { execSync } from 'child_process'
import packageConfig from '../../package.json'

function exec (cmd) {
  return execSync(cmd).toString().trim()
}

const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node
    // versionRequirement: ''
  }
]
if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
    // versionRequirement: ''
  })
}

async function startCheck () {
  // const packageConfig = await import('./package.json')
  // console.log(packageConfig, 'packageConfig66')
  for (let i = 0; i < versionRequirements.length; i++) {
    if (versionRequirements[i].name === 'node') {
      versionRequirements[i].versionRequirement = packageConfig.engines.node
    }
    if (versionRequirements[i].name === 'npm') {
      versionRequirements[i].versionRequirement = packageConfig.engines.npm
    }
  }

  const warnings = []
  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    process.exit(1)
  }
}

export default function checkVersion (checkOptions) {
  return {
    name: 'vite-check-version',

    enforce: 'pre',

    // 指明它们仅在 'build' 或 'serve' 模式时调用
    // apply: 'build', // apply 亦可以是一个函数

    // 1. vite 独有的钩子：可以在 vite 被解析之前修改 vite 的相关配置。钩子接收原始用户配置 config 和一个描述配置环境的变量env
    config () {},

    // 2. vite 独有的钩子：在解析 vite 配置后调用。使用这个钩子读取和存储最终解析的配置。当插件需要根据运行的命令做一些不同的事情时，它很有用。
    configResolved () {},

    // 4. vite 独有的钩子：主要用来配置开发服务器，为 dev-server (connect 应用程序) 添加自定义的中间件
    configureServer () {},

    // 18的前面. vite 独有的钩子：转换 index.html 的专用钩子。钩子接收当前的 HTML 字符串和转换上下文
    transformIndexHtml () {},

    // vite 独有的钩子: 执行自定义HMR更新，可以通过ws往客户端发送自定义的事件
    handleHotUpdate () {},

    // 3. 构建阶段的通用钩子：在服务器启动时被调用：获取、操纵Rollup选项
    options () {
      // console.log(options, 'options66')
    },

    // 5. 构建阶段的通用钩子：在服务器启动时被调用：每次开始构建时调用
    buildStart () {
      startCheck(checkOptions)
      // console.log(options, 'buildStart66')
    },

    // 构建阶段的通用钩子：在每个传入模块请求时被调用：创建自定义确认函数，可以用来定位第三方依赖
    resolveId () {},

    // 构建阶段的通用钩子：在每个传入模块请求时被调用：可以自定义加载器，可用来返回自定义的内容
    load () {},

    // 构建阶段的通用钩子：在每个传入模块请求时被调用：在每个传入模块请求时被调用，主要是用来转换单个模块
    transform () {},

    // 构建阶段的通用钩子：在构建结束后被调用，此处构建只是代表所有模块转义完成
    buildEnd () {},

    // 输出阶段钩子通用钩子：接受输出参数
    outputOptions () {},

    // 输出阶段钩子通用钩子：每次bundle.generate 和 bundle.write调用时都会被触发。
    renderStart () {},

    // 输出阶段钩子通用钩子：用来给chunk增加hash
    augmentChunkHash () {},

    // 输出阶段钩子通用钩子：转译单个的chunk时触发。rollup输出每一个chunk文件的时候都会调用。
    renderChunk () {
      // return null
    },

    // 输出阶段钩子通用钩子：在调用 bundle.write 之前立即触发这个hook
    generateBundle () {},

    // 输出阶段钩子通用钩子：在调用 bundle.write后，所有的chunk都写入文件后，最后会调用一次 writeBundle
    writeBundle () {},

    // 通用钩子：在服务器关闭时被调用
    closeBundle () {}
  }
}
