<template>
  <el-dialog
    v-model="dialogVisible"
    class="login-dialog"
    width="500"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="onBeforeClose"
  >
    <div
      v-if="dialogVisible"
      class="flex flex-col items-center"
    >
      <LoginLogo :is-login-form="true" />
      <div class="ml-0 sm:ml-0 md:ml-[10px]">
        <!-- <el-progress v-if="firebaseLoading" :percentage="100" :format="(percentage) => (percentage === 100 ? '' : `${percentage}%`)" :indeterminate="true" /> -->
        <div
          id="firebaseui-auth-container"
          class="firebaseui-auth-container"
        />
      </div>

      <!-- FOOTER -->
      <el-divider
        class="mt-20"
        style="border-color: rgba(0, 0, 0, 0.3)"
      />
      <div class="login-footer">
        By continuing, you are agreeing to Mojo Gogo’s
        <span class="underline cursor-pointer underline-offset-4 hover:opacity-75"> Terms of Service </span>
        and
        <span class="underline cursor-pointer underline-offset-4 hover:opacity-75"> Privacy Policy. </span>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import useUserStore from '@/store/modules/user';
// import { t } from '@gptx/base/i18n';
import { sendEmailVerification } from "firebase/auth";
import firebase from 'firebase/compat/app';
import LoginLogo from './LoginLogo';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
// import { OAuthProvider } from "firebase/auth";

import { welcomeAccess } from '@gptx/base/api/login';
import { nextTick } from 'vue';

const emit = defineEmits(['close', 'dialog-close', 'referral']);
const dialogVisible = ref(false);

// const AppleProvider = new OAuthProvider("apple.com");
const firebaseLoading = ref(false);

const onBeforeClose = (done) => {
  emit('dialog-close');
  done();
};
const handleToken = async (authResult) => {
  firebaseLoading.value = true;
  try {
    const {
        user,
        additionalUserInfo: { isNewUser }
      } = authResult;

      console.log(authResult, authResult.additionalUserInfo.providerId,'authResultauthResult666')
      if(isNewUser && authResult.additionalUserInfo.providerId!=='google.com'){//
        sendEmailVerification(authResult.user);
      }
    if (!user.emailVerified) { // 未验证邮箱
      emit('close');
      firebaseLoading.value = false;
      dialogVisible.value = false;

      ElMessageBox.confirm(
        'Please check your email inbox and click on the verification link to complete your registration. This step is necessary to verify your email address before you can access the full features of our application.If you don’t see the email in your inbox, please check your spam or junk folder.',
        'Email Verification Required',
        {
          confirmButtonText: 'OK',
          showClose:false,
          cancelButtonText: 'Not found, resend',
          type: 'warning',
        }).then(() => {
  
        }).catch(() => {
            // 再次发送验证邮件
            sendEmailVerification(authResult.user);
        })
        return false
    }
  firebaseLoading.value = true;
    if (user) {
      const accessToken = await user.getIdToken();

      const userInfo = {
        ...user._delegate,
        accessToken: accessToken,
        id: user.uid,
        nickName: user.displayName
      };
      let res;
      const referralCode = window.sessionStorage.getItem('referral_code');

      if (referralCode) {
        res = await welcomeAccess(accessToken, { referral_code: referralCode });
      } else {
        res = await welcomeAccess(accessToken);
        console.log(res, 'res999')
        if (res.data.user.first_login ===1) {
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
  }
};

const userStore = useUserStore();
// const router = useRouter();

// FireBaseUI login
const handleFireBaseUI = () => {
  let uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult) {
        handleToken(authResult);
        return false;
      }
    },
    signInFlow: 'popup',
    // signInSuccessUrl: "",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      // AppleProvider.providerId,
    ]
  };
  firebase.initializeApp(window.FIREBASE_CONFIG);

  if (firebaseui.auth.AuthUI.getInstance()) {
    const ui = firebaseui.auth.AuthUI.getInstance();
    ui.start('#firebaseui-auth-container', uiConfig);
  } else {
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
  }
};
onMounted(() => {});

// open dialog
const open = () => {
  dialogVisible.value = true;
  nextTick(() => {
    handleFireBaseUI();
  });
};
defineExpose({ open });
// export { open }
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
</style>
