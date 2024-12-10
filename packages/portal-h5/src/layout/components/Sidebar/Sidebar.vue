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
        <div v-else class="user-item w-full">
          <NoLogin
            @login-signup="onCreateClick"
          />
        </div>
      </div>
      <div class="menu-cs-item" @click="goPage(1)">
        Home
      </div>
      <div class="menu-cs-item" @click="goPage(2)">
        Personal
      </div>
      <div class="menu-cs-item explore-item" @click="goPage(3)">
        Explore
      </div>
    </div>


    <!--    <div class="flex-1 overflow-y-auto overflow-x-hidden">-->
    <!--      <div class="sidebar-menu">-->
    <!--        <sidebar-item :item="indexPage" />-->
    <!--      </div>-->
    <!--      &lt;!&ndash; <div class="sidebar-menu">-->
    <!--        <sidebar-item :item="personalPage" />-->
    <!--      </div> &ndash;&gt;-->
    <!--      <template-->
    <!--        v-for="({ name, list }, i) in sidebarRouters"-->
    <!--        :key="i"-->
    <!--      >-->
    <!--        <div-->
    <!--          v-if="list && list.length > 0"-->
    <!--          class="sidebar-menu"-->
    <!--        >-->
    <!--          <div class="sidebar-menu__group">-->
    <!--            {{ $t(name) }}-->
    <!--          </div>-->
    <!--          <sidebar-item-->
    <!--            v-for="(item, index) in list"-->
    <!--            :key="item.path + index"-->
    <!--            :item="item"-->
    <!--          />-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </div>-->
    <!--    <div class="sidebar-menu">-->
    <!--      <user-->
    <!--        v-if="isLogin"-->
    <!--        class="flex-none"-->
    <!--      />-->
    <!--      <NoLogin-->
    <!--        v-else-->
    <!--        @login-signup="onCreateClick"-->
    <!--      />-->
    <!--    </div>-->
  </div>
</template>

<script setup>
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import router from '@/router'

import NoLogin from './NoLogin';
import User from './User';
import { constantRoutes } from '@/router';
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

// 左边侧边栏菜单
const sidebarRouters = computed(() => {
  let routeGroup = [
    // {
    //   name: 'menu.group.c',
    //   list: []
    // },
    {
      name: 'menu.group.e',
      list: []
    },
    {
      name: 'menu.group.m',
      list: []
    }
  ];
  constantRoutes.forEach((item) => {
    if (!item.hidden) {
      const i = routeGroup.findIndex((o) => o.name === item.groupName);
      if (i > -1) {
        routeGroup[i]['list'].push(item);
      }
    }
  });
  return routeGroup;
});
/* 首页路由 */
const indexPage = computed(() => {
  return constantRoutes.find((item) => {
    if (!item.hidden) {
      return item?.children[0]?.name === 'ChatRoot';
    }
  });
});

// personalPage
const personalPage = computed(() => {
  return constantRoutes.find((item) => {
    if (!item.hidden) {
      return item?.children[0]?.name === 'Personal';
    }
  });
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