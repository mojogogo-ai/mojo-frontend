<script setup lang="tsx">
import { ref, reactive, onMounted, watch, defineEmits, unref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElCheckbox, ElLink, ElIcon, ElForm, ElFormItem, ElInput, ElDivider, ElMessage } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { t } from '@gptx/base/i18n'
import { Search } from '@element-plus/icons-vue'

const emit = defineEmits(['to-register'])
const router = useRouter()
const route = useRoute()

const appStore = useAppStore()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

const { required } = useValidator()

const formRef = ref()
const formData = reactive({
  username: '',
  password: ''
})

// const remember = ref(userStore.getRememberMe)
const loading = ref(false)
const firebaseLoading = ref(false)
const redirect = ref<string>('')

const rules = reactive({
  username: [required()],
  password: [required()]
})

const iconSize = 30
const iconColor = '#999'
const hoverColor = 'var(--el-color-primary)'

const initLoginInfo = () => {
  const loginInfo = userStore.getLoginInfo
  if (loginInfo) {
    formData.username = loginInfo.username
    formData.password = loginInfo.password
  }
}

onMounted(initLoginInfo)

watch(
  () => route.query.redirect,
  (newRedirect) => {
    redirect.value = newRedirect
  },
  { immediate: true }
)

// Firebase Email/Password Login
const signIn = async () => {
  await formRef.value?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.username, formData.password)
        await handleFirebaseToken(userCredential)
      } catch (error) {
        ElMessage.error(t('login.loginError'))
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}

// Google Login with Firebase
const openGoogleLogin = async () => {
  firebaseLoading.value = true
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    await handleFirebaseToken(userCredential)
  } catch (error) {
    ElMessage.error(t('login.googleLoginError'))
    console.error(error)
  } finally {
    firebaseLoading.value = false
  }
}

// Handle Firebase Token and Set User Data
const handleFirebaseToken = async (authResult) => {
  const { user } = authResult
  const accessToken = await user.getIdToken()
  const userInfo = {
    email: user.email,
    displayName: user.displayName,
    uid: user.uid,
    accessToken
  }

  await userStore.loginOthers(userInfo)

  // Redirect to desired route
  const routePath = redirect.value || permissionStore.addRouters[0].path
  router.push({ path: routePath })
}

const toRegister = () => {
  emit('to-register')
}
const toForgetPassword = () => {
  // router.push({ name: 'ForgetPassword' })
}
</script>

<template>
  <div class="light-mode-section">
    <el-form
      ref="formRef"
      theme="light"
      :model="formData"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
      size="large"
      class="w-full"
    >
      <h2 class="text-2xl text-[#000000] font-bold text-center w-full">{{ t('login.login') }}</h2>

      <el-form-item prop="username" class="w-full">
        <el-input
          v-model="formData.username"
          :placeholder="t('login.username')"
        />
      </el-form-item>

      <el-form-item prop="password" class="w-full">
        <el-input
          v-model="formData.password"
          :placeholder="t('login.password')"
          show-password
        />
      </el-form-item>

      <!--    <el-form-item class="w-full">-->
      <!--      <div class="flex justify-between items-center w-full">-->
      <!--        <el-checkbox v-model="remember">{{ t('login.remember') }}</el-checkbox>-->
      <!--        <el-link type="primary" underline="false">-->
      <!--          {{ t('login.forgetPassword') }}-->
      <!--        </el-link>-->
      <!--      </div>-->
      <!--    </el-form-item>-->

      <el-form-item class="w-full pt-[20px] mb-[18px]">
        <el-button
          :loading="loading"
          type="primary"
          class="w-full"
          @click="signIn"
        >
          {{ t('login.login') }}
        </el-button>
      </el-form-item>

      <el-form-item class="w-full mb-[36px]">
        <div class="link-button">
          <el-button style="text-align: left;justify-content: flex-start;text-decoration: underline" link class="w-full font-Inter text-[15px]" @click="toRegister">
            {{ t('login.notAccount') }}
          </el-button>
          <el-button style="justify-content: flex-end; text-decoration: underline" link class="w-full font-Inter text-[15px]" @click="toForgetPassword">
            {{ t('login.forgetPassword') }}
          </el-button>
        </div>
      </el-form-item>


      <el-divider
        class="bg-[transparent]"
        :content-position="'center'">{{ t('login.orContinueWith') }}</el-divider>

      <!-- Google Login Button -->
      <el-form-item class="w-full text-center mt-4">
<!--        <el-button-->
<!--          type="primary"-->
<!--          icon="el-icon-google"-->
<!--          @click="openGoogleLogin"-->
<!--          :loading="firebaseLoading"-->
<!--        >-->
<!--          Google {{ t('login.signIn') }}-->
<!--        </el-button>-->
        <div class="flex justify-center items-center gap-5 mx-auto">
          <el-icon
            :size="48"
            class="cursor-pointer ant-icon"
            @click="handleIconClick('github')"
          >
            <Search />
          </el-icon>
          <el-icon
            :size="48"
            class="cursor-pointer ant-icon"
            @click="handleIconClick('github')"
          >
            <Search />
          </el-icon>
          <el-icon
            :size="48"
            class="cursor-pointer ant-icon"
            @click="handleIconClick('github')"
          >
            <Search />
          </el-icon>
        </div>
      </el-form-item>

      <el-form-item class="w-full">
        <div class="flex justify-between w-full">
          <el-icon
            :size="iconSize"
            class="cursor-pointer ant-icon"
            @click="handleIconClick('github')"
          >
            <i class="vi vi-ant-design:github-filled" />
          </el-icon>
          <el-icon
            :size="iconSize"
            class="cursor-pointer ant-icon"
            @click="handleIconClick('wechat')"
          >
            <i class="vi vi-ant-design:wechat-filled" />
          </el-icon>
          <el-icon
            :size="iconSize"
            class="cursor-pointer ant-icon"
            @click="handleIconClick('alipay')"
          >
            <i class="vi vi-ant-design:alipay-circle-filled" />
          </el-icon>
          <el-icon
            :size="iconSize"
            class="cursor-pointer ant-icon"
            @click="handleIconClick('weibo')"
          >
            <i class="vi vi-ant-design:weibo-circle-filled" />
          </el-icon>
        </div>
      </el-form-item>
    </el-form>

  </div>

</template>
<style scoped lang="scss">
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


}

</style>
