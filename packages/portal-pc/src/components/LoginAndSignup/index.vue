<template>
  <el-dialog
    v-model="dialogVisible"
    class="login-dialog"
    width="500"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="onBeforeClose"
  >
    <!-- Google 登录按钮及其他内容 -->
    <div v-if="dialogVisible" class="flex flex-col items-center mt-4 light-mode-section">
      <LoginLogo :is-login-form="isLoginView" />
      <div class="h-[100%] w-full relative lt-xl:bg-[var(--login-bg-color)] lt-sm:px-10px lt-xl:px-10px lt-md:px-10px">
        <ElScrollbar class="h-full">
          <div class="relative flex mx-auto min-h-100vh">
            <div class="flex-1 p-30px lt-sm:p-10px dark:bg-[var(--login-bg-color)] relative">
              <Transition appear enter-active-class="animate__animated animate__bounceInRight">
                <div class="h-full flex items-center m-auto w-[100%] at-2xl:max-w-500px at-xl:max-w-500px at-md:max-w-500px at-lg:max-w-500px">
                  <LoginForm
                    v-if="isLoginView"
                    class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white w-full "
                    @close="handleClose"
                    @to-register="toRegister"
                  />
                  <RegisterForm
                    v-else
                    class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
                    @to-login="toLogin"
                  />
                </div>
              </Transition>
            </div>
          </div>
        </ElScrollbar>
      </div>
      <el-divider
        class="bg-[transparent]"
        style="margin-top: 0"
        :content-position="'center'"
      >
        {{ t('login.orContinueWith') }}
      </el-divider>
      <!-- Google Login Button -->
      <div class="w-full text-center">
        <div class="flex justify-center items-center gap-5 mx-auto">
          <el-icon :size="48" class="cursor-pointer ant-icon" @click="handleIconClick('facebook')">
            <template #default>
              <img :src="facebookIcon" alt="facebook">
            </template>
          </el-icon>
          <el-icon :size="48" class="cursor-pointer ant-icon" @click="handleIconClick('apple')">
            <template #default>
              <img :src="appleIcon" alt="apple">
            </template>
          </el-icon>
          <el-icon :size="48" class="cursor-pointer ant-icon" :loading="firebaseLoading" @click="handleIconClick('google')">
            <template #default>
              <img :src="googleIcon" alt="google">
            </template>
          </el-icon>
        </div>
      </div>
      <el-divider class="mt-[20px] mb-[20px]" style="border-color: rgba(0, 0, 0, 0.3)" />
      <div class="login-footer mx-auto">
        <!-- 服务条款及隐私政策（此处可根据需要添加） -->
        <div
          class=" font-inter
        w-full
        text-center
  text-[15px]
  font-normal
  leading-[25px]"
        >
          By continuing, you are agreeing to
        </div>
        <div
          class=" font-inter
             w-full
        text-center
  text-[15px]
  font-normal
  leading-[25px]"
        >
          Mojo Gogo’s <span
            class="text-[#000] underline font-inter
  text-[15px]
  font-normal
  leading-[25px] cursor-pointer"
          >Terms of Service</span> and <span
            class="text-[#000] underline font-inter
  text-[15px]
  font-normal

   cursor-pointer
  leading-[25px]"
          >Privacy Policy</span>
        </div>
      </div>
    </div>

  </el-dialog>
</template>

