<template>
  <div class="app-page">
    <div class="font-Inter mb-5 mt-10 flex justify-center text-[32px] text-[#E1FF01]">Your Task List</div>
    <div class="app-page-content flex flex-col">
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
              @open-with="onDropDownClick($event, appInfo)"
              @open-new-chat="onOpenNewChat(appInfo)"
              @duplicate="onDuplicate(appInfo)"
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
    <bot-base-info
      ref="baseInfoRef"
      @after-create="onAfterCreate"
    />
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { getList, getListCategory } from '@gptx/base/api/assistant-store';
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
const onDropDownClick = (plat, { shared_social }) => {
  const { link } = shared_social[plat];
  window.open(link, '_blank');
};
const onOpenNewChat = ({ app_id }) => {
  router.push(`/bot/${app_id}`);
};
const getStoreList = async () => {
  if (!isLoadMore) return;
  /*try {
    const { code, data } = await getList({
      search: appName.value,
      category_id: activeTab.value,
      page_num: pageNum,
      page_size: pageSize
    });
    if (code === 200) {
      const {
        list,
        page: { total }
      } = data;
      __data.storeList.push(...list);
      pageNum++;
      if (__data.storeList.length >= total) {
        isLoadMore = false;
      }
    }
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  } catch (error) {
    console.log(error);
  }*/
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
const _getListCategory = async () => {
  try {
    const {
      code,
      data: { list }
    } = await getListCategory();
    if (code === 200) {
      tabList.push(...list);
      activeTab.value = list[0].id;
    }
  } catch (error) {
    console.log(error);
  }
};
const onScroll = ({ scrollTop }) => {
  const wrap = scrollbar.value.wrapRef;
  if (wrap.scrollHeight - scrollTop <= wrap.offsetHeight) getStoreList();
};
// duplicate assistant
const onDuplicate = (appInfo) => {
  baseInfoRef.value.open({
    from_id: appInfo.app_id,
    name: `${appInfo.app_name}${t('bots.backup')}`,
    icon: appInfo.app_icon,
    description: appInfo.app_description
    // category_id: appInfo.app_categories.map((_) => _.id)
  });
};
const onAfterCreate = async (data) => {
  if (data && data.app_id) router.push(`/design/${data.app_id}`);
};

onMounted(async () => {
  await _getListCategory();
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
