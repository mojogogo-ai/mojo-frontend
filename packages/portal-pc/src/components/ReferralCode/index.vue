<template>
  <el-dialog
    v-model="isDialogVisible"
    class="login-dialog"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="onBeforeClose"
  >
    <LoginLogo title="Referral Code" />
    <el-form
      class="referral-form mx-auto mb-12 w-[500px]"
      :disabled="isLoading"
    >
      <el-form-item>
        <el-input
          v-model="code"
          maxlength="6"
          clearable
        >
          <template #prefix>
            <span class="text-[var(--el-text-color-secondary)]">Referral Code</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="info"
          size="large"
          class="w-full"
          :loading="isLoading"
          :disabled="!code"
          @click="emit('confirm', code)"
        >
          Continue
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ElMessageBox } from 'element-plus';

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
    const action = await ElMessageBox.confirm('Are you sure to skip referral?', {
      title: 'System Tip',
      customClass: 'referral-confirm'
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
  background-color: var(--el-color-primary);

  .el-dialog__close {
    color: #000;
    font-size: 20px;
  }

  .el-dialog__headerbtn:focus .el-dialog__close,
  .el-dialog__headerbtn:hover .el-dialog__close {
    color: #000 !important;
    opacity: 0.75;
  }

  .login-footer {
    width: 348px;
    height: 50px;
    font-size: 15px;
    font-weight: 400;
    line-height: 25px;
    text-align: center;
    color: #000;
  }
}

.referral-form {
  .el-input {
    --el-input-bg-color: #fff;
    --el-input-border-color: var(-el-border-color);
    --el-input-text-color: var(--el-text-color-primary);
    --el-input-placeholder-color: var(--el-text-color-secondary);
    --el-disabled-bg-color: rgba(0, 0, 0, 0.1);
    --el-disabled-text-color: var(--el-text-color-secondary);
  }

  .el-button {
    &--info {
      --el-button-bg-color: var(--el-color-white);
      --el-button-text-color: var(--el-color-black);
      --el-button-hover-bg-color: var(--el-text-color-secondary);
      --el-button-hover-text-color: var(--el-text-color-placeholder);
      --el-button-disabled-bg-color: rgba(0, 0, 0, 0.3);
      --el-button-disabled-text-color: var(--el-text-color-secondary);
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
