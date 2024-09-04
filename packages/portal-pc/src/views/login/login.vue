<template>
  <div class="login">
    <div class="login-header">
      <div style="width: 180px" class="sidebar-logo">
        <a
          key="collapse"
          class="sidebar-logo__link"
          :href="WEBSITE_HOME"
        >
          <img
            :src="logoLeft"
            alt="SafeGen AI"
            class="sidebar-logo__icon"
          >
          {{ isCn? $t('common.productName_Cn') :$t('common.productName') }}
        </a>
      </div>
      <LanguageSelect lable-color="black" />
    </div>
    <div class="login-form">
      <img class="w-[0] sm:w-[0px] md:w-[400px] lg:w-[660px]" :src="logoLoginLeft">
      <div class="ml-0 login-container sm:ml-0 md:ml-[10px]">
        <el-form
          ref="loginRef"
          :model="loginForm"
          :rules="loginRules"
        >
          <h3 class="email-title">{{ $t('login.emailLogin') }}</h3>
          <el-form-item prop="email" style="margin-bottom: 27px;">
            <div style="display: flex; width: 100%">
              <el-input
                v-model.trim="loginForm.email"
                type="text"
                autocomplete="off"
                :placeholder="$t('login.em')"
              />
            </div>
          </el-form-item>
          <el-form-item prop="password" style="margin-bottom: 27px;">
            <el-input
              v-model.trim="loginForm.password"
              type="password"
              autocomplete="off"
              show-password
              :placeholder="$t('login.password')"
            />
          </el-form-item>
          <div class="operation">
            <div class="left">
              <span>
                {{ $t("login.tips-2") }}
                <el-link type="primary" @click="handleRegister">
                  {{ $t("login.sign-up-now") }}
                </el-link>
              </span>
            </div>
            <div class="other">
              <el-link
                type="primary"
                :disabled="unregistrable"
                @click="handleForgot"
              >
                {{ $t("login.forgot") }}?
              </el-link>
            </div>
          </div>
          <el-form-item style="width: 100%; margin: 14px 0 0 0">
            <el-button
              class="sign-in"
              :loading="emailLoading"
              size="large"
              linear
              type="primary"
              @click.prevent="loginByEmail"
              @keydown.enter="handleKeyDown()"
            >
              <span> {{ $t("login.login") }}</span>
            </el-button>
          </el-form-item>
          <p class="other-tips">
            <span> {{ $t("login.otherLoginType") }} </span>
          </p>
          <el-progress v-if="firebaseLoading&&!emailLoading" :percentage="100" :format="(percentage) => (percentage === 100 ? '' : `${percentage}%`)" :indeterminate="true" />
          <div id="firebaseui-auth-container" class="firebaseui-auth-container" />
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import logoLeft from '@/assets/logo/bot-default-logo.svg';
import logoLoginLeft from "@/assets/images/login-left.png";
import useUserStore from "@/store/modules/user";
import { t } from '@gptx/base/i18n';
import { isRegister } from "@gptx/base/api/user";
import { validatorEmail, validatorPassword } from '@gptx/base/utils/validator'

import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import '@/assets/styles/firebaseui.scss'
import { OAuthProvider } from "firebase/auth";

import { ElMessage } from "element-plus";
import { welcomeAccess } from "@gptx/base/api/login";
const AppleProvider = new OAuthProvider("apple.com");
const unregistrable = ref(false);
const emailLoading = ref(false);
const firebaseLoading = ref(false)

const WEBSITE_HOME = window.WEBSITE_HOME;
const isCn = computed(() => {
  return  window.SITE_TYPE && window.SITE_TYPE === '2'
});

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
        const { email, emailVerified } = user;
        const password = loginForm.value.password;
        const emailAddress = loginForm.value.email;
        if (email && !emailVerified && password && emailAddress && emailLoading.value) {
          ElMessageBox.confirm(t('login.checkEmailLink'), {
            autofocus: false,
            confirmButtonText: t("common.ok"),
            cancelButtonText: t("login.register"),
            type: "warning",
            title:t("login.remind"),
            distinguishCancelAndClose: true,
            closeOnClickModal: false,
            customClass: 'customize-message-box'
          }).then(() => {
            firebaseLoading.value = false;
            emailLoading.value = false;
          }).catch((action) => {
              console.log(action);
              if (action === 'cancel') {
                  handleRegister()
              } else {
                firebaseLoading.value = false;
                emailLoading.value = false;
              }
          });
          return false;
        }
        
        let anonymousToken = localStorage.getItem('anonymousToken') || '' ;
        welcomeAccess(accessToken, anonymousToken).then((res) => {
            if (res.code === 200) {
              if (res.data && res.data.system_chat) {
                localStorage.setItem('systemChat', JSON.stringify(res.data.system_chat));
                localStorage.setItem('user', JSON.stringify(res.data.user_info));
              }
              userStore.loginOthers(userInfo)
              localStorage.removeItem('anonymousToken')
              router.push({ path: "/chat" });
            }
            firebaseLoading.value = false
            emailLoading.value = false;
          }).catch(() => {
            firebaseLoading.value = false
            emailLoading.value = false;
            return false;
          });
      },(err) => {
        firebaseLoading.value = false
        emailLoading.value = false;
        console.log("user.getIdToken: ", err);
      }
    );
  }
};

