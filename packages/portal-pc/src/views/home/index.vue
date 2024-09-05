<template>
  <div class="app-page">
    <div class="app-page-content">
      <div class="h-[148px]" />
      <div class="homepage-title">{{ t('common.productName') }}</div>
      <div class="homepage-subtitle">
        Discover the future of business with Mojo GoGo. Our platform allows businesses and individuals to harness the
        power of AI to streamline operations, enhance customer engagement, and protect data privacy - all in one place.
      </div>
      <div class="flex justify-center mt-8 mb-24">
        <el-button v-if="!isLogin" type="info" @click="toLogin"> Sign Up </el-button>
        <el-button type="primary" @click="toCreate"> + Create Bot </el-button>
      </div>
      <div class="flex w-full">
        <div class="mr-[24px] flex-1">
          <el-card class="w-[480px]">
            <div class="px-[14px] pb-[18px] pt-5">
              <div class="w-[306px] text-[40px]">Create Your Own AI Bot</div>
              <div class="pr-[20px] pt-4 text-[18px]">
                Easily design and deploy AI agents tailored to your business needs. Enhance customer service, automate
                routine tasks, and leverage AI-driven insights for smarter decision-making.
              </div>
              <div class="pt-8">
                <el-button type="primary" @click="toPage('')"> Personal </el-button>
              </div>
            </div>
          </el-card>
        </div>
        <div class="shrink-0">
          <el-image
            class="h-[407px] w-[776px]"
            fit="contain"
            :src="Pic1"
          />
        </div>
      </div>
      <div class="flex w-full mt-4">
        <div class="shrink-0">
          <el-image
            class="h-[515px] w-[776px]"
            fit="contain"
            :src="Pic2"
          />
        </div>
        <div class="ml-[24px] flex-1">
          <el-card class="w-[480px]">
            <div class="px-[14px] pb-[18px] pt-5">
              <div class="w-[306px] text-[40px]">Next Gen AI Product</div>
              <div class="pr-[20px] pt-4 text-[18px]">
                Easily design and deploy AI agents tailored to your business needs. Enhance customer service, automate
                routine tasks, and leverage AI-driven insights for smarter decision-making.
              </div>
              <div class="pt-8">
                <el-button type="primary" @click="toPage('/assistant')"> Explore </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <div class="h-[266px]" />
    </div>
  </div>
</template>
<script setup>
import { t } from '@gptx/base/i18n';
import Pic1 from '@/assets/images/homepage/pic1.png';
import Pic2 from '@/assets/images/homepage/pic2.png';

import { getIsLogin } from '@gptx/base/utils/auth'
import useLoginStore from '@/store/modules/login'
const useLogin = useLoginStore();

import useBotStore from '@/store/modules/bot'
const useBot = useBotStore();

const router = useRouter();

const isLogin = ref(false);
onBeforeMount(async () => {
    isLogin.value = await getIsLogin()
});

watch(() => useLogin.isLogOut,() => { 
  isLogin.value = false
},{ immediate: false });


const toLogin = ()=>{
  useLogin.openLoginDialog() // open login dialog
}

const toCreate = ()=>{
  if (isLogin.value) {
    useBot.openCreateBotDialog() //open create bot dialog
  } else {
    useLogin.openLoginDialog() // open login dialog
  }
}


const toPage = (path)=>{
  if (path) {
    router.push({ path });
  }
}
</script>
<style scoped lang="scss">
.homepage-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  text-align: center;
  font-family: 'Druk Wide Bold', monospace;
  font-size: 80px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -1px;
  background: linear-gradient(180deg, var(--el-text-color-regular) 40.49%, var(--el-color-primary) 81.44%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.homepage-subtitle {
  width: 742px;
  margin: 16px auto 0;
  text-align: center;
  font-size: 20px;
}
</style>
