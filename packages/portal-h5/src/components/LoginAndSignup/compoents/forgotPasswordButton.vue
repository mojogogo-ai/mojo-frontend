<script setup lang="tsx">
import { ref, reactive } from 'vue'
import { Dialog, showFailToast, showToast } from 'vant'
import { sendPasswordResetEmail } from 'firebase/auth'
import { t } from '@gptx/base/i18n'
import { auth } from "@/utils/firebase.js"
import { validatorEmailVant } from '@gptx/base/utils/validator'
import { handleFirebaseError } from '@/utils/firebase.js'

const forgotPasswordDialogVisible = ref(false)

const formRef = ref()
const formData = reactive({
  email: ''
})

const loading = ref(false)

const rules = {
  email: [{ validator: validatorEmailVant, message: t('forgotPassword.invalidEmail') }]
}

const openForgotPasswordDialog = () => {
  forgotPasswordDialogVisible.value = true
}

const closeForgotPasswordDialog = () => {
  forgotPasswordDialogVisible.value = false
}

const sendResetEmail = async () => {
  await formRef.value.validate()
  try {
    loading.value = true
    await sendPasswordResetEmail(auth, formData.email)
    showToast(t('forgotPassword.resetEmailSent'))
    closeForgotPasswordDialog()
  } catch (error) {
    handleFirebaseError(error)
    showFailToast(t('forgotPassword.resetEmailFailed'))
    console.error(error)
  } finally {
    loading.value = false
  }
}

defineExpose({ openForgotPasswordDialog })
</script>

<template>
  <mojo-dialog
    v-model:show="forgotPasswordDialogVisible"
    class="login-dialog"
    closeable
    teleport="body"
    width="90%"
    :before-close="closeForgotPasswordDialog"
  >
    <div class="forget-logo mt-20">
      <a class="forget-logo__link">
        <svg-icon class="mr-4" name="logo" />
        {{ $t('common.productName') }}
      </a>
      <div class="mt-8 mb-4 forget-text1">
        {{ t('forgotPassword.dialogTitle') }}
      </div>
      <div class="mb-8 forget-text2">
        {{ t('forgotPassword.emailLabel') }}
      </div>
    </div>
    <div class="mx-auto mb-20 px-4">
      <van-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        @submit="sendResetEmail"
      >
        <van-field
          v-model="formData.email"
          name="email"
          :rules="rules.email"
          :placeholder="t('forgotPassword.emailPlaceholder')"
        />
        <div class="button-group">
          <van-button
            type="primary"
            :loading="loading"
            class="w-full"
            @click="sendResetEmail"
          >
            {{ t('forgotPassword.send') }}
          </van-button>
        </div>
      </van-form>
    </div>
  </mojo-dialog>
</template>

<style scoped lang="scss">
:deep(.van-cell) {
  padding: 0;
  min-height: 78px;
  .van-field__error-message{
    padding-left: 5px;
  }
  .van-field__control{
    --van-field-placeholder-text-color: rgba(0, 0, 0, 0.70);
    line-height: 20px;
    border-radius: 12px;
    border: 1px solid #D0D0D0;
    background: #FFF;
    padding: 16px;
    color: #000000;
  }

}
.van-button.van-button--primary{
  display: flex;
  height: 52px;
  padding: 16px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 12px;
  background: #000;
  color: #FFF;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
:deep(.van-field) {
  .van-field__control {
    --van-field-placeholder-text-color: rgba(0, 0, 0, 0.70);
    line-height: 20px;
    border-radius: 12px;
    border: 1px solid #D0D0D0;
    background: #FFF;
    padding: 16px;
    color: #000000;
  }
  .van-field__error-message {
    padding-left: 5px;
  }
}
.forget-logo {
  text-align: center;
  color: #000;
  margin-bottom: 24px;

  .forget-logo__link {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Druk Wide Bold", monospace;
    font-size: 30px;
    font-weight: 700;
    color: #000;
    margin: 4px 0 0;
  }
}
.forget-text1 {
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.forget-text2 {
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.button-group {
  margin-top: 20px;
}
.van-dialog__body {
  padding: 0;
}
</style>
