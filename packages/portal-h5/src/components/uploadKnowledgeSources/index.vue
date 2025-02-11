<template>
  <mojoDialogTranslucent
    v-model:show="isVisible"
    v-bind="$attrs"
    closeable
    round
    teleport="body"
    @close="close"
  >
    <template #title>
      Knowledge sources
    </template>
    <div class="dialog-content">
      <van-form
        ref="formRef"
        @submit.prevent
      >
        <van-uploader
          v-model="form.fileList"
          multiple
          :max-count="5"
          :max-size="100 * 1024 * 1024"
          accept=".pdf,.txt,.pptx"
          :before-read="beforeUpload"
          :disabled="loading || isUploading"
          class="w-full mt-4 upload-demo"
          :after-read="handleFileSelect"
          @oversize="handleExceed"
        >
          <div class="upload-custom">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="37" viewBox="0 0 36 37" fill="none">
              <path d="M16.5 24.5V12.275L12.6 16.175L10.5 14L18 6.5L25.5 14L23.4 16.175L19.5 12.275V24.5H16.5ZM9 30.5C8.175 30.5 7.469 30.2065 6.882 29.6195C6.295 29.0325 6.001 28.326 6 27.5V23H9V27.5H27V23H30V27.5C30 28.325 29.7065 29.0315 29.1195 29.6195C28.5325 30.2075 27.826 30.501 27 30.5H9Z" fill="#C5C5C5" />
            </svg>
            <div class="upload-custom-text">
              <div class="upload-custom-text-top">
                Click to upload file or drag it here
              </div>
              <div class="upload-custom-text-bottom">
                Up to 5 files, total 100 MB, PDF, TXT, PPTX
              </div>
            </div>
          </div>
        </van-uploader>
      </van-form>
      <div class="dialog-footer">
        <van-button :disabled="loading" @click="close">{{ t('common.cancel') }}</van-button>
        <van-button type="primary" :loading="loading" :disabled="loading" @click="submitForm">
          {{ 'Next Step' }}
        </van-button>
      </div>
    </div>
  </mojoDialogTranslucent>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import { t } from '@gptx/base/i18n';
import { getOssPresignedUrlV2 } from '@gptx/base/api/user';
import { botFileSave, updateBotFile } from '@gptx/base/api/application';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { showFailToast, showSuccessToast } from 'vant';

const emits = defineEmits(['after-upload-knowledge-sources', 'after-update']);
const isVisible = ref(false);
const isEdit = ref(false);
const botId = ref(null);
const form = reactive({
  name: '',
  file_url: '',
  fileList: []
});

const formRef = ref(null);
const loading = ref(false);
const isUploading = ref(false);
const selectedFile = ref(null);
const selectedFileName = ref('');

const open = async (option) => {
  isVisible.value = true;
  await nextTick();
  if (formRef.value && formRef.value.resetFields) {
    formRef.value.resetFields(); // 根据 Vant 的表单处理方式调整
  }
  botId.value = option.id;

  if (option.files && Array.isArray(option.files)) {
    isEdit.value = true;
    form.fileList = option.files.map((file) => ({
      id: file.id,
      file: new File([""], file.file_name), // 使用空文件对象仅作展示
      name: file.file_name,
      size: 0, // 大小可以省略或保持默认值，因为已有文件无需验证大小
      url: file.file_url, // 已有文件的URL，便于显示和后续操作
    }));
  } else {
    isEdit.value = false;
    form.fileList = [];
  }
};

const close = () => {
  isVisible.value = false;
  if (formRef.value && formRef.value.resetFields) {
    formRef.value.resetFields(); // 根据 Vant 的表单处理方式调整
  }
  selectedFile.value = null;
  selectedFileName.value = '';
  form.fileList = [];
};

const handleFileSelect = async (files) => {
  // 确保处理的是数组
  console.log('handleFileSelect', files);
  const fileList = Array.isArray(files) ? files : [files];

  for (const file of fileList) {
    const actualFile = file.file || file; // 根据具体情况获取 File 对象

    if (!(actualFile instanceof File)) {
      console.error("接收到的文件类型无效:", actualFile);
      showFailToast('无效的文件类型！');
      continue;
    }

    // 检查文件类型
    const allowedExtensions = ['pdf', 'txt', 'pptx'];
    const fileExtension = actualFile.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      showFailToast('仅支持 PDF, TXT, PPTX 文件上传！');
      form.fileList = form.fileList.filter((item) => item.file !== actualFile); // 移除不符合条件的文件
      continue;
    }

    // 检查单个文件大小
    if (actualFile.size / 1024 / 1024 > 100) {
      showFailToast('文件大小不能超过 100 MB！');
      form.fileList = form.fileList.filter((item) => item.file !== actualFile); // 移除不符合条件的文件
      continue;
    }

    // 检查总文件数量
    if (form.fileList.length >= 5) {
      showFailToast('最多只能上传 5 个文件。');
      break; // 超过数量限制后停止处理剩余文件
    }

    // 检查总文件大小
    const totalSize = form.fileList.reduce((sum, fileData) => sum + (fileData.size || 0), 0) + actualFile.size;
    if (totalSize / 1024 / 1024 > 100) {
      showFailToast('所有文件总大小不能超过 100 MB！');
      form.fileList = form.fileList.filter((item) => item.file !== actualFile); // 移除不符合条件的文件
      continue;
    }

    // 生成文件哈希并添加到文件列表
    try {
      const fileHash = await generateFileHash(actualFile);
      const fileData = {
        file: actualFile,
        name: actualFile.name,
        size: actualFile.size,
        hash: fileHash
      };

      // form.fileList.push(fileData);
      // form.fileList = [...form.fileList, fileData];
      // 替换掉原有文件对象，避免 Vant 组件的 bug
      form.fileList = form.fileList.map((item) => item.file === actualFile ? fileData : item);


      showSuccessToast(`${actualFile.name} 添加成功！`);
    } catch (error) {
      console.error("生成文件哈希失败:", error);
      showFailToast(`${actualFile.name} 处理失败！`);
    }
  }

  return false; // 防止自动上传
};

