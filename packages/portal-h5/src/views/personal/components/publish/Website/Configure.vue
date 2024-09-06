<template>
  <van-popup
    v-model:show="isVisible"
    class="cover-popup"
    positon="bottom"
    closeable
  >
    <div class="cover-popup-head">
      <div class="flex-1">
        <div class="text-base font-black">
          {{ title }}
        </div>
        <div class="text-sm text-[#7a7a7a]">
          {{ subtitle }}
        </div>
      </div>
    </div>
    <div class="cover-popup-body">
      <ChatText
        style="border: 0 none; background-color: #fff"
        :text="textValue"
      />
    </div>
  </van-popup>
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
