import { createWebHistory, createWebHashHistory, createRouter } from 'vue-router';
import Layout from '@/layout';
import { t } from '@gptx/base/i18n';
const isHash = true;

export const constantRoutes = [
  {
    path: '',
    redirect: '/home',
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404'),
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: 'Home' },
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/personal',
        component: () => import('@/views/personal/index.vue'),
        name: 'personal',
        meta: { title: 'Personal'}
      }
    ]
  },

  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/assistant',
        component: () => import('@/views/assistant/store'),
        name: 'assistant',
        meta: { title: t('menu.ass')}
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/pointsHistory',
        component: () => import('@/views/pointsHistory/index.vue'),
        name: 'pointsHistory',
        meta: { title: 'pointsHistoryList'}
      }
    ]

  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/user',
        component: () => import('@/views/userCenter/index'),
        name: 'user',
        meta: { title: t('menu.d')}
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/tasks',
        component: () => import('@/views/tasks/index.vue'),
        name: 'tasks',
        meta: { title: 'My task list'}
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/refer',
        component: () => import('@/views/refer/index.vue'),
        name: 'refer',
        meta: { title: 'Refer friends'}
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/memebot',
        component: () => import('@/views/memebot/index.vue'),
        name: 'memebot',
        meta: { title: 'Meme Bot'}
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/memebotDetail',
        component: () => import('@/views/memebotDetail/index.vue'),
        name: 'memebotDetail',
        meta: { title: 'Meme Bot'}
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/conversation',
        component: () => import('@/views/conversation/index.vue'),
        name: 'conversation',
        meta: { title: 'Conversation'}
      }
    ]
  },
];
export const asyncRouterMap = []

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
