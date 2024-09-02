<template>
  <div class="app-page">
    <page-header
      :title="formData.app?.name"
      right-icon="edit"
      @right-icon-click="openBaseInfo"
    />
    <div class="app-page-content">
      <van-floating-bubble
        v-model:offset="vanFloatBubbleOffset"
        axis="xy"
        magnetic="x"
        @click="onOpenDebug"
      >
        <svg-icon
          name="bots"
          style="color: #fff; font-size: 24px"
        />
      </van-floating-bubble>
      <div class="design-scroll">
        <div class="mt-3 design-block">
          <van-form
            ref="submitFormRef"
            class="cover-form"
          >
            <div class="pb-0 design-form">
              <div class="mb-0 design-form-item">
                <div class="design-form-title">
                  {{ t('bots.label.tip') }}
                  <van-button
                    type="primary"
                    class="font-normal"
                    size="small"
                    link
                    :disabled="!tipWords || !tipWords.trim().length || isDisabled"
                    @click="onModifyTipWords"
                  >
                    <svg-icon
                      name="modify"
                      class="mr-[2px]"
                    />
                    {{ t('bots.label.modify') }}
                  </van-button>
                </div>
                <div class="pb-0 design-form-content">
                  <van-field
                    v-model="tipWords"
                    class="flex-1"
                    type="textarea"
                    show-word-limit
                    maxlength="2000"
                    background
                    bordered
                    :rows="10"
                    :placeholder="t('bots.placeholder.tipWords')"
                    :readonly="isDisabled"
                    :rules="submitFormRules"
                    @blur="onOptimizePrompt"
                  />
                </div>
              </div>
            </div>
          </van-form>
        </div>
        <div class="design-block">
          <design-prologue
            :data="formData.prologue"
            :bot-id="botId"
            :disabled="isDisabled"
            @update="_getBotDetail"
          />
        </div>
        <div class="design-block">
          <design-model
            :data="formData.llm"
            :bot-id="botId"
            :disabled="isDisabled"
            @update="_getBotDetail"
            @show-tip="onShowTip"
          />
        </div>
        <!--        <div class="design-block">-->
        <!-- <design-plugin v-show="currentTab === 'plugin'" /> -->
        <!--        </div>-->
        <div class="design-block">
          <design-knowledge
            :data="formData.knowledge"
            :bot-id="botId"
            :disabled="isDisabled"
            @update="_getBotDetail"
            @show-tip="onShowTip"
          />
        </div>
        <div class="publish-button">
          <van-button
            class="w-1/2"
            type="primary"
            linear
            round
            @click="toPublish"
          >
            {{ t('bots.publish.pageTitle') }}
          </van-button>
        </div>
      </div>
      <design-tip-words
        ref="tipWordsRef"
        v-model:disabled="isDisabled"
        :bot-id="botId"
        @update-tip-words="_getBotDetail"
      />
    </div>
    <bot-base-info
      ref="baseInfoRef"
      @after-update="_getAppInfo"
    />
    <design-debugger
      ref="debuggerRef"
      :bot-config="botConfig"
    />
  </div>
</template>

<script setup>
import router from '@/router';
import { t } from '@gptx/base/i18n';
import { getAppInfo, getBotDetail, updateConfig } from '@gptx/base/api/application';
import { chatDetail } from '@gptx/base/api/chat.js';
import {
  DesignDebugger,
  DesignKnowledge,
  DesignModel,
  DesignPrologue,
  DesignTipWords
} from './components/design/index';
import { showDialog } from 'vant';

const {
  params: { id: botId }
} = useRoute();
const tipWords = ref('');
let formData = reactive({
  app: {},
  knowledge: {},
  llm: {},
  prologue: {},
  prompt: {}
});
const isDisabled = ref(false);
const __data = reactive({
  appInfo: {}
});
// const isDebugger = ref(false);
const vanFloatBubbleOffset = reactive({
  x: 200,
  y: 400
});
const submitFormRules = [{ required: true, message: t('bots.tip.tipWords') }];
/* ref dom */
const tipWordsRef = ref(null);
const baseInfoRef = ref(null);
const debuggerRef = ref(null);
const submitFormRef = ref(null);

const openBaseInfo = () => {
  baseInfoRef.value.open(__data.appInfo);
};
const toPublish = async () => {
  try {
    await submitFormRef.value.validate();
    const id = __data.appInfo.id;
    await router.push({
      path: `/publish/${id}`
    });
  } catch (e) {
    console.log(e);
    showToast({ message: t('bots.tip.tipWords'), position: 'top' });
  }
};

