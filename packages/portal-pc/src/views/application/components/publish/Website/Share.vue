<template>
  <el-dialog
    v-model="isVisible"
    width="622px"
    :title="t('bots.publish.label.webShare')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      class="text-[#36353a]"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent
    >
      <el-form-item prop="access_key">
        <div class="w-full leading-[22px]">
          <div class="flex items-center mb-1">
            <div class="mr-auto">{{ t('bots.publish.label.security') }}</div>
            <el-switch
              v-model="form.encrypt"
              size="small"
              @change="onNeedPasswordChange"
            />
          </div>
          <div class="text-[#7a7a7a] mb-1">{{ t('bots.publish.label.sercuritySub') }}</div>
          <el-input
            v-if="form.encrypt"
            v-model="form.access_key"
            type="password"
            size="large"
            maxlength="10"
            show-password
            :placeholder="t('bots.publish.placeholder.password')"
          />
        </div>
      </el-form-item>
      <!-- <el-form-item>
        <div class="w-full leading-[22px]">
          <div class="mb-1">{{ t('common.theme.theme') }}</div>
          <div class="text-[#7a7a7a] mb-1">{{ t('common.theme.choose') }}</div>
          <el-select
            v-model="form.theme_symbol"
            size="large"
          >
            <el-option
              :label="t('common.theme.system')"
              value="system"
            />
            <el-option
              :label="t('common.theme.l')"
              value="light"
            />
            <el-option
              :label="t('common.theme.d')"
              value="dark"
            />
          </el-select>
        </div>
      </el-form-item> -->
      <el-form-item v-if="option.shared_key">
        <div class="w-full leading-[22px]">
          <div class="mb-1">SharedKey</div>
          <div class="text-[#7a7a7a] mb-1">{{ option.shared_key }}</div>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="w-full leading-[22px]">
          <div class="mb-1">{{ t('bots.icon') }}</div>
          <user-avatar
            :avatar="form.icon || BotDefaultLogo"
            :custom-style="{
              height: '44px',
              width: '44px'
            }"
            @update-avatar="onAvatarUpload($event, 'icon')"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <div class="w-full leading-[22px]">
          <div class="mb-1">{{ t('user.icon') }}</div>
          <user-avatar
            :avatar="form.avatar || AvatarDefault"
            :custom-style="{
              height: '44px',
              width: '44px'
            }"
            @update-avatar="onAvatarUpload($event, 'avatar')"
          />
        </div>
      </el-form-item>
      <!-- <el-form-item>
        <div class="w-full leading-[22px]">
          <div class="flex items-center mb-1">
            <div class="mr-auto">{{ t('chat.newChatBtn') }}</div>
            <el-switch
              v-model="form.enable_new_session"
              size="small"
            />
          </div>
          <div class="text-[#7a7a7a] mb-1">{{ t('chat.newChatBtnDes') }}</div>
        </div>
      </el-form-item> -->
      <el-form-item>
        <div class="w-full leading-[22px]">
          <div class="flex items-center mb-1">
            <div class="mr-auto">{{ t('chat.keepChatHistory') }}</div>
            <el-switch
              v-model="form.enable_chat_stay"
              size="small"
            />
          </div>
          <div class="text-[#7a7a7a] mb-1">{{ t('chat.keepChatHistoryDes') }}</div>
        </div>
      </el-form-item>
      <!-- <el-form-item>
        <div class="w-full leading-[22px]">
          <div class="flex items-center mb-1">
            <div class="mr-auto">{{ t('common.poweredBy') }}</div>
            <el-switch
              v-model="form.show_powered_by"
              size="small"
            />
          </div>
          <div class="text-[#7a7a7a] mb-1">{{ t('common.showThisLabel') }}</div>
        </div>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="close">{{ t('common.cancel') }}</el-button>
      <el-button
        type="primary"
        linear
        :loading="loading"
        :disabled="loading"
        @click="submit"
      >
        {{ t('common.ok') }}
      </el-button>
    </template>
  </el-dialog>
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
const form = reactive({
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
/* ref dom */
const formRef = ref(null);

const open = () => {
  isVisible.value = true;
};
const close = () => {
  isVisible.value = false;
};
/* 验证密码 */
const checkPassword = (rule, value, callback) => {
  const password = /^(\w|\W){4,10}$/;
  if(!value||!value.trim()){
    return callback(new Error(t('bots.publish.placeholder.password')));
  }
  if (!password.test(value)) {
    return callback(new Error(t('bots.publish.placeholder.passwordVali')));
  }
  callback();
};
const onNeedPasswordChange = (isNeed) => {
  formRef.value.resetFields();
  form.access_key = '';
  if (isNeed) {
    rules.access_key = [
      {
        required: true,
        validator: checkPassword,
        trigger: 'blur'
      }
    ];
  } else {
    rules.access_key = null;
  }
};
const onAvatarUpload = (url, key) => (form[key] = url);
const submit = async () => {
  try {
    const isValidate = await formRef.value.validate();
    if (isValidate) {
      const { code } = await configureWebShare({
        app_id: props.botId,
        ...form
      });
      if (code === 200) {
        emits('update-option');
        close();
      }
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => props.option,
  (value) => {
    for (const key in form) {
      if (Object.hasOwnProperty.call(form, key)) {
        form[key] = value[key];
      }
    }
  }
);
defineExpose({ open });
</script>
