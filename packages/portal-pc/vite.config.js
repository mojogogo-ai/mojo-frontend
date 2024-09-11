import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'
import optimize from './vite/optimize'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// vite 相关配置
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.dappworks.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.dappworks.vip/admin/，则设置 baseUrl 为 /admin/。
    base: command === 'build' || process.env.npm_lifecycle_event==='preview' ? '/' : '/',
    plugins: [
      ...createVitePlugins(env, command === 'build'),
    ],
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src'),
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
      port: 9001,
      host: true,
      open: true,
      proxy: {
        '/v1': {
          target: 'https://api-dev.mojogogo.ai/portal/', // 开发
          changeOrigin: true,
          // rewrite: (p) => p.replace(/^\/proxy-api/, '/v1')
        }
      }
    },
    optimizeDeps: optimize, // 目前没用到
    build: {
      outDir: 'dist', // 指定输出路径
      reportCompressedSize: false, // 启用/禁用 gzip 压缩大小报告。禁用该功能可能会提高大型项目的构建性能。
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 3000,
      // minify: 'esbuild',
      cssCodeSplit: false,
      rollupOptions: {
        // 静态资源分类打包,分类存放
        output: {
          manualChunks: {
            // 自定义拆分
            // vue,vue-router合并打包
            vue: ['vue', 'vue-router'],
            'element-plus': ['element-plus']
          },
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: 'static/js/[name]-[hash].js',
          // 用于从入口点创建的块的打包输出格式，[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: 'static/js/[name]-[hash].js',
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    esbuild: {
      // 打包后移除console debugger
      drop: ["console", "debugger"],
    },
    css: {
      preprocessorOptions: { css: { charset: false } },
      // vite集成了postcss，可直接在此处写postcss的相关配置。无需单独安装postcss
      postcss: {
        plugins: [
          tailwindcss(),
          // 添加浏览器厂商前缀的PostCSS插件 (注意：vite本身会做一定处理，但如果想兼容更低的浏览器，则启用autoprefixer)
          autoprefixer({
              // overrideBrowserslist: [// 指定目标浏览器
              //     "Android 4.1",
              //     "iOS 7.1",
              //     "Chrome > 31",
              //     "ff > 31",
              //     "ie >= 8",
              // ],
              // grid: true,
          })
        ]
      }
    }
  }
})
