<template>
  <div class="app-page">
    <page-header
      :title="t('menu.ass')"
      :placeholder="t('store.placeholder.name')"
      input-area
      @search="onSearch"
    />
    <!-- <van-search
      v-model="appName"
      class="store-search"
      placeholder="Search"
      shape="round"
      background="transparent"
      @search="onSearch"
    /> -->
    <div class="flex flex-col app-page-content">
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
        class="flex items-center justify-center flex-1"
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
          <div  className="flex flex-col items-center">
            <svg-icon name="smart-people" style="height: 220px; width: 220px;"></svg-icon>
            <div class="text-[16px] font-black">{{ t('bots.not_found') }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { getList } from '@gptx/base/api/assistant-store';
import { ListItem } from './components/store/index.js';


const router = useRouter();
const __data = reactive({
  storeList: []
});
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
      // search: appName.value,
      // category_id: activeTab.value,
      // page_num: pageNum,
      // page_size: pageSize
    });
    if (code === 200) {
      const {
        list,
        total
      } = data;
      __data.storeList.push(...list);
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

const onScroll = ({ target: { scrollTop, scrollHeight, offsetHeight } }) => {
  if (scrollHeight - offsetHeight <= scrollTop) getStoreList();
};

onMounted(async () => {
  onSearch();
});
</script>

<style lang="scss" scoped>
.store-scroll {
  height: 100%;
  overflow: hidden auto;
}

.store-search {
  position: sticky;
  top: var(--van-action-bar-height);
  z-index: 1;
}
</style>
