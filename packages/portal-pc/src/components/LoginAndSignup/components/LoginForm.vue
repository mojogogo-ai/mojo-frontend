<script setup lang="tsx">
import { ref, reactive, onMounted, watch, defineEmits, unref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElCheckbox, ElLink, ElIcon, ElForm, ElFormItem, ElInput, ElDivider } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { loginApi, getTestRoleApi, getAdminRoleApi } from '@/api/login'
import { t } from '@gptx/base/i18n'

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

const remember = ref(userStore.getRememberMe)
const loading = ref(false)
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

const signIn = async () => {
  await formRef.value?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      try {
        const res = await loginApi(formData)
        if (res) {
          if (unref(remember)) {
            userStore.setLoginInfo({
              username: formData.username,
              password: formData.password
            })
          } else {
            userStore.setLoginInfo(undefined)
          }
          userStore.setRememberMe(unref(remember))
          userStore.setUserInfo(res.data)

          if (appStore.getDynamicRouter) {
            await getRole()
          } else {
            await permissionStore.generateRoutes('static').catch(() => {})
            permissionStore.getAddRouters.forEach((route) => {
              router.addRoute(route)
            })
            permissionStore.setIsAddRouters(true)
            router.push({ path: redirect.value || permissionStore.addRouters[0].path })
          }
        }
      } finally {
        loading.value = false
      }
    }
  })
}

const getRole = async () => {
  const params = { roleName: formData.username }
  const res =
    appStore.getDynamicRouter && appStore.getServerDynamicRouter
      ? await getAdminRoleApi(params)
      : await getTestRoleApi(params)
  if (res) {
    const routers = res.data || []
    userStore.setRoleRouters(routers)
    const generateType = appStore.getDynamicRouter && appStore.getServerDynamicRouter ? 'server' : 'frontEnd'
    await permissionStore.generateRoutes(generateType, routers).catch(() => {})
    permissionStore.getAddRouters.forEach((route) => {
      router.addRoute(route)
    })
    permissionStore.setIsAddRouters(true)
    router.push({ path: redirect.value || permissionStore.addRouters[0].path })
  }
}

const toRegister = () => {
  emit('to-register')
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border border-[var(--el-border-color)] border-solid) w-full"
  >
    <h2 class="text-2xl font-bold text-center w-full">{{ t('login.login') }}</h2>

    <el-form-item prop="username" :label="t('login.username')" class="w-full">
      <el-input v-model="formData.username" placeholder="admin or test" />
    </el-form-item>

    <el-form-item prop="password" :label="t('login.password')" class="w-full">
      <el-input
        v-model="formData.password"
        placeholder="admin or test"
        show-password
      />
    </el-form-item>

    <el-form-item class="w-full">
      <div class="flex justify-between items-center w-full">
        <el-checkbox v-model="remember">{{ t('login.remember') }}</el-checkbox>
        <el-link type="primary" underline="false">
          {{ t('login.forgetPassword') }}
        </el-link>
      </div>
    </el-form-item>

    <el-form-item class="w-full">
      <base-button
        :loading="loading"
        type="primary"
        class="w-full"
        @click="signIn"
      >
        {{ t('login.login') }}
      </base-button>
    </el-form-item>

    <el-form-item class="w-full">
      <base-button class="w-full" @click="toRegister">
        {{ t('login.register') }}
      </base-button>
    </el-form-item>

    <el-divider :content-position="'center'">{{ t('login.otherLogin') }}</el-divider>

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
</template>
