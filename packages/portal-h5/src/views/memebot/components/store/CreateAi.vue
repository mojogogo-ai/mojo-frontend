<template>
  <div>
    <GptxChat :bot-info="botConfig" :chat-api-url="chatApiUrl"
              :operation-config="operationConfig"
              :is-debug="false" style="max-width: 100%" />
  </div>
</template>
<script setup>
import GptxChat from '@gptx/components/src/components/GptxChat/index.vue';
import { ref } from 'vue';
const chatApiUrl = '/portal/conversation/chat-anonymous';

const botConfig = ref(null);

const _getChatDetail = async () => {
  let systemBot = JSON.parse('{"id":"SafeGen-AI-Chat","name":"SafeGen AI","icon":"","prologue":"Welcome to MojoGogo. Click start to start the journey","description":"","system":true}');
  let predefined_question = systemBot.predefined_question ? systemBot.predefined_question.map((i) => {
    return { content: i };
  }) : [];
  let prologue = { content: systemBot.prologue || '' };
  let resData = { app: { ...systemBot, system: true }, predefined_question, prologue, isHome: true };
  botConfig.value = resData;
  return;
};
_getChatDetail();

</script>
