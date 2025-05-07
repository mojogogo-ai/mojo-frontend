<template>
  <config-provider
    class="h-full"
    :theme-vars="themeVars"
  >
    <router-view />
  </config-provider>
</template>
<script setup>
import { getCurLang } from '@gptx/base';
import { ConfigProvider, Locale } from 'vant';
import enUS from 'vant/es/locale/lang/en-US';
import zhTW from 'vant/es/locale/lang/zh-TW';
import zhCN from 'vant/es/locale/lang/zh-CN';

const allLang = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  en: enUS
};
const themeVars = {
};

const curLang = getCurLang(); // 当前语言
// console.log("curLang: ", curLang)
const locale = computed(() => allLang[curLang]);
onMounted(() => {
  Locale.use(curLang, locale.value);
});
// watch(
//   locale,
//   (n) => {
//     console.log("locale: ", n)
//     if (n && n.name === 'en') {
//       const app = document.getElementById('app');
//       app.style.fontFamily = 'Roboto-Regular, Roboto';
//     } else {
//       app.style.fontFamily = 'Microsoft YaHei';
//     }
//   },
//   { immediate: true }
// );
</script>

<style>
/* 基础层级 */
.van-overlay {
  z-index: 1000 !important;
}

/* 下拉框层级 */
.van-popup {
  z-index: 1001 !important;
}

.van-dropdown-menu {
  z-index: 1001 !important;
}

.van-dropdown-menu__bar {
  z-index: 1001 !important;
}

.van-dropdown-menu__item {
  z-index: 1001 !important;
}

/* 钱包弹窗层级 */
.wallet-adapter-modal {
  z-index: 9999 !important;
}

.wallet-adapter-modal-wrapper {
  z-index: 9999 !important;
}

.wallet-adapter-modal-container {
  z-index: 9999 !important;
}

.wallet-adapter-modal-overlay {
  z-index: 9998 !important;
}

/* 确保钱包按钮在正确的层级 */
.wallet-adapter-button {
  z-index: 1001 !important;
}
</style>
