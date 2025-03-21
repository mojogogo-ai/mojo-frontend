<template>
  <mojoDialogTranslucent
    v-model="isVisible"
    v-bind="$attrs"
    width="622px"
    :title="isEdit ? 'Edit basic information' : t('bots.new')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      label-position="top"
      :model="form"
      :rules="rules"
      :disabled="loading || isAIloading"
      @submit.prevent
    >
      <el-form-item
        :label="t('bots.label.name')"
        prop="name"
      >
        <el-input
          v-model="form.name"
          :placeholder="t('bots.place.name')"
          maxlength="50"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="t('bots.label.gender')"
        prop="gender"
      >
        <el-select
          v-model="form.gender"
          :placeholder="t('bots.place.catalog')"
        >
          <el-option
            v-for="item in genderList"
            :key="item.id"
            :label="t(item.name)"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="t('bots.label.symbol')"
        prop="symbol"
      >
        <el-input
          v-model="form.symbol"
          :placeholder="t('bots.place.symbol')"
          maxlength="6"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="t('bots.label.conversationStyle')"
        prop="classification"
      >
        <el-select
          v-model="form.classification"
          :placeholder="t('bots.place.conversationStyle')"
        >
          <el-option
            v-for="{ name, id } in catalogList"
            :label="t(name)"
            :value="id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="t('bots.label.description')"
        prop="introduction"
      >
        <el-input
          v-model="form.introduction"
          type="textarea"
          :rows="6"
          :placeholder="t('bots.place.description')"
          maxlength="2000"
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
          :symbol="form.symbol"
          :introduction="form.introduction"
          :title="t('bots.icon')"
          :disabled-tooltip-text="t('bots.generateIconTooltip')"
          @before-generate="isAIloading = true"
          @after-generate="isAIloading = false"
          @change="onImageChange"
        />
      </el-form-item>
      <el-form-item
        label="Twitter"
        prop="twitter"
      >
        <TwitterButton
          @updateTwitterLink="updateTwitterLink"
          @update-auth-status="handleAuthStatusUpdate" />
      </el-form-item>
      <el-form-item
        label="Telegram"
        prop="telegram"
      >
        <el-input
          v-model="form.telegram"
          placeholder="Enter your Telegram address"
          maxlength="255"
          clearable
        />
        <div class="toggle-container">
          <label for="telegram-switch">Configure Telegram Bot</label>
          <el-switch
            v-model="isTelegramConfigured"
            @change="toggleTelegramConfiguration"
            active-color="#1da1f2"
            inactive-color="#ccc"
          />
        </div>
        <div v-if="isTelegramConfigured" class="additional-config">
          <el-form-item
            prop="telegram_bot_token"
          >
            <div class="w-[552px] h-9 flex flex-col">
              <span class="text-white/70 text-[13px] font-normal font-['TT Norms Pro'] leading-none">Connect to Telegram bots and chat with this bot in Telegram App.</span>
              <span class="text-[#e1ff01] text-[13px] font-normal font-['TT Norms Pro'] mt-1 mb-2 leading-none cursor-pointer hover:" @click="getTgToken">How to get Telegram Bot adress and token?</span>
            </div>

            <el-input
              v-model="form.telegram_bot_address"
              placeholder="Enter Telegram Bot address"
              maxlength="255"
              clearable
            />
            <div class="w-[552px] h-5 flex flex-col"></div>
            <el-input
              v-model="form.telegram_bot_token"
              placeholder="Please enter Telegram Bot token"
              maxlength="10000"
              clearable
            />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item
        label="Website"
        prop="website"
      >
        <el-input
          v-model="form.website"
          placeholder="Enter your website"
          maxlength="255"
          clearable
        />
      </el-form-item>


    </el-form>
    <template #footer>
      <el-button
        :disabled="loading"
        @click="close"
      >
        {{ t('common.cancel') }}
      </el-button>
      <el-button
        style="margin-left: 16px;width: 140px;"
        type="primary"
        :loading="loading"
        :disabled="loading"
        linear
        @click="submitBaseInfo(formRef)"
      >
        {{ 'Next Step' }}
      </el-button>
    </template>
  </mojoDialogTranslucent>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { getBotInfo, createBot, botEdit } from '@gptx/base/api/application';
