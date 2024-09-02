<template>
  <div
    ref="scrollbar"
    class="h-full overflow-y-auto overflow-x-hidden"
    @scroll="onScroll"
  >
    <div class="mb-4">
      <van-form class="cover-form">
        <van-field
          v-model="testContent"
          type="textarea"
          clearable
          background
          :rows="6"
          :placeholder="t('base.place.test')"
        />
      </van-form>
    </div>
    <div class="mb-4 px-2 text-center">
      <van-button
        type="primary"
        size="small"
        style="width: 100px"
        @click="onSearch"
      >
        {{ t('base.action.search') }}
      </van-button>
    </div>
    <div class="search-list">
      <div
        v-for="{ similarity, content, character_count } in __data.resultList"
        class="page-list"
      >
        <van-cell
          class="page-list__inner"
          shadow="hover"
          @mouseenter="onMouseenter"
        >
          <div class="mb-2 flex items-center">
            <div class="mr-auto">{{ t('base.label.simi') }}: {{ similarity }}</div>
            <div class="h-[24px] shrink-0 rounded bg-gray-200 px-2 py-1 text-xs">
              <span>{{ character_count }}{{ t('base.label.words') }}</span>
            </div>
          </div>
          <van-text-ellipsis
            :content="content"
            rows="4"
            :expand-text="t('common.expand')"
            :collapse-text="t('common.fold')"
          />
        </van-cell>
      </div>
      <van-empty
        v-if="isEmpty"
        :description="t('common.nodata')"
      />
      <van-loading
        v-if="isLoading"
        class="text-center"
      >
        {{ t('common.loading') }}
      </van-loading>
    </div>
    <van-floating-bubble
      v-if="scrollTopValue >= 200"
      axis="xy"
      magnetic="x"
      icon="arrow-up"
      @click="backToTop"
    />
  </div>
</template>

<script setup>
import { searchTest } from '@gptx/base/api/knowledge';
import { t } from '@gptx/base/i18n';
import { showToast } from 'vant';

const prop = defineProps({
  baseId: {
    type: String,
    default: ''
  }
});

const __data = reactive({
  resultList: []
});
const testContent = ref('');
let pageNum = 1;
let pageSize = 18;
let isLoadMore = true;
let timer = null;
const tooltipWidth = ref(0);
const scrollTopValue = ref(0);
const isLoading = ref(false);
const isEmpty = ref(false);
/* ref dom */
const scrollbar = ref(null);

//search
const onSearch = () => {
  if (isLoading.value) return;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  timer = setTimeout(() => {
    __data.resultList = [];
    pageNum = 1;
    isLoadMore = true;
    getTestContentList();
  }, 300);
};

const getTestContentList = async () => {
  if (!testContent.value || !testContent.value.trim())
    return showToast({
      message: t('base.place.test'),
      position: 'top'
    });
  if (!isLoadMore) return;
  try {
    isLoading.value = true;
    const { code, data } = await searchTest({
      id: prop.baseId,
      text: testContent.value,
      page_num: pageNum,
      page_size: pageSize
    });
    if (code === 200) {
      const {
        list,
        page: { total }
      } = data;
      __data.resultList.push(...list);
      pageNum++;
      if (__data.resultList.length >= total) {
        isLoadMore = false;
      }
    }
    setTimeout(() => {
      isLoading.value = false;
      if (__data.resultList.length === 0) {
        isEmpty.value = true;
      }
    }, 300);
  } catch (error) {
    console.log(error);
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }
};

const onScroll = ({ target: { scrollTop, scrollHeight, offsetHeight } }) => {
  scrollTopValue.value = scrollTop;
  if (scrollHeight - offsetHeight <= scrollTop) getTestContentList();
};
const onMouseenter = (e) => {
  tooltipWidth.value = e.target.offsetWidth;
};
const backToTop = () => {
  scrollbar.value.scrollTop = 0;
};
</script>

<style lang="scss">
.search-list {
  flex: 1;
  margin-bottom: 1em;
  padding: 0 8px;
}

.search-list-item {
  display: inline-block;
  width: 100%;
  height: 156px;
}
</style>
