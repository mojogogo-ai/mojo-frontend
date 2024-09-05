<template>
  <el-dialog
    v-model="dialogVisible"
    class="login-dialog"
    width="640px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="emit('close')"
  >
    <div class="flex flex-col items-center">
      <LoginLogo :is-login-form="true" />
      <div class="ml-0  sm:ml-0 md:ml-[10px]">
        <el-progress v-if="firebaseLoading" :percentage="100" :format="(percentage) => (percentage === 100 ? '' : `${percentage}%`)" :indeterminate="true" />
        <div id="firebaseui-auth-container" class="firebaseui-auth-container" />
      </div>

      <!-- FOOTER -->
      <el-divider class="mt-20" style="border-color: rgba(0, 0, 0, 0.3);" />
      <div class="login-footer">
        By continuing, you are agreeing to Mojo Gogo’s 
        <span class="underline cursor-pointer underline-offset-4 hover:opacity-75">
          Terms of Service 
        </span>
        and 
        <span class="underline cursor-pointer underline-offset-4 hover:opacity-75"> 
          Privacy Policy.
        </span>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import useUserStore from "@/store/modules/user";
// import { t } from '@gptx/base/i18n';

import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import '@/assets/styles/firebaseui.scss'
// import { OAuthProvider } from "firebase/auth";

import { welcomeAccess } from "@gptx/base/api/login";
import { nextTick } from 'vue';

const emit = defineEmits(['close'])
const dialogVisible = ref(true);

// const AppleProvider = new OAuthProvider("apple.com");
const firebaseLoading = ref(false)

const handleToken = (user) => {
  if (user) {
    firebaseLoading.value = true
    user.getIdToken().then((accessToken) => {
        const userInfo = {
          ...user._delegate,
          accessToken: accessToken,
          id: user.uid,
          nickName: user.displayName,
        };
        
        let anonymousToken = localStorage.getItem('anonymousToken') || '' ;
        welcomeAccess(accessToken, anonymousToken).then((res) => {
            if (res.code === 200) {
              if (res.data && res.data.system_chat) {
                localStorage.setItem('systemChat', JSON.stringify(res.data.system_chat));
                localStorage.setItem('user', JSON.stringify(res.data.user_info));
              }
              userStore.loginOthers(userInfo)
              localStorage.removeItem('anonymousToken')
              emit('close')
              window.location.reload()
              // router.push({ path: "/home" });
            }
            firebaseLoading.value = false
          }).catch(() => {
            firebaseLoading.value = false
            return false;
          });
      },(err) => {
        firebaseLoading.value = false
        console.log("user.getIdToken: ", err);
      }
    );
  }
};

const userStore = useUserStore();
// const router = useRouter();

// FireBaseUI login
const handleFireBaseUI = () => {
  let uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult) {
        console.log("signInSuccess: ", authResult);
        handleToken(authResult.user);
        return false;
      },
    },
    signInFlow: "popup",
    // signInSuccessUrl: "",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      // AppleProvider.providerId,
    ],
  };
  firebase.initializeApp(window.FIREBASE_CONFIG);
  
  if (firebaseui.auth.AuthUI.getInstance()) {
    const ui = firebaseui.auth.AuthUI.getInstance();
    ui.start("#firebaseui-auth-container", uiConfig);
  } else {
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
  }
};
onMounted(() => {
  nextTick(()=>{
    handleFireBaseUI();

  })
});

</script>

<style lang="scss">
.login-dialog{
  background-color:  var(--el-color-primary);
  .el-dialog__close{
      color: #000;
      font-size: 20px;
  }
  .el-dialog__headerbtn:focus .el-dialog__close, .el-dialog__headerbtn:hover .el-dialog__close {
      color: #000 !important;
      opacity: 0.75;
  }
  .login-footer{
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
