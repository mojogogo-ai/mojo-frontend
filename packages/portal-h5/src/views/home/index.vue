<template>
  <div class="app-page">
    <page-header />
    <div class="app-page-content">
      <div class="homepage-title">{{ t('common.productName') }}</div>
      <div class="homepage-subtitle">
        Discover the future of business with Mojo GoGo. Our platform allows businesses and individuals to harness the
        power of AI to streamline operations, enhance customer engagement, and protect data privacy - all in one place.
      </div>
      <van-button
        v-if="!isLogin"
        class="mb-4"
        size="large"
        type="primary"
        @click="onOpenLoginDialog"
      >
        Log in
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
          <div class="mb-4 text-lg">Create Your Own AI Bot</div>
          <div class="mb-4 text-sm">
            Easily design and deploy AI agents tailored to your business needs. Enhance customer service, automate
            routine tasks, and leverage AI-driven insights for smarter decision-making.
          </div>
          <van-button
            class="w-4/5"
            type="primary"
            @click="jump('/user')"
          >
            Personal
          </van-button>
        </van-cell>
      </div>
      <div class="page-list">
        <van-image
          class="w-full"
          fit="cover"
          :src="Pic1"
        />
      </div>
      <div class="page-list">
        <van-cell class="page-list__inner">
          <div class="mb-4 text-lg">Next Gen AI Product</div>
          <div class="mb-4 text-sm">
            Easily design and deploy AI agents tailored to your business needs. Enhance customer service, automate
            routine tasks, and leverage AI-driven insights for smarter decision-making.
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
    </div>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import Pic1 from '@/assets/images/homepage/pic1.png';
import Pic2 from '@/assets/images/homepage/pic2.png';
import { getIsLogin } from '@gptx/base/utils/auth';
import useLoginStore from '@/store/modules/login.js';

const route = useRoute();
const router = useRouter();
let isLogin = ref(false);
const useLogin = useLoginStore();
const isOpened = computed(() => useLogin.loginDialogVisible);

const onOpenLoginDialog = () => {
  useLogin.setLoginDialogVisible(true);
};

const jump = (path) => {
  router.push(path);
}

watch(
  isOpened,
  async (val) => {
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
</script>

<style lang="scss" scoped>
.app-page-content {
  padding: 0 16px;

  &::before {
    display: block;
    height: 80px;
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

.homepage-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  text-align: center;
  font-family: 'Druk Wide Bold', monospace;
  font-size: 34px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -1px;
  background: linear-gradient(180deg, var(--h5-text-color-regular) 40.49%, var(--van-blue) 81.44%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.homepage-subtitle {
  margin: 16px auto 32px;
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
</style>
