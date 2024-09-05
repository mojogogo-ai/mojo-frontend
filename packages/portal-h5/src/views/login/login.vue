<template>
  <div class="login">
    <div class="login-header">
      <div
        style="width: 160px"
        class="sidebar-logo"
      >
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
          {{ isCn ? $t('common.productName_Cn') : $t('common.productName') }}
        </a>
      </div>
      <div class="w-[120px]">
        <selector
          v-model="curLang"
          :columns="langList"
          :columns-field-names="{ text: 'lable' }"
          @update:model-value="changeLangCommand"
        />
      </div>
    </div>
    <div class="login-form">
      <!-- <img class="w-[0] sm:w-[0px] md:w-[400px] lg:w-[660px]" :src="logoLoginLeft"> -->
      <div class="login-container ml-0 sm:ml-0 md:ml-[10px]">
        <van-form
          ref="loginRef"
          class="cover-form"
          @submit="loginByEmail"
        >
          <van-tabs
            v-model="activeName"
            class="login-tab"
            title-active-color="#066BE9"
          >
            <van-tab
              :title="$t('login.emailLogin')"
              name="email"
            >
              <van-field
                v-model.trim="loginForm.email"
                name="email"
                type="text"
                left-icon="envelop-o"
                autocomplete="off"
                background
                clearable
                :placeholder="$t('login.em')"
                :rules="loginRules.email"
              />
              <van-field
                v-model.trim="loginForm.password"
                prop="password"
                left-icon="bag-o"
                autocomplete="off"
                background
                clearable
                :placeholder="$t('login.password')"
                :rules="loginRules.password"
                :type="showPassword ? 'text' : 'password'"
                :right-icon="showPassword ? 'closed-eye' : 'eye-o'"
                @click-right-icon="showPassword = !showPassword"
              />
            </van-tab>
          </van-tabs>
          <div
            v-if="activeName === 'email'"
            class="operation"
          >
            <div class="left">
              <span>
                {{ $t('login.tips-2') }}
                <a
                  class="link-text"
                  href="javascript:;"
                  @click="handleRegister"
                >
                  {{ $t('login.sign-up-now') }}
                </a>
              </span>
            </div>
            <div class="other">
              <van-button
                type="primary"
                link
                :disabled="unregistrable"
                @click="handleForgot"
              >
                {{ $t('login.forgot') }}?
              </van-button>
            </div>
          </div>
          <van-button
            type="primary"
            style="margin: 20px 0 0"
            linear
            block
            :loading="unlogin"
            @click.prevent="loginByEmail"
          >
            <span> {{ $t('login.login') }}</span>
          </van-button>
          <p class="other-tips">
            <span> {{ $t('login.otherLoginType') }} </span>
          </p>
          <van-loading
            v-if="firebaseLoading && !unlogin"
            class="mt-[40px]"
            color="#1989fa"
            size="48"
            vertical
          />
          <div
            id="firebaseui-auth-container"
            class="firebaseui-auth-container"
          />
        </van-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import logoLeft from '@/assets/logo/safe-gen-ai.svg';

import useUserStore from '@/store/modules/user';
import { t } from '@gptx/base/i18n';
import { isRegister } from '@gptx/base/api/user';

import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import '@/assets/styles/firebaseui.scss';
import { OAuthProvider } from 'firebase/auth';

import { welcomeAccess } from '@gptx/base/api/login';
import { getCurLang, supportLang } from '@gptx/base';

const AppleProvider = new OAuthProvider('apple.com');
let unregistrable = ref(false);
let unlogin = ref(false);
let activeName = ref('email');
const WEBSITE_HOME = window.WEBSITE_HOME;
const isCn = computed(() => {
  return window.SITE_TYPE && window.SITE_TYPE === '2';
});

const firebaseLoading = ref(false);
const handleToken = (user) => {
  if (user) {
    firebaseLoading.value = true;
    user.getIdToken().then(
      (accessToken) => {
        const userInfo = {
          ...user._delegate,
          accessToken: accessToken,
          id: user.uid,
          nickName: user.displayName
        };
        const { email, emailVerified } = user;
        const password = loginForm.value.password;
        const emailAddress = loginForm.value.email;
        if (email && !emailVerified && password && emailAddress) {
          showConfirmDialog({
            title: t('login.remind'),
            message: t('login.checkEmailLink'),
            confirmButtonText: t('common.ok'),
            cancelButtonText: t('login.register'),
            showConfirmButton: true
          })
            .then(() => {
              firebaseLoading.value = false;
            })
            .catch(() => {
              handleRegister();
              firebaseLoading.value = false;
            });
          return false;
        }

        let anonymousToken = localStorage.getItem('anonymousToken') || '';
        welcomeAccess(accessToken, anonymousToken)
          .then((res) => {
            if (res.code === 200) {
              if (res.data && res.data.system_chat) {
                localStorage.setItem('systemChat', JSON.stringify(res.data.system_chat));
                localStorage.setItem('user', JSON.stringify(res.data.user_info));
              }
              userStore.loginOthers(userInfo);
              localStorage.removeItem('anonymousToken');
              router.push({ path: '/home' });
            }
            firebaseLoading.value = false;
          })
          .catch(() => {
            firebaseLoading.value = false;
            return false;
          });
      },
      (err) => {
        firebaseLoading.value = false;
        console.log('user.getIdToken: ', err);
      }
    );
  }
};

