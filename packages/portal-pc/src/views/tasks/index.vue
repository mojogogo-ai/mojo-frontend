<template>
  <div class="app-page">
    <div class="font-Inter mb-5 mt-10 flex justify-center text-[32px] text-[#E1FF01]">Your Task List</div>
    <div class="flex flex-col app-page-content">
      <div
        v-loading="isLoading"
        element-loading-background="transparent"
        :element-loading-text="t('common.loading')"
        class="flex-1 overflow-hidden"
      >
        <el-scrollbar
          v-if="__data.storeList.length && !isLoading"
          ref="scrollbar"
          class="h-full"
          @scroll="onScroll"
        >
          <div class="pt-3">
            <list-item
              v-for="appInfo in __data.storeList"
              :app-info="appInfo"
              @click="onTaskClick(appInfo)"
            />
          </div>
        </el-scrollbar>
        <template v-if="!__data.storeList.length && !isLoading">
          <el-empty :image="emptyRobotImageUrl">
            <template #description>
              <div class="text-[16px] font-black">{{ t('bots.not_found') }}</div>
            </template>
          </el-empty>
        </template>
      </div>
    </div>
  </div>
  <CheckIn
    ref="checkInRef"
    width="800px"
  />
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import ListItem from './components/ListItem';
import emptyRobotImageUrl from '@/assets/images/empty-robot.png';
import TaskImg01 from '@/assets/images/tasks/01.svg';
import TaskImg02 from '@/assets/images/tasks/02.svg';
import TaskImg03 from '@/assets/images/tasks/03.svg';
import TaskImg04 from '@/assets/images/tasks/04.svg';
import TaskImg05 from '@/assets/images/tasks/05.svg';
import TaskImg06 from '@/assets/images/tasks/06.svg';
import TaskImg07 from '@/assets/images/tasks/07.svg';
import CheckIn from '@/views/tasks/components/Check-In.vue';

const __data = reactive({
  storeList: []
});
let isLoadMore = true;
let timer = null;
const isLoading = ref(true);
/* ref dom */
const scrollbar = ref(null);
const checkInRef = ref(null);
const onSearch = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  timer = setTimeout(() => {
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
      {
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
        app_name: 'Daily Check-In',
        app_description: 'Daily login,check-in and interact.',
        app_icon: TaskImg07,
        points: '+ 5 pts',
        id: 7
      },
      // {
      //   app_name: 'Agent Training',
      //   app_description: 'Sign up/ Log in with Gmail or Telegram and receive 200 points',
      //   app_icon: TaskImg04,
      //   points: '+ 5 pts'
      // },
      {
        app_name: 'Interact with ChatBot',
        app_description: 'Sign up/ Log in with Gmail or Telegram and receive 200 points',
        app_icon: TaskImg05,
        points: '+ 5 pts'
      },
      {
        app_name: 'Refer Friends',
        app_description: 'Refer friends to use and successfully complete the registration.',
        app_icon: TaskImg06,
        points: '+ 50 pts'
      }
    ]
  );
  isLoadMore = false;
  setTimeout(() => {
    isLoading.value = false;
  }, 30);
};
const onScroll = ({ scrollTop }) => {
  const wrap = scrollbar.value.wrapRef;
  if (wrap.scrollHeight - scrollTop <= wrap.offsetHeight) getStoreList();
};

const onTaskClick = (appInfo) => {
  console.log('appInfo', appInfo);
  if(appInfo.id === 7) {
    // router.push({ name: 'daily-check-in' });
    checkInRef.value.open();

  }
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
  width: 50%;
  max-width: unset;
  cursor: pointer;
  .page-list__inner {
    .el-card__body {
      min-height: 152px;
    }
  }

  .page-list-img {
    width: 120px;
    height: 120px;
  }
}
</style>
