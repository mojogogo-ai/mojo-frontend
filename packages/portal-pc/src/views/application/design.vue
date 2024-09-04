<template>
  <layout @publish="toPublish">
    <template #default>
      <div class="flex h-full pt-[12px]">
        <div class="flex w-[calc((100%-660px)/2)] flex-col">
          <div class="design-title h-[40px] pl-[24px]">{{ t('bots.label.tip') }}</div>
          <div class="design-side">
            <div class="flex items-center justify-end px-[20px] py-[16px]">
              <el-button
                type="primary"
                link
                :disabled="!submitForm.tipWords || !submitForm.tipWords.trim().length || isDisabled"
                @click="onModifyTipWords"
              >
                <svg-icon
                  name="modify"
                  class="mr-[2px]"
                />
                {{ t('bots.label.modify') }}
              </el-button>
            </div>
            <el-form
              ref="submitFormRef"
              class="h-[calc(100%-72px)]"
              :model="submitForm"
              :rules="submitFormRules"
            >
              <el-form-item
                class="h-full"
                prop="tipWords"
              >
                <el-input
                  v-model="submitForm.tipWords"
                  type="textarea"
                  class="h-full"
                  input-style="height: 100%;padding: 0 16px 20px;"
                  resize="none"
                  show-word-limit
                  maxlength="2000"
                  :placeholder="t('bots.placeholder.tipWords')"
                  :readonly="isDisabled"
                  @blur="onOptimizePrompt"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="flex h-full w-[660px] shrink-0 flex-col px-[20px] pt-[40px]">
          <el-segmented
            v-model="currentTab"
            :options="tabList.map((_) => _.name)"
            @change="onTabChange"
          />
          <div class="flex-1 overflow-hidden">
            <design-prologue
              v-show="currentTab === 'prologue'"
              :data="formData.prologue"
              :bot-id="botId"
              :disabled="isDisabled"
              @update="_getBotDetail"
            />
            <design-model
              v-show="currentTab === 'model'"
              :data="formData.llm"
              :bot-id="botId"
              :disabled="isDisabled"
              @update="_getBotDetail"
            />
            <!-- <design-plugin v-show="currentTab === 'plugin'" /> -->
            <design-knowledge
              v-show="currentTab === 'knowledge'"
              :data="formData.knowledge"
              :bot-id="botId"
              :disabled="isDisabled"
              @update="_getBotDetail"
            />
          </div>
        </div>
        <div class="flex w-[calc((100%-660px)/2)] flex-col">
          <div class="design-title h-[40px]">
            <span> {{ t('bots.label.preview') }} </span>
            <span class="ml-2 text-xs font-normal text-[var(--el-text-color-placeholder)]">{{
              t('bots.label.previewDesc')
            }}</span>
          </div>
          <div class="design-side">
            <GptxChat
              :bot-info="botConfig"
              :is-debug="true"
              style="max-width: 100%"
            />
          </div>
        </div>
        <design-tip-words
          ref="tipWordsRef"
          v-model:disabled="isDisabled"
          :bot-id="botId"
          @update-tip-words="_getBotDetail"
        />
      </div>
    </template>
  </layout>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { getBotDetail, updateConfig } from '@gptx/base/api/application';
import { chatDetail } from '@gptx/base/api/chat.js';
import { ElMessage } from 'element-plus';
import { DesignKnowledge, DesignModel, DesignPrologue, DesignTipWords } from './components/design/index';
import layout from './layout';

const {
  params: { id: botId }
} = useRoute();
const router = useRouter();
const tabList = [
  {
    name: 'prologue',
    tab: t('bots.a8')
  },
  {
    name: 'model',
    tab: t('bots.n')
  },
  {
    name: 'plugin',
    tab: t('bots.plugin')
  },
  {
    name: 'knowledge',
    tab: t('base.b')
  }
];
const currentTab = ref('prologue');
let formData = reactive({
  app: {},
  knowledge: {},
  llm: {},
  prologue: {},
  prompt: {}
});
const loading = ref(false);
const isDisabled = ref(false);
const submitForm = reactive({
  tipWords: ''
});
const submitFormRules = reactive({
  tipWords: [
    {
      required: true,
      message: t('bots.tip.tipWords'),
      trigger: 'blur'
    }
  ]
});
/* ref dom */
const tipWordsRef = ref(null);
const submitFormRef = ref(null);

const onTabChange = (name) => {
  if (name === 'plugin') {
    ElMessage.info(t('bots.notReadyYet'));
  }
};
const onOptimizePrompt = async () => {
  if (
    submitForm.tipWords === formData?.prompt?.builtin_prompt ||
    !submitForm.tipWords ||
    !submitForm.tipWords.trim().length
  )
    return;
  try {
    await updateConfig({ id: botId, builtin_prompt: submitForm.tipWords });
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

const _getBotDetail = async () => {
  try {
    loading.value = true;
    const { data, code } = await getBotDetail({ id: botId });
    if (code === 200) {
      for (const key in formData) {
        if (Object.hasOwnProperty.call(formData, key)) {
          formData[key] = data[key];
        }
      }
      submitForm.tipWords = data?.prompt?.builtin_prompt;
    }
    loading.value = false;
  } catch (error) {
    console.log(error);
    loading.value = false;
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
const toPublish = async () => {
  try {
    const isValidate = await submitFormRef.value.validate();
    if (isValidate) router.push(`/publish/${botId}`);
  } catch (e) {
    ElMessage({
      type: 'warning',
      message: t('bots.tip.tipWords')
    });
    console.log(e);
  }
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
  _getBotDetail();
});
</script>

<style lang="scss" scoped>
.design-side {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: rgba(#fff, 0.1);
  backdrop-filter: blur(35px);
  overflow: hidden auto;

  :deep(.el-textarea__inner) {
    box-shadow: none;

    &:hover {
      box-shadow: none;
    }
  }
}

.design-title {
  font-weight: bold;
  font-size: 16px;
  line-height: 1;
  color: var(--el-text-color-regular);
}

:deep(.n-tabs) {
  .n-tabs-nav {
    width: 500px;
    margin: 0 auto;
  }
}
</style>
