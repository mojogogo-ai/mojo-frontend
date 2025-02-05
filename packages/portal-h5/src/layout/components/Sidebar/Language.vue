<template>
  <div>
    <div>
      <logo
          class="flex-none"
          :collapse="false"
      />
    </div>
    <div class="menu-cs-lists">
      <div class="menu-cs-item" @click="changeLanguage('en')">
        English
      </div>
      <div class="menu-cs-item" @click="changeLanguage('zh-CN')">
        中文简体
      </div>
      <div class="menu-cs-item" @click="changeLanguage('zh-TW')">
        中文繁体
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { getIsLogin } from '@/utils/firebase.js';
import useLoginStore from '@/store/modules/login';
import Logo from "@/layout/components/Sidebar/Logo.vue";

const useLogin = useLoginStore();

const isLogin = ref(false);
const setIsLogin = async () => {
  isLogin.value = await getIsLogin();
};
onBeforeMount(() => {
  setIsLogin();
});

const { locale } = useI18n()
const changeLanguage = (value) => {
  localStorage.setItem('lang',value) // 记住选择的语言
};
defineExpose({ setIsLogin });
</script>
<style lang="scss" scoped>
.menu-cs-lists{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  //background: rgba(0, 0, 0, 0.05);
  //backdrop-filter: blur(35px);
  background: var(--h5-bg-color-primary);
  width: 100%;

  .menu-cs-item{
    border-bottom: 1px solid var(--neon-green-20, rgba(224, 255, 49, 0.20));
    width: 100%;
    min-height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.70);
    text-align: center;
    font-feature-settings: 'dlig' on;
    font-family: Inter;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 23px; /* 127.778% */
    cursor: pointer;
    .login-item{
      width: 100%;
    }
    &.explore-item{
      color: var(--Style, #E1FF01);
      text-align: center;
      font-feature-settings: 'dlig' on;
      font-family: Inter;
      font-size: 18px;
      font-style: normal;
      font-weight: 500;
      line-height: 23px; /* 127.778% */
    }
  }
}
.wallet {
  border-bottom: 1px solid var(--neon-green-20, rgba(224, 255, 49, 0.20));
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.70);
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 23px; /* 127.778% */
  cursor: pointer;
  .wallet-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    backdrop-filter: blur(35px);
    background: var(--Style, #E1FF01);
    color: var(--h5-text-color-primary);
    font-size: 16px;
    font-weight: 600;
    margin: 26px 30px;
    min-height: 48px;
    width: 100%;
    text-align: center;
    .wallet-wallet_icon{
      margin-right: 8px;
      font-size: 30px;
    }
  }
}

</style>
