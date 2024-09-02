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
