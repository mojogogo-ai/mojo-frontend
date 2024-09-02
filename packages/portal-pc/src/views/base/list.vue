<template>
  <div class="app-page">
    <div
      v-if="__data.knowledgeList.length || knowledgeBaseName"
      class="app-page-top"
    >
      <div class="flex items-center">
        <div class="app-page-col mr-auto">
          <el-input
            v-model="knowledgeBaseName"
            prefix-icon="search"
            style="width: 240px"
            :placeholder="t('base.a')"
            @input="_findKnowledgeList"
          />
        </div>
        <div class="app-page-col">
          <el-button
            type="primary"
            linear
            @click="createNewKnowledgeBase"
          >
            {{ t('base.new') }}
          </el-button>
        </div>
      </div>
    </div>
    <div
      v-loading="loadingKnowledge"
      class="app-page-content"
      element-loading-background="transparent"
      :element-loading-text="t('common.loading')"
    >
      <el-scrollbar
        v-if="__data.knowledgeList.length && !loadingKnowledge"
        class="h-full"
      >
        <div class="pt-3">
          <base-list-item
            v-for="listItem in __data.knowledgeList"
            class="app-page-item"
            :info="listItem"
            @edit="createNewKnowledgeBase(listItem)"
            @delete="_handleRemoveKnowledge(listItem.id)"
            @click="goBaseDetail(listItem)"
          />
        </div>
      </el-scrollbar>
      <template v-if="!__data.knowledgeList.length && !loadingKnowledge">
        <el-empty v-if="knowledgeBaseName">
          <template #description>
            <div class="text-[16px] font-black">{{ t('base.not_found') }}</div>
          </template>
        </el-empty>
        <el-empty v-else>
          <template #description>
            <div class="text-[16px] font-black">{{ t('base.no_base') }}</div>
            <div class="mt-[4px]">{{ t('base.click') }}</div>
          </template>
          <el-button
            type="primary"
            linear
            @click="createNewKnowledgeBase"
          >
            {{ t('base.new') }}
          </el-button>
        </el-empty>
      </template>
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
const loadingKnowledge = ref(true);
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

// 获取知识库列表
const _findKnowledgeList = async () => {
  try {
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
  router.push(`/base_detail/${id}?tab=${file_count > 0 ? 'a' : 'b'}`);
};
const onCreateNewBase = async ({ id }) => {
  router.push({
    path: `/base_detail/${id}`,
    query: {
      tab: 'b'
    }
  });
};
onMounted(() => {
  _findKnowledgeList();
});
</script>

<style lang="scss" scoped></style>
