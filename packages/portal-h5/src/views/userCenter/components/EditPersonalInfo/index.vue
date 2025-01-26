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
      Edit personal information
    </template>
    <div class="bbi-dialog-body">
      <van-form
        ref="formRef"
        class="cover-form"
        label-align="top"
        :disabled="loading"
        @submit.prevent
      >
        <van-field v-model="form.username" label="Username" readonly />
        <van-field v-model="form.alias" label="Alias" />
        <van-field v-model="form.email" label="Email" readonly />
      </van-form>
      <div class="bbi-dialog-foot">
        <van-button size="large" @click="close">Cancel</van-button>
        <van-button size="large" type="primary" @click="submitProfileInfo">Save</van-button>
      </div>
    </div>
  </mojoDialogTranslucent>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user.js';
import { updateUserInfo } from '@gptx/base/api/user.js';
import { showFailToast, showSuccessToast } from 'vant';
const loading = ref(false);
const userStore = useUserStore();
const isVisible = ref(false);
const form = reactive({
  username: '',
  alias: '',
  email: ''
});

const open = () => {
  form.username = userStore.username;
  form.alias = userStore.nickname;
  form.email = userStore.email;
  isVisible.value = true;
};

const close = () => {
  isVisible.value = false;
};

const submitProfileInfo = async () => {
  if(loading.value) return;
  if(!form.alias) {
    showFailToast('Alias is required');
    return;
  }
  try {
    await updateUserInfo({ nick_name: form.alias });
    showSuccessToast('Profile updated successfully');
    close();
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    showFailToast('Failed to update profile');
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