const userStore = useUserStore();
const router = useRouter();
const { proxy } = getCurrentInstance();
const loginForm = ref({
  username: "",
  password: "",
  email: "",
});

const loginRules = {
  email: [{ required: true, validator: validatorEmail, trigger: "blur" }],
  password: [{ required: true, validator: validatorPassword, trigger: "blur" }],
};

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
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      AppleProvider.providerId,
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
  handleFireBaseUI();
});

// email login
const loginByEmail = async () => {
  let validate = ref(false);
  await proxy.$refs.loginRef.validateField(["email", "password"], (result) => {
    validate.value = result;
  });
  if (!validate.value) return;
  const { email, password } = loginForm.value;
  emailLoading.value = true;
  await handleIsRegister().then((res) => {
      if (!res.data.is_register) {
        emailLoading.value = false;
        ElMessage.error(t("login.firebaseNoAccount"));
        return;
      }
      firebase.auth().signInWithEmailAndPassword(email, password).then(
        ({ user }) => {
          // Signed in
          console.log("signInWithEmailAndPassword:", user);
          handleToken(user);
        },
        (err) => {
          console.dir("err:", err);
          ElMessage.error(t('login.errLogin'));
          emailLoading.value = false;
        }
      ).catch((error) => {
        console.log("error:", error);
        ElMessage.error(error.message);
        emailLoading.value = false;
      });
    },
    (err) => console.log(err)
  ).catch(() => {
    emailLoading.value = false;
  });
};

// register 
const handleRegister = () => {
  router.push("/register");
};
const handleIsRegister = async () => {
  return await isRegister({ email: loginForm.value.email })
    .then(
      (res) => res,
      (err) => err
    )
    .catch((err) => err);
};

const handleForgot = async () => {
  let validate = ref(false);
  await proxy.$refs.loginRef.validateField("email", (result) => {
    validate.value = result;
  });
  if (!validate.value) return;
  console.log("validate");
  await handleIsRegister()
    .then(
      (res) => {
        if (!res.data.is_register) {
          ElMessage.error(t("login.firebaseNoAccount"));
          return false;
        }
        unregistrable.value = true;
        firebase
          .auth()
          .sendPasswordResetEmail(loginForm.value.email)
          .then(
            (res) => {
              console.log(res);
              ElMessage.success(t("login.emailCodeSendedTips"));
              unregistrable.value = false;
            },
            (err) => {
              console.log(err);
              ElMessage.error(err.message);
              unregistrable.value = false;
            }
          )
          .catch((error) => {
            ElMessage.error(error.message);
            unregistrable.value = false;
          });
      },
      (err) => console.log(err)
    )
    .catch((err) => console.log(err));
};
</script>

<style lang="scss" scoped>
:deep(.el-input__inner),
:deep(.el-input--large) {
  font-size: var(--font-size-16);
}
:deep(.el-button--large) {
  font-size: var(--font-size-18);
}
:deep(.el-input--default) {
  height: 40px;
}
:deep(.el-input__wrapper) {
  background: #f5f5f5;
  &:hover {
    border-color: var(--el-color-primary);
  }
}
.email-title{
  font-size: 20px;
  color:#076DEA;
  margin: 5px 0 30px 0;
  text-align: center;
}
.login {
  height: 100vh;
  background-image: url("@/assets/images/login-background2.png");
  background-size: cover;
  .login-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 50px;
    .sidebar-logo {
      position: relative;
      width: 100%;
      background: transparent !important;
      text-align: center;
      overflow: hidden;

      &__link {
        display: flex;
        align-items: center;
        // justify-content: center;
        font-size: 20px;
        font-weight: 600;
        color: #066be9;
      }

      &__icon {
        height: 30px;
        margin-right: 6px;
      }

      &__title {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }

  .login-form {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 80px;
    .login-container {
      border-radius: 20px;
      background: #ffffff;
      width: 460px;
      padding: 30px 40px;
      min-height: 510px;
      form {
        height: 100%;
        display: flex;
        flex-flow: column;
        .firebaseui-auth-container {
          flex: 1;
          box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%),
            0 1px 5px 0 rgb(0 0 0 / 12%);
        }
      }
    }
  }
  .operation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
    height: 23px;
    .left {
      display: flex;
      align-items: center;
      span {
        font-size: var(--font-size-14);
      }
    }
    .other {
      .fast-registry {
        margin-right: 10px;
      }
    }
  }
  #firebaseui-auth-container {
    box-shadow: none;
  }
  .sign-in {
    width: 100%;
    height: 40px;
  }
  .other-tips {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.6);
    text-align: center;
    margin: 30px 0 0 0;
    position: relative;
    &::after {
      position: absolute;
      content: "";
      width: 100%;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      border-bottom: 1px solid #dcdcde;
    }
    span {
      background-color: #fff;
      position: relative;
      z-index: 88;
      padding: 0 10px;
    }
  }
}

</style>
