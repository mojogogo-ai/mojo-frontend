<template>
  <mojoDialog
    v-model:show="dialogVisible"
    v-bind="$attrs"
    class="login-dialog"
    closeable
    teleport="body"
    width="90%"
    :before-close="onBeforeClose"
  >
    <div v-if="dialogVisible" class="flex flex-col items-center p-4 pt-20">
      <LoginLogo :is-login-form="isLoginView" />
      <div class="w-full flex justify-center items-center">
        <LoginForm
          v-if="isLoginView"
          class="w-full"
          @close="handleClose"
          @to-register="toRegister"
        />
        <RegisterForm
          v-else
          class="w-full"
          @to-login="toLogin"
        />
      </div>

      <div class="w-60 l-m-d-g">
        or continue with
      </div>

      <!-- 社交登录按钮 -->
      <div class="flex justify-center items-center gap-12 mx-auto">
        <van-icon name="facebook" size="48" @click="handleIconClick('facebook')" >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="24" cy="23.52" rx="21" ry="21" fill="url(#paint0_linear_827_56875)"/>
            <mask id="mask0_827_56875" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="3" y="2" width="42" height="43">
              <ellipse cx="24" cy="23.9419" rx="21" ry="21" fill="url(#paint1_linear_827_56875)"/>
            </mask>
            <g mask="url(#mask0_827_56875)">
              <path d="M31.8205 31.8623L32.7534 25.9351H26.9178V22.0904C26.9178 20.4685 27.7315 18.8865 30.3452 18.8865H33V13.8404C33 13.8404 30.5917 13.4399 28.2904 13.4399C23.4822 13.4399 20.3425 16.2794 20.3425 21.4176V25.9351H15V31.8623H20.3425V46.1917C21.415 46.3559 22.5123 46.4399 23.6301 46.4399C24.7479 46.4399 25.8452 46.3559 26.9178 46.1917V31.8623H31.8205Z" fill="white"/>
            </g>
            <defs>
              <linearGradient id="paint0_linear_827_56875" x1="24" y1="2.52002" x2="24" y2="44.3955" gradientUnits="userSpaceOnUse">
                <stop stop-color="#18ACFE"/>
                <stop offset="1" stop-color="#0163E0"/>
              </linearGradient>
              <linearGradient id="paint1_linear_827_56875" x1="24" y1="2.94189" x2="24" y2="44.8173" gradientUnits="userSpaceOnUse">
                <stop stop-color="#18ACFE"/>
                <stop offset="1" stop-color="#0163E0"/>
              </linearGradient>
            </defs>
          </svg>
        </van-icon>
        <van-icon name="apple" size="48" @click="handleIconClick('apple')" >
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M45 23.6742C45 35.6886 35.6025 45.4393 24 45.4393C12.3975 45.4393 3 35.6886 3 23.6742C3 11.649 12.3975 1.90918 24 1.90918C35.6025 1.90918 45 11.649 45 23.6742Z" fill="black"/>
            <path d="M33.8432 18.6861C33.7286 18.7529 31.0006 20.1637 31.0006 23.2918C31.1292 26.8591 34.4432 28.1102 34.5 28.1102C34.4432 28.177 33.9997 29.8144 32.686 31.5308C31.6435 33.0093 30.4863 34.5 28.7292 34.5C27.0577 34.5 26.4577 33.5146 24.5292 33.5146C22.458 33.5146 21.872 34.5 20.2863 34.5C18.5292 34.5 17.2863 32.9295 16.1869 31.4648C14.7586 29.5479 13.5447 26.5396 13.5018 23.6512C13.4729 22.1206 13.7878 20.616 14.5872 19.3381C15.7155 17.554 17.7298 16.3429 19.9295 16.3029C21.6149 16.25 23.1149 17.3812 24.1435 17.3812C25.1292 17.3812 26.972 16.3029 29.0571 16.3029C29.9571 16.3038 32.3571 16.5564 33.8432 18.6861ZM24.0009 15.9973C23.7009 14.5996 24.5292 13.2018 25.3006 12.3102C26.2863 11.2319 27.8431 10.5 29.1857 10.5C29.2714 11.8978 28.7282 13.2686 27.7574 14.267C26.8863 15.3453 25.3863 16.1571 24.0009 15.9973Z" fill="white"/>
          </svg>
        </van-icon>
        <van-icon name="google" size="48" @click="handleIconClick('google')" >
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="39" viewBox="0 0 40 39" fill="none">
            <path d="M39.2021 20.228C39.2021 18.6494 39.0714 17.4974 38.7885 16.3027H20.394V23.428H31.1911C30.9735 25.1987 29.798 27.8654 27.1857 29.6573L27.1491 29.8959L32.9651 34.3114L33.3681 34.3508C37.0687 31.0014 39.2021 26.0734 39.2021 20.228Z" fill="#4285F4"/>
            <path d="M20.3928 39.0005C25.6825 39.0005 30.1232 37.2938 33.3668 34.3498L27.1845 29.6563C25.5301 30.787 23.3097 31.5763 20.3928 31.5763C15.2119 31.5763 10.8146 28.227 9.24714 23.5977L9.01738 23.6168L2.96982 28.2035L2.89073 28.419C6.11246 34.691 12.7301 39.0005 20.3928 39.0005Z" fill="#34A853"/>
            <path d="M9.24828 23.5984C8.83468 22.4037 8.59532 21.1236 8.59532 19.801C8.59532 18.4783 8.83468 17.1983 9.22652 16.0037L9.21556 15.7492L3.0922 11.0889L2.89185 11.1823C1.56402 13.785 0.802109 16.7077 0.802109 19.801C0.802109 22.8944 1.56402 25.817 2.89185 28.4197L9.24828 23.5984Z" fill="#FBBC05"/>
            <path d="M20.3929 8.02456C24.0717 8.02456 26.5533 9.58189 27.9683 10.8833L33.4976 5.5926C30.1018 2.49927 25.6826 0.600586 20.3929 0.600586C12.7302 0.600586 6.11247 4.9099 2.89073 11.1819L9.22541 16.0033C10.8147 11.3739 15.2119 8.02456 20.3929 8.02456Z" fill="#EB4335"/>
          </svg>
        </van-icon>
      </div>

      <van-divider
        :style="{ color: 'rgba(0, 0, 0, 0.30)',width: '100%', borderColor: 'rgba(0, 0, 0, 0.30)', padding: '32px 0 4px' }"
      >
      </van-divider>
      <div class="login-footer mx-auto text-center text-sm w-72">
        By continuing, you agree to Mojo Gogo’s
        <span class="underline cursor-pointer">Terms of Service</span>
        and <span class="underline cursor-pointer">Privacy Policy</span>
      </div>
    </div>
  </mojoDialog>
