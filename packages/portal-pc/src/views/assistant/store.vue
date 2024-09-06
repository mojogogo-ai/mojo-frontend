<template>
  <div class="app-page">
    <div class="app-page-top">
      <!-- <div class="text-xl font-black">
        {{ t('menu.ass') }}
      </div> -->
      <el-row>
        <el-col :span="6">
          <el-input
            v-model="appName"
            prefix-icon="search"
            :placeholder="t('store.placeholder.name')"
            @input="onSearch"
          />
        </el-col>
      </el-row>
    </div>
    <div class="app-page-content flex flex-col">
      <div class="shrink-0">
        <el-segmented
          v-model="activeTab"
          :options="tabList.map((_) => ({ value: _.id, label: _.name }))"
          @change="onTabChange"
        >
          <template #default="{ item: { label } }">
            {{ t(label) }}
          </template>
        </el-segmented>
      </div>
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
import { ListItem } from './components/store/index.js';
import emptyRobotImageUrl from '@/assets/images/empty-robot.png';

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
const onTabChange = (value) => {
  activeTab.value = value;
  onSearch();
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
  try {
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
  }
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
.app-page-top {
  padding-top: 16px;
  padding-bottom: 16px;
}

.app-page-content {
  overflow: hidden;
}
</style>
