<template>
  <div class="app-page font-[TTNormsPro]">
    <page-header />
    <div class="app-page-content">
      <div class="homepage-title">Mojo GoGo</div>
      <div class="homepage-subtitle">
        "Mojo Gogo lets everyone unleash autonomous AI agents with a click, granting them a life in cyberspace: soul-bonded tokens, self-managed social media, active community engagement, PayFi-powered on-chain financing, and limitless cultural and financial adventures."
      </div>
      <van-button
        v-if="!isLogin"
        class="mb-4 white-btn"
        size="large"
        type="primary"
        @click="onOpenLoginDialog"
      >
        Sign Up
      </van-button>
      <van-button
        class="mb-4"
        size="large"
        type="primary"
        @click="createBot"
      >
        +  Create Bot
      </van-button>



      <!-- <van-button
        class="mb-[80px]"
        type="primary"
        size="large"
      >
        + Create Bot
      </van-button> -->

      <div class="page-list">
        <van-cell class="page-list__inner">
          <div class="mb-4 text-lg">Unleash AI Coin Power</div>
          <div class="mb-4 text-sm">
            Mojo GoGo, backed by PayFi, empowers AI with its own meme coins, unlocking endless possibilities. With our support, you can explore new realms of innovation and creativity.
          </div>
          <van-button
            class="w-4/5"
            type="primary"
            @click="toLaunch"
          >
            Create Bot
          </van-button>
        </van-cell>
      </div>


      <div class="page-list">
        <van-image
          class="w-full"
          fit="cover"
          :src="Pic3"
        />
      </div>

      <div class="page-list">
        <van-cell class="page-list__inner">
          <div class="mb-4 text-lg">Meme Coins Made Easy!</div>
          <div class="mb-4 text-sm">
            Our AI platform enables you to create and launch your own meme coin quickly and easily. With the assistance of your dedicated AI agent, anyone can turn their idea into reality.
          </div>
          <van-button
            class="w-4/5"
            type="primary"
            @click="toLaunch"
          >
            Launch Meme
          </van-button>
        </van-cell>
      </div>

      <div class="page-list">
        <van-image
          class="w-full"
          fit="cover"
          :src="Pic4"
        />
      </div>

      <div class="page-list">
        <van-cell class="page-list__inner">
          <div class="mb-4 text-lg">Create Your Own AI Bot</div>
          <div class="mb-4 text-sm">
            Easily design and deploy AI agents tailored to your needs. Enhance customer service, automate\n   routine tasks, and leverage AI-driven insights for smarter decision-making.
          </div>
          <van-button
            class="w-4/5"
            type="primary"
            @click="jump('/assistant')"
          >
            Explore
          </van-button>
        </van-cell>
      </div>
      <div class="page-list">
        <van-image
          class="w-full"
          fit="cover"
          :src="Pic2"
        />
      </div>
      <div class="page-list copyright">
        Copyright © 2025 Mojo GoGo |Powered by Mojo GoGo
      </div>
    </div>

  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import Pic3 from '@/assets/images/homepage/pic3.png';
import Pic2 from '@/assets/images/homepage/pic2.png';
import Pic4 from '@/assets/images/homepage/pic4.png';
import { getIsLogin } from '@/utils/firebase.js';
import useLoginStore from '@/store/modules/login.js';
import { eventBus } from '@gptx/base/utils/eventBus.js';
import router from '@/router'
import { useRoute } from 'vue-router';

let isLogin = ref(false);
const useLogin = useLoginStore();
const isOpened = computed(() => useLogin.loginDialogVisible);
const route = useRoute();
const onOpenLoginDialog = () => {
  useLogin.setLoginDialogVisible(true, 'signup');
};

const createBot = () => {
  router.push({ path: '/memebot' });
  // let isLogin = getIsLogin();
  //  if(isLogin) {
  //    eventBus.emit('createBot');
  //  } else {
  //     useLogin.setLoginDialogVisible(true, 'login');
  //   }
};

const jump = (path) => {
  router.push(path);
}

watch(
  isOpened,
  async () => {
    isLogin.value = await getIsLogin();
  },
  {
    immediate: true
  }
);

onBeforeMount(async () => {
  const { query } = route;
  if (query && query.referral_code) window.sessionStorage.setItem('referral_code', query.referral_code);
});

const toLaunch = async () => {
  router.push({ path: '/memebot' });
};

watch(
  () => useLogin.isLogOut,
  () => {
    isLogin.value = false;
  },
  { immediate: false }
);
</script>

<style lang="scss" scoped>
.app-page-content {
  padding: 0 48px;

  &::before {
    display: block;
    height: 157.5px;
    content: '';
  }

  &::after {
    display: block;
    height: 180px;
    content: '';
  }
}

.page-list {
  padding: 0;

  &__inner {
    padding: 32px 24px;
    border-radius: 20px;
  }
}
.white-btn{
  --van-button-primary-background: #ffffff;
  --van-button-primary-border-color: #ffffff;
}
.part-home-1{
  display: flex;
  height: 292px;
  padding: 32px 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(16.399999618530273px);
}
.part-home-1-title{
  color: #FFF;
  font-feature-settings: 'dlig' on;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  //line-height: 112%; /* 26.88px */
  margin-bottom: 24px;
}
.part-home-1-content{
  color: #FFF;
  font-feature-settings: 'dlig' on;
  font-family: "TT Norms Pro";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  //line-height: 140%; /* 19.6px */
}
.homepage-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  text-align: center;
  //font-family: 'Druk Wide Bold', monospace;
  font-size: 34px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -1px;
  color: var(--Style, #E1FF01);
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-family: "Druk Wide Bold";
  font-size: 34px;
  font-style: normal;
  font-weight: 700;
  //line-height: 23px; /* 67.647% */
  letter-spacing: -1px;
  margin-bottom: 24px;
}

.homepage-subtitle {
  margin-bottom: 56px;
  text-align: center;
  font-size: 14px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-\[80px\] {
  margin-bottom: 80px;
}

.w-4\/5 {
  width: 80%;
}
:deep(.van-button) {
  color: #000;
  font-feature-settings: 'dlig' on;
  font-family: "TT Norms Pro";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  //line-height: 23px; /* 143.75% */
}
</style>
