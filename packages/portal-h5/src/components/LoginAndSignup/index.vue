<template>
  <el-dialog
    v-model="dialogVisible"
    class="login-dialog"
    width="640px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="flex flex-col items-center">
      <LoginLogo :is-login-form="isLoginForm" />

      <!-- login -->
      <el-form
        v-if="isLoginForm"
        ref="loginRef"
        style="width: 400px;"
        label-position="top"
        :model="loginForm"
        :rules="loginRules"
        :disabled="isLoading"
      >
        <el-form-item
          prop="email"
          required
        >
          <el-input
            v-model="loginForm.email"
            placeholder="Email"
            clearable
          />
        </el-form-item>
        <el-form-item
          prop="password"
        >
          <el-input
            v-model="loginForm.password"
            placeholder="Password"
          />
        </el-form-item>
        <el-button
          color="#000000"
          class="w-full mt-4 mb-2"
          :loading="isLoading"
          @click="onLogin"
        >
          <span style="color: #fff;font-size: 14px;">Login</span>
        </el-button>

        <div class="flex justify-between text-[#000] ">
          <span 
            class="font-medium underline cursor-pointer underline-offset-4 hover:opacity-75" 
            @click="formChange"
          >
            Not a member? Sign up
          </span>
          <span class="font-medium underline cursor-pointer underline-offset-4 hover:opacity-75">
            Forgot password?
          </span>
        </div>
      </el-form>

      <!-- sign up -->
      <el-form
        v-else
        ref="signupRef"
        style="width: 400px;"
        label-position="top"
        :model="signupForm"
        :rules="signupRules"
        :disabled="isLoading"
      >
        <el-form-item
          prop="email"
          required
        >
          <el-input
            v-model="signupForm.email"
            placeholder="Email"
            clearable
          />
        </el-form-item>
        <el-form-item
          prop="password"
        >
          <el-input
            v-model="signupForm.password"
            placeholder="Password"
          />
        </el-form-item>
        <el-form-item
          prop="confirmPassword"
        >
          <el-input
            v-model="signupForm.confirmPassword"
            placeholder="Confirm password again"
          />
        </el-form-item>
        <el-button
          color="#000000"
          class="w-full mt-4 mb-2"
          :loading="isLoading"
          @click="onSignUp"
        >
          <span style="color: #fff;font-size: 14px;">Sign up</span>
        </el-button>

        <div class="flex justify-center text-[#000] ">
          <span class="font-medium underline cursor-pointer underline-offset-4 hover:opacity-75" @click="formChange">
            Already a member? Login
          </span>
        </div>
      </el-form>

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
  import { t } from '@gptx/base/i18n';
  import useUserStore from '@/store/modules/user.js';
  import LoginLogo from './LoginLogo.vue';
  import { updateUserInfo } from '@gptx/base/api/user.js';

  const isLoginForm = ref(true);
  const dialogVisible = ref(false);
  const isLoading = ref(false);
  const user = useUserStore();

  // open dialog
  const open = (bol) => {
    isLoginForm.value = bol
    dialogVisible.value = true;
    loginRef.value.resetFields()
    signupRef.value.resetFields()
  };

  const loginRef = ref();
  const loginForm = reactive({
    password: '',
    email: '',
  });
  const loginRules = reactive({
    password: [
      {
        required: true,
        message: t('user.nameRequired'),
        trigger: 'blur'
      }
    ],
  });

  // login in
  const onLogin = async () => {
    try {
      if (isLoading.value) return;
      isLoading.value = true;
      const isValid = await loginRef.value.validate();
      if (isValid) {
        let params = {
          password: loginForm.password,
        }
        const { code } = await updateUserInfo(params);
        if (code === 200) {
          user.updateUserInfo('nickName', loginForm.password);
          dialogVisible.value = false;
        }
      }
    } catch (e) {
      console.log(e);
      isLoading.value = false;
    }
  };

  // sign up
  const signupRef = ref();
  const signupForm = reactive({
    email: '',
    password: '',
    confirmPassword:''
  });
  const signupRules = reactive({
    password: [
      {
        required: true,
        message: t('user.nameRequired'),
        trigger: 'blur'
      }
    ],
  });
  const onSignUp = () => {
    
  }

  const formChange = () => {
    isLoginForm.value = !isLoginForm.value
    loginRef.value.resetFields()
    signupRef.value.resetFields()
  };

  defineExpose({ open });
  </script>
  <style lang="scss">
  .login-dialog{
    background-color:  var(--el-color-primary);
    .el-dialog__close{
        color: #000;
        font-size: 20px;
        &:hover{
            color: #000;
            opacity: 0.75;
        }
    }
    .el-input__wrapper{
        background: #fff;
        color: #000;
        .el-input__inner{
            background: #fff;
            color: #000;
        
        }
        .el-input__inner::placeholder{
            color: rgba(0, 0, 0, 0.7);
            font-size: 15px;
        }
        .el-input__suffix{
            .el-icon-circle-close:before{
                color: rgba(0, 0, 0, 0.7);
            }
        }
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
  