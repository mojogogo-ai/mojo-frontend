<template>
  <el-dialog
    v-model="visible"
    width="550px"
    destroy-on-close
    :title="t('base.label.nf')"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <template v-if="isList">
      <el-upload
        ref="uploadRef"
        v-model:file-list="curList"
        :action="action"
        :headers="headers"
        :auto-upload="false"
        :on-success="onFileUploadSuccess"
      >
        <template #file="{ file }">
          <div
            class="file-list"
            :class="{ 'is-fail': file.status === 'fail' }"
            :style="{ '--after-width': `${file.percentage}%` }"
          >
            <div class="relative flex items-center w-full">
              <el-image
                class="mr-2 file-list-icon"
                fit="contain"
                :src="docIcons[/\.[^\.]+$/.exec(file.name)[0].toLocaleLowerCase()]"
              />
              <div
                class="w-3/5 line-clamp-1"
                :title="file.name"
              >
                {{ file.name }}
              </div>
              <div class="mx-2">
                {{ filesize(file.size) }}
              </div>
              <div class="flex items-center ml-auto">
                <el-button
                  v-if="file.status === 'fail'"
                  type="primary"
                  icon="refresh"
                  link
                  @click="onFileRetry(file)"
                />
                <el-button
                  v-if="file.status === 'uploading'"
                  text
                >
                  {{ `${file.percentage}%` }}
                </el-button>
                <el-button
                  v-else
                  type="danger"
                  link
                  :disabled="loading"
                  @click="handleRemove(file)"
                >
                  <svg-icon name="delete" />
                </el-button>
              </div>
            </div>
          </div>
        </template>
      </el-upload>
    </template>
    <template v-else>
      <div class="my-4">
        <el-upload
          v-model:file-list="curList"
          drag
          multiple
          :action="action"
          :accept="supportedFileType.join(', ')"
          :limit="5"
          :show-file-list="false"
          :headers="headers"
          :before-upload="handleBeforeUpload"
          :http-request="handleUpload"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
        >
          <div class="px-2 text-[3em]">
            <svg-icon name="upload" />
          </div>
          <div class="px-2">
            {{ t('base.uploadTip') }}
            <span class="cursor-pointer text-[var(--el-color-primary)] hover:opacity-85">
              {{ t('base.btn') }}
            </span>
          </div>
          <div
            class="px-2"
          >
            {{ t('chat.uploadSupport') }}
          </div>
        </el-upload>
      </div>
    </template>
    <template #footer>
      <el-button
        :disabled="loading"
        @click="visible = false"
      >
        {{ t('common.cancel') }}
      </el-button>
      <el-button
        v-if="isList"
        type="primary"
        linear
        :loading="loading"
        :disabled="loading"
        @click="onConfirmFileList"
      >
        {{ t('common.ok') }}
      </el-button>
      <el-button
        v-else
        type="primary"
        linear
        :disabled="curList.length === 0 || loading"
        :loading="loading"
      >
        {{ t('common.next') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { filesize } from 'filesize';
import { getToken } from '@gptx/base/utils/auth';
// import { getCurLang } from '@gptx/base';
// import { isMobi } from '@gptx/base/utils/index';
import { t } from '@gptx/base/i18n';
import IconHtml from '@/assets/images/base/upload/html.svg';
import IconMd from '@/assets/images/base/upload/md.svg';
import IconPdf from '@/assets/images/base/upload/pdf.svg';
import IconTxt from '@/assets/images/base/upload/txt.svg';
import IconExcel from '@/assets/images/base/upload/xls.svg';
import IconDoc from '@/assets/images/base/upload/doc.svg';
import IconCsv from '@/assets/images/base/upload/csv.svg';

// 知识库id

// 上传文档之后触发更新
const emit = defineEmits(['reload']);

const visible = ref(false);
const headers = ref({ Authorization: '' });
const action = window.BASE_API + '/portal/conversation/chat-file';
const curList = ref([]);
const loading = ref(false);
// is show file list
const isList = ref(false);
let timer = null;
const uploadRef = ref(null);
const docIcons = {
  '.pdf': IconPdf,
  '.doc': IconDoc,
  '.docx': IconDoc,
  '.txt': IconTxt,
  '.html': IconHtml,
  '.md': IconMd,
  '.xls': IconExcel,
  '.xlsx': IconExcel,
  '.csv': IconCsv
};
// const supportedFileType = ['.pdf', '.doc', '.docx', '.txt', '.html', '.md', '.csv', '.xls', '.xlsx', '.ppt', '.pptx'];
const supportedFileType = ['.pdf', '.docx', '.txt', '.ppt', '.pptx'];

const handleClose = () => {
  visible.value = false;
};

const openModal = () => {
  curList.value = [];
  visible.value = true;
  isList.value = false;
};

const handleRemove = (file) => {
  const uid = file.uid;
  const index = curList.value.findIndex((_) => _.uid === uid);
  curList.value.splice(index, 1);
  if (curList.value.length <= 0) {
    isList.value = false;
  }
};
// retry upload
const onFileRetry = ({ uid }) => {
  curList.value.forEach((_) => {
    if (uid === _.uid) {
      _.status = 'ready';
      _.percentage = 0;
    }
  });
  handleUpload();
};
// 覆盖默认 上传
const handleUpload = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  timer = setTimeout(async () => {
    isList.value = true;
    loading.value = true;
    await nextTick();
    uploadRef.value.submit();
  }, 300);
};
const onFileUploadSuccess = (res, file, files) => {
  const { code, msg } = res;
  if (code === 200) {
    curList.value = files;
  } else {
    ElMessage.error(msg);
    file.status = 'fail';
  }
  const l = files.filter((_) => {
    return ['fail', 'success', 'ready'].includes(_.status);
  }).length;
  if (l === files.length) {
    loading.value = false;
  }
};
const onConfirmFileList = async () => {
  console.log(curList.value,'curList.value999')
  let resFile = curList.value.filter((i)=>{return i.response && i.response.code === 200})
//   {
//   "message_id": 12760,
//   "fid": 489,
//   "file_name": "中金-AI十年展望（五）：从ChatGPT到通用智能，新长征上的新变化20220203.pdf",
//   "file_size": 2920056,
//   "file_ext": ".pdf",
//   "file_content_type": "application/pdf",
//   "file_exist": true
// }
  resFile = resFile.map((i)=>{
    return {
      "message_id": '',
      "fid": '',
      "file_name": i.name,
      "file_size": i.size,
      "file_ext": "",
      "file_content_type": i.raw.type,
      "file_exist": true,
      ref: i.response.data.ref
    }
  })

  visible.value = false;
  emit('reload', resFile);
};

// 限制上传
const handleBeforeUpload = async (file) => {
  // const lang = getCurLang();
  let authToken = await getToken();
  headers.value.Authorization = 'Bearer ' + authToken;
  // headers.value['X-Client-Locale'] = lang === 'zh' ? 'zh-CN' : lang;
  // headers.value['X-Client-Timezone-Offset'] = new Date().getTimezoneOffset(); // timezone offset
  // headers.value['X-Client-Type'] = isMobi() ? 'H5' : 'WEB'; // X-Client-Type
  // headers.value['X-Client-Site'] = window.SITE_TYPE; // X-Client-Site
  const isLt1M = file.size / 1024 / 1024 < 20;
  if (!isLt1M) {
    ElMessage.error(`${t('base.fileName')}${file.name}${t('base.p')}20MB!`);
    return false;
  }
  const fileExtensions = supportedFileType.map((_) => _.substring(1));
  if (!fileExtensions.includes(file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase())) {
    ElMessage.error(`${t('base.fileName')}文件${file.name}${t('base.pp')}`);
    return false;
  }
};

// 超出提示
const handleExceed = (files) => {
  if (files.length > 5) {
    ElMessage.error(t('base.a1'));
  }
};

// 暴露方法给父组件，供父组件调用
defineExpose({ openModal });
</script>
<style lang="scss" scoped>
.upload-type {
  display: flex;

  &-block {
    flex: 1;
    flex-shrink: 0;
    padding: 8px 16px;
    background-color: #fff;
    border-radius: 11px;
    box-shadow: 0 1px 2px 1px rgba(#000, 0.16);

    &:hover {
      border-color: var(--el-border-color-hover);
    }

    & + & {
      margin-left: 15px;
    }
  }
}

.file-list {
  --after-width: 0;
  --border-color: var(--el-color-primary-light-5);
  --track-bg: var(--el-color-primary-light-9);
  position: relative;
  display: flex;
  align-items: center;
  height: 50px;
  line-height: 24px;
  padding: 0 12px;
  margin-bottom: 6px;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  overflow: hidden;

  &::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    content: '';
    width: var(--after-width);
    border-radius: 8px;
    background: linear-gradient(180deg, var(--track-bg) 0%, var(--track-bg) 100%);
    transition: width 10ms linear;
  }

  &.is-fail {
    --border-color: var(--el-color-warning-light-5);
    --track-bg: var(--el-color-warning-light-9);
  }
}

.file-list-icon {
  width: 24px;
  height: 24px;
}
</style>
