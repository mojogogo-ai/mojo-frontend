<script setup>
import { chatDetail } from '@gptx/base/api/chat.js';

const router = useRouter();
const chatApiUrl = computed(() => {
  const storageUserInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (storageUserInfo.data.isAnonymous) {
    // Anonymous
    return '/portal/conversation/chat-anonymous';
  } else {
    return '/portal/conversation/chat';
  }
});
const botConfig = ref(null);
const _getChatDetail = async () => {
  let systemBot = JSON.parse(localStorage.getItem('systemChat'));
  const storageUserInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (storageUserInfo.data.isAnonymous) {
    // no Anonymous
    let predefined_question = systemBot.predefined_question
      ? systemBot.predefined_question.map((i) => {
          return { content: i };
        })
      : [];
    let prologue = { content: systemBot.prologue || '' };
    let resData = { app: { ...systemBot, system: true }, predefined_question, prologue, isHome: true };
    botConfig.value = resData;
    return;
  }
  try {
    const { data, code } = await chatDetail({
      // "sid": "S1234567890",
      system_builtin: true,
      max_context_length: 0,
      debug: false,
      app_id: systemBot.id
    });
    if (code === 200) {
      let predefined_question = systemBot.predefined_question
        ? systemBot.predefined_question.map((i) => {
            return { content: i };
          })
        : [];
      let prologue = { content: systemBot.prologue || '' };
      let resData = { ...data, ...systemBot, predefined_question, prologue, isHome: true };
      botConfig.value = resData;
    }
  } catch (error) {
    console.log(error);
  }
};
_getChatDetail();

const onErrorHandle = (res) => {
  if (res && res.code && (res.code === 901 || res.code === 902)) {
    // 游客，触发登录
    router.push('/application');
  }
};
const isCn = computed(() => {
  return  window.SITE_TYPE && window.SITE_TYPE === '2'
});
</script>

<template>
  <page-header :title="isCn? $t('common.productName_Cn') :$t('common.productName')" class="bg-none" />
  <div class="transition-all" style="height: calc(100% - 50px);">
    <GptxChat
      v-if="botConfig"
      :bot-info="botConfig"
      :chat-api-url="chatApiUrl"
      :is-debug="false"
      style="max-width: 100%"
      @on-error="onErrorHandle"
    />
  </div>
</template>

<style lang="scss" scoped>
</style>
