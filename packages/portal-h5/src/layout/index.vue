<template>
  <div class="app-wrapper">
    <div class="app-bg"></div>
    <div class="bg-animation">
      <div class="dragon"></div>
      <div class="melting-face"></div>
      <div class="melting-pink-face"></div>
      <div class="ufo"></div>
    </div>
    <van-popup
      v-model:show="storeLayout.isSHowSidebar"
      position="top"
      class="sidebar-popup"
    >
      <Sidebar
        ref="sidebarRef"
        class="sidebar-container"
      />
    </van-popup>
    <van-popup
        v-model:show="storeLayout.isShowLanguage"
        position="top"
        class="sidebar-popup"
    >
      <Language
          ref="sidebarRef"
          class="sidebar-container"
      />
    </van-popup>
    <div class="main-container">
      <app-main />
      <LoginAndSignup
        ref="loginRef"
        @dialog-close="onCloseLoginDialog"
        @close="onLoginClose"
      />
      <CreateBot ref="botRef" />
      <referral-code
        ref="referralCodeRef"
        @confirm="onConfirmUserInvite"
      />
    </div>

  </div>
</template>

<script setup>
import Language from "@/layout/components/Sidebar/Language.vue";
import Sidebar from './components/Sidebar/Sidebar.vue';
import { AppMain } from './components';
import { useLayoutStore } from '@/store/modules/layout';
import useLoginStore from '@/store/modules/login';
import useBotStore from '@/store/modules/bot';
import useUserStore from '@/store/modules/user.js';
import { confirmUserInvite } from '@gptx/base/api/user.js';

const useLogin = useLoginStore();
const useBot = useBotStore();
const useUser = useUserStore();

const storeLayout = useLayoutStore();
const route = useRoute();

const loginRef = ref(null);
const botRef = ref(null);
const referralCodeRef = ref(null);
const sidebarRef = ref(null);

const onCloseLoginDialog = () => {
  useLogin.setLoginDialogVisible(false);
};
const onLoginClose = async () => {
  await useUser.updateSysInfo();
  if (sidebarRef.value) await sidebarRef.value.setIsLogin();
  await useUser.updateSysInfo();
  onCloseLoginDialog()
};
const onOpenReferralCodeDialog = async () => {
  await nextTick();
  referralCodeRef.value.open();
};

const onConfirmUserInvite = async (refer_code) => {
  try {
    referralCodeRef.value.setIsLoading(true);
    const { code } = await confirmUserInvite({ refer_code });
    if (code === 200) {
      referralCodeRef.value.setIsLoading(false);
      referralCodeRef.value.close();
    }
  } catch (e) {
    console.log(e);
    referralCodeRef.value.setIsLoading(false);
  }
};
// 路由变化，关闭侧边栏
watch(
  () => route.path,
  () => {
    storeLayout.setSidebarVisible(false);
  }
);

watch(
  () => useLogin.loginDialogVisible,
  (isOpen) => {
    if (isOpen) loginRef.value.open();
  },
  { immediate: false }
);

watch(
  () => useBot.createBotDialog,
  () => {
    botRef.value.open();
  },
  { immediate: false }
);
</script>

<style lang="scss" scoped>
.px-6 {
  padding: 0 24px;
}
</style>
<style lang="scss">
.sidebar-popup {
  width: 100%;
  height: auto;
}
.copyright {
  width: 100%;
  //position: absolute;
  //bottom: 0;
  text-align: center;
  padding-bottom: 10px;
}
</style>
