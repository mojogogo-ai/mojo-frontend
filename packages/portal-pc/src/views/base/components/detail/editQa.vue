<template>
  <el-dialog
    v-model="visible"
    width="1000px"
    destroy-on-close
    :title="$t('user.edit')"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-button
      type="primary"
      linear
      @click="createNew"
    >
      新增
    </el-button>
    <el-table
      v-loading="loadingList"
      :data="fileList"
      :element-loading-text="t('common.loading')"
      :empty-text="t('base.no_date')"
      plain
    >
      <el-table-column
        type="index"
        :label="t('base.g')"
        align="center"
        width="60"
      />
      <!-- <el-table-column
        prop="segment_id"
        :label="t('base.g')"
        align="center"
        width="60"
      /> -->
      <el-table-column
        prop="question"
        :label="$t('common.d')"
        align="center"
        width="220"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.question"
            style="width: 180px"
            :autosize="{ minRows: 1, maxRows: 3 }"
            type="textarea"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="answer"
        :label="$t('common.f')"
        align="center"
        width="220"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.answer"
            style="width: 180px"
            :autosize="{ minRows: 1, maxRows: 3 }"
            type="textarea"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="answer"
        :label="$t('common.g')"
        align="left"
        width="110"
      >
        <template #default="scope">
          <el-select
            v-model="scope.row.extra.type"
            style="width: 80px"
          >
            <el-option
              v-for="item in extraOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="answer"
        :label="$t('common.h')"
        align="left"
        width="220"
      >
        <template #default="scope">
          <el-input
            v-if="scope.row.extra.type===1"
            v-model="scope.row.extra.command"
            style="width: 180px"
            :autosize="{ minRows: 1, maxRows: 3 }"
            type="textarea"
          />
          <el-input
            v-else-if="scope.row.extra.type===3"
            v-model="scope.row.extra.link"
            style="width: 180px"
            :autosize="{ minRows: 1, maxRows: 3 }"
            type="textarea"
          />
          <div v-else-if="scope.row.extra.type===2" @click="setCurIndex(scope)">
            <el-upload
              v-model:file-list="scope.row.imgList"
              class="qa-img-uploader"
              :action="action"
              list-type="picture-card"
              :headers="headers"
              accept=".png, .jpg, .jpeg"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUpload"
            >
              <template #file="{ file }">
                <div>
                  <img class="w-[55px] h-[55px]" :src="file.url" alt="">
                  <span class="el-upload-list__item-actions" style="width: 55px;height: 55px;">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <el-icon><zoom-in /></el-icon>
                    </span>
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleRemove(scope.row)"
                    >
                      <el-icon><Delete /></el-icon>
                    </span>
                  </span>
                </div>
              </template>
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
 
          <span v-else />
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        align="center"
        width="120"
        :label="t('base.l')"
      >
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            link
            :loading="scope.row.loading"
            @click="saveQA(scope.row)"
          >
            {{ $t('common.b') }}
          </el-button>
          <el-button
            type="danger"
            size="small"
            link
            :loading="scope.row.removeLoading"
            @click="delteQA(scope.row)"
          >
            {{ $t('common.deleted') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:page-size="page_size"
      v-model:current-page="page_num"
      class="flex justify-end mt-4"
      layout="prev, pager, next, total"
      background
      hide-on-single-page
      :total="totalCount"
      @size-change="getFileList"
      @current-change="getFileList"
    />
  </el-dialog>
  
  <el-dialog v-model="dialogVisible" width="550px">
    <div class="flex justify-center w-full">
      <img :src="dialogImageUrl" style="margin: 0 auto;width: 100%;">
    </div>
  </el-dialog>

  <addQa
    ref="addQaRef"
    :base-id="props.baseId"
    :doc-id="props.docId"
    @after-create="afterCreate"
  />
</template>

<script setup>
import { docSegmented, docUpdatedSegmented, docDeleteSegmented } from '@gptx/base/api/knowledge';
import { getToken } from '@gptx/base/utils/auth';
// import { getCurLang } from '@gptx/base';
// import { isMobi } from '@gptx/base/utils/index';
import addQa from './addQa';

import { t } from '@gptx/base/i18n';
const props = defineProps({
  baseId: {
    type: [Number, String],
    default: ''
  },
  docId: {
    type: [Number, String],
    default: null
  }
});
const visible = ref(false);
const loadingList = ref(false);
const extraOptions = [
  {
    value: 0,
    label: t('base.extra_0'),
  },
  {
    value: 1,
    label: t('base.extra_1'),
  },
  {
    value: 2,
    label: t('base.extra_2'),
  },
  {
    value: 3,
    label: t('base.extra_3'),
  }
]

const handleClose = () => {
  visible.value = false;
};

const openModal = () => {
  visible.value = true;
  getFileList()
};

 
const fileList = ref([]);
const totalCount = ref(0);
const page_num = ref(1);
const page_size = ref(10);

const getFileList = async () => {
  try {
    loadingList.value = true;
    const { code, data } = await docSegmented({
      base_id: props.baseId,
      doc_id: props.docId,
      page_num: page_num.value,
      page_size: page_size.value,
    });
    if (code === 200) {
      fileList.value = data.list.map((i)=>{
        return {
          ...i,
          loading: false,
          removeLoading: false,
          imgList: i.extra.image=='' ? [] : [{
            name: i.extra.image,
            url: i.extra.image
          }]
        }
      });
      totalCount.value = data.page.total
    }
    loadingList.value = false;
  } catch (e) {
    console.log(e);
    loadingList.value = false;
  }
};

const saveQA = async (row) => {
  try {
    row.loading = true;
    let params = { 
      base_id: props.baseId,
      doc_id: props.docId,
      segment_id: row.segment_id,
      
      question: row.question,
      answer: row.answer,

      extra_type: row.extra.type,
      extra_command:row.extra.command,
      extra_image: row.extra.image,
      extra_link:row.extra.link,
    }
    
    // link 
    let linkUrl = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/
    if (params.extra_type===3 && !linkUrl.test(params.extra_link)) {
      ElMessage.warning(t('base.c'));
      row.loading = false;
      return
    }
    if (params.extra_type===2 && params.extra_image === '') {
      ElMessage.warning('请上传文件');
      row.loading = false;
      return
    }

    const { code } = await docUpdatedSegmented(params);
    if (code === 200) {
      ElMessage.success(t('common.i'));
    }
    row.loading = false;
  } catch (e) {
    console.log(e);
    row.loading = false;
  }
};

const action = window.BASE_API + '/portal/knowledge/doc-segment-upload-image';
const curIndex = ref('')
const setCurIndex = (scope) => {
  curIndex.value = scope.$index
}
const handleUploadSuccess = (response) => {
   if (response.code === 200) {
      fileList.value[curIndex.value].imgList = [{
        name: response.data.location,
        url: response.data.location
      }]
      fileList.value[curIndex.value].extra.image = response.data.location
  } else {
     fileList.value[curIndex.value].imgList = []
     fileList.value[curIndex.value].extra.image = ''
  }
}
const supportedFileType = ['.png', '.jpg', '.jpeg'];
const headers = ref({ Authorization: '' });
const beforeUpload= async (file) => {
  console.log(file,'file')
  // only one img
  if (fileList.value[curIndex.value].imgList.length!==0) {
    ElMessage.error(`只能上传一个图片`);
    return false
  }

  // const lang = getCurLang();
  let authToken = await getToken();
  headers.value.Authorization = 'Bearer ' + authToken;
  // headers.value['X-Client-Locale'] = lang === 'zh' ? 'zh-CN' : lang;
  // headers.value['X-Client-Timezone-Offset'] = new Date().getTimezoneOffset(); // timezone offset
  // headers.value['X-Client-Type'] = isMobi() ? 'H5' : 'WEB'; // X-Client-Type
  
  const isLt1M = file.size / 1024 / 1024 < 20;
  if (!isLt1M) {
    ElMessage.error(`${t('base.fileName')}${file.name}${t('base.p')}20MB!`);
    return false;
  }
  const fileExtensions = supportedFileType.map((_) => _.substring(1));
  if (!fileExtensions.includes(file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase())) {
    ElMessage.error(`只能上传/png/jpg/jpeg格式的图片`);
    return false;
  }
  return true
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePictureCardPreview= (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
const handleRemove= (row) => {
  row.imgList = []
  row.extra.image = ''
}


const delteQA = (row) => {
  ElMessageBox.confirm('确定删除？',
    {
      autofocus: false,
      confirmButtonText: t('common.clear'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(async () => {
    try {
      row.removeLoading = true;
      let params = { 
        base_id: props.baseId,
        doc_id: props.docId,
        segment_id: row.segment_id,
      }

      const { code } = await docDeleteSegmented(params);
      if (code === 200) {
        ElMessage.success(t('common.deleteSuccessful'));
        // page_num.value = 1
        getFileList()
      }
      row.removeLoading = false;
    } catch (e) {
      console.log(e);
      row.removeLoading = false;
    }
  }).catch(() => { })
};


// 新增
const addQaRef = ref(null);
const createNew = () => addQaRef.value.open();
const afterCreate = () => {
  page_num.value = 1
  getFileList()
};

defineExpose({ openModal });
</script>
<style lang="scss">
.qa-img-uploader{
  .el-upload--picture-card{
    width: 55px !important;
    height: 55px !important;
  }
  .el-upload-list__item{
    width: 55px !important;
    height: 55px !important;
  }
}

</style>