// import defaultRobotAvatar from '@/assets/logo/bot-default-logo.svg';
import { storeAppCopy } from '@gptx/base/api/chat.js';
import { ElMessage } from 'element-plus';
import TwitterButton from '@/views/memebot/twitterbutton/index.vue';
import { ref } from 'vue';

const emits = defineEmits(['after-create', 'after-update','after-upload-knowledge-sources']);
const isVisible = ref(false);
const isEdit = ref(false);
const form = reactive({
  icon: '',
  name: '',
  introduction: '',
  classification: [],
  gender: null,
  third_company: '',
  is_personalize_image_icon: false,
  twitter_state: '',
  twitter: '',
  website: '',
  telegram: '',
  telegram_bot_address: '',
  telegram_bot_token: '',
});
const rules = reactive({
  icon: [{ required: true, message: t('bots.ruleMessage.icon'), trigger: 'change' }],
  name: [{ required: true, message: t('bots.ruleMessage.name') }],
  symbol: [{ required: true, message: t('bots.ruleMessage.symbol') }],
  gender: [{ required: true, message: t('bots.ruleMessage.gender') }],
  introduction: [{ required: true, message: 'Please enter description' }],
  classification: [{ required: true, message: t('bots.ruleMessage.catalog'), trigger: 'change' }]
});
const catalogList = reactive([
  // Natural Professional Passionate Customize
  { id: 'Natural', name: 'Natural' },
  { id: 'Professional', name: 'Professional' },
  { id: 'Passionate', name: 'Passionate' },
  { id: 'Default', name: 'Default' },
  { id: 'Playful', name: 'Playful' }
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
const isTelegramConfigured = ref(false);


const open = async (option) => {
  if (option?.id) form.id = option?.id;
  isEdit.value = !!option?.id;
  isVisible.value = true;
  if(isEdit.value) {
    loading.value = true;
    try {
      const { code, data } = await getBotInfo({
        id: option.id
      });
      // console.log(data, 'data')
      if (code === 200) {
        console.log("data",data)
        form.icon = data.icon;
        form.name = data.name;
        form.introduction = data.introduction;
        form.classification = data.classification;
        form.gender = data.gender
        form.files = data.files;
        form.symbol = data.symbol;
      }
    } catch (error) {
      console.log(error);
      // 获取详情失败
      ElMessage.error(t('bots.error.getDetail'));
    } finally {
      loading.value = false;
    }
  } else {
    // await nextTick();
    // alert(1)
    form.id = '';
    form.symbol = '';
    form.icon = '';
    form.name = '';
    form.introduction = '';
    form.classification = [];
    form.gender = null;
    form.third_company = '';
    form.is_personalize_image_icon = false;
    // formRef.value.resetFields();
  }
}
const close = () => {
  isVisible.value = false;
  form.id = '';
  form.icon = '';
  form.name = '';
  form.symbol = '';
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
      emits('after-upload-knowledge-sources');
      emits('after-create', {
        id: form.id,
        icon: form.icon,
        name: form.name,
        introduction: form.introduction,
        classification: form.classification,
        gender: form.gender,
        symbol: form.symbol,
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
function updateTwitterLink(newLink) {
  form.twitter = newLink;
}
function handleAuthStatusUpdate(newStatus) {
  form.twitter_state = newStatus;
}
const toggleTelegramConfiguration = () => {
  if (!isTelegramConfigured.value) {
    form.telegram_bot_address = '';
    form.telegram_bot_token = '';
  }
};


defineExpose({ open });
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
.toggle-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  width: 100%;
}

</style>
