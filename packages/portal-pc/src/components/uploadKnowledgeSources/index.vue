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
          :file-list="form.fileList"
          class="upload-demo w-full mt-[16px]"
          ref="uploadRef"
          :auto-upload="false"
          :limit="5"
          :accept="'application/pdf,.txt,.pptx'"
          :on-change="handleFileSelect"
          :before-upload="beforeUpload"
          :on-exceed="handleExceed"
        >
          <div class="upload-custom">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="37" viewBox="0 0 36 37" fill="none">
              <path d="M16.5 24.5V12.275L12.6 16.175L10.5 14L18 6.5L25.5 14L23.4 16.175L19.5 12.275V24.5H16.5ZM9 30.5C8.175 30.5 7.469 30.2065 6.882 29.6195C6.295 29.0325 6.001 28.326 6 27.5V23H9V27.5H27V23H30V27.5C30 28.325 29.7065 29.0315 29.1195 29.6195C28.5325 30.2075 27.826 30.501 27 30.5H9Z" fill="#C5C5C5"/>
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
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </mojoDialogTranslucent>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import { t } from '@gptx/base/i18n';
import { getOssPresignedUrlV2 } from '@gptx/base/api/user';
import {botFileSave} from '@gptx/base/api/application';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { ElMessage } from 'element-plus';

const emits = defineEmits(['after-upload-knowledge-sources', 'after-update']);
const isVisible = ref(false);
const isEdit = ref(false);
const botId = ref(null);
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
const fileHash = ref('');
const selectedFileName = ref('');
const fileSize = ref(0);

const open = async (option) => {
  isVisible.value = true;
  await nextTick();
  formRef.value.resetFields();
  botId.value = option.id;
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
  if (form.fileList.length === 0) {
    formRef.value.validateField('fileList');
    return;
  }
  if(botId.value ===null) {
    ElMessage.error('Please select a bot first!');
    return;
  }
  loading.value = true;
  try {
    // 遍历每个文件并上传
    const fileDataList = [];
    for (const fileData of form.fileList) {
      const { file, name, size, hash } = fileData;

      // 获取预签名 URL
      const presignedData = await getPresignedUrl(name, size, hash);
      const { upload_url, form_data, file_id_list } = presignedData.data;
      // 上传文件
      await uploadFile(upload_url, file, form_data);
      fileDataList.push(...file_id_list);
      // 保存文件 URL，便于后续使用（例如展示或提交到后端）
      fileData.url = presignedData.data.file_url;
      console.log('文件上传成功:', fileData.url);
    }

    // 提交表单数据的 API 调用
    // if (isEdit.value) {
    //   await updateKnowledgeBase(form);
    //   emits('after-update');
    // } else {
    //   await createKnowledgeBase(form);
    //   emits('after-create');
    // }
    await botFileSave({
      bot_id: botId.value,
      file_id_list: fileDataList
    });
    ElMessage.success('Files uploaded successfully!');
    emits('after-upload-knowledge-sources', {
      id: botId.value,
    });
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
      biz_type: 'static',
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
    this.$message.error('Only PDF, TXT, PPTX files are allowed!');
  }
  if (!isWithinSizeLimit) {
    this.$message.error('File size exceeds 100 MB limit!');
  }
  return isAllowedType && isWithinSizeLimit;
};

const handleExceed = () => {
  this.$message.warning('You can upload up to 5 files only.');
};

defineExpose({ open });
</script>

<style lang="scss" scoped>
:deep(.el-upload) {
  width: 100%;
  //margin-top: 16px;
}
 .upload-custom{
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
   .upload-custom-text{
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .upload-custom-text-top{
        color: #FFF;
        text-align: center;
        font-feature-settings: 'dlig' on;
        font-family: "TT Norms Pro";
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 23px; /* 143.75% */
      }
      .upload-custom-text-bottom{
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
