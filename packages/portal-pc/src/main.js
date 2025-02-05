import { createApp } from 'vue'
import { createPinia } from 'pinia'
import gptxComponents from '@gptx/components'
import '@gptx/components/lib/index.css'

import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/notification/style/css'
import 'element-plus/es/components/loading/style/css'
import '@/assets/styles/index.scss' // global css
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

import SolanaWallets from "solana-wallets-vue";

// You can either import the default styles or create your own.
import "solana-wallets-vue/styles.css";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { useWallet } from 'solana-wallets-vue';

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true,
};

// Initialize Firebase
initializeApp(FIREBASE_CONFIG);

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(i18n)
app.use(pinia)
app.use(gptxComponents)

app.use(SolanaWallets, walletOptions)

app.use(elementIcons)
app.component(SvgIcon.name, SvgIcon)

directive(app)
app.mount('#app')
