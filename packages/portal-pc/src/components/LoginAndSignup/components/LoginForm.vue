<script setup lang="tsx">
import { ref, reactive, onMounted, watch, defineEmits, unref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ElCheckbox,
  ElLink,
  ElIcon,
  ElForm,
  ElFormItem,
  ElInput,
  ElDivider,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { t } from '@gptx/base/i18n'
import facebookIcon from '@/assets/svg/facebook.svg'
import googleIcon from '@/assets/svg/google.svg'
import appleIcon from '@/assets/svg/apple.svg'
// firebase auth
import { getAuth } from "firebase/auth";
import { app, auth } from "@/utils/firebase.js"; // 假设你在 firebase.js 中初始化了 Firebase 应用
import { welcomeAccess } from '@gptx/base/api/login';
import { sendEmailVerification } from "firebase/auth";
const emit = defineEmits(['close', 'dialog-close', 'referral', 'to-register']);
import { ElScrollbar, ElButton } from 'element-plus';

const router = useRouter()
const route = useRoute()

const appStore = useAppStore()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

const { required } = useValidator()

const formRef = ref()
const formData = reactive({
  username: '',
  password: ''
})

// const remember = ref(userStore.getRememberMe)
const loading = ref(false)
const firebaseLoading = ref(false)
const redirect = ref<string>('')

const rules = reactive({
  username: [required()],
  password: [required()]
})

const iconSize = 30
const iconColor = '#999'
const hoverColor = 'var(--el-color-primary)'

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
        ElMessage.error(t('login.loginError'))
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}

// Google Login with Firebase
const openGoogleLogin = async () => {
  firebaseLoading.value = true
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    await handleFirebaseToken(userCredential)
  } catch (error) {
    ElMessage.error(t('login.googleLoginError'))
    console.error(error)
  } finally {
    firebaseLoading.value = false
  }
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
      // dialogVisible.value = false

      ElMessageBox.confirm(
        t('login.checkEmailVerificationPrompt'),
        t('login.emailVerificationTitle'),
        {
          confirmButtonText: t('login.confirm'),
          showClose: false,
          cancelButtonText: t('login.resend'),
          type: 'warning',
        }
      ).then(() => {
        // User confirms and closes dialog
      }).catch(async () => {
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
      ...user, // Spread user properties
      accessToken,
      id: user.uid,
      nickName: user.displayName
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
      // dialogVisible.value = false
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
const toForgetPassword = () => {
  // router.push({ name: 'ForgetPassword' })
}
</script>

<template>
  <div class="light-mode-section">
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
          :placeholder="t('login.username')"
        />
      </el-form-item>

      <el-form-item prop="password" class="w-full">
        <el-input
          v-model="formData.password"
          :placeholder="t('login.password')"
          show-password
        />
      </el-form-item>

      <!--    <el-form-item class="w-full">-->
      <!--      <div class="flex justify-between items-center w-full">-->
      <!--        <el-checkbox v-model="remember">{{ t('login.remember') }}</el-checkbox>-->
      <!--        <el-link type="primary" underline="false">-->
      <!--          {{ t('login.forgetPassword') }}-->
      <!--        </el-link>-->
      <!--      </div>-->
      <!--    </el-form-item>-->

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
        <div class="link-button">
          <el-button style="text-align: left;justify-content: flex-start;text-decoration: underline" link class="w-full font-Inter text-[15px]" @click="toRegister">
            {{ t('login.notAccount') }}
          </el-button>
          <el-button style="justify-content: flex-end; text-decoration: underline" link class="w-full font-Inter text-[15px]" @click="toForgetPassword">
            {{ t('login.forgetPassword') }}
          </el-button>
        </div>
      </el-form-item>


      <el-divider
        class="bg-[transparent]"
        :content-position="'center'">{{ t('login.orContinueWith') }}</el-divider>

      <!-- Google Login Button -->
      <el-form-item class="w-full text-center mt-4">
<!--        <el-button-->
<!--          type="primary"-->
<!--          icon="el-icon-google"-->
<!--          @click="openGoogleLogin"-->
<!--          :loading="firebaseLoading"-->
<!--        >-->
<!--          Google {{ t('login.signIn') }}-->
<!--        </el-button>-->
        <div class="flex justify-center items-center gap-5 mx-auto">
          <el-icon
            :size="48"
            class="cursor-pointer ant-icon"
            @click="handleIconClick('github')"
          >
            <template #default>
              <img :src="facebookIcon" alt="facebook">
            </template>
          </el-icon>
          <el-icon
            :size="48"
            class="cursor-pointer ant-icon"
            @click="handleIconClick('github')"
          >
            <template #default>
              <img :src="appleIcon" alt="apple">
            </template>
          </el-icon>
          <el-icon
            :size="48"
            class="cursor-pointer ant-icon"
            :loading="firebaseLoading"
            @click="openGoogleLogin"
          >
            <template #default>
              <img :src="googleIcon" alt="google">
            </template>
          </el-icon>

        </div>
      </el-form-item>
      <el-divider class="mt-[20px] mb-[20px]" style="border-color: rgba(0, 0, 0, 0.3)" />
      <div class="login-footer mx-auto">
        <!-- 服务条款及隐私政策（此处可根据需要添加） -->
        <div class=" font-inter
        w-full
        text-center
  text-[15px]
  font-normal
  leading-[25px]">By continuing, you are agreeing to</div>
        <div class=" font-inter
             w-full
        text-center
  text-[15px]
  font-normal
  leading-[25px]">
          Mojo Gogo’s <span class="text-[#000] underline font-inter
  text-[15px]
  font-normal
  leading-[25px] cursor-pointer" >Terms of Service</span > and <span class="text-[#000] underline font-inter
  text-[15px]
  font-normal

   cursor-pointer
  leading-[25px]">Privacy Policy</span>
        </div>
      </div>
    </el-form>
</div>

</template>
<style scoped lang="scss">
.light-mode-section{
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
    // placeholder样式
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
