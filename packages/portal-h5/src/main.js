import { createApp } from 'vue'
import { createPinia } from 'pinia'
import gptxComponents from '@gptx/components'
import '@gptx/components/lib/index.css'

// import toast styles from vant
import 'vant/es/toast/style'

import '@/assets/styles/index.scss' // global css
import App from './App'
import i18n from '@gptx/base/i18n'
import router from './router'

// 注册所有element-ui的图标
import elementIcons from '@/plugins/svgicon'
// svg图标组件
import SvgIcon from '~virtual/svg-component'

import './permission2' // permission control

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

app.mount('#app')
