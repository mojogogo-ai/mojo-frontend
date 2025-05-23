import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import Layout from '@/layout';
import { t } from '@gptx/base/i18n';

const isHash = true;

/**
 * Note: vue-router config
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
 title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
 icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
 }
 */

export const constantRoutes = [
  {
    path: '',
    redirect: '/home',
    hidden: true
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'ChatRoot',
        component: () => import('@/views/home/index.vue'),
        meta: { title: 'Home', icon: 'home-chat', affix: true },
      }
    ]
  },
  {
    path: '',
    component: Layout,
    groupName: 'menu.group.c',
    children: [
      {
        path: '/personal',
        component: () => import('@/views/personal/list'),
        name: 'Personal',
        meta: { title: 'Personal', icon: 'bots' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    groupName: 'menu.group.e',
    children: [
      {
        path: '/assistant',
        component: () => import('@/views/assistant/store'),
        name: 'assistant',
        meta: { title: t('menu.ass'), icon: 'app-store' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    groupName: 'menu.group.m',
    hidden: true,
    children: [
      {
        path: '/user',
        component: () => import('@/views/userCenter/index'),
        name: 'user',
        meta: { title: t('menu.d'), icon: 'user' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    groupName: 'menu.group.m',
    hidden: true,
    children: [
      {
        path: '/pointsHistory',
        component: () => import('@/views/pointsHistory/index'),
        name: 'pointsHistory',
        meta: { title: t('menu.d'), icon: 'user' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/tasks',
        component: () => import('@/views/tasks/index'),
        name: 'tasks',
        meta: { title: 'MojoGogo Point', icon: 'user' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/refer',
        component: () => import('@/views/refer/index'),
        name: 'refer',
        meta: { title: 'Refer friends', icon: 'user' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    // groupName: 'memebot', TODO
    children: [
      {
        path: '/memebot',
        component: () => import('@/views/memebot/store'),
        name: 'memebot',
        meta: { title: t('menu.ass'), icon: 'app-store' }
      },
      {
        path: '/memebotDetail',
        component: () => import('@/views/memebotDetail/store'),
        name: 'memebotDetail',
        meta: { title: t('menu.ass'), icon: 'app-store' }
      }
    ]
  },
];

const getRoutes = function () {
  return constantRoutes
}

const router = createRouter({
  history: isHash ? createWebHashHistory() : createWebHistory(),
  routes: getRoutes(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;
