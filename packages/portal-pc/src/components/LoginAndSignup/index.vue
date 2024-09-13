<template>
  <el-dialog
    v-model="dialogVisible"
    class="login-dialog"
    width="500"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
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

import firebase from 'firebase/compat/app';
import LoginLogo from './LoginLogo';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
// import { OAuthProvider } from "firebase/auth";

import { welcomeAccess } from '@gptx/base/api/login';
import { nextTick } from 'vue';

const emit = defineEmits(['close', 'referral']);
const dialogVisible = ref(false);

// const AppleProvider = new OAuthProvider("apple.com");
const firebaseLoading = ref(false);

const handleToken = async (authResult) => {
  firebaseLoading.value = true;
  try {
    if (user) {
      const {
        user,
        additionalUserInfo: { isNewUser }
      } = authResult;
      const accessToken = await user.getIdToken();

      const userInfo = {
        ...user._delegate,
        accessToken: accessToken,
        id: user.uid,
        nickName: user.displayName
      };
      let res;
      const referralCode = window.sessionStorage.getItem('referral_code');
      if (isNewUser) {
        if (referralCode) {
          res = await welcomeAccess(accessToken, { referral_code: referralCode });
        } else {
          res = await welcomeAccess(accessToken);
          emit('referral');
        }
      } else {
        res = await welcomeAccess(accessToken);
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
