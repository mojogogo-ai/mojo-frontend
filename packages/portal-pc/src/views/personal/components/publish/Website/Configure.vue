<template>
  <el-dialog
    v-model="isVisible"
    width="622px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <template #header>
      <div class="text-base font-black">
        {{ title }}
      </div>
      <div class="text-sm text-[#7a7a7a]">
        {{ subtitle }}
      </div>
    </template>
    <el-scrollbar max-height="596px">
      <ChatText
        style="border: 0 none; background-color: #fff"
        :text="textValue"
      />
    </el-scrollbar>
  </el-dialog>
</template>
<script setup>
import { t } from '@gptx/base/i18n';
import DATA from '@gptx/base/utils/gptx-chatbot.json';
defineProps({
  botId: {
    type: String,
    default: ''
  }
});

const textValue = ref('');
const title = ref('');
const subtitle = ref('');
const titleList = {
  javascript: t('bots.publish.javascript'),
  robot: t('bots.publish.robot')
};
const subtitleList = {
  javascript: t('bots.publish.javascriptDes'),
  robot: t('bots.publish.robotDes')
};
const isVisible = ref(false);

const open = (name) => {
  isVisible.value = true;
  
  let baseUrl = window.SITE_TYPE == 2 ? 'https://chat.dappworks.cn/v2' : 'https://api.safegen.ai/v2'
  let text =  DATA[name].replace(/chatApiUrl/g, baseUrl);

  textValue.value = text;
  title.value = titleList[name];
  subtitle.value = subtitleList[name];
};
defineExpose({ open });
</script>
