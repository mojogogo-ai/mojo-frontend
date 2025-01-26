<template>
  <el-config-provider size="default" :locale="locale">
    <router-view />
  </el-config-provider>
</template>
<script setup>
import { ElConfigProvider } from "element-plus";
import { getCurLang } from "@gptx/base";

import zh from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";
import tw from "element-plus/dist/locale/zh-tw.mjs";

const allLang = {
  "zh-CN": zh,
  en: en,
  "zh-TW": tw,
};
const curLang = getCurLang(); // 当前语言
const locale = computed(() => allLang[curLang]);
</script>
