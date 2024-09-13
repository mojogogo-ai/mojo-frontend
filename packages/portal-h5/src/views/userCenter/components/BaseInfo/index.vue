<template>
  <van-popup
    v-model:show="dialogVisible"
    class="cover-popup"
    position="bottom"
    closeable
  >
    <div class="cover-popup-head">
      {{ t('user.editProfile') }}
    </div>
    <div class="cover-popup-body">
      <van-form
        ref="formRef"
        class="cover-form"
        label-align="top"
        :disabled="isLoading"
        @submit="onSubmit"
      >
        <van-field
          required
          name="photo_url"
          :label="t('user.d')"
          :rules="rules.photo_url"
        >
          <template #input>
            <input
              v-model="form.photo_url"
              type="hidden"
              name="photo_url"
            >
            <user-avatar
              v-model="form.photo_url"
              user
              :custom-style="{
                height: '80px',
                width: '80px'
              }"
              round-cropper-image
            />
          </template>
        </van-field>
        <van-field
          v-model="form.nick_name"
          type="textarea"
          name="nick_name"
          maxlength="20"
          show-word-limit
          required
          background
          :placeholder="t('user.nameRequired')"
          :label="t('user.nickName')"
          :rules="rules.nick_name"
        />
        <van-field
          v-model="form.email"
          required
          background
          disabled
          :label="t('user.account')"
        />
      </van-form>
    </div>
    <div class="cover-popup-foot">
      <van-button
        size="small"
        @click="dialogVisible = false"
      >
        {{ t('common.cancel') }}
      </van-button>
      <van-button
        type="primary"
        size="small"
        linear
        :loading="isLoading"
        @click="onSubmit"
      >
        {{ t('common.confirm') }}
      </van-button>
    </div>
  </van-popup>
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
      message: t('user.nameRequired')
    }
  ],
  photo_url: [
    {
      message: t('user.avatarRequired'),
      validator: () => {
        return !!(form.photo_url && form.photo_url !== defaultAvatar);
      }
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
  form.photo_url = user.avatar || defaultAvatar;
};
// submit action
const onSubmit = async () => {
  try {
    if (isLoading.value) return;
    isLoading.value = true;
    await formRef.value.validate();
    let params = {
      nickname: form.nick_name,
      photo_url: form.photo_url === defaultAvatar ? '' : form.photo_url
    };
    const { code } = await updateUserInfo(params);
    if (code === 200) {
      user.updateUserInfo('nickName', form.nick_name);
      user.updateUserInfo('avatar', form.photo_url);
      isLoading.value = false;
      dialogVisible.value = false;
    }
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  }
};

defineExpose({ open });
</script>
<style lang="scss" scoped></style>
