import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import { resolve } from 'path'
import createVitePlugins from './vite/plugins'
// import optimize from './vite/optimize'
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
    // base: command === 'build' || process.env.npm_lifecycle_event==='preview' ? '/portal/' : '/',
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
      extensions: ['.mjs', '.js', '.json', '.vue']
    },
    server: {
      // port: 9003,
      // host: true,
      // open: true,
      // proxy: {
      //   // https://cn.vitejs.dev/config/#server-proxy
      //   '/v2': {
      //     target: 'http://192.168.50.203:80/', // 开发
      //     changeOrigin: true,
      //     // rewrite: (p) => p.replace(/^\/proxy-api/, '/v1')
      //   }
      // }
    },
    build: {
      outDir: 'lib', // 
      lib: {
        entry: resolve(__dirname, './build-lib.js'),
        name: 'SafeGenChat',
        fileName: 'index',
        formats:['es']
      },
      //库模式配置
      rollupOptions: {
        external: ['vue', 'vue-i18n','pinia', 'axios',
         'highlight.js', 'markdown-it',
         'naive-ui','element-plus',
         'markdown-it-link-attributes','@vueuse/core'],
        output: {
          assetFileNames: "index.css",
          globals: {
            vue: 'Vue',
            'vue-i18n': 'vue-i18n', 
            pinia: 'pinia',
            axios: 'axios',
            'naive-ui': 'naive-ui',
            'element-plus': 'element-plus',
            'highlight.js': 'hljs',
          }
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
