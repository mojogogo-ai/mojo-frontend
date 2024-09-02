<template>
  <div class="app-page">
    <page-header :title="baseInfo.name" />
    <div class="app-page-content">
      <div class="m-auto mb-4 w-[300px] text-center">
        <van-tabs
          v-model:active="currentTab"
          class="mb-2 cover-tab"
        >
          <van-tab
            v-for="{ value, label } in tabList"
            :name="value"
            :title="label"
          />
        </van-tabs>
      </div>
      <div
        v-show="currentTab === 'a'"
        class="flex flex-col flex-1 overflow-hidden"
      >
        <search-test :base-id="baseId" />
      </div>
      <div
        v-show="currentTab === 'b'"
        class="flex min-h-[430px] flex-1 flex-col overflow-hidden"
      >
        <associated-files
          ref="associatedFilesRef"
          :base-id="baseId"
          @open-upload="onOpenUpload"
          @update="_getKnowledgeDetail"
        />
      </div>
    </div>
  </div>
  <import-base-dialog
    ref="baseFileUploadRef"
    :doc-main-id="baseId"
    @reload="onReload"
  />
  <van-floating-bubble
    v-if="currentTab === 'b'"
    axis="xy"
    magnetic="x"
    icon="plus"
    @click="onOpenUpload"
  />
</template>

<script setup>
import { getKnowledgeDetail } from '@gptx/base/api/knowledge';
import { t } from '@gptx/base/i18n';
import SearchTest from './components/detail/SearchTest';
import AssociatedFiles from './components/detail/AssociatedFiles';
import ImportBaseDialog from './components/ImportBaseDialog';

const route = useRoute();
const baseId = route.params.id;
const currentTab = ref('a');
const baseInfo = reactive({});
const tabList = [
  { value: 'a', label: t('base.tab.a') },
  { value: 'b', label: t('base.tab.b') }
];

/* ref dom */
const baseFileUploadRef = ref(null);
const associatedFilesRef = ref(null);

const onOpenUpload = () => baseFileUploadRef.value.openModal();

const onReload = () => associatedFilesRef.value.refreshList();
const _getKnowledgeDetail = async () => {
  try {
    const { code, data } = await getKnowledgeDetail(baseId);
    if (code === 200) {
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          baseInfo[key] = data[key];
        }
      }
      document.title = data.name;
    }
  } catch (error) {
    console.log(error);
  }
};
onMounted(async () => {
  await _getKnowledgeDetail();
  currentTab.value = route.query.tab || 'a';
});
</script>

<style lang="scss" scoped>
.app-page {
  height: 100%;
}

.app-page-top {
  padding-top: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #e1e4f2;
}

.app-page-content {
  display: flex;
  flex-direction: column;
  padding: 16px 8px;
  overflow: hidden;
}
</style>
