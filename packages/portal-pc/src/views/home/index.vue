<template>
  <div class="app-page font-[TTNormsPro]">
    <div class="app-page-content">
      <div class="h-[148px]" />
      <div class="homepage-title">{{ t('common.productName') }}</div>
      <div class="homepage-subtitle">
        Mojo Gogo lets everyone unleash autonomous AI agents with a click, granting them a life in cyberspace: soul-bonded tokens, self-managed social media, active community engagement, PayFi-powered on-chain financing, and limitless cultural and financial adventures.
      </div>
      <div class="flex justify-center mt-8 mb-24 home-page-btn">
        <el-button
          v-if="!isLogin"
          class="bg-[#ffffff] text-[#000000] border-[1px] border-[#000000] hover:bg-[#ffffff] hover:text-[#000000] hover:border-[#000000] "
          type="primary"
          @click="toLogin"
        >
          Sign Up
        </el-button>
        <el-button type="primary" @click="toCreate"> Create Bot </el-button>
      </div>
      <div class="flex w-full home-content">
        <div class="flex-1 home-part">
          <div class="home-part-1">
            <div class="home-part1-text">Unleash AI Coin Power</div>
            <div class="home-part1-text-content">
              Mojo GoGo, backed by PayFi, empowers AI with its own meme coins, unlocking endless possibilities. With our support, you can explore new realms of innovation and creativity.
            </div>
            <div class="pt-8 home-part1-btn">
              <el-button type="primary" @click="toCreate"> Create Bot </el-button>
            </div>
          </div>
        </div>
        <div class="home-part">
          <div class="home-part-2">
            <el-image
              class="h-[407px] w-[628px]"
              fit="cover"
              :src="Pic3"
            />
          </div>
        </div>
        <div class="flex home-part">
          <div class="home-part-3">
            <el-image
              class="h-[407px] w-[628px]"
              fit="cover"
              :src="Pic4"
            />
          </div>
        </div>
        <div class="home-part">
          <div class="home-part-4">
            <div class="w-[628px] h-[407px]">
              <div class="px-[48px] pt-10">
                <div class="home-part4-text">Meme Coins Made Easy!</div>
                <div class="home-part-4-text-content">
                  Our AI platform enables you to create and launch your own meme coin quickly and easily. With the assistance of your dedicated AI agent, anyone can turn their idea into reality.
                </div>
                <div class="pt-8 home-part4-btn">
                  <el-button
                    type="primary"
                    class=""
                    @click="toLaunch"
                  >
                    Launch Meme
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 home-part">
          <div class="home-part-1">
            <div class="home-part1-text">Create Your Own AI Bot</div>
            <div class="home-part1-text-content">
              Easily design and deploy AI agents tailored to your needs. Enhance customer service, automate
              routine tasks, and leverage AI-driven insights for smarter decision-making.
            </div>
            <div class="pt-8 home-part4-btn">
              <el-button
                type="primary"
                class=""
                @click="toPage('/assistant')"
              >
                Explore
              </el-button>
            </div>
          </div>
        </div>
        <div class="home-part">
          <div class="home-part-2">
            <el-image
              class="h-[407px] w-[628px]"
              fit="cover"
              :src="Pic2"
            />
          </div>
        </div>
      </div>

      <div class="h-[266px]" />
    </div>
    <upload-knowledge-sources />
  </div>
</template>
<script setup>
import { t } from '@gptx/base/i18n';
import Pic3 from '@/assets/images/homepage/pic3.png';
import Pic2 from '@/assets/images/homepage/pic2.png';
import Pic4 from '@/assets/images/homepage/pic4.png';
import { getIsLogin } from '@gptx/base/utils/auth';
import useLoginStore from '@/store/modules/login';
import useBotStore from '@/store/modules/bot';
import UploadKnowledgeSources from '@/components/uploadKnowledgeSources/index.vue';

const useLogin = useLoginStore();
const useBot = useBotStore();
const router = useRouter();

const isLogin = ref(false);

watch(
  () => useLogin.isLogOut,
  () => {
    isLogin.value = false;
  },
  { immediate: false }
);
watch(
  () => useLogin.loginDialogVisible,
  async () => {
    // console.log('isOpened', val);
    isLogin.value = await getIsLogin();
  },
  {
    immediate: true
  }
);

