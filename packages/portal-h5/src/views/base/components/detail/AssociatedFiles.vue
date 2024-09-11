<template>
  <div class="h-full overflow-hidden">
    <div class="file-search-area">
      <selector
        v-model="form.file_type"
        :columns="typeOptionList"
        :columns-field-names="{ text: 'label' }"
        :placeholder="t('base.title.select_type')"
        @update:model-value="_findKnowledgeFileList"
      />
      <selector
        v-model="form.enabled"
        :columns="statusOptionList"
        :columns-field-names="{ text: 'label' }"
        :placeholder="t('base.title.select_status')"
        @update:model-value="_findKnowledgeFileList"
      />
      <van-search
        ref="searchInputRef"
        v-model="form.doc_name"
        :placeholder="t('base.e')"
        left-icon="search"
        @search="onKeyConfirm"
      />
    </div>
    <div
      v-if="fileList.length"
      class="file-wrap"
    >
      <div class="pt-2">
        <div
          v-for="file in fileList"
          class="page-list"
        >
          <van-cell class="page-list__inner bg-[#fff]">
            <div class="file-list-row">
              <div class="flex-1 mr-2 font-black">{{ file.doc_name }}</div>
              <van-switch
                v-model="file.enabled"
                size="16px"
                @update:model-value="onFileEnable(file)"
              />
            </div>
            <div class="file-list-row text-[#7a7a7a]">
              <van-icon
                class="mr-1"
                name="description"
              />
              {{ file.file_type === 2 ? t('base.label.qna') : t('base.label.local') }}
            </div>
            <div class="file-list-row text-[#7a7a7a]">
              <van-icon
                class="mr-1"
                name="underway"
              />
              {{
                dayjs(file.created_at)
                  .subtract(new Date().getTimezoneOffset(), 'minute')
                  .format('YYYY-MM-DD HH:mm:ss')
              }}
            </div>
            <div class="file-list-row">
              <van-button
                class="ml-auto"
                icon="delete-o"
                link
                @click="onFileDelete(file)"
              />
            </div>
            <div class="flex file-list-status">
              <van-tag
                v-if="file.status === 3"
                type="danger"
                size="medium"
                @click="onFileRetry(file)"
              >
                {{ file.status_name }}
                <van-icon name="replay" />
              </van-tag>
              <van-tag
                v-else
                size="medium"
                :type="getStatus(file.status)"
              >
                {{ file.status_name }}
              </van-tag>
              <div
                v-if="[0, 1, 2].includes(file.status)"
                class="progress-wrap"
              >
                <van-progress
                  :show-pivot="false"
                  :stroke-width="8"
                  :percentage="getPercentage(file)"
                />
              </div>
            </div>
          </van-cell>
        </div>
      </div>
    </div>
    <van-empty v-else />
  </div>
</template>

<script setup>
import { docAvailable, findAllDocsList, removeKnowledgeDoc, resolverKnowledgeDoc } from '@gptx/base/api/knowledge';
import { t } from '@gptx/base/i18n';
import dayjs from 'dayjs';
import { showFailToast, showSuccessToast } from 'vant';

const prop = defineProps({
  baseId: {
    type: String,
    default: ''
  }
});

const form = reactive({
  page_num: 1,
  page_size: 9999,
  doc_name: '',
  file_type: '',
  enabled: ''
});
const typeOptionList = [
  { value: '', label: t('base.fileTypePlaceholder') },
  { value: '1', label: t('base.label.local') },
  { value: '2', label: t('base.label.qna') }
];
const statusOptionList = [
  { value: '', label: t('base.fileTypePlaceholder') },
  { value: '1', label: t('base.label.s') },
  { value: '2', label: t('base.label.e') }
];
const fileList = ref([]);
let timer = null;
const loading = ref(true);
const searchInputRef = ref(null);

