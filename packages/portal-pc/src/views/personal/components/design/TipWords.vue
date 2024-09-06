<template>
  <el-dialog
    v-model="isVisible"
    width="622px"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <template #header>
      <div class="flex items-center">
        <div class="mr-auto text-base font-black">{{ `${t('bots.label.tipModify')}` }}</div>
        <el-button
          type="primary"
          link
          :disabled="isDisabled"
          @click="onModifyTipWords"
        >
          <el-icon class="mr-1"><Refresh /></el-icon>
          {{ t('base.m') }}
        </el-button>
      </div>
    </template>
    <div class="h-[596px] flex flex-col">
      <el-input
        ref="tipWordRef"
        v-model="tipWords"
        class="flex-1"
        type="textarea"
        input-style="height: 100%;padding: 16px;"
        resize="none"
        show-word-limit
        maxlength="2000"
        :placeholder="t('bots.placeholder.tipWords')"
        :readonly="isDisabled"
      />
    </div>
    <template #footer>
      <el-button @click="close">{{ t('common.cancel') }}</el-button>
      <el-button
        type="primary"
        linear
        :loading="isDisabled"
        :disabled="isDisabled"
        @click="onSubmit"
      >
        {{ t('common.ok') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { updateConfig } from '@gptx/base/api/application';
import { getCurLang } from '@gptx/base';
import { getToken } from '@gptx/base/utils/auth';
import { isMobi } from '@gptx/base'

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
    body: JSON.stringify({ // 参数
      app_id: props.botId
    }),
    onmessage({ data }) {
      // TODO 处理滚动至底部
      const { content } = JSON.parse(data);
      tipWords.value += content;
      const { scrollHeight, offsetHeight } = tipWordRef.value.ref;
      tipWordRef.value.ref.scrollTop = scrollHeight - offsetHeight;
    },
    onopen() {
      isDisabled.value = true;
    },
    onerror() {
      isDisabled.value = false;
      controller.abort()
    },
    onclose() {
      isDisabled.value = false;
      controller.abort()
    }
  });
};
defineExpose({
  open
});
</script>
