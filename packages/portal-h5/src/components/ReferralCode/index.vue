<template>
  <van-popup
    v-model:show="isDialogVisible"
    class="login-dialog cover-popup"
    teleport="body"
    round
    closeable
    :style="{
      width: '85%',
      height: 'auto',
      padding: '80px 16px 20px'
    }"
    :close-on-click-overlay="false"
    :close-on-popstate="false"
    :before-close="onBeforeClose"
  >
    <LoginLogo title="Referral Code" />
    <van-form
      class="referral-form mx-auto mb-12 w-full"
      :disabled="isLoading"
    >
      <van-field
        v-model="code"
        label="Referral Code"
        maxlength="6"
        clearable
      />
      <van-button
        class="mt-6 w-full"
        :loading="isLoading"
        :disabled="!code"
        @click="emit('confirm', code)"
      >
        Continue
      </van-button>
    </van-form>
  </van-popup>
</template>

<script setup>
const emit = defineEmits(['close', 'confirm']);
const isDialogVisible = ref(false);
const code = ref('');
const isLoading = ref(false);

const open = () => {
  isDialogVisible.value = true;
};

const close = () => {
  isDialogVisible.value = false;
  emit('close');
};

const onBeforeClose = async () => {
  try {
    const action = await showConfirmDialog({
      title: 'Are you sure to skip referral?',
      showConfirmButton: true
    });
    if (action === 'confirm') {
      close();
    }
  } catch (e) {
    console.log(e);
  }
  emit('close');
};

const setIsLoading = (loading) => {
  isLoading.value = loading;
};

defineExpose({ close, open, setIsLoading });
</script>

<style lang="scss">
.login-dialog {
  --van-popup-close-icon-color: var(--h5-text-color-primary);
  background-color: var(--van-blue);


}

.referral-form {
  .van-cell {
    &.van-field {
      --van-cell-background: var(--van-white);
      --van-cell-text-color: var(--h5-text-color-secondary);
      --van-field-input-text-color: var(--van-black);
      --van-field-label-color: var(--h5-text-color-secondary);
      --van-field-label-width: fit-content;
      --van-field-input-disabled-text-color: var(--h5-text-color-secondary);
      --van-field-disabled-text-color: var(--h5-text-color-secondary);
      border-radius: 12px;
    }
  }

  .van-button {
    &--default {
      --van-button-default-color: var(--van-white);
      --van-button-default-background: var(--van-black);
    }
  }
}
</style>
<style lang="scss">
.referral-confirm {
  vertical-align: top;
  margin-top: 136px;
}
</style>
