import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VantResolver } from '@vant/auto-import-resolver';

export default function createAutoImport () {
  return [
    AutoImport({
      resolvers: [
        ElementPlusResolver({
          // importStyle: 'sass'
        }),
        VantResolver()
      ],
      imports: ['vue', 'vue-router', 'pinia'],
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      // Generate corresponding .eslintrc-auto-import.json file.
      // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
      eslintrc: {
        enabled: true
        // filepath: './.eslintrc-auto-import.json',
        // globalsPropValue: true
      },
      dts: false
    }),
    Components({ resolvers: [ElementPlusResolver(), VantResolver()] })
  ]
}
