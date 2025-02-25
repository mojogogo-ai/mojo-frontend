<script setup>
import { showFailToast, showToast } from 'vant'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { t } from '@gptx/base/i18n'
import { auth } from "@/utils/firebase.js"
import { bindEmailRefer } from '@gptx/base/api/user'
import { validatorEmailVant, validatorPasswordVant } from '@gptx/base/utils/validator'
import ForgotPasswordButton from './forgotPasswordButton.vue'
import { handleFirebaseError } from '@/utils/firebase.js'
import { useRoute } from 'vue-router';

const emit = defineEmits(['to-login'])

const formRef = ref()
const formData = reactive({
  username: '',
  password: '',
  referral_code: '' // 可选邀请代码字段
})

const loading = ref(false)

// 验证规则
const rules = {
  username: [{ validator: validatorEmailVant, message: t('login.usernameError') }],
  password: [{ validator: validatorPasswordVant, message: t('login.passwordError') }],
  referral_code: [] // 可选，无需验证
}

const toLogin = () => {
  emit('to-login')
}

// Firebase 注册
const register = async () => {
  await formRef.value.validate()
  try {
    loading.value = true
    if (formData.referral_code) {
      try {
        await bindEmailRefer({
          email: formData.username,
          refer_code: formData.referral_code
        })
        // Firebase 邮箱/密码注册
        const userCredential = await createUserWithEmailAndPassword(auth, formData.username, formData.password)

        // 发送验证邮件
        await sendEmailVerification(userCredential.user)
        showToast(t('login.checkEmailVerification'))

        // 可选：存储用户信息和推荐码
        const userInfo = {
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          referralCode: formData.referral_code || null // 推荐码可为空
        }
        console.log('用户已注册:', userInfo)
        window.sessionStorage.setItem('referral_code', formData.referral_code)
        // 跳转到登录或处理注册后逻辑
        toLogin()
      } catch (error) {
        console.error('绑定推荐码失败:', error)
        // showFailToast(t('login.invalidReferralCode'))
      }
    }else{
      const userCredential = await createUserWithEmailAndPassword(auth, formData.username, formData.password)

      // 发送验证邮件
      await sendEmailVerification(userCredential.user)
      showToast(t('login.checkEmailVerification'))

      // 可选：存储用户信息和推荐码
      const userInfo = {
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        referralCode: formData.referral_code || null // 推荐码可为空
      }
      console.log('用户已注册:', userInfo)
      window.sessionStorage.setItem('referral_code', formData.referral_code)
      // 跳转到登录或处理注册后逻辑
      toLogin()
    }
  } catch (error) {
    handleFirebaseError(error)
  } finally {
    loading.value = false
  }
}
const forgotPasswordButtonRef = ref()

// const toForgetPassword = () => {
//   forgotPasswordButtonRef.value.openForgotPasswordDialog()
// }
onBeforeMount(async () => {
  // await useUser.updateSysInfo();
  // isLogin.value = await getIsLogin();
  const route = useRoute();
  const { query } = route;
  if (query && query.referral_code) {
    formData.referral_code = query.referral_code;
  }
});
</script>

<template>
  <div class="register-form-section">
    <van-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      @submit="register"
    >
      <van-field
        v-model="formData.username"
        name="username"
        :rules="rules.username"
        :placeholder="t('login.usernamePlaceholder')"
      />
      <van-field
        v-model="formData.password"
        name="password"
        :rules="rules.password"
        type="password"
        :placeholder="t('login.passwordPlaceholder')"
      />
      <van-field
        v-model="formData.referral_code"
        name="referral_code"
        :placeholder="t('login.invitationCodePlaceholder')"
      />
      <div class="button-group">
        <van-button
          type="primary"
          :loading="loading"
          class="w-full"
          @click="register"
        >
          {{ t('login.register') }}
        </van-button>
        <div class="link-button">
          <van-button
            plain
            class="font-Inter text-[15px] text-left underline w-full mt-4"
            @click="toLogin"
          >
            {{ t('login.hasUser') }}
          </van-button>
          <!--          <van-button-->
          <!--            plain-->
          <!--            class="font-Inter text-[15px] text-right"-->
          <!--            @click="toForgetPassword"-->
          <!--          >-->
          <!--            {{ t('login.forgetPassword') }}-->
          <!--          </van-button>-->
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

.register-form-section {
  width: 100%;
  .van-button.van-button--primary {
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
    //margin-top: 20px;
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
