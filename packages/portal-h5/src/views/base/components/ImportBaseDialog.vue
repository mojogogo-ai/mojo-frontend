<template>
  <van-popup
    v-model:show="visible"
    class="cover-popup"
    position="bottom"
    closeable
  >
    <div class="cover-popup-head">
      {{ t('base.label.nf') }}
    </div>
    <div class="cover-popup-body">
      <template v-if="isList">
        <div
          v-for="file in curList"
          class="file-list"
          :class="{ 'is-fail': file.status === 'fail' }"
          :style="{ '--after-width': `${file.percentage}%` }"
        >
          <div class="relative flex items-center w-full">
            <van-image
              class="mr-2 file-list-icon shrink-0"
              fit="contain"
              :src="docIcons[/\.[^\.]+$/.exec(file.file.name)[0].toLocaleLowerCase()]"
            />
            <div
              class="w-3/5 line-clamp-1"
              :title="file.file.name"
            >
              {{ file.file.name }}
            </div>
            <div class="mx-2 shrink-0">
              {{ filesize(file.file.size) }}
            </div>
            <div class="flex items-center ml-auto">
              <van-button
                v-if="file.status !== 'fail'"
                type="primary"
                icon="replay"
                link
                @click="onFileRetry(file)"
              />
              <van-button
                v-if="file.status === 'uploading'"
                link
              >
                {{ `${file.percentage.toFixed(2)}%` }}
              </van-button>
              <van-button
                v-else
                type="danger"
                icon="delete-o"
                link
                :disabled="loading"
                @click="handleRemove(file)"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="upload-type">
          <div class="upload-type-block">
            <label class="flex">
              <div class="mr-1 shrink-0">
                <input
                  v-model="uploadFileType"
                  type="radio"
                  value="1"
                >
              </div>
              <div class="flex-1">
                <div class="">{{ t('base.label.local') }}</div>
                <div class="my-1 text-xs text-[#7a7a7a]">
                  {{ t('base.uplaodSupportLocal') }}
                </div>
              </div>
            </label>
          </div>
          <div class="upload-type-block">
            <label class="flex">
              <div class="mr-1 shrink-0">
                <input
                  v-model="uploadFileType"
                  type="radio"
                  value="2"
                >
              </div>
              <div class="flex-1">
                <div class="">{{ t('base.label.qna') }}</div>
                <div class="my-1 text-xs text-[#7a7a7a]">
                  {{ t('base.uplaodSupportQna') }}
                </div>
              </div>
            </label>
          </div>
        </div>
        <div class="my-4">
          <van-uploader
            v-model="curList"
            multiple
            :show-upload="false"
            :accept="uploadFileType === '1' ? supportedFileType.join(', ') : '.xls, .xlsx'"
            :max-cont="5"
            :max-size="1024 * 1024 * 20"
            :before-read="onFileReadBefore"
            :after-read="onFileReadAfter"
          >
            <div class="uploader-area">
              <div class="px-2 text-[3em]">
                <svg-icon name="upload" />
              </div>
              <div class="px-2">
                <span class="cursor-pointer text-[var(--van-primary-color)] hover:opacity-85">
                  {{ t('base.btn') }}
                </span>
              </div>
              <div
                v-if="uploadFileType === '1'"
                class="px-2"
              >
                {{ t('base.uploadSupport') }}
              </div>
              <div
                v-if="uploadFileType === '2'"
                class="px-2"
              >
                {{ t('base.uploadSupportQna') }}
                <van-button
                  type="primary"
                  link
                  style="vertical-align: middle; position: relative; z-index: 1"
                  @click.stop="_downloadDocSample"
                >
                  <span class="text-xs">
                    {{ t('base.downloadTemp') }}
                  </span>
                </van-button>
              </div>
            </div>
          </van-uploader>
        </div>
      </template>
    </div>
    <div class="cover-popup-foot">
      <van-button
        size="small"
        :disabled="loading"
        @click="visible = false"
      >
        {{ t('common.cancel') }}
      </van-button>
      <van-button
        v-if="isList"
        type="primary"
        size="small"
        linear
        :loading="loading"
        :disabled="loading || !curList.length"
        @click="onConfirmFileList"
      >
        {{ t('common.ok') }}
      </van-button>
      <van-button
        v-else
        type="primary"
        size="small"
        linear
        :disabled="curList.length === 0 || loading"
        :loading="loading"
      >
        {{ t('common.next') }}
      </van-button>
    </div>
  </van-popup>
</template>

<script setup>
import { filesize } from 'filesize';
import { getToken } from '@gptx/base/utils/auth';
// import { getCurLang } from '@gptx/base';
import { downloadDocSample, saveKnowledgeDocFiles } from '@gptx/base/api/knowledge';
import { t } from '@gptx/base/i18n';
import IconHtml from '@/assets/images/base/upload/html.svg';
import IconMd from '@/assets/images/base/upload/md.svg';
import IconPdf from '@/assets/images/base/upload/pdf.svg';
import IconTxt from '@/assets/images/base/upload/txt.svg';
import IconExcel from '@/assets/images/base/upload/xls.svg';
import IconDoc from '@/assets/images/base/upload/doc.svg';
import IconCsv from '@/assets/images/base/upload/csv.svg';
import { showToast } from 'vant';

