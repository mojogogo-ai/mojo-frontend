<template>
  <el-dialog
    v-model="dialogVisible"
    width="622px"
    :title="t('user.editProfile')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      ref="formRef"
      label-position="top"
      :model="form"
      :rules="rules"
      :disabled="isLoading"
    >
      <el-form-item
        :label="t('user.d')"
        prop="photo_url"
      >
        <user-avatar
          user
          :avatar="form.photo_url || defaultAvatar"
          :custom-style="{
            height: '80px',
            width: '80px'
          }"
          round-cropper-image
          @update-avatar="onAvatarUpload"
        />
      </el-form-item>
      <el-form-item
        :label="t('user.nickName')"
        prop="nick_name"
      >
        <el-input
          v-model="form.nick_name"
          maxlength="20"
          show-word-limit
        >
          <template #prefix><span class="mr-2">@</span></template>
        </el-input>
      </el-form-item>
      <el-form-item
        :label="t('user.account')"
        prop="email"
        required
      >
        <el-input
          v-model="form.email"
          disabled
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">
        {{ t('common.cancel') }}
      </el-button>
      <el-button
        type="primary"
        linear
        :loading="isLoading"
        @click="onSubmit"
      >
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { t } from '@gptx/base/i18n';
import defaultAvatar from '@/assets/logo/avatar-default.svg';
import useUserStore from '@/store/modules/user.js';
import { updateUserInfo } from '@gptx/base/api/user.js';

const user = useUserStore();
const formRef = ref();
const form = reactive({
  nick_name: '',
  email: '',
  photo_url: ''
});
const rules = reactive({
  nick_name: [
    {
      required: true,
      message: t('user.nameRequired'),
      trigger: 'blur'
    }
  ],
  photo_url: [
    {
      required: true,
      message: t('user.avatarRequired'),
      trigger: 'blur'
    }
  ]
});
const dialogVisible = ref(false);
const isLoading = ref(false);

// open dialog
const open = () => {
  dialogVisible.value = true;
  form.nick_name = user.nickName;
  form.email = user.email || user.phoneNumber;
  form.photo_url = user.avatar;
};
// after avtar upload
const onAvatarUpload = (url) => (form.photo_url = url);
// submit action
const onSubmit = async () => {
  try {
    if (isLoading.value) return;
    isLoading.value = true;
    const isValid = await formRef.value.validate();
    if (isValid) {
      let params = {
        nickname: form.nick_name,
        photo_url: form.photo_url === defaultAvatar ? '' : form.photo_url
      };
      const { code } = await updateUserInfo(params);
      if (code === 200) {
        user.updateUserInfo('nickName', form.nick_name);
        user.updateUserInfo('avatar', form.photo_url);
        dialogVisible.value = false;
      }
    }
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  }
};

defineExpose({ open });
</script>
<style lang="scss" scoped></style>
