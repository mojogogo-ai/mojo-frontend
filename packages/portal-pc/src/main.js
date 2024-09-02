import { createApp } from 'vue'
import { createPinia } from 'pinia'
import gptxComponents from '@gptx/components'
import '@gptx/components/lib/index.css'

import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/notification/style/css'
import 'element-plus/es/components/loading/style/css'
import '@/assets/styles/element-ui.scss'
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/element-variables.scss'
import App from './App'
import i18n from '@gptx/base/i18n'
import router from './router'

// 注册指令
import directive from './directive'

// 注册所有element-ui的图标
import elementIcons from '@/plugins/svgicon'
// svg图标组件
import SvgIcon from '~virtual/svg-component'

import './permission' // permission control

import '@/styles/lib/tailwind.css'

import { initializeApp } from 'firebase/app'
// Initialize Firebase
if (window.SITE_TYPE === '1') { // firebase
   initializeApp(FIREBASE_CONFIG);
}

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(i18n)
app.use(pinia)
app.use(gptxComponents)

app.use(elementIcons)
app.component(SvgIcon.name, SvgIcon)

directive(app)
app.mount('#app')