const generateFileHash = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target.result;
      const wordArray = CryptoJS.lib.WordArray.create(fileData);
      const hash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
      console.log('文件哈希:', hash);
      resolve(hash);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

const uploadFile = async (upload_url, file, form_data) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(form_data)) {
    formData.append(key, value);
  }

  formData.append('file', file);

  await axios.post(upload_url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

const submitForm = async () => {
  if (botId.value === null) {
    showFailToast('Please select a bot first!');
    return;
  }
  loading.value = true;
  try {
    const fileDataList = [];
    for (const fileData of form.fileList) {
      if (!fileData.url) { // 新增文件
        const { file, name, size, hash } = fileData;
        const presignedData = await getPresignedUrl(name, size, hash);
        const { upload_url, form_data, file_id_list } = presignedData.data;
        await uploadFile(upload_url, file, form_data);
        fileDataList.push(...file_id_list);
        fileData.url = presignedData.data.file_url;
        console.log('文件上传成功:', fileData.url);
      } else {
        // 已有文件直接使用其ID
        fileDataList.push(fileData.id);
      }
    }

    // 根据 isEdit 状态选择调用不同的 API
    if (isEdit.value) {
      await updateBotFile({
        bot_id: botId.value,
        file_id_list: fileDataList,
      });
      showSuccessToast('Files updated successfully!');
      emits('after-upload-knowledge-sources', {
        id: botId.value,
      });
    } else {
      await botFileSave({
        bot_id: botId.value,
        file_id_list: fileDataList,
      });
      showSuccessToast('Files uploaded successfully!');
      emits('after-upload-knowledge-sources', {
        id: botId.value,
      });
    }

    close();
  } catch (error) {
    console.error('文件上传失败:', error);
    showFailToast('File upload failed.');
  } finally {
    loading.value = false;
  }
};

// 修改 getPresignedUrl 函数，使其可以接受每个文件的信息
const getPresignedUrl = async (fileName, fileSize, fileHash) => {
  isUploading.value = true;
  try {
    const response = await getOssPresignedUrlV2({
      biz_type: 'users',
      file_name: fileName,
      file_size: fileSize,
      file_hash: fileHash
    });
    return response;
  } catch (error) {
    console.error("Failed to get presigned URL:", error);
    throw error;
  } finally {
    isUploading.value = false;
  }
};

const beforeUpload = (files) => {
  // 确保处理的是数组
  const fileList = Array.isArray(files) ? files : [files];
  let allValid = true;

  fileList.forEach(file => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isAllowedType = ['pdf', 'txt', 'pptx'].includes(fileExtension);
    const isWithinSizeLimit = file.size / 1024 / 1024 < 100;

    if (!isAllowedType) {
      showFailToast('仅支持 PDF, TXT, PPTX 文件上传！');
      allValid = false;
    }

    if (!isWithinSizeLimit) {
      showFailToast('文件大小不能超过 100 MB！');
      allValid = false;
    }
  });

  return allValid;
};


const handleExceed = () => {
  showFailToast('You can upload up to 5 files only.');
};

defineExpose({ open });
</script>

<style lang="scss" scoped>
.upload-demo {
  width: 100%;
  /* margin-top: 16px; */
  display: flex;
  align-items: center;
  justify-content: center;
  :deep(.van-uploader__wrapper){
    width: 100%;
    .van-uploader__input-wrapper{
      width: 100%;
    }
  }
}

.upload-custom {
  flex-direction: column;
  align-items: center;
  color: #999;
  cursor: pointer;
  width: 100%;
  transition: border-color 0.3s;
  display: inline-flex;
  flex-shrink: 0;
  border-radius: 12px;
  border: 1px dashed #C5C5C5;
  background: rgba(0, 0, 0, 0.50);
  backdrop-filter: blur(50px);
  height: 180px;
  padding: 10px 16px;
  justify-content: center;
  gap: 10px;
  .upload-custom-text {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .upload-custom-text-top {
      color: #FFF;
      font-feature-settings: 'dlig' on;
      font-family: "TT Norms Pro";
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 23px; /* 164.286% */
    }

    .upload-custom-text-bottom {
      color: rgba(255, 255, 255, 0.70);
      text-align: center;
      font-feature-settings: 'dlig' on;
      font-family: "TT Norms Pro";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 23px; /* 191.667% */
    }
  }
}

.dialog-content {
  padding: 16px;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.van-button + .van-button {
  margin-left: 8px;
}
</style>
