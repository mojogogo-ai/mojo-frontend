<template>
  <div class="w-[552px] mx-auto">
    <div class="text-center  mt-[60px] mb-[40px] text-[#e1ff01] text-[28px] font-bold font-['TT Norms Pro'] leading-[23px]">Create Meme Bot</div>
    <div class="w-full h-[38px] mb-2 px-3.5 py-3 bg-[#e1ff01]/5 rounded-xl justify-start items-start gap-3 inline-flex">
      <div class="w-3.5 h-3.5 relative"><el-icon color="#e1ff01"><WarningFilled /></el-icon></div>
      <div class="grow shrink basis-0 opacity-80 text-[#e1ff01] text-[12px] font-medium font-['Inter']">Cost to launch an AI agent is 0.02 SOL.</div>
    </div>
    <el-form
      ref="formRef"
      label-position="top"
      :model="form"
      :rules="rules"
      :disabled="loading || isAIloading"
      @submit.prevent
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="Your name"
            prop="name"
          >
            <el-input
              v-model="form.name"
              placeholder="Your name"
              maxlength="50"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="t('bots.label.gender')"
            prop="gender"
          >
            <el-select
              v-model="form.gender"
              placeholder="Your gender"
            >
              <el-option
                v-for="item in genderList"
                :key="item.id"
                :label="t(item.name)"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            :label="t('bots.label.conversationStyle')"
            prop="classification"
          >
            <el-select
              v-model="form.classification"
              placeholder="Your conversation Style"
            >
              <el-option
                v-for="{ name, id } in catalogList"
                :label="t(name)"
                :value="id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="Audio Selection"
            prop="gender"
          >
            <el-select
              v-model="form.gender"
              placeholder="Select audio"
            >
              <el-option
                v-for="item in genderList"
                :key="item.id"
                :label="t(item.name)"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="Twitter"
        prop="name"
      >
        <el-input
          v-model="form.name"
          placeholder="twitter"
          maxlength="255"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="Telegram"
        prop="name"
      >
        <el-input
          v-model="form.name"
          placeholder="telegram"
          maxlength="255"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="Configure Telegram bot"
        prop="name"
      >
        <div class="w-[552px] h-9 flex flex-col">
          <span class="text-white/70 text-[13px] font-normal font-['TT Norms Pro'] leading-none">Connect to Telegram bots and chat with this bot in Telegram App.</span>
          <span class="text-[#e1ff01] text-[13px] font-normal font-['TT Norms Pro'] mt-1 mb-2 leading-none cursor-pointer hover:" @click="getTgToken">How to get Telegram Bot token ?</span>
        </div>
        <el-input
          v-model="form.name"
          placeholder="Please enter Telegram Bot token"
          maxlength="10000"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="Description"
        prop="introduction"
      >
        <el-input
          v-model="form.introduction"
          type="textarea"
          :rows="4"
          placeholder="Describe your bot’s functions and usage."
          maxlength="800"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="t('bots.icon')"
        prop="icon"
      >
        <BotAvatarGenerator
          :default-avatar="form.icon"
          :name="form.name"
          :gender="form.gender"
          :introduction="form.introduction"
          :title="t('bots.icon')"
          :disabled-tooltip-text="t('bots.generateIconTooltip')"
          @before-generate="isAIloading = true"
          @after-generate="isAIloading = false"
          @change="onImageChange"
        />
      </el-form-item>
    </el-form>
    <div class="flex justify-end w-full my-10">
      <el-button
        :disabled="loading"
        @click="close"
      >
        {{ t('common.cancel') }}
      </el-button>
      <el-button
        style="margin-left: 16px;"
        type="primary"
        :loading="loading"
        :disabled="loading"
        linear
        @click="submitBaseInfo(formRef)"
      >
        {{ 'Launch' }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { createBot, botEdit } from '@gptx/base/api/application';
import { storeAppCopy } from '@gptx/base/api/chat.js';

const emits = defineEmits(['after-create', 'after-update']);
const isVisible = ref(false);
const isEdit = ref(false);
const form = reactive({
  icon: '',
  name: '',
  introduction: '',
  classification: [],
  gender: null,
  third_company: '',
  is_personalize_image_icon: false
});
const rules = reactive({
  icon: [{ required: true, message: t('bots.ruleMessage.icon'), trigger: 'change' }],
  name: [{ required: true, message: t('bots.ruleMessage.name') }],
  introduction: [{ required: true, message: t('bots.ruleMessage.introduction') }],
  classification: [{ required: true, message: t('bots.ruleMessage.catalog'), trigger: 'change' }]
});
const catalogList = reactive([
  // Natural Professional Passionate Customize
  { id: 'Natural', name: 'Natural' },
  { id: 'Professional', name: 'Professional' },
  { id: 'Passionate', name: 'Passionate' },
  { id: 'Customize', name: 'Customize' }
]);
// user gender,0 none-binary 1 male 2 female
const genderList = reactive([
  { id: 0, name: 'None-binary' },
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' }
]);



const formRef = ref(null);
const loading = ref(false);
const isAIloading = ref(false);
const isCopy = ref(false);

const close = () => {
  isVisible.value = false;
  form.id = '';
  form.icon = '';
  form.name = '';
  form.introduction = '';
  form.classification = [];
  form.gender = null;
  form.third_company = '';
  form.is_personalize_image_icon = false;
  formRef.value.resetFields();
};
const onImageChange = (url, is_personalize_image_icon) => {
  form.icon = url
  form.is_personalize_image_icon = is_personalize_image_icon
};
// commit action
const submitBaseInfo = async (el) => {
  if (loading.value) return;
  await el.validate(async (valid) => {
    if (valid) {
      if (isCopy.value) await copyApp();
      else if (isEdit.value) await editAppInfo();
      else await createNewBot();
    }
  });
};
// update info
const editAppInfo = async () => {
  try {
    loading.value = true;
    const result = await botEdit(form);
    if (result.code === 200) {
      loading.value = false;
      emits('after-update');
      emits('after-create', {
        id: form.id,
        icon: form.icon,
        name: form.name,
        introduction: form.introduction,
        classification: form.classification,
        files: form?.files || null
      });
      formRef.value.resetFields();
      close();
    }
    loading.value = false;
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};
// create new bot
const createNewBot = async () => {
  try {
    loading.value = true;
    const result = await createBot(form);
    if (result.code === 200) {
      loading.value = false;
      emits('after-create', result.data);
      close();
    }
    loading.value = false;
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};
// copy app
const copyApp = async () => {
  try {
    loading.value = true;
    const result = await storeAppCopy(form);
    if (result.code === 200) {
      loading.value = false;
      emits('after-create', result.data);
      close();
    }
    loading.value = false;
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};

const getTgToken = () => {
  window.open('https://www.siteguarding.com/en/how-to-get-telegram-bot-api-token')
};

</script>

<style lang="scss" scoped>
.base-info-img {
  position: relative;
  width: 88px;
  height: 88px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;

  &::after {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #eee;
    font-size: 24px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: rgba(#000, 0.4);
    content: '+';
    opacity: 0;
  }

  &:hover {
    &::after {
      opacity: 1;
    }
  }
}

.base-info-avatar {
  width: 100%;
  height: 100%;
}

.base-list-row {
  display: flex;
}

.base-list-col {
  & + & {
    margin-left: 16px;
  }
}

.base-list-img {
  width: 56px;
  height: 56px;
  border-radius: 8px;

  &__error {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 20px;
  }
}

.base-list-option {
  padding-top: 4px;
  color: #999;
  font-size: 20px;
  line-height: 32px;
  border-top: 1px solid #eee;

  .base-list-col {
    display: flex;
    align-items: center;

    & + .base-list-col {
      margin-left: 8px;
    }
  }
}

.el-card__body {
  padding: 12px 16px !important;
}
</style>
