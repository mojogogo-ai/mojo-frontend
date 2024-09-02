import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/notification/style/css'
import 'element-plus/es/components/loading/style/css'
import '@/assets/styles/element-ui.scss'
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/element-variables.scss'
import '@/assets/iconfont/iconfont.css'
import App from './App'
import i18n from '@gptx/base/i18n'

// 注册所有element-ui的图标
import elementIcons from '@/plugins/svgicon'

import '@/styles/lib/tailwind.css'
import '@/styles/lib/highlight.scss'
import '@/styles/lib/github-markdown.scss'

const app = createApp(App)
const pinia = createPinia()
app.use(i18n)
app.use(pinia)
app.use(elementIcons)
app.mount('#app')