// 知识库id
const props = defineProps({
  docMainId: {
    type: [Number, String],
    default: null
  }
});
// 上传文档之后触发更新
const emit = defineEmits(['reload']);

const visible = ref(false);
const action = window.BASE_API + '/portal/knowledge/doc-file-upload';
const curList = ref([]);
const loading = ref(false);
const uploadFileType = ref('1');
// is show file list
const isList = ref(false);
let timer = null;
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
const supportedFileType = ['.pdf', '.doc', '.docx', '.txt', '.html', '.md', '.csv', '.xls', '.xlsx', '.ppt', '.pptx'];
const maxLimitCount = 5;

const handleClose = () => {
  visible.value = false;
};

const openModal = () => {
  curList.value = [];
  visible.value = true;
  isList.value = false;
};

const handleRemove = (file) => {
  const {
    response: {
      data: { doc_id }
    }
  } = file;
  const index = curList.value.findIndex((_) => _?.response?.data?.doc_id === doc_id);
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
    curList.value.forEach(uploadXhr);
  }, 300);
};
const onFileUploadSuccess = (res, file, files) => {
  const { code, msg } = res;
  if (code === 200) {
    curList.value = files;
  } else {
    showToast({ message: msg, position: 'top' });
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
  try {
    loading.value = true;
    const docIds = curList.value.map((result) => result?.response?.data?.fid);
    const { code, data } = await saveKnowledgeDocFiles({
      base_id: props.docMainId,
      fid_list: docIds,
      file_type: uploadFileType.value
    });
    if (code === 200) {
      emit('reload', data.successful_fid_list);
      handleClose();
      loading.value = false;
    }
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};

// 超出提示
// const handleExceed = (files) => {
//   if (files.length > 5) {
//     showToast({
//       message: t('base.a1'),
//       position: 'top'
//     });
//   }
// };

const _downloadDocSample = async () => {
  const data = await downloadDocSample();
  let aTag = document.createElement('a');
  aTag.download = `${t('base.sample')}.xlsx`;
  aTag.href = URL.createObjectURL(data);
  document.body.appendChild(aTag);
  aTag.click();
  await nextTick();
  document.body.removeChild(aTag);
};
const checkFileValidate = (file) => {
  const isLt1M = file.size / 1024 / 1024 < 20;
  if (!isLt1M) {
    showToast({
      message: `${t('base.fileName')}${file.name}${t('base.p')}20MB!`,
      position: 'top'
    });
  }
  const fileExtensions = supportedFileType.map((_) => _.substring(1));
  if (!fileExtensions.includes(file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase())) {
    showToast({
      message: `${t('base.fileName')}文件${file.name}${t('base.pp')}`,
      position: 'top'
    });
  }
};
const onFileReadBefore = async (file) => {
  let fileArray = [];
  if (Array.isArray(file)) {
    if (file.length > maxLimitCount) file = file.slice(0, maxLimitCount);
    file.forEach((_) => {
      if (checkFileValidate(_)) {
        fileArray.push(file);
      }
    });
  } else {
    if (checkFileValidate(file)) {
      fileArray.push(file);
    }
  }
  curList.value = fileArray;
};
const onFileReadAfter = async (file) => {
  handleUpload(file);
};

const uploadXhr = async (file) => {
  const formData = new FormData();
  formData.append('file', file.file);
  formData.append('base_id', props.docMainId);
  formData.append('file_type', uploadFileType.value);
  const xhr = new XMLHttpRequest();
  // const lang = getCurLang();
  xhr.upload.onprogress = (evt) => {
    file.percentage = evt.total > 0 ? (evt.loaded / evt.total) * 100 : 0;
    file.status = 'uploading';
    if (evt.total === evt.loaded) {
      file.status = 'success';
    }
  };
  xhr.addEventListener('error', () => {
    file.status = 'fail';
  });
  xhr.addEventListener('load', () => {
    file.status = 'ready';
  });
  xhr.open('POST', action);
  let authToken = await getToken();
  xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
  // xhr.setRequestHeader('X-Client-Locale', lang === 'zh' ? 'zh-CN' : lang);
  // xhr.setRequestHeader('X-Client-Timezone-Offset', new Date().getTimezoneOffset());
  // xhr.setRequestHeader('X-Client-Type', isMobi() ? 'H5' : 'WEB');
  xhr.send(formData);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const res = JSON.parse(xhr.responseText);
      file.response = res;
      onFileUploadSuccess(res, file, curList.value);
    }
  };
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

    & + & {
      margin-left: 15px;
    }
  }
}

.file-list {
  --after-width: 0;
  --border-color: var(--h5-color-primary-light-5);
  --track-bg: var(--h5-color-primary-light-9);
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
    --border-color: #f3d19e;
    --track-bg: #fdf6ec;
  }
}

.file-list-icon {
  width: 24px;
  height: 24px;
}

.text-\[var\(--van-primary-color\)\] {
  color: var(--van-primary-color);
}

.uploader-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 10px;
  text-align: center;
  background-color: #fff;
  border: 1px dashed var(--van-border-color);
  border-radius: 6px;
}

:deep(.van-uploader__preview) {
  display: none;
}

:deep(.van-uploader) {
  width: 100%;

  .van-uploader__input-wrapper,
  .van-uploader__wrapper {
    width: 100%;
  }
}
</style>
