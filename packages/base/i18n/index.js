import { createI18n } from 'vue-i18n'
import { getCurLang } from '@gptx/base'
import { i18nMessages } from './i18nMessages'

const i18n = createI18n({
  legacy: false,
  locale: getCurLang(),
  globalInjection: true, // 全局注册$t方法（仅在vue模板内注入）
  messages: i18nMessages,
  // fallbackLocale: 'en', // set fallback locale
})
export const t = i18n.global.t // 在非vue模板内使用，相当模板内的$t
export default i18n