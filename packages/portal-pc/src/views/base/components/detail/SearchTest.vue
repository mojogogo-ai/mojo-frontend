<template>
  <el-scrollbar
    ref="scrollbar"
    class="h-full back-top-anchor"
    @scroll="onScroll"
  >
    <div class="mb-4">
      <el-input
        v-model="testContent"
        type="textarea"
        resize="none"
        :rows="6"
        :placeholder="t('base.place.test')"
      />
    </div>
    <div class="mb-4">
      <el-button @click="onSearch"> {{ t('base.action.search') }} </el-button>
    </div>
    <div
      v-loading="isLoading"
      class="search-list"
      element-loading-background="transparent"
      :element-loading-text="t('common.loading')"
    >
      <el-card
        v-for="{ similarity, content, character_count } in __data.resultList"
        class="search-list-item"
        shadow="hover"
        @mouseenter="onMouseenter"
      >
        <div class="flex items-center mb-2">
          <div class="mr-auto">{{ t('base.label.simi') }}: {{ similarity }}</div>
          <div class="shrink-0 h-[24px] px-2 py-1 bg-gray-200 rounded text-xs">
            <span>{{ character_count }}{{ t('base.label.words') }}</span>
          </div>
        </div>
        <n-ellipsis :line-clamp="4">
          <div
            class="text-[#7a7a7a]"
            v-html="content.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;').replace(/\t/g, '&nbsp;&nbsp;')"
          />
          <template #tooltip>
            <div
              class="overflow-auto"
              :style="{ width: `${tooltipWidth}px`, maxHeight: `${tooltipWidth * 0.5}px` }"
              v-html="content.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;').replace(/\t/g, '&nbsp;&nbsp;')"
            />
          </template>
        </n-ellipsis>
      </el-card>
    </div>
    <n-float-button
      v-if="scrollTopValue >= 200"
      right="40px"
      bottom="40px"
      @click="backToTop"
    >
      <el-icon><CaretTop /></el-icon>
    </n-float-button>
  </el-scrollbar>
</template>

<script setup>
import { searchTest } from '@gptx/base/api/knowledge';
import { t } from '@gptx/base/i18n';
import { ElMessage } from 'element-plus';
import { NEllipsis, NFloatButton } from 'naive-ui';

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
    isLoading.value = true;
    getTestContentList();
  }, 300);
};

const getTestContentList = async () => {
  if (!testContent.value || !testContent.value.trim())
    return ElMessage({ message: t('base.place.test'), type: 'warning' });
  if (!isLoadMore) return;
  try {
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
    }, 300);
  } catch (error) {
    console.log(error);
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }
};

const onScroll = ({ scrollTop }) => {
  const wrap = scrollbar.value.wrapRef;
  scrollTopValue.value = scrollTop;
  if (wrap.scrollHeight - wrap.offsetHeight <= scrollTop) getTestContentList();
};
const onMouseenter = (e) => {
  tooltipWidth.value = e.target.offsetWidth;
};
const backToTop = () => {
  scrollbar.value.setScrollTop(0);
};
</script>

<style lang="scss">
.search-list {
  width: 100%;
  min-height: 348px;
  margin-bottom: 1em;
  list-style: none;
  overflow: hidden auto;
}
.search-list-item {
  display: inline-block;
  width: calc(50% - 1em);
  height: 156px;
  margin: 0.5em;
}
</style>
