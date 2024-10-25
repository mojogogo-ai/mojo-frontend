<script setup lang="tsx">
import { ref, reactive, defineEmits } from 'vue'
import { t } from '@gptx/base/i18n'
import { useValidator } from '@/hooks/web/useValidator'
import { ElInput, ElForm, ElFormItem } from 'element-plus'
import { IAgree } from '@/components/IAgree'
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
  username: [required()],
  password: [required()],
  check_password: [required()],
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

const loginRegister = async () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        // Handle registration logic here
        // For now, just redirect to login
        toLogin()
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
        :placeholder="t('login.passwordPlaceholder')"
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
