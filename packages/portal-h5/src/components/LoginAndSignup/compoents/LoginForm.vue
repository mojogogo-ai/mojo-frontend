<script setup>
import { useRoute } from 'vue-router'
import { showDialog, showFailToast, showToast } from 'vant';
import { useUserStore } from '@/store/modules/user'
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { t } from '@gptx/base/i18n'
import { auth } from "@/utils/firebase.js"
import { welcomeAccess } from '@gptx/base/api/login'
import { validatorEmailVant, validatorPasswordVant } from '@gptx/base/utils/validator'
import ForgotPasswordButton from './forgotPasswordButton.vue'
import { handleFirebaseError } from '@/utils/firebase.js'
import { getAuth, signOut } from 'firebase/auth';
import useLoginStore from '@/store/modules/login.js';

const emit = defineEmits(['close', 'dialog-close', 'referral', 'to-register'])
const route = useRoute()
const userStore = useUserStore()
const useLogin = useLoginStore();

const formRef = ref()
const formData = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const firebaseLoading = ref(false)
const redirect = ref('')

const rules = {
  username: [{ validator: validatorEmailVant, message: t('login.usernameError') }],
  password: [{ validator: validatorPasswordVant, message: t('login.passwordError') }]
}

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

const signIn = async () => {
  await formRef.value.validate()
  try {
    // Validate the form; if validation fails, it will throw and skip further execution
    console.log(123)
    // Proceed with the sign-in if validation is successful
    loading.value = true
    const userCredential = await signInWithEmailAndPassword(auth, formData.username, formData.password)
    await handleFirebaseToken(userCredential)
  } catch (error) {
    // Handle both validation and sign-in errors
    handleFirebaseError(error)
  } finally {
    // Ensure loading is reset regardless of success or failure
    loading.value = false
  }
}

const handleFirebaseToken = async (authResult) => {
  firebaseLoading.value = true
  try {
    const { user, additionalUserInfo } = authResult
    const isNewUser = additionalUserInfo?.isNewUser
    const providerId = additionalUserInfo?.providerId

    if (isNewUser && providerId !== 'google.com') {
      await sendEmailVerification(user)
    }

    if (!user.emailVerified) {
      emit('close')
      firebaseLoading.value = false

      showDialog({
        message: t('login.checkEmailVerificationPrompt'),
        title: t('login.emailVerificationTitle'),
        confirmButtonText: t('login.confirm'),
        cancelButtonText: t('login.resend'),
      })
        .then(() => {
        })
        .catch(async () => {
          await sendEmailVerification(user)
          showToast(t('login.verificationEmailResent'))
        })
      // 用户邮箱未验证，拒绝登录
      const auth = getAuth();
      await signOut(auth);
      await userStore.logOut();
      useLogin.toLoginOut();
      return
    }

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
      window.sessionStorage.removeItem('referral_code')
    }
  } catch (error) {
    console.error(error)
    showFailToast(t('login.loginErrorRetry'))
  } finally {
    firebaseLoading.value = false
  }
}

const toRegister = () => {
  emit('to-register')
}
const forgotPasswordButtonRef = ref()

const toForgetPassword = () => {
  forgotPasswordButtonRef.value.openForgotPasswordDialog()
}
</script>

<template>
  <div class="login-mode-section">
    <van-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      @submit="signIn"
    >
      <van-field
        v-model="formData.username"
        :placeholder="t('login.usernamePlaceholder')"
        name="username"
        :rules="rules.username"
      />
      <van-field
        v-model="formData.password"
        :placeholder="t('login.passwordPlaceholder')"
        name="password"
        :rules="rules.password"
        type="password"
      />
      <div class="button-group">
        <van-button
          type="primary"
          :loading="loading"
          class="w-full"
          @click="signIn"
        >
          {{ t('login.login') }}
        </van-button>
        <div class="flex justify-between link-button">
          <van-button
            plain
            class="font-Inter text-[15px] text-left"
            @click="toRegister"
          >
            {{ t('login.notAccount') }}
          </van-button>
          <van-button
            plain
            class="font-Inter text-[15px] text-right"
            @click="toForgetPassword"
          >
            {{ t('login.forgetPassword') }}
          </van-button>
        </div>
      </div>
    </van-form>
    <ForgotPasswordButton ref="forgotPasswordButtonRef" />
  </div>
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
.login-mode-section {
  width: 100%;
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
  .button-group {
    margin-top: 20px;
    .link-button {
      margin-top: 24px;
      flex-direction: column;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      width: 100%;
      :deep(.van-button){
        height: 20px;
        color: #000;
        text-align: center;
        font-family: Inter;
        font-size: 15px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        text-decoration-line: underline;
        text-decoration-style: solid;
        text-decoration-skip-ink: none;
        text-decoration-thickness: auto;
        text-underline-offset: auto;
        text-underline-position: from-font;
        background: transparent;
        border: none;
      }
    }
  }
}
</style>
