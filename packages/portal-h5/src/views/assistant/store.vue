<template>
  <div class="app-page">
    <page-header
      :title="t('menu.ass')"
      :placeholder="t('store.placeholder.name')"
      input-area
      @search="onSearch"
    />
    <van-search
      v-model="appName"
      placeholder="Search"
      shape="round"
      background="transparent"
      @search="onSearch"
    />
    <div class="app-page-content flex flex-col">
      <!--      <div class="shrink-0">
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
            </div>-->
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
              @open-with="onDropDownClick($event, appInfo)"
              @open-new-chat="onOpenNewChat(appInfo)"
              @duplicate="onDuplicate(appInfo)"
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
    <bot-base-info
      ref="baseInfoRef"
      @after-create="afterCreateBot"
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
let pageSize = 18;
let isLoadMore = true;
const appName = ref('');
let timer = null;
const isLoading = ref(true);
/* ref dom */
const scrollbar = ref(null);
const baseInfoRef = ref(null);

const onSearch = (value) => {
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
const onTabChange = ({ name }) => {
  activeTab.value = name;
  onSearch();
};
const onDropDownClick = (plat, { shared_social }) => {
  const { link } = shared_social[plat];
  window.open(link, '_blank');
};
const onOpenNewChat = ({ app_id }) => {
  const { href } = router.resolve(`/bot/${app_id}`);
  window.open(href, '_blank');
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
const onScroll = ({ target: { scrollTop, scrollHeight, offsetHeight } }) => {
  if (scrollHeight - offsetHeight <= scrollTop) getStoreList();
};
// duplicate assistant
const onDuplicate = (app) => {
  baseInfoRef.value.open({
    from_id: app.app_id,
    name: `${app.app_name}${t('bots.backup')}`,
    icon: app.app_icon,
    description: app.app_description
    // category_id: app.categories.map((_) => _.id)
  });
};
const afterCreateBot = async (data) => {
  if (data && data.app_id) router.push(`/design/${data.app_id}`);
};

onMounted(async () => {
  await _getListCategory();
  onSearch();
});
</script>

<style lang="scss" scoped>
.store-scroll {
  height: 100%;
  overflow: hidden auto;
}
</style>