const toLogin = () => {
  useLogin.setLoginDialogVisible(true, 'signup'); // open login dialog
};

const toCreate = () => {
  if (isLogin.value) {
    useBot.openCreateBotDialog(); //open create bot dialog
  } else {
    useLogin.setLoginDialogVisible(true, 'login'); // open login dialog
  }
};

const toPage = (path) => {
  if (path) {
    router.push({ path });
  }
};

const isPhantomInstalled = window.phantom?.solana?.isPhantom
const toLaunch = async () => {
  if (isLogin.value) {
    if (isPhantomInstalled) {
      router.push({ path: '/memebot' });
    } else {
      installWallet();
    }
  } else {
    useLogin.setLoginDialogVisible(true, 'login'); // open login dialog
  }
};
</script>
<style scoped lang="scss">
.homepage-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  text-align: center;
  color: #E1FF01;
  font-feature-settings: 'dlig' on;
  font-family: "Druk Wide Bold";
  font-size: 80px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -1px;
}
.homepage-subtitle {
  width: 741px;
  margin: 16px auto 0;
  text-align: center;
  font-size: 20px;
  display: flex;
  color: #FFF;
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-family: "TT Norms Pro";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
}
.home-page-btn{
  :deep(.el-button){
    display: flex;
    width: 180px;
    height: 55px;
    padding: 8px 28px;
    justify-content: center;
    align-items: center;
    font-feature-settings: 'dlig' on;
    font-family: "TT Norms Pro";
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 23px; /* 127.778% */
  }
}
.home-content{
  flex-wrap: wrap;
  gap: 24px;
  .home-part{
    width: 628px;
    height: 407px;
    flex-shrink: 0;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    background: rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(16.399999618530273px);
   .home-part-1{
      padding: 40px;
      .home-part1-text{
        display: flex;
        width: 470px;
        height: 92px;
        align-items: center;
        text-align: left;
        flex-shrink: 0;
        color: #FFF;
        font-feature-settings: 'dlig' on;
        font-family: "TT Norms Pro";
        font-size: 40px;
        font-style: normal;
        font-weight: 500;
        line-height: 44.8px; /* 44.8px */
        margin-bottom: 4px;
      }
      .home-part1-text-content{
        color: #FFF;
        width: 518px;
        font-feature-settings: 'dlig' on;
        font-family: "TT Norms Pro";
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 32px; /* 32px */

      }
      .home-part1-btn {
        :deep(.el-button){
          display: flex;
          width: 180px;
          height: 55px;
          padding: 8px 28px;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          border-radius: 12px;
          background: var(--Style, #E1FF01);
          color: #000;
          font-feature-settings: 'dlig' on;
          font-family: "TT Norms Pro";
          font-size: 18px;
          font-style: normal;
          font-weight: 500;
          line-height: 23px; /* 127.778% */
        }
      }
    }
    .home-part-2,.home-part-4, .home-part-3{
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 20px;

    }
    .home-part-4{
      .home-part4-text{
        display: flex;
        width: 480.229px;
        height: 92px;
        //justify-content: center;
        align-items: center;
        flex-shrink: 0;
        color: #FFF;
        font-feature-settings: 'dlig' on;
        font-family: "TT Norms Pro";
        font-size: 40px;
        font-style: normal;
        font-weight: 500;
        line-height: 112%; /* 44.8px */
        margin-bottom: 4px;
      }
      .home-part-4-text-content{
        display: flex;
        width: 462px;
        //height: 100px;
        flex-shrink: 0;
        color: #FFF;
        font-feature-settings: 'dlig' on;
        font-family: "TT Norms Pro";
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 160%; /* 32px */
      }
      .home-part4-btn {
        :deep(.el-button){
          display: flex;
          width: 242.813px;
          height: 55px;
          padding: 8px 28px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          border-radius: 12px;
          background: var(--Style, #E1FF01);
          color: #000;
          font-feature-settings: 'dlig' on;
          font-family: "TT Norms Pro";
          font-size: 18px;
          font-style: normal;
          font-weight: 500;
          line-height: 23px; /* 127.778% */
        }
      }
    }
  }
}
</style>
