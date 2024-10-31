<template>
  <el-dialog
    v-model="isVisible"
    width="622px"
    :title="isEdit ? t('base.edit') : t('docs.new')"
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
        :label="t('docs.label.file')"
        prop="fileList"

      >
        <el-upload
          v-model:file-list="form.fileList"
          class="upload-demo"
          ref="uploadRef"
          :auto-upload="false"
          :on-change="handleFileSelect"
        >
          <el-button type="primary">{{ t('common.selectFile') }}</el-button>
          <div v-if="selectedFileName">{{ selectedFileName }}</div>
        </el-upload>
      </el-form-item>


    </el-form>
    <template #footer>
      <el-button :disabled="loading" @click="close">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="loading" :disabled="loading" @click="submitForm">
        {{ t('common.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import { t } from '@gptx/base/i18n';
import { getOssPresignedUrlV2 } from '@gptx/base/api/user'; // Adjust this import as necessary
import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';

const emits = defineEmits(['after-create', 'after-update']);
const isVisible = ref(true);
const isEdit = ref(false);

const form = reactive({
  name: '',
  fileUrl: '',
  fileList: [] // 文件列表，用于绑定到 el-upload 的 v-model:file-list

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
};

const close = () => {
  isVisible.value = false;
  formRef.value.resetFields();
  selectedFile.value = null;
  selectedFileName.value = '';
  form.fileList = [];
};

// 文件选择处理：自动获取文件信息
// 文件选择处理：自动获取文件信息
const handleFileSelect = async (file) => {
  const actualFile = file.raw; // 获取真正的 File 对象

  if (!(actualFile instanceof File)) {
    console.error("Invalid file type received:", actualFile);
    return false;
  }

  selectedFile.value = actualFile;
  selectedFileName.value = actualFile.name; // 获取文件名
  fileSize.value = actualFile.size; // 获取文件大小

  // 生成文件哈希值
  fileHash.value = await generateFileHash(actualFile);
  return false; // 防止 el-upload 自动上传
};

// 生成 SHA256 哈希的辅助函数
const generateFileHash = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target.result;
      const wordArray = CryptoJS.lib.WordArray.create(fileData); // 使用 WordArray 创建 SHA256 输入
      const hash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
      console.log('文件哈希:', hash);
      resolve(hash);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file); // 读取文件内容为 ArrayBuffer
  });
};

// 请求预签名 URL
const getPresignedUrl = async () => {
  isUploading.value = true;
  try {
    const response = await getOssPresignedUrlV2({
      biz_type: 'static', // 业务类型
      file_name: selectedFileName.value, // 文件名自动获取
      file_size: fileSize.value, // 文件大小自动获取
      file_hash: fileHash.value // 文件哈希
    });
    return response;
  } catch (error) {
    console.error("Failed to get presigned URL:", error);
    throw error;
  } finally {
    isUploading.value = false;
  }
};

// 上传文件
const uploadFile = async (uploadUrl, file, formData) => {
  // 创建 FormData 对象并附加上传所需的字段
  const form = new FormData();

  // 将 formData 中的键值对添加到 formData 对象中
  for (const [key, value] of Object.entries(formData)) {
    form.append(key, value);
  }
  // 最后添加文件本身
  form.append('file', file);

  // 使用 POST 请求上传文件
  await axios.post(uploadUrl, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};


// 提交表单
// 提交表单
const submitForm = async () => {
  if (!selectedFile.value) {
    formRef.value.validateField('file');
    return;
  }

  loading.value = true;
  try {
    // 获取预签名 URL 并提取 uploadUrl 和 formData
    const presignedData = await getPresignedUrl();
    const { uploadUrl, formData } = presignedData.data;

    // 使用上传 URL 和表单数据上传文件
    await uploadFile(uploadUrl, selectedFile.value, formData);

    // 提取文件访问 URL 并赋值到表单字段
    form.fileUrl = presignedData.data.fileUrl;
    console.log('文件上传成功:', form.fileUrl);

    // 提交表单数据的 API 调用
    if (isEdit.value) {
      await updateKnowledgeBase(form);
      emits('after-update');
    } else {
      await createKnowledgeBase(form);
      emits('after-create');
    }

    close();
  } catch (error) {
    console.error('文件上传失败:', error);
  } finally {
    loading.value = false;
  }
};


// 处理文件选择变更
const handleFileChange = (file, fileList) => {
  form.fileList = fileList; // 更新文件列表到 form 中
};
defineExpose({ open });
</script>
