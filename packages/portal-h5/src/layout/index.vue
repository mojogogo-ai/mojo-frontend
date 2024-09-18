<template>
  <div class="app-wrapper">
    <van-popup
      v-model:show="storeLayout.isSHowSidebar"
      position="left"
      class="sidebar-popup"
    >
      <Sidebar
        ref="sidebarRef"
        class="sidebar-container"
      />
    </van-popup>
    <div class="main-container">
      <app-main />
      <!-- login or sign up -->
      <LoginAndSignup
        ref="loginRef"
        @dialog-close="onLoginDialogClose"
        @close="onLoginClose"
        @referral="onOpenReferralCodeDialog"
      />
      <!-- create bot -->
      <CreateBot ref="botRef" />
      <!--  referral code  -->
      <referral-code
        ref="referralCodeRef"
        @confirm="onConfirmUserInvite"
      />
    </div>
  </div>
</template>

<script setup>
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

const onLoginDialogClose = () => {
  useLogin.setLoginDialogVisible(false);
};
const onLoginClose = async () => {
  await useUser.updateSysInfo();
  if (sidebarRef.value) sidebarRef.value.setIsLogin();
  onLoginDialogClose()
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
  width: 300px;
  height: 100%;
}
</style>
