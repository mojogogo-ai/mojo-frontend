<template>
  <div class="app-page">
    <page-header class="shrink-0" />
    <div class="font-Inter text-highlight mb-4 mt-16 flex justify-center text-[32px]">Your Task List</div>
    <div class="app-page-content flex flex-col">
      <!--
      <div class="shrink-0">
        <van-tabs
          v-model:active="activeTab"
          background="transparent"
          @click-tab="onTabChange"
        >
          <van-tab
            v-for="{ id, name } in tabList"
            :name="id"
            :title="t(name)"
          />
        </van-tabs>
      </div>
      -->
      <div
        v-if="isLoading"
        class="flex flex-1 items-center justify-center"
      >
        <van-loading
          class="cover-loading"
          size="36px"
          vertical
        >
          {{ t('common.loading') }}
        </van-loading>
      </div>
      <div
        v-else
        class="flex-1 overflow-hidden"
      >
        <div
          v-if="__data.storeList.length"
          ref="scrollbar"
          class="store-scroll"
          @scroll="onScroll"
        >
          <div class="pt-3">
            <list-item
              v-for="appInfo in __data.storeList"
              :app-info="appInfo"
            />
          </div>
        </div>
        <template v-if="!__data.storeList.length">
          <van-empty :image="emptyRobotImageUrl">
            <template #description>
              <div class="text-[16px] font-black">{{ t('bots.not_found') }}</div>
            </template>
          </van-empty>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { getList } from '@gptx/base/api/assistant-store';
import ListItem from './components/ListItem';
import emptyRobotImageUrl from '@/assets/images/empty-robot.png';
import TaskImg01 from '@/assets/images/tasks/01.svg';
import TaskImg02 from '@/assets/images/tasks/02.svg';
import TaskImg03 from '@/assets/images/tasks/03.svg';
import TaskImg04 from '@/assets/images/tasks/04.svg';
import TaskImg05 from '@/assets/images/tasks/05.svg';
import TaskImg06 from '@/assets/images/tasks/06.svg';
import TaskImg07 from '@/assets/images/tasks/07.svg';

const router = useRouter();
const tabList = reactive([]);
const activeTab = ref(10000);
const __data = reactive({
  storeList: []
});
let pageNum = 1;
let pageSize = 36;
let isLoadMore = true;
const appName = ref('');
let timer = null;
const isLoading = ref(true);
/* ref dom */
const scrollbar = ref(null);
const baseInfoRef = ref(null);

const onSearch = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  timer = setTimeout(() => {
    pageNum = 1;
    isLoadMore = true;
    __data.storeList = [];
    isLoading.value = true;
    getStoreList();
  }, 300);
};
const getStoreList = async () => {
  if (!isLoadMore) return;
  __data.storeList.push(
    ...[
      {
        app_name: 'Sign up with Mojo Gogo',
        app_description: 'Sign up/Log in with Apple ID,Gmail,or other email account.',
        app_icon: TaskImg01,
        points: '+ 200 pts'
      },
      /*{
        app_name: 'Create AI Me',
        app_description: 'Sign up/ Log in with Gmail or Telegram and receive 200 points',
        app_icon: TaskImg02,
        points: '+ 100 pts'
      },
      {
        app_name: 'Personalize AI Me Image',
        app_description: 'Sign up/ Log in with Gmail or Telegram and receive 200 points',
        app_icon: TaskImg03,
        points: '+ 20 pts'
      },
      {
        app_name: 'Agent Training',
        app_description: 'Sign up/ Log in with Gmail or Telegram and receive 200 points',
        app_icon: TaskImg04,
        points: '+ 5 pts'
      },
      {
        app_name: 'Interact with ChatBot',
        app_description: 'Sign up/ Log in with Gmail or Telegram and receive 200 points',
        app_icon: TaskImg05,
        points: '+ 5 pts'
      },*/
      {
        app_name: 'Refer Friends',
        app_description: 'Refer friends to use and successfully complete the registration.',
        app_icon: TaskImg06,
        points: '+ 50 pts'
      },
      {
        app_name: 'Daily Login and Check-In',
        app_description: 'Daily login,check-in and interact.',
        app_icon: TaskImg07,
        points: '+ 5 pts'
      }
    ]
  );
  isLoadMore = false;
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};
const onScroll = ({ scrollTop }) => {
  const wrap = scrollbar.value.wrapRef;
  if (wrap.scrollHeight - scrollTop <= wrap.offsetHeight) getStoreList();
};

onMounted(async () => {
  onSearch();
});
</script>

<style lang="scss" scoped>
.app-page-content {
  overflow: hidden;
}

:deep(.page-list) {
  width: 100%;
  max-width: unset;

  .page-list__inner {
    .el-card__body {
      min-height: 152px;
    }
  }

  .page-list-img {
    width: 80px;
    height: 80px;
  }
}

.store-scroll {
  height: 100%;
  overflow: hidden auto;
}
</style>
