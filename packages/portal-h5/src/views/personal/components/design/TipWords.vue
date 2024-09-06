<template>
  <van-popup
    v-model:show="isVisible"
    class="cover-popup"
    position="bottom"
    :close-on-click-overlay="false"
  >
    <div class="cover-popup-head">
      <div class="mr-auto text-base font-black">{{ `${t('bots.label.tipModify')}` }}</div>
      <van-button
        type="primary"
        size="small"
        link
        :disabled="isDisabled"
        @click="onModifyTipWords"
      >
        <van-icon name="replay" />
        {{ t('base.m') }}
      </van-button>
    </div>
    <div class="cover-popup-body">
      <div class="flex h-full">
        <van-form class="cover-form w-full">
          <van-field
            ref="tipWordRef"
            v-model="tipWords"
            type="textarea"
            resize="none"
            maxlength="2000"
            rows="16"
            background
            show-word-limit
            :placeholder="t('bots.placeholder.tipWords')"
            :readonly="isDisabled"
          />
        </van-form>
      </div>
    </div>
    <div class="cover-popup-foot">
      <van-button
        size="small"
        @click="close"
      >
        {{ t('common.cancel') }}
      </van-button>
      <van-button
        type="primary"
        size="small"
        linear
        :loading="isDisabled"
        :disabled="isDisabled"
        @click="onSubmit"
      >
        {{ t('common.ok') }}
      </van-button>
    </div>
  </van-popup>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { updateConfig } from '@gptx/base/api/application';
import { getCurLang, isMobi } from '@gptx/base';
import { getToken } from '@gptx/base/utils/auth';

const props = defineProps({
  botId: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['update-tip-words']);

let controller = new AbortController();
const tipWords = ref('');
const isVisible = ref(false);
const isDisabled = ref(true);
const tipWordRef = ref(null);

const open = () => {
  isVisible.value = true;
  onModifyTipWords();
};
const close = () => {
  if (isDisabled.value) {
    controller.abort();
    isDisabled.value = false;
  }
  isVisible.value = false;
};
const onSubmit = async () => {
  try {
    isDisabled.value = true;
    await updateConfig({ id: props.botId, builtin_prompt: tipWords.value });
    emits('update-tip-words');
    close();
  } catch (error) {
    console.log(error);
    isDisabled.value = false;
  }
};
const onModifyTipWords = async () => {
  let lang = getCurLang();
  let authToken = await getToken();
  tipWords.value = '';
  controller = new AbortController();
  fetchEventSource(`${window.BASE_API}/portal/conversation/generate-prompt`, {
    signal: controller.signal,
    method: 'POST',
    openWhenHidden: true,
    headers: {
      Authorization: `Bearer ${authToken}`,
      'X-Client-Locale': lang === 'zh' ? 'zh-CN' : lang, // Locale
      'X-Client-Type': isMobi() ? 2 : 1, // X-Client-Type
      'X-Client-Site': window.SITE_TYPE // X-Client-Site
    },
    body: JSON.stringify({
      // 参数
      app_id: props.botId
    }),
    onmessage({ data }) {
      const { content } = JSON.parse(data);
      tipWords.value += content;
      const el = tipWordRef.value.$el.querySelector('.van-field__control');
      const { scrollHeight, offsetHeight } = el;
      el.scrollTop = scrollHeight - offsetHeight;
    },
    onopen() {
      isDisabled.value = true;
    },
    onerror() {
      isDisabled.value = false;
      controller.abort();
    },
    onclose() {
      isDisabled.value = false;
      controller.abort();
    }
  });
};
defineExpose({
  open
});
</script>
<style scoped>
.cover-popup {
  height: auto;
}
</style>
