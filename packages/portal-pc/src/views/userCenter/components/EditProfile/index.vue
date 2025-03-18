<template>
  <mojoDialogTranslucent
    v-model="isVisible"
    v-bind="$attrs"
    width="600px"
    :title="t('profile.editProfile')"
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
      <!-- Profile Photo Upload -->
      <el-form-item
        :label="t('profile.uploadProfilePhoto')"
        prop="avatar"
      >
        <profile-avatar-generator
          :default-avatar="form.avatar"
          :gender="userStore.gender"
          :title="t('profile.uploadProfilePhoto')"
          :disabled-tooltip-text="t('profile.generateTooltip')"
          :name="'avatar'"
          @before-generate="isAIloading = true"
          @after-generate="isAIloading = false"
          @change="onImageChange"
        />
      </el-form-item>

      <!-- Nickname -->
      <!--      <el-form-item-->
      <!--        :label="t('profile.nickname')"-->
      <!--        prop="nickname"-->
      <!--      >-->
      <!--        <el-input-->
      <!--          v-model="form.nickname"-->
      <!--          :placeholder="t('profile.enterNickname')"-->
      <!--          clearable-->
      <!--        />-->
      <!--      </el-form-item>-->

      <!-- Social Media Links -->
      <el-form-item
        :label="t('profile.twitter')"
        prop="twitter_link"
      >
        <el-input
          v-model="form.twitter_link"
          placeholder="Please enter the correct link (with the prefix https://)"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="t('profile.instagram')"
        prop="instagram_link"
      >
        <el-input
          v-model="form.instagram_link"
          placeholder="Please enter the correct link (with the prefix https://)"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="t('profile.facebook')"
        prop="facebook_link"
      >
        <el-input
          v-model="form.facebook_link"
          placeholder="Please enter the correct link (with the prefix https://)"
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
        type="primary"
        :loading="loading"
        :disabled="loading"
        @click="submitProfileInfo(formRef)"
      >
        {{ t('common.save') }}
      </el-button>
    </template>
  </mojoDialogTranslucent>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import useUserStore from '@/store/modules/user.js';
import { updateUserInfo } from '@gptx/base/api/user.js';
import { ElMessage } from 'element-plus';

const userStore = useUserStore();
const isVisible = ref(false);
const form = reactive({
  avatar: '',
  is_personalize_image_icon: false,
  twitter_link: '',
  instagram_link: '',
  facebook_link: ''
});
const rules = reactive({
  avatar: [{ required: true, message: t('profile.ruleMessage.avatar'), trigger: 'change' }],
  // nickname: [{ required: true, message: t('profile.ruleMessage.nickname'), trigger: 'blur' }]
  twitter_link: [
    {
      required: false, // 如果非必填，可以设置为 false
      validator: (rule, value, callback) => {
        if (value && !/^https:\/\//.test(value)) {
          callback(new Error('Link must start with https://'));
        } else if (value && !isValidUrl(value)) {
          callback(new Error('Please enter a valid URL'));
        } else {
          callback();
        }
      }
    }
  ],
  instagram_link: [
    {
      required: false, // 如果非必填，可以设置为 false
      validator: (rule, value, callback) => {
        if (value && !/^https:\/\//.test(value)) {
          callback(new Error('Link must start with https://'));
        } else if (value && !isValidUrl(value)) {
          callback(new Error('Please enter a valid URL'));
        } else {
          callback();
        }
      }
    }
  ],
  facebook_link: [
    {
      required: false, // 如果非必填，可以设置为 false
      validator: (rule, value, callback) => {
        if (value && !/^https:\/\//.test(value)) {
          callback(new Error('Link must start with https://'));
        } else if (value && !isValidUrl(value)) {
          callback(new Error('Please enter a valid URL'));
        } else {
          callback();
        }
      }
    }
  ]
});
const formRef = ref(null);
const loading = ref(false);
const isAIloading = ref(false);

const onImageChange = (url, is_personalize_image_icon) => {
  form.avatar = url
  form.is_personalize_image_icon = is_personalize_image_icon
}

const open = () => {
  form.avatar = userStore.avatar;
  // form.nickname = userStore.nickname;
  form.twitter_link = userStore.twitter_link;
  form.instagram_link = userStore.instagram_link;
  form.facebook_link = userStore.facebook_link;
  isVisible.value = true;
};
const close = () => {
  isVisible.value = false;
  formRef.value.resetFields();
};
const submitProfileInfo = async (el) => {
  if (loading.value) return;
  await el.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        console.log('Profile updated successfully', form);
        updateUserInfo({
          photo_url: form.avatar,
          twitter_link: form.twitter_link,
          instagram_link: form.instagram_link,
          facebook_link: form.facebook_link,
          is_personalize_image_icon: form.is_personalize_image_icon
        }).then(() => {
          // 提示更新成功
          ElMessage({
            message: 'Profile updated successfully!',
            type: 'success',
            duration: 2000
          });
        });
        close();
      } catch (e) {
        console.error(e);
        // 提示更新失败
        ElMessage({
          message: 'Failed to update profile. Please try again later.',
          type: 'error',
          duration: 2000
        });
      } finally {
        await userStore.updateSysInfo()
        loading.value = false;
      }
    }
  });
};
onMounted(() => {
  console.log(form, 'form');
});
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
</style>
