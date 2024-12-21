<template>
  <mojoDialogTranslucent
    v-model="isVisible"
    v-bind="$attrs"
    width="600px"
    custom-class="edit-personal-info-dialog"
    class="edit-personal-info-dialog"
    :title="t('profile.editPersonalInfo')"
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
      <!-- Username -->
      <el-form-item
        :label="t('profile.username')"
        prop="username"
      >
        <el-input
          v-model="form.username"
          readonly
          :placeholder="'readOnly'"
          clearable
        />
      </el-form-item>

      <!-- Alias -->
      <el-form-item
        :label="t('profile.alias')"
        prop="alias"
      >
        <el-input
          v-model="form.alias"
          :placeholder="t('profile.enterAlias')"
          clearable
        />
      </el-form-item>

      <!-- Email -->
      <el-form-item
        :label="t('profile.email')"
        prop="email"
      >
        <el-input
          v-model="form.email"
          readonly
          :placeholder="'readOnly'"
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
        style="margin-left: 16px;width: 140px;"
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
import mojoDialogTranslucent from '@/components/mojoDialogTranslucent/index.vue';

const userStore = useUserStore();
const isVisible = ref(false);
const form = reactive({
  username: '',
  alias: '',
  email: ''
});
const rules = reactive({
});
const formRef = ref(null);
const loading = ref(false);
const isAIloading = ref(false);

const open = () => {
  form.username = userStore.username;
  form.alias = userStore.nickname;
  form.email = userStore.email;
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
        await updateUserInfo({
          // username: form.username,
          nick_name: form.alias,
          // email: form.email
        }).then(async () => {
          await userStore.updateSysInfo()
          ElMessage({
            message: 'Profile updated successfully!',
            type: 'success',
            duration: 2000
          });
        });
      } catch (e) {
        console.error(e);
        ElMessage({
          message: 'Failed to update profile. Please try again later.',
          type: 'error',
          duration: 2000
        });
      } finally {
        loading.value = false;
        close();
      }
    }
  });
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
  //padding: 12px 16px !important;
}
</style>