const userStore = useUserStore();
const router = useRouter();
const { proxy } = getCurrentInstance();
const loginForm = ref({
  username: '',
  password: '',
  email: ''
});
const validatorEmail = (value) => {
  const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (!value) {
    return false;
  }
  return regEmail.test(value);
};
const validatorPassword = (value) => {
  const password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/;
  return !(!value || !password.test(value));
};

const loginRules = {
  email: [{ message: t('login.b'), validator: validatorEmail }],
  password: [{ message: t('login.validPassword'), validator: validatorPassword }]
};
const showPassword = ref(false);

// FireBaseUI login
const handleFireBaseUI = () => {
  let uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult) {
        console.log('signInSuccess: ', authResult);
        handleToken(authResult.user);
        return false;
      }
    },
    signInFlow: 'popup',
    // signInSuccessUrl: "",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      AppleProvider.providerId
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
onMounted(() => {
  handleFireBaseUI();
});

// email login
const loginByEmail = async () => {
  try {
    await proxy.$refs.loginRef.validate();
    const { email, password } = loginForm.value;
    unlogin.value = true;
    await handleIsRegister()
      .then(
        (res) => {
          if (!res.data.is_register) {
            unlogin.value = false;
            showFailToast(t('login.firebaseNoAccount'))
            return false;
          }
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(
              ({ user }) => {
                // Signed in
                console.log('signInWithEmailAndPassword:', user);
                handleToken(user);
                setTimeout(() => {
                  unlogin.value = false;
                }, 3000);
              },
              () => {
                showFailToast(t('login.errLogin'))
                unlogin.value = false;
              }
            )
            .catch((error) => {
              showFailToast(error.message)
              unlogin.value = false;
            });
        },
        (err) => console.log(err)
      )
      .catch(() => {
        unlogin.value = false;
      });
  } catch (e) {
    console.log(e);
  }
};

// register
const handleRegister = () => {
  router.push('/register');
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
  await proxy.$refs.loginRef.validateField('email', (result) => {
    validate.value = result;
  });
  if (!validate.value) return;
  console.log('validate');
  await handleIsRegister()
    .then(
      (res) => {
        if (!res.data.is_register) {
          showFailToast(t('login.firebaseNoAccount'))
          return false;
        }
        unregistrable.value = true;
        firebase
          .auth()
          .sendPasswordResetEmail(loginForm.value.email)
          .then(
            (res) => {
              console.log(res);
              showSuccessToast(t('login.emailCodeSendedTips'))
              unregistrable.value = false;
            },
            (err) => {
              showFailToast(err.message);
              unregistrable.value = false;
            }
          )
          .catch((err) => {
            showFailToast(err.message);
            unregistrable.value = false;
          });
      },
      (err) => console.log(err)
    )
    .catch((err) => console.log(err));
};

const curLang = ref(getCurLang());
const langList = supportLang(); // 支持切换的语言

const changeLangCommand = (command) => {
  if (command === curLang) return;
  localStorage.setItem('lang', command);
  window.location.reload();
};
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  background: url('@/assets/images/login-background2.png') no-repeat center / cover;

  .login-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px 10px 20px;

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
        height: 20px;
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
      background: rgba(#fff, 0.55);
      width: 96%;
      padding: 10px 20px;
      min-height: 510px;

      form {
        height: 100%;
        display: flex;
        flex-flow: column;

        .firebaseui-auth-container {
          flex: 1;
          box-shadow:
            0 2px 2px 0 rgb(0 0 0 / 14%),
            0 3px 1px -2px rgb(0 0 0 / 20%),
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
    // margin-top: 20px;
    box-shadow: none;
  }

  .sign-in {
    width: 100%;
    height: 40px;
  }

  .other-tips {
    font-size: var(--font-size-16);
    color: rgba(0, 0, 0, 0.6);
    text-align: center;
    margin-bottom: 0;
    position: relative;

    &::after {
      position: absolute;
      content: '';
      width: 100%;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      border-bottom: 1px solid #dcdcde;
    }

    span {
      //background-color: #fff;
      position: relative;
      z-index: 88;
      padding: 0 10px;
    }
  }
}

.w-\[120px\] {
  width: 120px;
}

.link-text {
  font-size: 14px;
  color: var(--van-primary-color);
}

.login-tab {
  margin-top: 12px;

  :deep(.van-tabs__wrap) {
    margin-bottom: 12px;

    .van-tabs__nav {
      padding: 0;
      background-color: transparent;

      .van-tab__text {
        font-size: 20px;
      }
    }
  }

  :deep(.van-tabs__line) {
    background-color: transparent;
  }
}

.mt-\[40px\] {
  margin-top: 40px;
}
</style>
