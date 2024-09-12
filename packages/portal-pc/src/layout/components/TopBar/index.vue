<template>
  <el-header class="flex h-[80px] justify-center">
    <div class="flex w-full min-w-[800px] max-w-[1280px] items-center justify-between">
      <div class="flex items-center">
        <logo class="mr-10 flex-none" />
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          :ellipsis="false"
          :router="true"
          @select="handleSelect"
        >
          <el-menu-item
            style="margin-right: 8px"
            index="/home"
          >
            Home
          </el-menu-item>
          <!-- <el-menu-item style="margin-right:8px;" index="/personal">Personal</el-menu-item> -->
          <el-sub-menu
            index=""
            :popper-offset="15"
            popper-class="customs-sub-menu"
          >
            <template #title>Explore</template>
            <el-menu-item
              style="min-width: 240px"
              index="/assistant"
            >
              <div class="flex">
                <div class="mr-2 flex h-9 w-9 items-center justify-center rounded-full bg-black">
                  <svg-icon
                    style="color: rgba(225, 255, 1, 1); font-size: 24px"
                    name="bot-store"
                  />
                </div>
                <div class="flex flex-col">
                  <div class="mb-3 font-['Inter'] text-xl font-bold text-black">{{ $t('menu.ass') }}</div>
                  <span class="text-sm font-medium text-black">Offer daily clothing inspirations for you every day.</span>
                </div>
              </div>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>

      <div class="flex items-center">
        <!-- <el-button
          style="margin-right: 10px;"
          type="primary"
          round
          @click="onCreateClick()"
        >
          + Create Bot
        </el-button> -->
        <user
          v-if="isLogin"
          class="flex-none"
        />
        <NoLogin
          v-else
          @login="onCreateClick"
        />
      </div>
    </div>
  </el-header>

  <!-- login or sign up -->
  <LoginAndSignup
    ref="loginRef"
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
</template>

<script setup>
import Logo from './Logo';
import User from './User';
import NoLogin from './NoLogin';
import { getIsLogin } from '@gptx/base/utils/auth';
import useLoginStore from '@/store/modules/login';
import useBotStore from '@/store/modules/bot';
import useUserStore from '@/store/modules/user.js';
import { confirmUserInvite } from '@gptx/base/api/user.js';

const route = useRoute();

const useLogin = useLoginStore();

const useBot = useBotStore();

const useUser = useUserStore();

const loginRef = ref(null);
const botRef = ref(null);
const isLogin = ref(false);
const referralCodeRef = ref(null);

const activeIndex = ref('/home');
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath);
};
onBeforeMount(async () => {
  await useUserStore().updateSysInfo();
  isLogin.value = await getIsLogin();
});
const onLoginClose = async () => {
  await useUser.updateSysInfo();
  isLogin.value = await getIsLogin();
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

const onCreateClick = () => {
  if (isLogin.value) {
    botRef.value.open();
  } else {
    // to  login
    loginRef.value.open();
  }
};

watch(
  () => route.path,
  (newPath, oldPath) => {
    let routeList = ['/home', '/assistant', '/personal'];
    console.log(newPath, oldPath, 'oldPath');
    if (routeList.indexOf(newPath) === -1) {
      activeIndex.value = '';
    } else {
      activeIndex.value = newPath;
    }
  },
  { immediate: true }
);

watch(
  () => useLogin.loginDialog,
  () => {
    loginRef.value.open();
  },
  { immediate: false }
);

watch(
  () => useLogin.isLogOut,
  () => {
    isLogin.value = false;
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

<style lang="scss">
.customs-sub-menu {
  border-radius: 20px;
  padding: 15px;

  &:hover {
    background-color: transparent !important;
  }

  .el-menu {
    box-shadow: none !important;
  }

  .el-menu-item {
    height: 70px !important;
    line-height: unset !important;
  }
}

.el-popper .el-menu--horizontal .el-menu .el-menu-item:not(.is-disabled):focus,
.el-popper .el-menu--horizontal .el-menu .el-menu-item:not(.is-disabled):hover {
  background-color: transparent !important;
  opacity: 0.75;
}
</style>
