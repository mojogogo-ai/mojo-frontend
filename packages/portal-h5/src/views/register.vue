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
    <div class="register-form">
      <div class="login-container ml-0 sm:ml-0 md:ml-[10px]">
        <div class="top-header">
          <h4 class="title">
            {{ $t('login.registered') }}
          </h4>
          <span class="sub-title">
            <span style="font-size: 14px">{{ $t('login.tips-1') }} </span>
            <a
              class="link-text"
              href="javascript:"
              @click="() => router.push('/login')"
            >
              {{ $t('login.sign-in-now') }}
            </a>
          </span>
        </div>
        <van-form
          ref="registerRef"
          class="cover-form"
          @submit="handleRegister"
        >
          <van-field
            v-model.trim="registerForm.email"
            type="text"
            name="email"
            autocomplete="off"
            left-icon="envelop-o"
            background
            clearable
            :placeholder="$t('login.em')"
            :rules="registerRules.email"
          />
          <van-field
            v-model.trim="registerForm.password"
            name="password"
            autocomplete="off"
            left-icon="bag-o"
            background
            clearable
            :type="showPassword ? 'text' : 'password'"
            :right-icon="showPassword ? 'closed-eye' : 'eye-o'"
            :placeholder="$t('login.password')"
            :rules="registerRules.password"
            @click-right-icon="showPassword = !showPassword"
            @keyup.enter="handleRegister"
          />
          <van-field
            v-model.trim="registerForm.confirmPassword"
            name="confirmPassword"
            autocomplete="off"
            left-icon="bag-o"
            style="margin-bottom: 8px"
            background
            clearable
            :type="showPasswordConfirm ? 'text' : 'password'"
            :right-icon="showPasswordConfirm ? 'closed-eye' : 'eye-o'"
            :placeholder="$t('login.confirmPassword')"
            :rules="registerRules.confirmPassword"
            @click-right-icon="showPasswordConfirm = !showPasswordConfirm"
            @keyup.enter="handleRegister"
          />
          <van-field style="margin-bottom: 0">
            <template #input>
              <van-checkbox
                v-model="userAgreement"
                class="cover-checkbox"
                icon-size="14"
                shape="square"
              >
                {{ $t('login.checkAgree') }}
                <a
                  class="link-text"
                  href="javascript:"
                  @click.stop="termsServiceCnVisible = true"
                >
                  {{ $t('login.userAgreement') }}
                </a>
                <span style="margin: 0 1px">{{ $t('common.and') }}</span>
                <a
                  class="link-text"
                  href="javascript:"
                  @click="privacyPolicyCnVisible = true"
                >
                  {{ $t('login.privacyPolicy') }}
                </a>
              </van-checkbox>
            </template>
          </van-field>
          <van-field>
            <template #input>
              <van-button
                :loading="loading"
                block
                linear
                type="primary"
                @click.prevent="handleRegister"
              >
                <span>{{ $t('login.createAccount') }}</span>
              </van-button>
            </template>
          </van-field>
        </van-form>
      </div>
    </div>
    <van-popup
      v-model:show="termsServiceCnVisible"
      class="cover-popup"
      position="bottom"
      closeable
    >
      <div class="cover-popup-head">
        <span class="title">{{ $t('login.userAgreement') }}</span>
      </div>
      <div class="cover-popup-body">
        <ModelService height="100%" />
      </div>
    </van-popup>
    <van-popup
      v-model:show="privacyPolicyCnVisible"
      class="cover-popup"
      position="bottom"
      closeable
    >
      <div class="cover-popup-head">
        <span class="title">{{ $t('login.privacyPolicy') }}</span>
      </div>
      <div class="cover-popup-body">
        <PrivacyPolicy height="100%" />
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from 'firebase/auth';
import logoLeft from '@/assets/logo/safe-gen-ai.svg';
import { t } from '@gptx/base/i18n';
import { getCurLang, supportLang } from '@gptx/base';

const privacyPolicyCnVisible = ref(false);
const termsServiceCnVisible = ref(false);

const WEBSITE_HOME = window.WEBSITE_HOME;
const router = useRouter();
const { proxy } = getCurrentInstance();
const userAgreement = ref(false);
const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: ''
});
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const isCn = computed(() => {
  return window.SITE_TYPE && window.SITE_TYPE === '2';
});

const validatorTwoPassword = (value, rule) => {
  if (!value) {
    rule.message = t('login.tips-3');
    return false;
  } else if (registerForm.value.password !== value) {
    rule.message = t('login.validConfirmPassword');
    return false;
  }
  return true;
};
const validatorEmail = (value) => {
  const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (!value) {
    return false;
  }
  return regEmail.test(value);
};
const validatorRegiterPassword = (value) => {
  const password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/;
  return !(!value || !password.test(value));
};
const registerRules = {
  email: [{ message: t('login.b'), validator: validatorEmail }],
  password: [{ message: t('login.validPassword'), validator: validatorRegiterPassword }],
  confirmPassword: [{ validator: validatorTwoPassword }]
};

const loading = ref(false);
const registerByEmail = () => {
  const { email, password } = registerForm.value;
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      loading.value = false;
      sendEmailVerification(auth.currentUser).then(() => {
        showConfirmDialog({
          title: t('login.remind'),
          message: t('login.checkEmailLink'),
          confirmButtonText: t('common.ok'),
          showConfirmButton: true,
          showCancelButton: false
        })
          .then(() => {})
          .catch(() => {});
        router.push('/login');
      });
    })
    .catch((error) => {
      console.log(error, 'error');
      // Firebase: Error (auth/email-already-in-use).
      if (error.message.includes('email-already-in-use')) {
        showConfirmDialog({
          title: t('login.remind'),
          message: t('login.tips-6'),
          confirmButtonText: t('common.ok'),
          showConfirmButton: true,
          showCancelButton: false
        })
          .then(() => {})
          .catch(() => {});
      } else {
        showFailToast(error.message)
      }
      loading.value = false;
    });
};

async function handleRegister() {
  try {
    await proxy.$refs.registerRef.validate();
    if (!userAgreement.value) {
      return showFailToast(t('login.userAgreement_new'));
    }
    loading.value = true;
    registerByEmail();
  } catch (e) {
    console.log(e);
  }
}

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
  background: url('../assets/images/login-background2.png') no-repeat center / cover;

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

  .register-form {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 80px;

    .login-container {
      border-radius: 24px;
      background: rgba(#fff, 0.55);
      width: 96%;
      padding: 10px 20px;

      .top-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: var(--font-size-18);

        .title {
          font-weight: bold;
          font-size: var(--font-size-20);
        }

        .sub-title {
          font-size: var(--font-size-14);
        }
      }
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
</style>
