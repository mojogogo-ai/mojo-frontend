<template>
  <van-popup
    v-model:show="isVisible"
    class="cover-popup"
    position="bottom"
    closeable
  >
    <div class="cover-popup-head">
      {{ t('bots.publish.label.webShare') }}
    </div>
    <div class="cover-popup-body">
      <van-form
        ref="formRef"
        class="cover-form text-[#36353a]"
        label-position="top"
        @submit="submit"
      >
        <div class="w-full leading-[22px]">
          <div class="flex items-center mb-1">
            <div class="mr-auto">{{ t('bots.publish.label.security') }}</div>
            <van-switch
              v-model="form.encrypt"
              size="18"
              @change="onNeedPasswordChange"
            />
          </div>
          <div class="mb-2 text-[#7a7a7a]">{{ t('bots.publish.label.sercuritySub') }}</div>
        </div>
        <van-field
          v-if="form.encrypt"
          v-model="form.access_key"
          name="access_key"
          type="password"
          maxlength="10"
          background
          :placeholder="t('bots.publish.placeholder.password')"
          :rules="rules.access_key"
        />
        <!-- <div class="w-full leading-[22px]">
          <div class="mb-1">{{ t('common.theme.theme') }}</div>
          <div class="mb-2 text-[#7a7a7a]">{{ t('common.theme.choose') }}</div>
          <van-field class="no-body-padding">
            <template #input>
              <selector
                v-model="form.theme_symbol"
                background
                :columns="themeList"
              />
            </template>
          </van-field>
        </div> -->
        <div v-if="option.shared_key" class="w-full leading-[22px]">
          <div class="mb-1">SharedKey</div>
          <div class="mb-2 text-[#7a7a7a]">{{ option.shared_key }}</div>
        </div>
        <div class="w-full leading-[22px]">
          <div class="mb-2">{{ t('bots.icon') }}</div>
          <van-field class="no-body-padding">
            <template #input>
              <user-avatar
                v-model="form.icon"
                :custom-style="{
                  height: '44px',
                  width: '44px'
                }"
                @update:model-value="onAvatarUpload($event, 'icon')"
              />
            </template>
          </van-field>
        </div>
        <div class="w-full leading-[22px]">
          <div class="mb-2">{{ t('user.icon') }}</div>
          <van-field class="no-body-padding">
            <template #input>
              <user-avatar
                v-model="form.avatar"
                :custom-style="{
                  height: '44px',
                  width: '44px'
                }"
                @update:model-value="onAvatarUpload($event, 'avatar')"
              />
            </template>
          </van-field>
        </div>
        <!-- <div class="w-full leading-[22px]">
          <div class="flex items-center mb-1">
            <div class="mr-auto">{{ t('chat.newChatBtn') }}</div>
            <van-switch
              v-model="form.enable_new_session"
              size="18"
            />
          </div>
          <div class="mb-2 text-[#7a7a7a]">{{ t('chat.newChatBtnDes') }}</div>
        </div> -->
        <div class="w-full leading-[22px]">
          <div class="flex items-center mb-1">
            <div class="mr-auto">{{ t('chat.keepChatHistory') }}</div>
            <van-switch
              v-model="form.enable_chat_stay"
              size="18"
            />
          </div>
          <div class="mb-2 text-[#7a7a7a]">{{ t('chat.keepChatHistoryDes') }}</div>
        </div>
        <!-- <div class="w-full leading-[22px]">
          <div class="flex items-center mb-1">
            <div class="mr-auto">{{ t('common.poweredBy') }}</div>
            <van-switch
              v-model="form.show_powered_by"
              size="18"
            />
          </div>
          <div class="mb-2 text-[#7a7a7a]">{{ t('common.showThisLabel') }}</div>
        </div> -->
      </van-form>
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
        :loading="loading"
        :disabled="loading"
        @click="submit"
      >
        {{ t('common.ok') }}
      </van-button>
    </div>
  </van-popup>
</template>
<script setup>
import { t } from '@gptx/base/i18n';
import BotDefaultLogo from '@/assets/logo/bot-default-logo.svg';
import AvatarDefault from '@/assets/logo/avatar-default.svg';
import { configureWebShare } from '@gptx/base/api/application';

const props = defineProps({
  botId: {
    type: String,
    default: ''
  },
  option: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(['update-option']);

const isVisible = ref(false);
let form = reactive({
  encrypt: false,
  access_key: '',
  theme_symbol: 'system',
  icon: '',
  avatar: '',
  enable_new_session: false,
  enable_chat_stay: false,
  show_powered_by: false
});
const rules = reactive({
  access_key: null
});
const loading = ref(false);
// const themeList = [
//   { text: t('common.theme.system'), value: 'system' },
//   { text: t('common.theme.l'), value: 'light' },
//   { text: t('common.theme.d'), value: 'dark' }
// ];
/* ref dom */
const formRef = ref(null);

const open = () => {
  isVisible.value = true;
};
const close = () => {
  isVisible.value = false;
};
/* 验证密码 */
const checkPassword = (value) => {
  const password = /^(\w|\W){4,10}$/;
  return password.test(value);
};
const onNeedPasswordChange = (isNeed) => {
  form.access_key = '';
  if (isNeed) {
    rules.access_key = [
      {
        required: true,
        message: t('bots.publish.placeholder.password')
      },
      {
        required: true,
        validator: checkPassword,
        message: t('bots.publish.placeholder.passwordVali')
      }
    ];
  } else {
    rules.access_key = null;
  }
};
const onAvatarUpload = (url, key) => (form[key] = url);
const submit = async () => {
  try {
    await formRef.value.validate();
    const { code } = await configureWebShare({
      app_id: props.botId,
      ...form,
      icon: form.icon === BotDefaultLogo ? '' : form.icon,
      avatar: form.avatar === AvatarDefault ? '' : form.avatar
    });
    if (code === 200) {
      emits('update-option');
      close();
    }
    loading.value = false;
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => props.option,
  (value) => {
    if (value)
      form = {
        ...form,
        ...value,
        icon: value.icon || BotDefaultLogo,
        avatar: value.avatar || AvatarDefault
      };
  },
  { immediate: true }
);
defineExpose({ open });
</script>
<style>
.van-cell {
  overflow: visible;
}

.van-field__error-message {
  top: 32px;
  bottom: unset;
  line-height: 1.2;
}
</style>
