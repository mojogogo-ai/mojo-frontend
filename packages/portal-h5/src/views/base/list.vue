<template>
  <div class="app-page">
    <page-header
      :title="t('menu.b')"
      :placeholder="t('base.a')"
      input-area
      @search="onSearch"
    />
    <div
      v-if="loadingKnowledge"
      class="app-page-content flex items-center justify-center"
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
      class="app-page-content"
    >
      <div class="flex h-full flex-col overflow-hidden">
        <van-floating-bubble
          v-if="__data.knowledgeList.length || knowledgeBaseName"
          axis="xy"
          magnetic="x"
          icon="plus"
          @click="createNewKnowledgeBase"
        />
        <div
          v-if="__data.knowledgeList.length"
          class="flex-1 overflow-hidden"
        >
          <van-list class="cover-list h-full pt-3">
            <base-list-item
              v-for="listItem in __data.knowledgeList"
              class="app-page-item"
              :info="listItem"
              @edit="createNewKnowledgeBase(listItem)"
              @delete="_handleRemoveKnowledge(listItem.id)"
              @click="goBaseDetail(listItem)"
            />
          </van-list>
        </div>
        <template v-else>
          <van-empty v-if="knowledgeBaseName">
            <template #description>
              <div class="text-[16px] font-black">{{ t('base.not_found') }}</div>
            </template>
          </van-empty>
          <van-empty v-else>
            <template #description>
              <div class="text-center text-[16px] font-black">{{ t('base.no_base') }}</div>
              <div class="mt-[4px] text-center">{{ t('base.click') }}</div>
            </template>
            <van-button
              type="primary"
              size="small"
              linear
              @click="createNewKnowledgeBase"
            >
              {{ t('base.new') }}
            </van-button>
          </van-empty>
        </template>
      </div>
    </div>
    <base-info
      ref="baseInfoRef"
      @after-create="onCreateNewBase"
      @after-update="_findKnowledgeList"
    />
  </div>
</template>

<script setup>
import { findKnowledgeList, handleRemoveKnowledge } from '@gptx/base/api/knowledge';
import { t } from '@gptx/base/i18n';
import BaseInfo from './components/BaseInfo';
import BaseListItem from './components/list/BaseListItem';

const router = useRouter();
const loadingKnowledge = ref(false);
/* filter */
const knowledgeBaseName = ref('');
/* list */
const __data = reactive({
  knowledgeList: []
});
//show delete action confirm
/* ref dom */
const baseInfoRef = ref(null);
const createNewKnowledgeBase = (val) => baseInfoRef.value.open(val);

const onSearch = (value) => {
  knowledgeBaseName.value = value;
  _findKnowledgeList();
};
// get knowledge base list
const _findKnowledgeList = async () => {
  try {
    loadingKnowledge.value = true;
    const result = await findKnowledgeList(knowledgeBaseName.value);
    const {
      data: { list }
    } = result;
    __data.knowledgeList = list;
    setTimeout(() => {
      loadingKnowledge.value = false;
    }, 300);
  } catch (e) {
    console.log(e);
    loadingKnowledge.value = false;
  }
};
//delete selected knowledge base
const _handleRemoveKnowledge = async (id) => {
  await handleRemoveKnowledge(id);
  _findKnowledgeList();
};
//to detail page
const goBaseDetail = ({ id, file_count }) => {
  router.push({
    path: `/base_detail/${id}`,
    query: {
      tab: file_count > 0 ? 'a' : 'b'
    }
  });
};
const onCreateNewBase = async ({id}) => {
  router.push({
    path: `/base_detail/${id}`
  });
};
onMounted(() => {
  _findKnowledgeList();
});
</script>

<style lang="scss" scoped>
.page-list {
  &:last-child {
    margin-bottom: 64px;
  }
}
</style>