<script setup>
import useUserStore from '@/store/modules/user'
import { ref } from 'vue';
import { ElScrollbar, ElButton, ElDivider, ElFormItem, ElIcon, ElMessageBox, ElMessage } from 'element-plus';
import LoginLogo from './LoginLogo';
import { LoginForm, RegisterForm } from '@/components/LoginAndSignup/components';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { welcomeAccess } from '@gptx/base/api/login';
import facebookIcon from '@/assets/svg/Facebook.svg';
import appleIcon from '@/assets/svg/apple.svg';
import googleIcon from '@/assets/svg/google.svg';
import { t } from '@gptx/base/i18n/index.js';
import { FacebookAuthProvider, OAuthProvider,signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth'
import { handleFirebaseError, auth } from '@/utils/firebase.js';
import useLoginStore from '@/store/modules/login.js';

const emit = defineEmits(['close', 'dialog-close', 'referral']);
const dialogVisible = ref(false);
const isLoginView = ref(true); // 控制显示登录或注册
const firebaseLoading = ref(false);

// 切换到注册表单
const toRegister = () => {
  isLoginView.value = false;
};

// 切换到登录表单
const toLogin = () => {
  isLoginView.value = true;
};


// Facebook Login
const openFacebookLogin = async () => {
  firebaseLoading.value = true;
  try {
    const provider = new FacebookAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    await handleFirebaseToken(userCredential);
  } catch (error) {
    handleFirebaseError(error);
  } finally {
    firebaseLoading.value = false;
  }
};

// Apple Login
const openAppleLogin = async () => {
  firebaseLoading.value = true;
  try {
    const provider = new OAuthProvider('apple.com');
    const userCredential = await signInWithPopup(auth, provider);
    await handleFirebaseToken(userCredential);
  } catch (error) {
    handleFirebaseError(error);
  } finally {
    firebaseLoading.value = false;
  }
};

// Google Login
const openGoogleLogin = async () => {
  firebaseLoading.value = true;
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    await handleFirebaseToken(userCredential);
  } catch (error) {
    handleFirebaseError(error);
  } finally {
    firebaseLoading.value = false;
  }
};

// 修改 handleIconClick 方法，根据传入的参数判断调用哪个登录函数
const handleIconClick = (platform) => {
  if (platform === 'facebook') openFacebookLogin();
  if (platform === 'apple') openAppleLogin();
  if (platform === 'google') openGoogleLogin();
};
// 弹窗关闭前触发的事件
const onBeforeClose = (done) => {
  emit('dialog-close');
  done();
};

// 监听emit触发的关闭事件

const handleClose = () => {
  dialogVisible.value = false;
  emit('close');
};

// 处理 Firebase 认证结果
const handleFirebaseToken = async (authResult) => {
  firebaseLoading.value = true;
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
      emit('close');
      firebaseLoading.value = false;
      dialogVisible.value = false;

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

    if (user) {
      const accessToken = await user.getIdToken();
      console.log(user, 'user')
      const userInfo = {
        ...user,
        email: user.email,
        displayName: user.displayName,
        nickName: user.displayName,
        uid: user.uid,
        accessToken,
        id: user.uid,
      };

      let res;
      const referralCode = window.sessionStorage.getItem('referral_code');
      if (referralCode) {
        res = await welcomeAccess(accessToken, { referral_code: referralCode });
      } else {
        res = await welcomeAccess(accessToken);
        if (res.data.user.first_login === 1) {
          emit('referral');
        }
      }

      if (res.code === 200) {
        await userStore.loginOthers(userInfo);
        emit('close');
        firebaseLoading.value = false;
        dialogVisible.value = false;
        window.sessionStorage.removeItem('referral_code');
      }
    }
  } catch (e) {
    console.log(e);
    firebaseLoading.value = false;
    ElMessage({
      message: t('login.loginErrorRetry'),
      type: 'error',
    })
  } finally {
    firebaseLoading.value = false
  }
};



const userStore = useUserStore();

// 初始化 FirebaseUI 登录
// const handleFireBaseUI = () => {
//   const uiConfig = {
//     callbacks: {
//       signInSuccessWithAuthResult: function (authResult) {
//         handleToken(authResult);
//         return false;
//       }
//     },
//     signInFlow: 'popup',
//     signInOptions: [
//       firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//       firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     ]
//   };
//
//   const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
//   ui.start('#firebaseui-auth-container', uiConfig);
// };



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
<style>
  .login-dialog {
    overflow: hidden;
  }
</style>
<style scoped lang="scss">
.login-dialog .el-dialog__header {
  display: none; /* 隐藏默认弹窗标题栏 */
}

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
</style>
