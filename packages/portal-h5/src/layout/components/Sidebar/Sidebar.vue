<template>
  <div>
    <div>
      <logo
        class="flex-none"
        :collapse="false"
      />
    </div>
    <div class="menu-cs-lists">
      <div class="menu-cs-item">
        <div v-if="isLogin" class="login-item">
          <user
            class="flex-none"
          />
        </div>
        <div v-else class="w-full user-item">
          <NoLogin
            @login-signup="onCreateClick"
          />
        </div>
      </div>
      <div class="menu-cs-item" @click="goPage(1)">
        Home
      </div>
      <div class="menu-cs-item" @click="goPage(2)">
        My Memes
      </div>
      <div class="menu-cs-item" @click="goPage(3)">
        Explore
      </div>
    </div>
  </div>
</template>

<script setup>
import Logo from './Logo';
import router from '@/router'

import NoLogin from './NoLogin';
import User from './User';
import { getIsLogin } from '@/utils/firebase.js';

import useLoginStore from '@/store/modules/login';

const useLogin = useLoginStore();

const isLogin = ref(false);
const setIsLogin = async () => {
  isLogin.value = await getIsLogin();
};
onBeforeMount(() => {
  setIsLogin();
});


const onCreateClick = () => {
  const useLogin = useLoginStore();
  useLogin.setLoginDialogVisible(true);
};
const goPage = (index) => {
  switch (index) {
    case 1:
      router.push({ path: '/home' });
      break;
    case 2:
      router.push({ path: '/personal' });
      break;
    case 3:
      // router.push({ name: 'Explore' });
      // /assistant
      router.push({ path: '/assistant' });
      break;
    default:
      break;
  }
};
watch(
  () => useLogin.isLogOut,
  () => {
    isLogin.value = false;
  },
  { immediate: false }
);
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
   background: transparent;
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
</style>
