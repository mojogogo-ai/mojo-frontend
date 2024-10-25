<template>
  <el-dialog
    v-model="dialogVisible"
    class="login-dialog"
    width="500"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="onBeforeClose"
  >
    <div class="h-[100%] relative lt-xl:bg-[var(--login-bg-color)] lt-sm:px-10px lt-xl:px-10px lt-md:px-10px">
      <ElScrollbar class="h-full">
        <div class="relative flex mx-auto min-h-100vh">
          <div class="flex-1 p-30px lt-sm:p-10px dark:bg-[var(--login-bg-color)] relative">
            <Transition appear enter-active-class="animate__animated animate__bounceInRight">
              <div class="h-full flex items-center m-auto w-[100%] at-2xl:max-w-500px at-xl:max-w-500px at-md:max-w-500px at-lg:max-w-500px">
                <LoginForm
                  v-if="isLogin"
                  class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
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

    <!-- Google 登录按钮及其他内容 -->
    <div v-if="dialogVisible" class="flex flex-col items-center mt-4">
      <LoginLogo :is-login-form="true" />
      <el-button type="primary" icon="el-icon-google" @click="openGoogleLogin">
        Google 登录
      </el-button>

      <div id="firebaseui-auth-container" class="firebaseui-auth-container" />

      <!-- FOOTER -->
      <el-divider class="mt-20" style="border-color: rgba(0, 0, 0, 0.3)" />
      <div class="login-footer">
        <!-- 服务条款及隐私政策（此处可根据需要添加） -->
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, defineEmits, nextTick } from 'vue';
import { ElScrollbar, ElButton, ElDivider } from 'element-plus';
import LoginLogo from './LoginLogo';
import { LoginForm, RegisterForm } from '@/components/LoginAndSignup/components';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { sendEmailVerification } from "firebase/auth";
import { welcomeAccess } from '@gptx/base/api/login';

const emit = defineEmits(['close', 'dialog-close', 'referral']);
const dialogVisible = ref(false);
const isLogin = ref(true); // 控制显示登录或注册
const firebaseLoading = ref(false);

// 切换到注册表单
const toRegister = () => {
  isLogin.value = false;
};

// 切换到登录表单
const toLogin = () => {
  isLogin.value = true;
};

// Firebase 初始化
if (!firebase.apps.length) {
  firebase.initializeApp(window.FIREBASE_CONFIG);
}

// 弹窗关闭前触发的事件
const onBeforeClose = (done) => {
  emit('dialog-close');
  done();
};

// 处理 Firebase 认证结果
const handleToken = async (authResult) => {
  firebaseLoading.value = true;
  try {
    const { user, additionalUserInfo: { isNewUser } } = authResult;
    if (isNewUser && authResult.additionalUserInfo.providerId !== 'google.com') {
      await sendEmailVerification(authResult.user);
    }

    if (!user.emailVerified) {
      emit('close');
      firebaseLoading.value = false;
      dialogVisible.value = false;

      ElMessageBox.confirm(
        '请检查邮箱并点击验证链接完成注册。',
        '邮箱验证',
        {
          confirmButtonText: '确认',
          showClose: false,
          cancelButtonText: '重新发送',
          type: 'warning',
        }
      ).then(() => {
        // 用户确认
      }).catch(async () => {
        await sendEmailVerification(authResult.user);
        ElMessage({
          message: '验证邮件已重新发送，请检查邮箱。',
          type: 'info',
        });
      });
      return;
    }

    if (user) {
      const accessToken = await user.getIdToken();
      const userInfo = {
        ...user._delegate,
        accessToken,
        id: user.uid,
        nickName: user.displayName
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
    firebaseLoading.value = false;
    ElMessage({
      message: '登录出错，请稍后重试。' + e,
      type: 'error',
    });
  }
};

// 初始化 FirebaseUI 登录
const handleFireBaseUI = () => {
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult) {
        handleToken(authResult);
        return false;
      }
    },
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ]
  };

  const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
  ui.start('#firebaseui-auth-container', uiConfig);
};

// 打开 FirebaseUI 登录界面
const openGoogleLogin = () => {
  nextTick(() => {
    handleFireBaseUI();
  });
};

// 控制弹窗显示并切换视图
const open = (isLoginView = true) => {
  isLogin.value = isLoginView; // 根据传入标志决定显示登录或注册表单
  dialogVisible.value = true;
  nextTick(() => {
    handleFireBaseUI();
  });
};

defineExpose({ open });
</script>

<style scoped>
.login-dialog .el-dialog__header {
  display: none; /* 隐藏默认弹窗标题栏 */
}
</style>
