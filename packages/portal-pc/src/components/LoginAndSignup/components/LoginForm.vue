<script setup lang="tsx">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElForm, ElFormItem, ElInput, ElMessage, ElMessageBox, ElButton } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth'
import { t } from '@gptx/base/i18n'
// Firebase auth
import { auth } from "@/utils/firebase.js" // Assuming you have initialized Firebase in firebase.js
import { welcomeAccess } from '@gptx/base/api/login'
import { validatorEmail, validatorPassword } from '@gptx/base/utils/validator'
import ForgotPasswordButton from './forgotPasswordButton.vue';
import {handleFirebaseError} from '@/utils/firebase.js'

const emit = defineEmits(['close', 'dialog-close', 'referral', 'to-register'])
const route = useRoute()
const userStore = useUserStore()

const formRef = ref()
const formData = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const firebaseLoading = ref(false)
const redirect = ref<string>('')

// Validation rules
const rules = reactive({
  username: [{ validator: validatorEmail, trigger: 'blur' }],
  password: [{ validator: validatorPassword, trigger: 'blur' }]
})

// Initialize login information if stored
const initLoginInfo = () => {
  const loginInfo = userStore.getLoginInfo
  if (loginInfo) {
    formData.username = loginInfo.username
    formData.password = loginInfo.password
  }
}

onMounted(initLoginInfo)

watch(
  () => route.query.redirect,
  (newRedirect) => {
    redirect.value = newRedirect
  },
  { immediate: true }
)

// Firebase Email/Password Login
const signIn = async () => {
  await formRef.value?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.username, formData.password)
        await handleFirebaseToken(userCredential)
      } catch (error) {
        handleFirebaseError(error)
      } finally {
        loading.value = false
      }
    }
  })
}



// Handle Firebase Token and Set User Data
const handleFirebaseToken = async (authResult) => {
  firebaseLoading.value = true
  try {
    const { user, additionalUserInfo } = authResult
    const isNewUser = additionalUserInfo?.isNewUser
    const providerId = additionalUserInfo?.providerId

    // Send verification email if new user and not Google sign-in
    if (isNewUser && providerId !== 'google.com') {
      await sendEmailVerification(user)
    }

    // Check if email is verified
    if (!user.emailVerified) {
      emit('close')
      firebaseLoading.value = false

      ElMessageBox.confirm(
        t('login.checkEmailVerificationPrompt'),
        t('login.emailVerificationTitle'),
        {
          confirmButtonText: t('login.confirm'),
          showClose: false,
          cancelButtonText: t('login.resend'),
          type: 'warning',
        }
      )
        .then(() => {
          // User confirms and closes dialog
        })
        .catch(async () => {
          // Resend email verification
          await sendEmailVerification(user)
          ElMessage({
            message: t('login.verificationEmailResent'),
            type: 'info',
          })
        })
      return
    }

    // Set user info and handle referral logic
    const accessToken = await user.getIdToken()
    const userInfo = {
      ...user,
      email: user.email,
      displayName: user.displayName,
      nickName: user.displayName,
      uid: user.uid,
      accessToken,
      id: user.uid,
    }

    let res
    const referralCode = window.sessionStorage.getItem('referral_code')
    if (referralCode) {
      res = await welcomeAccess(accessToken, { referral_code: referralCode })
    } else {
      res = await welcomeAccess(accessToken)
      if (res.data?.user?.first_login === 1) {
        emit('referral')
      }
    }

    if (res?.code === 200) {
      await userStore.loginOthers(userInfo)
      emit('close')
      // firebaseLoading.value = false;
      // dialogVisible.value = false;
      window.sessionStorage.removeItem('referral_code')
    }
  } catch (error) {
    console.error(error)
    ElMessage({
      message: t('login.loginErrorRetry'),
      type: 'error',
    })
  } finally {
    firebaseLoading.value = false
  }
}



const toRegister = () => {
  emit('to-register')
}
const forgotPasswordButtonRef = ref()

const toForgetPassword = () => {
  // Redirect to forget password page or trigger forget password logic
  forgotPasswordButtonRef.value.openForgotPasswordDialog()

}
</script>

<template>
  <div class="login-mode-section">
    <el-form
      ref="formRef"
      theme="light"
      :model="formData"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
      size="large"
      class="w-full"
    >
      <el-form-item prop="username" class="w-full">
        <el-input
          v-model="formData.username"
          :placeholder="t('login.usernamePlaceholder')"
        />
      </el-form-item>

      <el-form-item prop="password" class="w-full">
        <el-input
          v-model="formData.password"
          :placeholder="t('login.passwordPlaceholder')"
          show-password
        />
      </el-form-item>

      <el-form-item class="w-full pt-[20px] mb-[18px]">
        <el-button
          :loading="loading"
          type="primary"
          class="w-full"
          @click="signIn"
        >
          {{ t('login.login') }}
        </el-button>
      </el-form-item>

      <el-form-item class="w-full mb-[36px]">
        <div class="link-button flex justify-between">
          <el-button
            link
            class="font-Inter text-[15px] text-left underline"
            @click="toRegister"
          >
            {{ t('login.notAccount') }}
          </el-button>
          <el-button
            link
            class="font-Inter text-[15px] text-right underline"
            @click="toForgetPassword"
          >
            {{ t('login.forgetPassword') }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <ForgotPasswordButton ref="forgotPasswordButtonRef" />

  </div>
</template>

<style scoped lang="scss">
.login-mode-section{
  width: 100%;
  :deep(.el-divider) {
    margin-top: 38px;
    margin-bottom: 26px;
    .el-divider__text{
      background: transparent;
      color: rgba(0, 0, 0, 0.50);
      text-align: center;
      font-family: Inter;
      font-size: 15px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }
}
:deep(.el-form-item) {
  width: 100%;
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
  .link-button{
    display: flex;
    width: 100%;
    justify-content: space-between;
    .el-button{
      --el-button-size: 60px;
      --el-button-bg-color: var(--el-color-white);
      --el-button-text-color: #000000;
      --el-button-hover-bg-color: var(--el-text-color-secondary);
      --el-button-hover-text-color: var(--el-text-color-placeholder);
      --el-button-disabled-bg-color: rgba(0, 0, 0, 0.3);
      --el-button-disabled-text-color: var(--el-text-color-secondary);
    }
  }


}

</style>