</template>

<script setup>
import { ref } from 'vue';
import useUserStore from '@/store/modules/user';
import LoginLogo from './LoginLogo';
import LoginForm from './compoents/LoginForm';
import RegisterForm from './compoents/RegisterForm';
import { FacebookAuthProvider, OAuthProvider, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { welcomeAccess } from '@gptx/base/api/login';
import { auth, handleFirebaseError } from '@/utils/firebase.js'; // Assuming you have initialized Firebase in firebase.js
import useLoginStore from '@/store/modules/login';
import { showConfirmDialog } from 'vant';
const emit = defineEmits(['close', 'dialog-close', 'referral']);
const dialogVisible = ref(false);
const isLoginView = ref(true);
const firebaseLoading = ref(false);

const userStore = useUserStore();

// 切换到注册表单
const toRegister = () => {
  isLoginView.value = false;
};

// 切换到登录表单
const toLogin = () => {
  isLoginView.value = true;
};

// 处理 Firebase 认证结果
const handleToken = async (authResult) => {
  firebaseLoading.value = true;
  try {
    const { user, additionalUserInfo } = authResult;
    const isNewUser = additionalUserInfo?.isNewUser;
    const providerId = additionalUserInfo?.providerId;

    // 邮件验证逻辑
    if (isNewUser && providerId !== 'google.com') {
      await sendEmailVerification(user);
    }
    if (!user.emailVerified) {
      emit('close');
      firebaseLoading.value = false;
      dialogVisible.value = false;
      showConfirmDialog({
        title: 'Email Verification Required',
        message: 'Please check your email inbox and click on the verification link.',
        cancelButtonTex: 'Not found, resend',
      }).catch(() => sendEmailVerification(user));
      return false;
    }

    if (user) {
      const accessToken = await user.getIdToken();
      const userInfo = { ...user, accessToken, id: user.uid, nickName: user.displayName };
      let res;
      const referralCode = window.sessionStorage.getItem('referral_code');

      res = referralCode
        ? await welcomeAccess(accessToken, { referral_code: referralCode })
        : await welcomeAccess(accessToken);

      if (res.code === 200) {
        await userStore.loginOthers(userInfo);
        emit('close');
        dialogVisible.value = false;
        window.sessionStorage.removeItem('referral_code');
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    firebaseLoading.value = false;
  }
};

// 各平台登录实现
const handleIconClick = (platform) => {
  firebaseLoading.value = true;
  try {
    let provider;
    if (platform === 'facebook') provider = new FacebookAuthProvider();
    if (platform === 'apple') provider = new OAuthProvider('apple.com');
    if (platform === 'google') provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(handleToken)
      .catch(handleFirebaseError)
      .finally(() => (firebaseLoading.value = false));
  } catch (error) {
    firebaseLoading.value = false;
    console.log('Error during social login:', error);
  }
};
// 弹窗关闭前触发的事件
const onBeforeClose = () => {
  dialogVisible.value = false;
  emit('dialog-close');
  // done();
};

// 监听emit触发的关闭事件

const handleClose = () => {
  dialogVisible.value = false;
  emit('close');
};

// 控制弹窗显示并切换视图
const open = () => {
  dialogVisible.value = true;
  const loginStore = useLoginStore();
  const isLoginOrSignUp = loginStore.isLoginOrSignUp;
  if (isLoginOrSignUp) {
    isLoginView.value = isLoginOrSignUp === 'login';
  }
};


defineExpose({ open });
</script>
<style lang="scss"  scoped>
.l-m-d-g{
  color: rgba(0, 0, 0, 0.50);
  text-align: center;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-top: 48px;
  margin-bottom: 24px;
}
.login-footer {
  color: #000;
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
}
</style>
