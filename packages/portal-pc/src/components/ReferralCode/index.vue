<template>
  <el-dialog
    v-model="isDialogVisible"
    class="login-dialog"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <LoginLogo title="Referral Code" />
    <el-form class="referral-form mx-auto mb-12 w-[500px]">
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

const open = () => {
  isDialogVisible.value = true;
};

const close = async () => {
  try {
    const action = await ElMessageBox.confirm('Are you sure to skip referral?', {
      title: 'System Tip',
      customClass: 'referral-confirm'
    });
    if (action === 'confirm') {
      isDialogVisible.value = false;
    }
  } catch (e) {
    console.log(e);
  }
};

defineExpose({ close, open });
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
  }

  .el-button {
    &--info {
      --el-button-bg-color: var(--el-color-white);
      --el-button-text-color: var(--el-color-black);
      --el-button-hover-bg-color: var(--el-text-color-secondary);
      --el-button-hover-text-color: var(--el-text-color-placeholder);
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
