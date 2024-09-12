<template>
  <div>
    <logo
      class="flex-none"
      :collapse="false"
    />
    <div class="flex-1 overflow-y-auto overflow-x-hidden">
      <div class="sidebar-menu">
        <sidebar-item :item="indexPage" />
      </div>
      <!-- <div class="sidebar-menu">
        <sidebar-item :item="personalPage" />
      </div> -->
      <template
        v-for="({ name, list }, i) in sidebarRouters"
        :key="i"
      >
        <div
          v-if="list && list.length > 0"
          class="sidebar-menu"
        >
          <div class="sidebar-menu__group">
            {{ $t(name) }}
          </div>
          <sidebar-item
            v-for="(item, index) in list"
            :key="item.path + index"
            :item="item"
          />
        </div>
      </template>
    </div>
    <div class="sidebar-menu">
      <user
        v-if="isLogin"
        class="flex-none"
      />
      <NoLogin
        v-else
        @login-signup="onCreateClick"
      />
    </div>
  </div>
</template>

<script setup>
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import NoLogin from './NoLogin';
import User from './User';
import { constantRoutes } from '@/router';
import { getIsLogin } from '@gptx/base/utils/auth';

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
  useLogin.openLoginDialog();
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
