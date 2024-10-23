<template>
  <el-header class="flex h-[80px] justify-center">
    <div class="flex w-full min-w-[800px] max-w-[1280px] items-center ">
      <div class="flex items-center">
        <Logo class="mr-10 flex-none" />
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          :ellipsis="false"
          :router="true"
          class="font-[TTNormsPro]"
          @select="handleSelect"
        >
          <el-menu-item
            style="margin-right: 8px"
            index="/home"
          >
            Home
          </el-menu-item>
          <el-menu-item
            style="margin-right: 8px"
            index="/personal"
          >
            Personal
          </el-menu-item>
          <el-sub-menu
            index="/assistant-group"
            :popper-offset="15"
            popper-class="customs-sub-menu"
          >
            <template #title>
              Explore
            </template>
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
      <div class="create-bot-button">
        <!--        create bot button-->
        <el-button round class="font-[TTNormsPro]">
          + Create Bot
        </el-button>
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
        <User v-if="isLogin" class="flex-none" />
        <NoLogin v-else @login="onCreateClick" />
      </div>
    </div>
  </el-header>

  <!-- login or sign up -->
  <LoginAndSignup
    ref="loginRef"
    @dialog-close="onCloseLoginDialog"
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
import { useRoute } from 'vue-router';
import { ArrowRight, WarningFilled } from '@element-plus/icons-vue';

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
  await useUser.updateSysInfo();
  isLogin.value = await getIsLogin();
  const { query } = route;
  if (query && query.referral_code) window.sessionStorage.setItem('referral_code', query.referral_code);
});

const onCloseLoginDialog = () => {
  useLogin.setLoginDialogVisible(false);
};

const onLoginClose = async () => {
  await useUser.updateSysInfo();
  isLogin.value = await getIsLogin();
  onCloseLoginDialog();
};

const onOpenReferralCodeDialog = async () => {
  await nextTick();
  if (referralCodeRef.value) referralCodeRef.value.open();
};

const onConfirmUserInvite = async (refer_code) => {
  try {
    if (referralCodeRef.value) {
      referralCodeRef.value.setIsLoading(true);
      const { code } = await confirmUserInvite({ refer_code });
      if (code === 200) {
        referralCodeRef.value.setIsLoading(false);
        referralCodeRef.value.close();
      }
    }
  } catch (e) {
    console.log(e);
    if (referralCodeRef.value) referralCodeRef.value.setIsLoading(false);
  }
};

const onCreateClick = () => {
  if (isLogin.value && botRef.value) {
    botRef.value.open();
  } else {
    useLogin.setLoginDialogVisible(true);
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
  () => useLogin.loginDialogVisible,
  (open) => {
    if (open && loginRef.value) loginRef.value.open();
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
    if (botRef.value) botRef.value.open();
  },
  { immediate: false }
);
</script>


<style lang="scss" scoped>
 :deep(.el-menu.el-menu--horizontal){
   height: 47px;
 }

 :deep(.el-sub-menu__icon-arrow) {
   display: block;
   width: 12px;
   height: 12px;

   svg {
     visibility: hidden; /* 隐藏 SVG，但保留布局 */
   }

   &::before {
     content: ""; /* 伪元素不需要内容 */
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%); /* 水平垂直居中并旋转 */

     /* CSS 三角形 */
     width: 0;
     height: 0;
     border-left: 6px solid transparent; /* 左边透明 */
     border-right: 6px solid transparent; /* 右边透明 */
     border-top: 6px solid rgba(255, 255, 255, 0.70); /* 上边绘制蓝色三角形 */
   }
 }




.create-bot-button{
  padding: 0 20px;
  .el-button{
    display: flex;
    padding: 12px 51px;
    justify-content: center;
    align-items: center;
    border-radius: 43px;
    background: var(--Style, #E1FF01);
    color: #000;
    font-feature-settings: 'dlig' on;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 23px; /* 127.778% */
  }
}
:deep(.el-menu-item) {
  padding: 0 35px;
  color: rgba(255, 255, 255, 0.70);
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 23px; /* 127.778% */
  &.is-active {
    background: #000000!important;
  }
}
:deep(.el-sub-menu__title.el-tooltip__trigger.el-tooltip__trigger){
  border-bottom-width: 0;
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  padding-left: 39.5px;
  padding-right: 50.5px;
  line-height: 23px; /* 127.778% */
  .el-icon.el-sub-menu__icon-arrow{
    right: 23.5px;
    bottom: 11.5px;
  }
}
.customs-sub-menu {
  border-radius: 20px;
  padding: 10px 0;


  &.el-menu--horizontal {
    .el-menu {
      box-shadow: none !important;
    }

    .el-menu-item {
      min-height: 70px;
      height: auto !important;
      padding: 15px;
      line-height: unset !important;
    }
  }
}

.el-popper .el-menu--horizontal .el-menu .el-menu-item:not(.is-disabled):focus,
.el-popper .el-menu--horizontal .el-menu .el-menu-item:not(.is-disabled):hover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
