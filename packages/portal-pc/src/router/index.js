import { createWebHistory, createWebHashHistory, createRouter } from 'vue-router';
import Layout from '@/layout';
import { t } from '@gptx/base/i18n';
const isHash = true;

/**
 * Note: vue-router config
 *
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
  }
 */

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
        path: '/application',
        component: () => import('@/views/application/list'),
        name: 'Application',
        meta: { title: t('menu.c') }
      }
    ]
  },
  {
    path: '',
    name: 'ApplicationDetail',
    meta: { title: t('menu.c') },
    children: [
      {
        path: '/design/:id?',
        name: 'Design',
        component: () => import('@/views/application/design'),
        meta: { title: t('menu.c'), tab: 'a' }
      },
      {
        path: '/analyze/:id?',
        name: 'Analyze',
        component: () => import('@/views/application/analyze'),
        meta: { title: t('menu.c'), tab: 'b' }
      }
    ]
  },
  {
    path: '',
    name: 'ApplicationPublish',
    children: [
      {
        path: '/publish/:id?',
        name: 'Publish',
        component: () => import('@/views/application/publish'),
        meta: { title: t('menu.c') }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/base',
        component: () => import('@/views/base/list'),
        name: 'BaseList',
        meta: { title: t('menu.b')}
      },
      {
        path: '/base_detail/:id?',
        component: () => import('@/views/base/detail'),
        name: 'BaseDetail',
        meta: { title: t('menu.b')}
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
        path: '/personal',
        component: () => import('@/views/personal/index.vue'),
        name: 'personal',
        meta: { title: 'Personal'}
      }
    ]
  },
  {
    path: '/bot/:id?',
    name: 'BotChat',
    component: () => import('@/views/assistant/chat'),
    meta: { title: t('menu.ass')}
  },
  {
    path: '/bot-shared/:id?',
    name: 'BotShared',
    component: () => import('@/views/assistant/share'),
    meta: { title: t('menu.ass')}
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
  }
  ,
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
  }
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
