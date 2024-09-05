import { createWebHistory, createWebHashHistory, createRouter } from 'vue-router';
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
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
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
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: t('common.productName'), icon: 'home-chat', affix: true },
      }
    ]
  },
  {
    path: '',
    component: Layout,
    groupName: 'menu.group.c',
    children: [
      {
        path: '/application',
        component: () => import('@/views/application/list'),
        name: 'Application',
        meta: { title: t('menu.c'), icon: 'bots' }
      }
    ]
  },
  {
    path: '',
    // component: () => import('@/views/application/layout'),
    name: 'ApplicationDetail',
    hidden: true,
    meta: { title: t('menu.c'), icon: 'bots' },
    children: [
      {
        path: '/design/:id?',
        name: 'Design',
        component: () => import('@/views/application/design'),
        meta: { title: t('menu.c'), icon: 'bots', tab: 'a' }
      },
      {
        path: '/analyze/:id?',
        name: 'Analyze',
        component: () => import('@/views/application/analyze'),
        meta: { title: t('menu.c'), icon: 'bots', tab: 'b' }
      }
    ]
  },
  {
    path: '',
    name: 'ApplicationPublish',
    hidden: true,
    children: [
      {
        path: '/publish/:id?',
        name: 'Publish',
        component: () => import('@/views/application/publish'),
        meta: { title: t('menu.c'), icon: 'bots' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    groupName: 'menu.group.c',
    children: [
      {
        path: '/base',
        component: () => import('@/views/base/list'),
        name: 'BaseList',
        meta: { title: t('menu.b'), icon: 'knowledge' }
      },
      {
        path: '/base_detail/:id?',
        component: () => import('@/views/base/detail'),
        name: 'BaseDetail',
        meta: { title: t('menu.b'), icon: 'knowledge' }
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
    path: '/bot/:id?',
    name: 'BotChat',
    component: () => import('@/views/assistant/chat'),
    hidden: true,
    meta: { title: t('menu.ass'), icon: 'app-store' }
  },
  {
    path: '/bot-shared/:id?',
    name: 'BotShared',
    component: () => import('@/views/assistant/share'),
    hidden: true,
    meta: { title: t('menu.ass'), icon: 'app-store' }
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
    groupName: 'menu.group.e',
    children: [
      {
        path: '/tasks',
        component: () => import('@/views/tasks/index.vue'),
        name: 'tasks',
        meta: { title: 'My task list', icon: 'app-store' }
      }
    ]
  }
  ,
  {
    path: '',
    component: Layout,
    groupName: 'menu.group.e',
    children: [
      {
        path: '/refer',
        component: () => import('@/views/refer/index.vue'),
        name: 'refer',
        meta: { title: 'Refer friends', icon: 'app-store' }
      }
    ]
  }
];

const getRoutes = function () {
  return window.SITE_TYPE && window.SITE_TYPE === '2' ? constantRoutes.filter(i=> i.path!=='/register') : constantRoutes
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
