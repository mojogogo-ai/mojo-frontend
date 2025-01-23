<script setup>
import { t } from '@gptx/base/i18n'
import { ElMessage } from 'element-plus'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { auth } from "@/utils/firebase.js" // Assuming Firebase is initialized in this file
import { handleFirebaseError } from '@/utils/firebase.js'
import { validatorEmail, validatorPassword } from '@gptx/base/utils/validator'
import {bindEmailRefer} from '@gptx/base/api/user'
import { useRoute } from 'vue-router'

const emit = defineEmits(['to-login'])

const formRef = ref()
const formData = reactive({
  username: '',
  password: '',
  referral_code: '' // Optional invitation code field
})

const loading = ref(false)

// Validation rules
const rules = reactive({
  username: [{ validator: validatorEmail, trigger: 'blur' }],
  password: [{ validator: validatorPassword, trigger: 'blur' }],
  referral_code: [] // Optional, no validation required
})

const toLogin = () => {
  emit('to-login')
}

// Firebase Registration
const loginRegister = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if(formData.referral_code) {
          // console.log('Referral code:', formData.referral_code)
          try {
            await bindEmailRefer({
              email: formData.username,
              refer_code: formData.referral_code
            })
            // Firebase email/password registration
            const userCredential = await createUserWithEmailAndPassword(auth, formData.username, formData.password)
            // Send verification email
            await sendEmailVerification(userCredential.user)
            ElMessage.success(t('login.checkEmailVerification'))

            // Optionally store user info and referral code
            const userInfo = {
              email: userCredential.user.email,
              uid: userCredential.user.uid,
              referralCode: formData.referral_code || null // Referral code can be empty
            }
            console.log('User registered:', userInfo)
            window.sessionStorage.setItem('referral_code', formData.referral_code)
            // Redirect to login or handle post-registration
            toLogin()
          } catch (error) {
            handleFirebaseError(error)
          }
        }

      } catch (error) {
        console.error('Failed to bind referral code:', error)
        ElMessage.error(t('login.invalidReferralCode'))
        
      } finally {
        loading.value = false
      }
    }
  })
}

onBeforeMount(async () => {
  const route = useRoute();
  const { query } = route;
  if (query && query.referral_code) {
    formData.referral_code = query.referral_code;
  }
});
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
    <el-form-item prop="username" class="w-full">
      <el-input
        v-model="formData.username"
        :placeholder="t('login.usernamePlaceholder')"
        autocomplete="email"
      />
    </el-form-item>

    <el-form-item prop="password" class="w-full">
      <el-input
        v-model="formData.password"
        :placeholder="t('login.passwordPlaceholder')"
        show-password
      />
    </el-form-item>

    <el-form-item prop="referral_code" class="w-full">
      <el-input
        v-model="formData.referral_code"
        :placeholder="t('login.invitationCodePlaceholder')"
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
      <el-button
        link
        class="font-Inter text-[15px] text-left underline w-full  mt-4 link-button"
        @click="toLogin"
      >
        {{ t('login.hasUser') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>


<style lang="scss" scoped>
:deep(.el-button.is-link) {
  --el-button-size: 60px;
  //width: 60px;
  background-color: transparent;
  color: #000000;
  &:disabled {
    background-color: rgba(0, 0, 0, 0.3);
    color: var(--el-text-color-secondary);
  }
}
</style>
