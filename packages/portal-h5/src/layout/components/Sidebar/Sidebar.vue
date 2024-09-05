<template>
  <div>
    <logo
      class="flex-none"
      :collapse="false"
    />
    <div class="flex-1 overflow-x-hidden overflow-y-auto">
      <div class="sidebar-menu">
        <sidebar-item :item="indexPage" />
      </div>
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
      <user class="flex-none" />
    </div>
  </div>
</template>

<script setup>
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import User from './User';
import { constantRoutes } from '@/router';

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

// const activeMenu = computed(() => {
//   const { meta, path } = route;
//   if (meta.activeMenu) {
//     return meta.activeMenu;
//   }
//   return path;
// });
</script>
