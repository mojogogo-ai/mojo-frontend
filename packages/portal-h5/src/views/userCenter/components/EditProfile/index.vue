<template>
  <mojoDialogTranslucent
    v-model:show="isVisible"
    v-bind="$attrs"
    closeable
    round
    teleport="body"
    @close="close"
  >
    <template #title>
      Edit Profile
    </template>
    <div class="bbi-dialog-body">
      <van-form
        ref="formRef"
        class="cover-form"
        label-align="top"
        :disabled="loading || isAIloading"
        @submit.prevent
      >
        <van-field
          :label="'Upload your profile photo'"
          name="icon"
          required
          :rules="rules.icon"
        >
          <template #input>
            <profile-avatar-generator
              :default-avatar="form.icon || defaultRobotAvatar"
              :name="form.name"
              :introduction="form.introduction"
              :title="t('bots.icon')"
              :disabled-tooltip-text="t('bots.generateIconTooltip')"
              @before-generate="isAIloading = true"
              @after-generate="isAIloading = false"
              @change="onImageChange"
            />
          </template>
        </van-field>
        <van-field v-model="form.twitter_link" label="Twitter" placeholder="Enter Twitter Link" />
        <van-field v-model="form.instagram_link" label="Instagram" placeholder="Enter Instagram Link" />
        <van-field v-model="form.facebook_link" label="Facebook" placeholder="Enter Facebook Link" />

      </van-form>
      <div class="bbi-dialog-foot">
        <van-button size="large" @click="close">Cancel</van-button>
        <van-button size="large" type="primary" @click="submitProfileInfo">Save</van-button>
      </div>
    </div>
  </mojoDialogTranslucent>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { useUserStore } from '@/store/modules/user.js';
import { updateUserInfo } from '@gptx/base/api/user.js';
import { ElMessage } from 'element-plus';
import defaultRobotAvatar from '@/assets/logo/bot-default-logo.svg';
import { showFailToast, showSuccessToast } from 'vant';

const userStore = useUserStore();
const isVisible = ref(false);
const formRef = ref(null);
const form = reactive({
  icon: '',
  twitter_link: '',
  instagram_link: '',
  facebook_link: ''
});
const rules = reactive({
  icon: [
    {
      message: t('bots.ruleMessage.icon'),
      trigger: 'change',
      validator: () => !!(form.icon && form.icon !== defaultRobotAvatar)
    }
  ]
});
const loading = ref(false);
const isAIloading = ref(false);
const open = () => {
  form.twitter_link = userStore.twitter_link;
  form.instagram_link = userStore.instagram_link;
  form.facebook_link = userStore.facebook_link;
  form.icon = userStore.avatar
  isVisible.value = true;
};

const close = () => {
  isVisible.value = false;
  form.twitter_link = '';
  form.instagram_link = ''
  form.facebook_link = ''
  form.icon = ''
  form.is_personalize_image_icon = false
};

const submitProfileInfo = async () => {
  if (loading.value) return;
  await formRef.value.validate();
  loading.value = true;
  try {
    console.log('Profile updated successfully', form);
    updateUserInfo({
      photo_url: form.icon,
      twitter_link: form.twitter_link,
      instagram_link: form.instagram_link,
      facebook_link: form.facebook_link,
      is_personalize_image_icon: form.is_personalize_image_icon
    }).then(() => {
      // 提示更新成功
      showSuccessToast('Profile updated successfully');
    });
    close();
  } catch (e) {
    console.error(e);
    // 提示更新失败
    // ElMessage({
    //   message: 'Failed to update profile. Please try again later.',
    //   type: 'error',
    //   duration: 2000
    // });
    showFailToast('Failed to update profile. Please try again later.');
  } finally {
    await userStore.updateSysInfo()
    loading.value = false;
  }
};

defineExpose({ open });
</script>

<style lang="scss" scoped>
.bbi-dialog {
  &-head {
    font-size: 18px;
    font-weight: bold;
    padding: 16px;
    border-bottom: 1px solid #eee;
  }

  &-body {
    padding: 16px;
  }

  &-foot {
    padding: 0;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    :deep(.van-button) {
      width: 45%;
      padding: 10px 20px;
    }
  }
}
</style>