//reset filters
const onFormReset = () => {
  form.page_num = 1;
  form.page_size = 10;
  form.doc_name = '';
  form.file_type = '';
  form.enabled = '';
  _findKnowledgeFileList();
};
const getStatus = (key) => {
  // 0 1 2：解析中，3 4：失败，5：成功
  let res = '';
  switch (key) {
    case 0:
      res = 'warning';
      break;
    case 1:
      res = 'warning';
      break;
    case 2:
      res = 'warning';
      break;
    case 3:
      res = 'danger';
      break;
    case 4:
      res = 'danger';
      break;
    case 5:
      res = 'success';
      break;
    default:
      break;
  }
  return res;
};
//file enable|disable
const onFileEnable = async ({ id, enabled }) => {
  try {
    const { code } = await docAvailable({
      doc_id: id,
      enable_status: enabled
    });
    if (code === 200) _findKnowledgeFileList();
  } catch (e) {
    console.log(e);
  }
};
//retry resolve
const onFileRetry = async (row) => {
  const { id } = row;
  try {
    const result = await resolverKnowledgeDoc({ doc_id_list: [id] });
    if (result.code === 200) {
      _findKnowledgeFileList(); // 更新列表
    }
  } catch (e) {
    console.warn(e);
  }
};
//delete selected file
const onFileDelete = async (row) => {
  try {
    const action = await showConfirmDialog({
      message: t('base.n1'),
      showCancelButton: true,
      cancelButtonText: t('common.cancel'),
      confirmButtonText: t('common.confirm')
    });
    if (action === 'confirm') {
      const { id } = row;
      const result = await removeKnowledgeDoc({ doc_ids: id });
      if (result.code === 200) {
        showSuccessToast(t('common.deleteSuccessful'));
        _findKnowledgeFileList(); // 更新列表
      } else {
        showFailToast(t('common.fail'));
      }
    }
  } catch (e) {
    console.warn(e);
  }
};
//clear timer
const clearTimer = () => {
  timer && clearTimeout(timer);
  timer = null;
};
//get file list
const _findKnowledgeFileList = async () => {
  try {
    const result = await findAllDocsList({ ...form, id: prop.baseId });
    const {
      data: { list },
      code
    } = result;
    if (code === 200) {
      if (loading.value) {
        setTimeout(() => (loading.value = false), 300);
      }
      fileList.value = list;
      let waitParseCount = list.findIndex((_) => [0, 1, 2].includes(_.status));
      if (waitParseCount > -1) {
        clearTimer();
        timer = setTimeout(() => {
          _findKnowledgeFileList();
        }, 5000);
      } else clearTimer();
    }
  } catch (e) {
    console.log(e);
    clearTimer();
    timer = setTimeout(() => {
      _findKnowledgeFileList();
    }, 5000);
  }
};
// get percentage
const getPercentage = ({ status, step_progress }) => {
  switch (status) {
    case 0:
      return 10;
    case 1:
    case 2:
      return Math.max(30, step_progress);
  }
  return 100;
};
const onKeyConfirm = () => {
  searchInputRef.value.blur();
  _findKnowledgeFileList();
};

onMounted(() => {
  _findKnowledgeFileList();
});
onUnmounted(() => {
  clearTimer();
});
defineExpose({
  refreshList: onFormReset
});
</script>

<style scoped lang="scss">
.file-search-area {
  display: flex;
  padding: 4px 8px;
  border-radius: 8px;
  background-color: #fff;
}

.van-cell {
  padding: 4px 12px;
}

.file-list-row {
  display: flex;
  align-items: center;

  & + & {
    margin-top: 8px;
  }
}

.file-list-status {
  position: absolute;
  left: -12px;
  bottom: -4px;
}

:deep(.page-list__inner) {
  .van-tag {
    border-radius: 0 12px 0 8px;
  }
}

.text-\[\#7a7a7a\] {
  --tw-text-opacity: 1;
  color: rgb(122 122 122 / var(--tw-text-opacity));
}

.h-full {
  height: 100%;
}

.pt-4 {
  padding-top: 24px;
}

.file-wrap {
  margin-top: 24px;
  height: calc(100% - 64px);
  overflow: hidden auto;
}

.pt-2 {
  padding-top: 8px;
}

.page-list {
  &:last-child {
    margin-bottom: 64px;
  }
}

.progress-wrap {
  width: 100px;
  margin-left: 8px;
  align-self: center;
}

:deep(.van-field__left-icon) {
  color: #a8abb2;
}

:deep(.van-search) {
  --van-search-content-background: transparent;
  flex: 360px;
  padding: 0;
  .van-search__content{
    padding-left: 0;
  }
}
</style>
