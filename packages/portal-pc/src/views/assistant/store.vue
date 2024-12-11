<template>
  <div class="app-page">
    <div class="app-page-top">
      <!-- <div class="text-xl font-black">
        {{ t('menu.ass') }}
      </div> -->
      <!-- <el-row>
        <el-col :span="6">
          <el-input
            v-model="appName"
            prefix-icon="search"
            :placeholder="t('store.placeholder.name')"
            @input="onSearch"
          />
        </el-col>
      </el-row> -->
    </div>
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
              @open-with="onDropDownClick($event, appInfo)"
              @open-dig="onDigClick()"
              @open-new-chat="onOpenNewChat(appInfo)"
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
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { getList } from '@gptx/base/api/assistant-store';
import { ListItem } from './components/store/index.js';
import emptyRobotImageUrl from '@/assets/images/empty-robot.png';

const router = useRouter();
const __data = reactive({
  storeList: []
});
let totalSize = ref(0);
let isLoadMore = true;
let timer = null;
const isLoading = ref(true);
/* ref dom */
const scrollbar = ref(null);

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
const onDropDownClick = (plat, data) => {
  // const { link } = shared_social[plat];
  // window.open(address, '_blank');
  if(plat === 'telegram'){
    let url = data.telegram_address;
    if (url.startsWith('t.me')) {
      url =  'https://' + url
    }
    window.open(url, '_blank');
  }else if(plat === 'discord'){
    window.open(data.discord_address, '_blank');
  }
};
const onDigClick = () => {
  window.open('https://virtual-human.mojogogo.ai/', '_blank');
};
const onOpenNewChat = ({ app_id }) => {
  router.push(`/bot/${app_id}`);
};
const getStoreList = async () => {
  if (!isLoadMore) return;
  try {
    const { code, data } = await getList({
      // search: appName.value,
      // category_id: activeTab.value,
      // page_num: pageNum,
      // page_size: pageSize
    });
    console.log(data,'data888')
    if (code === 200) {
      const {
        list,
        total
      } = data;
      let _list = list || []
      __data.storeList.push(..._list);
      totalSize.value = total;
      if (__data.storeList.length >= total) {
        isLoadMore = false;
      }
    }
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  } catch (error) {
    console.log(error);
  }
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
.app-page-top {
  padding-top: 16px;
  padding-bottom: 16px;
}

.app-page-content {
  overflow: hidden;
  min-height: 500px;
}
</style>
