<template>
  <el-form
    ref="formRef"
    :model="form"
    class="flex"
    inline
    @submit.prevent
  >
    <el-form-item :label="t('base.title.filename')">
      <el-input
        v-model="form.doc_name"
        :placeholder="t('base.e')"
      />
    </el-form-item>
    <el-form-item
      class="w-[160px]"
      :label="t('user.a3')"
    >
      <el-select v-model="form.file_type">
        <el-option
          v-for="{ label, value } in typeOptionList"
          :label="label"
          :value="value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      class="mr-[auto!important] w-[160px]"
      :label="t('bots.status')"
    >
      <el-select v-model="form.enabled">
        <el-option
          v-for="{ label, value } in statusOptionList"
          :label="label"
          :value="value"
        />
      </el-select>
    </el-form-item>
    <el-form-item class="mr-[0!important]">
      <el-button
        type="primary"
        linear
        @click="_findKnowledgeFileList"
      >
        {{ t('common.query') }}
      </el-button>
      <el-button @click="onFormReset">{{ t('common.reset') }}</el-button>
    </el-form-item>
  </el-form>
  <div class="flex">
    <el-button
      type="primary"
      linear
      @click="emit('open-upload')"
    >
      {{ t('base.label.nf') }}
    </el-button>
  </div>
  <div class="mt-4">
    <el-table
      :data="fileList"
      :empty-text="t('base.no_date')"
      plain
    >
      <el-table-column
        type="index"
        :label="t('base.g')"
        width="80"
        align="center"
      >
        <template #default="scope">
          <span> {{ scope.row.index }} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="doc_name"
        :label="t('base.title.filename')"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="file_type"
        :label="t('user.a3')"
        align="center"
        width="160"
        show-overflow-tooltip
      >
        <template #default="{ row: { file_type } }">
          {{ file_type === 2 ? t('base.label.qna') : t('base.label.local') }}
        </template>
      </el-table-column>
      <el-table-column
        :label="t('base.label.createdAt')"
        width="188"
        align="center"
      >
        <template #default="{ row }">
          <span>{{
            dayjs(row.created_at).subtract(new Date().getTimezoneOffset(), 'minute').format('YYYY-MM-DD HH:mm:ss')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('base.i')"
        align="center"
        width="132"
      >
        <template #default="{ row }">
          <el-progress
            v-if="[0, 1, 2].includes(row.status)"
            :show-text="false"
            :stroke-width="8"
            :percentage="getPercentage(row)"
          />
          <el-tag
            v-else
            :type="getStatus(row.status)"
          >
            {{ row.status_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('base.label.isEnable')"
        align="center"
        width="80"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.enabled"
            :before-change="onFileEnable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        :label="t('base.l')"
        align="center"
        width="120"
      >
        <template #default="scope">
          <el-button
            v-if="[3, 4].includes(scope.row.status)"
            type="primary"
            size="small"
            link
            @click="onFileRetry(scope.row)"
          >
            {{ t('base.m') }}
          </el-button>

          <el-button
            v-if="scope.row.file_type === 2 && scope.row.status === 5"
            type="primary"
            size="small"
            link
            @click="onFileEdit(scope.row)"
          >
            {{ $t('user.edit') }}
          </el-button>
          <el-popconfirm
            width="280px"
            :title="t('base.n1')"
            @confirm="onFileDelete(scope.row)"
          >
            <template #reference>
              <el-button
                type="danger"
                size="small"
                link
                :disabled="[0, 1, 2].includes(scope.row.status)"
              >
                {{ t('common.deleted') }}
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:page-size="form.page_size"
      v-model:current-page="form.page_num"
      class="flex justify-end mt-2"
      layout="prev, pager, next, total"
      hide-on-single-page
      background
      :total="totalCount"
      @size-change="_findKnowledgeFileList"
      @current-change="_findKnowledgeFileList"
    />
  </div>

  <editQa
    ref="editQaRef"
    :base-id="baseId"
    :doc-id="curDocId"
  />
</template>

<script setup>
import { docAvailable, findAllDocsList, removeKnowledgeDoc, resolverKnowledgeDoc } from '@gptx/base/api/knowledge';
import { t } from '@gptx/base/i18n';
import dayjs from 'dayjs';
import editQa from './editQa'

const prop = defineProps({
  baseId: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['open-upload', 'update']);

const form = reactive({
  page_num: 1,
  page_size: 10,
  doc_name: '',
  file_type: '',
  enabled: ''
});
const typeOptionList = [
  { value: '', label: t('base.title.select_type') },
  { value: '1', label: t('base.label.local') },
  { value: '2', label: t('base.label.qna') }
];
const statusOptionList = [
  { value: '', label: t('base.title.select_status') },
  { value: '1', label: t('base.label.s') },
  { value: '2', label: t('base.label.e') }
];
const fileList = ref([]);
const totalCount = ref(0);
let timer = null;
const formRef = ref(null);

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
const onFileEnable = ({ id, enabled }) => {
  return async () => {
    const { code } = await docAvailable({
      doc_id: id,
      enable_status: !enabled
    });
    if (code === 200) _findKnowledgeFileList();
  };
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

const editQaRef = ref(null);
const curDocId = ref('');
const onFileEdit  = (row) => { 
  curDocId.value = row.id
  nextTick(()=>{
    editQaRef.value.openModal();
  })
}

//delete selected file
const onFileDelete = async (row) => {
  const { id } = row;
  try {
    const result = await removeKnowledgeDoc({ doc_ids: id });
    if (result.code === 200) {
      ElMessage.success(t('common.deleteSuccessful'));
      _findKnowledgeFileList(); // 更新列表
    } else {
      ElMessage.error(t('common.fail'));
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
      data: { list, page },
      code
    } = result;
    if (code === 200) {
      const { total, page_num } = page || {};
      let waitParseCount = 0;
      fileList.value = list.map((item, index) => {
        if ([0, 1, 2].includes(item.status)) waitParseCount++;
        return {
          ...item,
          index: (page_num - 1) * 10 + index + 1
        };
      });
      totalCount.value = parseInt(total || 0);
      emit('update');
      if (waitParseCount > 0) {
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
