<template>
  <div
    v-loading="loading"
    class="app-page"
  >
    <div class="app-page-top">
      <div class="flex items-center">
        <div class="flex items-center app-page-col">
          <el-icon
            class="cursor-pointer hover:text-[var(--el-color-primary)]"
            size="20"
            @click="goBack"
          >
            <ArrowLeft />
          </el-icon>
        </div>
        <div class="app-page-col">
          <div class="text-xl font-black">
            {{ baseInfo.name }}
            <el-tag
              v-if="baseInfo.file_count"
              class="ml-[8px]"
              size="small"
            >
              <span>{{ baseInfo.file_count }}{{ t('base.label.fileUnitNum') }}</span>
            </el-tag>
            <el-tag
              v-if="baseInfo.friendly_file_size"
              class="ml-[4px]"
              size="small"
            >
              <span>{{ baseInfo.friendly_file_size }}</span>
            </el-tag>
          </div>
        </div>
      </div>
    </div>
    <div class="overflow-hidden app-page-content">
      <div class="m-auto mb-4 w-[300px] text-center">
        <n-tabs
          type="segment"
          :value="currentTab"
          @update:value="onTabChange"
        >
          <n-tab-pane
            v-for="{ value, label } in tabList"
            :name="value"
            :tab="label"
          />
        </n-tabs>
      </div>
      <div
        v-show="currentTab === 'a'"
        class="flex-1 overflow-auto"
      >
        <search-test :base-id="baseId" />
      </div>
      <div
        v-show="currentTab === 'b'"
        class="flex-1 overflow-auto"
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
</template>

<script setup>
import { ElMessageBox } from 'element-plus';
import { getKnowledgeDetail } from '@gptx/base/api/knowledge';
import { t } from '@gptx/base/i18n';
import { NTabs, NTabPane } from 'naive-ui';
import SearchTest from './components/detail/SearchTest';
import AssociatedFiles from './components/detail/AssociatedFiles';
import ImportBaseDialog from './components/ImportBaseDialog';
import router from '@/router';

const route = useRoute();
const baseId = route.params.id;
const loading = ref(false);
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
const onReload = () => {
  associatedFilesRef.value.refreshList();
};
const _getKnowledgeDetail = async () => {
  try {
    loading.value = true;
    const { code, data, message } = await getKnowledgeDetail(baseId);
    if (code === 200) {
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const value = data[key];
          baseInfo[key] = value;
        }
      }
      document.title = data.name;
      loading.value = false;
    } else {
      ElMessageBox.alert(message, t('common.c'), {
        callback: () => {
          loading.value = false;
        }
      });
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};
const onTabChange = (val) => (currentTab.value = val);
const goBack = () => router.back();
onMounted(async () => {
  currentTab.value = route.query.tab || 'a';
});
</script>

<style lang="scss" scoped>
.app-page {
  height: 100%;
  padding: 16px;
}
.app-page-top {
  padding-top: 0;
}
.app-page-content {
  display: flex;
  flex-direction: column;
  padding: 24px;
}
</style>
