<script setup lang="tsx">
import { ref, reactive, defineExpose } from 'vue'
import { t } from '@gptx/base/i18n'
import { ElInput, ElForm, ElFormItem, ElButton, ElMessage, ElDialog } from 'element-plus'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from "@/utils/firebase.js" // Assuming Firebase is initialized in this file
import mojoDialog from '@/components/mojoDialog/index.vue'
// State for dialog visibility
const forgotPasswordDialogVisible = ref(false)

// Form state and validation rules
const formRef = ref()
const formData = reactive({
  email: ''
})

const loading = ref(false)

// Email validation rules
const rules = reactive({
  email: [
    { required: true, message: t('forgotPassword.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('forgotPassword.invalidEmail'), trigger: 'blur' }
  ]
})

// Function to open the "Forgot Password" dialog
const openForgotPasswordDialog = () => {
  forgotPasswordDialogVisible.value = true
}

// Function to close the dialog
const closeForgotPasswordDialog = () => {
  forgotPasswordDialogVisible.value = false
}

// Send password reset email using Firebase
const sendResetEmail = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await sendPasswordResetEmail(auth, formData.email)
        ElMessage.success(t('forgotPassword.resetEmailSent'))
        closeForgotPasswordDialog()
      } catch (error) {
        ElMessage.error(t('forgotPassword.resetEmailFailed'))
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}

// Expose the open function for external use
defineExpose({ openForgotPasswordDialog })
</script>

<template>
  <!--  <el-button type="text" @click="openForgotPasswordDialog">-->
  <!--    {{ t('login.forgetPassword') }}-->
  <!--  </el-button>-->

  <mojo-dialog
    v-model="forgotPasswordDialogVisible"
    append-to-body
    width="660px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeForgotPasswordDialog"
  >
    <div class="forget-logo">
      <a
        class="forget-logo__link"
      >
        <svg-icon
          class="mr-4"
          name="logo"
        />
        {{ $t('common.productName') }}
      </a>
      <div class=" mt-[30px] mb-[24px] forget-text1">
        {{ t('forgotPassword.dialogTitle') }}
      </div>
      <div class="mb-[50px]  forget-text2">
        {{ t('forgotPassword.emailLabel') }}
      </div>
    </div>
    <div class="w-[490px] mx-auto mb-[80px]">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        hide-required-asterisk
        size="large"
        class=""
      >
        <el-form-item prop="email">
          <el-input
            v-model="formData.email"
            :placeholder="t('forgotPassword.emailPlaceholder')"
            autocomplete="email"
          />
        </el-form-item>

        <el-form-item class="">
          <el-button
            type="primary"
            :loading="loading"
            class="ml-2 w-full"
            @click="sendResetEmail"
          >
            {{ t('forgotPassword.send') }}
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </mojo-dialog>
</template>
<style lang="scss" scoped>
:deep(.el-form-item) {
  .el-input {
    width: 100%;
    --el-input-bg-color: #ffffff;
    border-radius: 12px;
    border: 1px solid #D0D0D0;
    --el-input-border-color: var(-el-border-color);
    --el-input-text-color: var(--el-text-color-primary);
    --el-input-placeholder-color: var(--el-text-color-secondary);
    --el-input-height: 60px;
    --el-input-border-radius: 12px;
    --el-input-inner-height: 60px;
    --el-disabled-bg-color: rgba(0, 0, 0, 0.1);
    --el-disabled-text-color: var(--el-text-color-secondary);
    font-family: Inter;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    &::placeholder {
      color: rgba(0, 0, 0, 0.70);
      font-family: Inter;
      font-size: 15px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }
  .el-button {
    --el-button-size: 60px;
    --el-button-bg-color: var(--el-color-white);
    --el-button-text-color: var(--el-color-black);
    --el-button-hover-bg-color: var(--el-text-color-secondary);
    --el-button-hover-text-color: var(--el-text-color-placeholder);
    --el-button-disabled-bg-color: rgba(0, 0, 0, 0.3);
    --el-button-disabled-text-color: var(--el-text-color-secondary);
  }
  }
.forget-logo {
  position: relative;
  background: transparent !important;
  text-align: center;
  overflow: hidden;
  color: #000;

  a {
    font-family: "Druk Wide Bold", monospace;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 4px 0 0;
    font-size: 30px;
    font-weight: 700;
    color: #000;
  }

}
.forget-text1{
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 34px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.forget-text2{
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
</style>