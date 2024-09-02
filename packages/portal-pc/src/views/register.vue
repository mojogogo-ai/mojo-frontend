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
    <div class="register-form">
      <img class="w-[0] sm:w-[0px] md:w-[400px] lg:w-[660px]" :src="logoLoginLeft">
      <div class="ml-0 login-container sm:ml-0 md:ml-[10px]">
        <div class="top-header">
          <h4 class="title">
            {{ $t("login.registered") }}
          </h4>
          <span class="sub-title">
            <span style="font-size: 14px;">{{ $t("login.tips-1") }} </span>
            <el-link type="primary" @click="() => router.push('/login')">
              {{ $t("login.sign-in-now") }}
            </el-link>
          </span>
        </div>
        <el-form
          ref="registerRef"
          :model="registerForm"
          :rules="registerRules"
        >
          <el-form-item prop="email" style="margin-bottom: 27px;">
            <el-input
              v-model.trim="registerForm.email"
              type="text"
              size="large"
              auto-complete="off"
              :placeholder="$t('login.em')"
              autocomplete="off"
            >
              <template #prefix>
                <svg-icon name="email" class="el-input__icon input-icon" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" style="margin-bottom: 27px;">
            <el-input
              v-model.trim="registerForm.password"
              type="password"
              size="large"
              auto-complete="off"
              :placeholder="$t('login.password')"
              autocomplete="off"
              @keyup.enter="handleRegister"
            >
              <template #prefix>
                <svg-icon name="password" class="el-input__icon input-icon" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model.trim="registerForm.confirmPassword"
              type="password"
              size="large"
              auto-complete="off"
              :placeholder="$t('login.confirmPassword')"
              autocomplete="off"
              @keyup.enter="handleRegister"
            >
              <template #prefix>
                <svg-icon name="confirmPassword" class="el-input__icon input-icon" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="userAgreement" :label="$t('login.checkAgree')" size="large" />
            <div class="flex" style="font-size: 14px;margin-top: 0">
              <el-link
                type="primary"
                :underline="false"
                @click="termsServiceCnVisible= true"
              >
                {{ $t("login.userAgreement") }}
              </el-link>
              <span style="margin: 0 1px;">{{ $t("common.and") }}</span>
              <el-link
                type="primary"
                :underline="false"
                @click="privacyPolicyCnVisible = true"
              >
                {{ $t("login.privacyPolicy") }}
              </el-link>
            </div>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              size="large"
              type="primary"
              linear
              style="width: 100%"
              @click.prevent="handleRegister"
            >
              <span>{{ $t("login.createAccount") }}</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog v-model="termsServiceCnVisible" width="620">
      <ModelService v-if="termsServiceCnVisible" />
    </el-dialog>
    <el-dialog v-model="privacyPolicyCnVisible" width="620">
      <PrivacyPolicy v-if="privacyPolicyCnVisible" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { getAuth, sendEmailVerification, createUserWithEmailAndPassword } from "firebase/auth";
import logoLeft from '@/assets/logo/safe-gen-ai.svg';
import logoLoginLeft from "../assets/images/login-left.png";
import { t } from '@gptx/base/i18n';
import { validatorEmail, validatorRegiterPassword } from '@gptx/base/utils/validator'

const privacyPolicyCnVisible = ref(false)
const termsServiceCnVisible = ref(false)

const WEBSITE_HOME = window.WEBSITE_HOME;
const router = useRouter();
const { proxy } = getCurrentInstance();
const userAgreement = ref(false);
const registerForm = ref({
  email: "",
  password: "",
  confirmPassword: "",
});

const isCn = computed(() => {
  return  window.SITE_TYPE && window.SITE_TYPE === '2'
});

const validatorTwoPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error(t("login.tips-3")));
  } else if (registerForm.value.password !== value) {
    callback(new Error(t("login.validConfirmPassword")));
  } else {
    callback();
  }
};

const registerRules = {
  email: [{ required: true, validator: validatorEmail, trigger: "blur" }],
  password: [{ required: true, validator: validatorRegiterPassword, trigger: "blur" }],
  confirmPassword: [{ required: true, validator: validatorTwoPassword, trigger: "blur" }],
};

const loading = ref(false);
const registerByEmail = () => {
  const { email, password } = registerForm.value;
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password).then(() => {
    loading.value = false;
    sendEmailVerification(auth.currentUser).then(() => {
        ElMessageBox.confirm(t('login.checkEmailLink'), {
          autofocus: false,
          confirmButtonText: t("common.ok"),
          type: "warning",
          title:t("login.remind"),
          showClose:false,
          distinguishCancelAndClose: true,
          showCancelButton: false,
          closeOnClickModal: false,
          customClass: 'customize-message-box'
        }).then(() => {
        }).catch(() => { });
        router.push("/login");
    });
  }).catch((error) => {
    console.log(error,'error')
    // Firebase: Error (auth/email-already-in-use).
    if(error.message.includes('email-already-in-use')){
      ElMessageBox.confirm(t('login.tips-6'), {
          autofocus: false,
          confirmButtonText: t("common.ok"),
          type: "warning",
          title:t("login.remind"),
          showClose:false,
          distinguishCancelAndClose: true,
          showCancelButton: false,
          closeOnClickModal: false,
          customClass: 'customize-message-box'
        }).then(() => {
        }).catch(() => { });
    } else{
      ElMessage.error(error.message);
    }
    loading.value = false;
  });
};

function handleRegister() {
  proxy.$refs.registerRef.validate((valid) => {
    if (valid) {
      if (!userAgreement.value){
        return ElMessage.error( `${t("login.userAgreement_new")}` );
      }
      loading.value = true;
      registerByEmail();
    }
  });
}
</script>

<style lang="scss" scoped>
:deep(.el-tabs__item) {
  font-weight: bold;
  font-size: var(--font-size-20);
}
:deep(.el-input__inner) {
  font-size: var(--font-size-16);
}
:deep(.el-button--large) {
  font-size: var(--font-size-18);
}
:deep(.el-checkbox) {
  margin-right: 5px;
}
.login {
  height: 100vh;
  background-image: url("../assets/images/login-background2.png");
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

  .register-form {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    .login-container {
      border-radius: 20px;
      background: #ffffff;
      width: 460px;
      padding: 30px 40px;
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
      .el-input {
        height: 40px;
        input {
          height: 40px;
        }
      }
      .input-icon {
        height: 39px;
        width: 16px;
        margin-left: 0;
      }
    }
  }
}


:deep(.el-input__wrapper) {
  background: #f5f5f5;
  &:hover {
    border-color: var(--el-color-primary);
  }
}
</style>
