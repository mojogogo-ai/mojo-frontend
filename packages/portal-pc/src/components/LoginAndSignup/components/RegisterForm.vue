<script setup lang="tsx">
import { ref, reactive } from 'vue'
import { t } from '@gptx/base/i18n'
import { useValidator } from '@/hooks/web/useValidator'
import { ElInput, ElForm, ElFormItem, ElButton, ElMessage } from 'element-plus'
import { IAgree } from '@/components/IAgree'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'

const emit = defineEmits(['to-login'])

const { required, check } = useValidator()

const formRef = ref()
const formData = reactive({
  username: '',
  password: '',
  check_password: '',
  code: '',
  iAgree: false
})

const rules = reactive({
  username: [
    required(),
    { type: 'email', message: t('register.invalidEmail'), trigger: 'blur' }
  ],
  password: [
    required(),
    { min: 6, message: t('register.passwordLength'), trigger: 'blur' }
  ],
  check_password: [
    required(),
    {
      validator: (rule, value, callback) => {
        if (value !== formData.password) {
          callback(new Error(t('register.passwordMismatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  code: [required()],
  iAgree: [required(), check()]
})

const getCodeTime = ref(60)
const getCodeLoading = ref(false)
const getCode = () => {
  if (getCodeLoading.value) return
  getCodeLoading.value = true
  const timer = setInterval(() => {
    getCodeTime.value--
    if (getCodeTime.value <= 0) {
      clearInterval(timer)
      getCodeTime.value = 60
      getCodeLoading.value = false
    }
  }, 1000)
}

const loading = ref(false)

const toLogin = () => {
  emit('to-login')
}

// Firebase Registration
const loginRegister = async () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // Firebase email/password registration
        const userCredential = await createUserWithEmailAndPassword(auth, formData.username, formData.password)

        // Send email verification
        await sendEmailVerification(userCredential.user)
        ElMessage.success(t('register.checkEmailVerification'))

        // Optionally store user info and proceed
        const userInfo = {
          email: userCredential.user.email,
          uid: userCredential.user.uid
        }
        console.log('User registered:', userInfo)

        // Redirect to login or handle post-registration
        toLogin()
      } catch (error) {
        ElMessage.error(t('register.registerError'))
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
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
    <h2 class="text-2xl font-bold text-center w-full">{{ t('login.register') }}</h2>

    <el-form-item prop="username" :label="t('login.username')" class="w-full">
      <el-input
        v-model="formData.username"
        :placeholder="t('login.usernamePlaceholder')"
        autocomplete="email"
      />
    </el-form-item>

    <el-form-item prop="password" :label="t('login.password')" class="w-full">
      <el-input
        v-model="formData.password"
        :placeholder="t('login.passwordPlaceholder')"
        show-password
      />
    </el-form-item>

    <el-form-item prop="check_password" :label="t('login.checkPassword')" class="w-full">
      <el-input
        v-model="formData.check_password"
        :placeholder="t('login.checkPasswordPlaceholder')"
        show-password
      />
    </el-form-item>

    <el-form-item prop="code" :label="t('login.code')" class="w-full">
      <div class="flex">
        <el-input
          v-model="formData.code"
          :placeholder="t('login.codePlaceholder')"
        />
        <el-button
          type="primary"
          :disabled="getCodeLoading"
          class="ml-2"
          @click="getCode"
        >
          {{ t('login.getCode') }}
          <span v-if="getCodeLoading">({{ getCodeTime }})</span>
        </el-button>
      </div>
    </el-form-item>

    <el-form-item prop="iAgree" class="w-full">
      <i-agree
        v-model="formData.iAgree"
        text="我同意《用户协议》"
        :link="[{ text: '《用户协议》', url: 'https://element-plus.org/' }]"
      />
    </el-form-item>

    <el-form-item class="w-full">
      <el-button
        :loading="loading"
        type="primary"
        class="w-full"
        @click="loginRegister"
      >
        {{ t('login.register') }}
      </el-button>
      <el-button class="w-full mt-4" @click="toLogin">
        {{ t('login.hasUser') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
