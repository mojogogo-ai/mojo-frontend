<template>
  <mojoDialogTranslucent
    v-model="isVisible"
    v-bind="$attrs"
    :title="'Knowledge sources'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      label-position="top"
      :model="form"
      :rules="rules"
      :disabled="loading || isUploading"
      @submit.prevent
    >
      <el-form-item
        :label="'Select the knowledge sources that your bot uses for its responses'"
        prop="fileList"
      >
        <el-upload
          ref="uploadRef"
          :file-list="form.fileList"
          class="upload-demo w-full mt-[16px]"
          :auto-upload="false"
          :limit="5"
          :accept="'application/pdf,.txt,.pptx'"
          :on-change="handleFileSelect"
          :before-upload="beforeUpload"
          :on-exceed="handleExceed"
          :on-remove="handleFileRemove"
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
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="loading" @click="close">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="loading" :disabled="loading" @click="submitForm">
        {{ 'Confirm' }}
      </el-button>
    </template>
  </mojoDialogTranslucent>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import { t } from '@gptx/base/i18n';
import { getOssPresignedUrlV2 } from '@gptx/base/api/user';
// import { botFileSave, updateBotFile } from '@gptx/base/api/application';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { ElMessage } from 'element-plus';

const emits = defineEmits(['after-upload-knowledge']);
const isVisible = ref(false);
const isEdit = ref(false);
// const botId = ref(null);
const form = reactive({
  name: '',
  file_url: '',
  fileList: []
});

const rules = reactive({
  name: [{ required: true, message: t('docs.ruleMessage.name'), trigger: 'blur' }],
  file: [{ required: true, message: t('docs.ruleMessage.file'), trigger: 'change' }]
});

const formRef = ref(null);
const loading = ref(false);
const isUploading = ref(false);
const selectedFile = ref(null);
const selectedFileName = ref('');
const handleFileRemove = (file) => {
  // 从 fileList 中移除该文件
  console.log('item.file', form.fileList)
  console.log(file, '文件')
  form.fileList = form.fileList.filter((item) => item.file !== file.file);
  ElMessage.success('File removed successfully!');
};

const open = async (option) => {
  isVisible.value = true;
  await nextTick();
  formRef.value.resetFields();
  // botId.value = option.id;

  // 如果提供了文件列表，则进入编辑模式并加载文件
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
    // 新增模式
    isEdit.value = false;
    form.fileList = [];
  }
};


const close = () => {
  isVisible.value = false;
  formRef.value.resetFields();
  selectedFile.value = null;
  selectedFileName.value = '';
  form.fileList = [];
};

const handleFileSelect = async (file) => {
  const actualFile = file.raw;

  if (!(actualFile instanceof File)) {
    console.error("Invalid file type received:", actualFile);
    return false;
  }

  // 检查文件类型
  const allowedExtensions = ['pdf', 'txt', 'pptx'];
  const fileExtension = actualFile.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    ElMessage.error('Only PDF, TXT, PPTX files are allowed!');
    form.fileList = form.fileList.filter((item) => item.file !== actualFile); // 移除不符合条件的文件
    return false;
  }

  // 检查单个文件大小
  if (actualFile.size / 1024 / 1024 > 100) {
    ElMessage.error('File size exceeds 100 MB limit!');
    form.fileList = form.fileList.filter((item) => item.file !== actualFile); // 移除不符合条件的文件
    return false;
  }

  // 检查总文件数量
  if (form.fileList.length >= 5) {
    ElMessage.error('You can upload up to 5 files only.');
    return false;
  }

  // 检查总文件大小
  const totalSize = form.fileList.reduce((sum, fileData) => sum + fileData.size, 0) + actualFile.size;
  if (totalSize / 1024 / 1024 > 100) {
    ElMessage.error('Total file size exceeds 100 MB limit!');
    form.fileList = form.fileList.filter((item) => item.file !== actualFile); // 移除不符合条件的文件
    return false;
  }

  // 如果通过所有验证，则生成文件哈希并添加到文件列表
  const fileData = {
    file: actualFile,
    name: actualFile.name,
    size: actualFile.size,
    hash: await generateFileHash(actualFile)
  };

  form.fileList.push(fileData);
  ElMessage.success('File added successfully!');

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
  const form = new FormData();

  for (const [key, value] of Object.entries(form_data)) {
    form.append(key, value);
  }

  form.append('file', file);

  await axios.post(upload_url, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

const submitForm = async () => {
  // if (form.fileList.length === 0) {
  //   // 提示文件设置为空
  // }
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
      // await updateBotFile({
      //   bot_id: botId.value,
      //   file_id_list: fileDataList,
      // });
      ElMessage.success('Files updated successfully!');
      emits('after-upload-knowledge', {
        // id: botId.value,
        file_id_list: fileDataList,
      });
    } else {
      // await botFileSave({
      //   bot_id: botId.value,
      //   file_id_list: fileDataList,
      // });
      ElMessage.success('Files uploaded successfully!');
      emits('after-upload-knowledge', {
        // id: botId.value,
        file_id_list: fileDataList,
      });
    }

    close();
  } catch (error) {
    console.error('文件上传失败:', error);
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

const beforeUpload = (file) => {
  const isAllowedType = ['pdf', 'txt', 'pptx'].includes(file.name.split('.').pop().toLowerCase());
  const isWithinSizeLimit = file.size / 1024 / 1024 < 100;
  if (!isAllowedType) {
    // this.$message.error('Only PDF, TXT, PPTX files are allowed!');
    ElMessage.error('Only PDF, TXT, PPTX files are allowed!');
  }
  if (!isWithinSizeLimit) {
    // this.$message.error('File size exceeds 100 MB limit!');
    ElMessage.error('File size exceeds 100 MB limit!');
  }
  return isAllowedType && isWithinSizeLimit;
};

const handleExceed = () => {
  // this.$message.warning('You can upload up to 5 files only.');
  ElMessage.warning('You can upload up to 5 files only.');
};

defineExpose({ open });
</script>

<style lang="scss" scoped>
:deep(.el-upload) {
  width: 100%;
  //margin-top: 16px;
}

.upload-custom {
  flex-direction: column;
  align-items: center;
  color: #999;
  cursor: pointer;
  width: 100%;
  transition: border-color 0.3s;
  display: inline-flex;
  height: 215px;
  padding: 46px 16px 0;
  flex-shrink: 0;
  border-radius: 12px;
  border: 1px dashed #C5C5C5;
  background: rgba(0, 0, 0, 0.50);
  backdrop-filter: blur(50px);

  .upload-custom-text {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .upload-custom-text-top {
      color: #FFF;
      text-align: center;
      font-feature-settings: 'dlig' on;
      font-family: "TT Norms Pro";
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 23px; /* 143.75% */
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

</style>
