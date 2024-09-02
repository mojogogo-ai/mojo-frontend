// import checkVersion from './check-version'
import vue from '@vitejs/plugin-vue'
import createAutoImport from './auto-import'
import legacy from '@vitejs/plugin-legacy'
import createCompression from './compression'
import { visualizer } from 'rollup-plugin-visualizer'

// vite插件引入
export default function createVitePlugins (viteEnv, isBuild = false) {
  const { VITE_LEGACY } = viteEnv

  // vite 插件
  let vitePlugins = [
    // checkVersion({ packagePath: '../../package.json' }), // 检查node版本插件
    vue({ include: [/\.vue$/] }), // @vitejs/plugin-vue
      ...createAutoImport(), // 自动导入插件
    ]

  // 是否兼容旧浏览器，参考：https://github.com/vitejs/vite/tree/main/packages/plugin-legacy#readme, https://juejin.cn/post/7165493414048301070
  if (VITE_LEGACY === 'true') {
    vitePlugins.push(legacy({ targets: ['defaults', 'not IE 11'] }))
  }

  // 是否启用压缩插件(打包操作才启用)
  if (isBuild) {
    vitePlugins.push(...createCompression(viteEnv))
  }

  // 是否查看打包体积分布(pnpm run report 才启用)
  const isReport = process.env.npm_lifecycle_event === 'report'
  if (isReport) {
    vitePlugins.push(visualizer({
      filename: 'report.html',
      open: true, // 是否直接打开查看
      gzipSize: true
      // brotliSize: true
    }))
  }

  return vitePlugins
}