const _getAppInfo = async () => {
  try {
    const { code, data } = await getAppInfo({ id: botId });
    if (code === 200) {
      __data.appInfo = data;
      document.title = data.name;
    }
  } catch (error) {
    console.log(error);
  }
};

const onOptimizePrompt = async () => {
  if (tipWords.value === formData?.prompt?.builtin_prompt || !tipWords.value.trim().length || !tipWords.value) return;
  try {
    await updateConfig({ id: botId, builtin_prompt: tipWords.value });
    isDisabled.value = false;
    await _getBotDetail();
  } catch (error) {
    console.log(error);
    isDisabled.value = false;
    await _getBotDetail();
  }
};
const onModifyTipWords = async () => {
  tipWordsRef.value.open();
};
const onOpenDebug = () => {
  debuggerRef.value.open();
};

const _getBotDetail = async () => {
  try {
    const { data, code } = await getBotDetail({ id: botId });
    if (code === 200) {
      for (const key in formData) {
        if (Object.hasOwnProperty.call(formData, key)) {
          formData[key] = data[key];
        }
      }
      tipWords.value = data?.prompt?.builtin_prompt;
    }
  } catch (error) {
    console.log(error);
  }
};

const botConfig = ref(null);
const _getChatDetail = async () => {
  try {
    const { data, code } = await chatDetail({
      // "sid": "S1234567890",
      system_builtin: false,
      max_context_length: 0,
      debug: true,
      app_id: botId
    });
    if (code === 200) {
      botConfig.value = data;
    }
  } catch (error) {
    console.log(error);
  }
};
const onShowTip = ({ title, message }) => {
  showDialog({
    title,
    message,
    confirmButton: false,
    className: 'tip-words-dialog'
  });
};

watch(
  () => formData,
  (val) => {
    if (val && botConfig.value && botConfig.value.prologue && botConfig.value.predefined_question) {
      botConfig.value.prologue.content = val.prologue.prologue;
      if (val.prologue.predefined_question && val.prologue.predefined_question.length) {
        botConfig.value.predefined_question = val.prologue.predefined_question.map((i) => {
          return { content: i, content_type: 1 };
        });
      } else {
        botConfig.value.predefined_question = [];
      }
    }
  },
  { deep: true }
);

onMounted(() => {
  _getChatDetail();
  _getAppInfo();
  _getBotDetail();
  const { availHeight, availWidth } = window.screen;
  vanFloatBubbleOffset.x = availWidth - 72;
  vanFloatBubbleOffset.y = availHeight - 320;
});
</script>

<style lang="scss" scoped>
.app-page {
  padding-top: 0;
}

.page-list-img {
  width: 32px;
  height: 32px;
}

.app-page-top {
  display: flex;
  padding: 10px 8px;
  margin-bottom: 0;
}

.app-page-content {
  padding: 0;
  overflow: hidden;
}

.page-list-img__error {
  background-color: #fff;
}

.design-side {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden auto;
}

.design-title {
  font-weight: bold;
  font-size: 16px;
  line-height: 1;
  color: #36353a;
}

:deep(.n-tabs) {
  .n-tabs-nav {
    width: 500px;
    margin: 0 auto;
  }
}
</style>
<style lang="scss">
.design-form {
  height: 100%;
  padding: 14px 20px 16px;
  overflow: hidden auto;
}

.design-form-item {
  margin-bottom: 24px;
}

.design-form-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  font-size: 16px;
  font-weight: bold;
  color: #36353a;

  &.justify-start {
    justify-content: flex-start;
  }
}

.design-form-content {
  padding-bottom: 12px;
}

.design-block {
  background-color: #fff;
  margin: 0 8px 12px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
  border-radius: 8px;

  &:first-child {
    margin-top: 12px;
  }
}

.publish-button {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 24px 12px 12px;
  z-index: 10;
}

.info-icon {
  font-size: 14px;
  vertical-align: middle;
}

.tip-words-dialog {
  .van-dialog__header {
    padding: 18px 18px 0;
  }

  .van-dialog__message {
    padding-top: 12px;
    text-align: left;
  }
}

.design-scroll {
  height: 100%;
  overflow: hidden auto;
}

.w-1\/2 {
  width: 50%;
}

.mb-0 {
  margin-bottom: 0;
}

.pb-0 {
  padding-bottom: 0;
}

.custom-slider-button {
  height: 28px;
  width: 28px;
  padding: 0;
  font-size: 0.6rem;
  box-shadow: 0 0 6px rgba(#000, 0.08);
  border: none;
}

.text-gray-400 {
  color: var(--van-gray-6);
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
