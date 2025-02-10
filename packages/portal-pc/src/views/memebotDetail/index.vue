<template>
  <div class="text-center mt-[80px] mb-[80px] text-[#e1ff01] text-[28px] font-bold font-['TT Norms Pro'] leading-[23px]">
    Coin Detail
  </div>
  <div class="w-[800px] mx-auto memebot-detail mb-[40px]">
    <div class="memebot-detail-top">
      <div class="detail-icon">
        <el-image
          class="cursor-pointer bmicl-avatar-img"
          fit="cover"
          :src="form.icon"
        />
      </div>
      <div class="detail-base">
        <div class="detail-name">
          {{ form.name }}
        </div>
        <div class="detail-meme-socials">
          <div class="detail-meme">
            <svg-icon
              name="coin"
            />
            <span class="symbol"> {{ form.symbol }}</span>
          </div>
          <div class="detail-socials">
            <div v-if="form.twitter" class="social">
              <svg-icon
                name="prime_twitter"
                class="icon"
              />

              Twitter
            </div>
            <div v-if="form.telegram" class="social">
              <svg-icon
                name="telegram"
                class="icon"
              />
              Telegram
            </div>
            <div v-if="form.website" class="social">
              <svg-icon
                name="web-fill"
                class="icon"

              />
              Website
            </div>
          </div>
        </div>
        <div class="detail-introduction">
          {{ form.introduction }}
        </div>

      </div>
    </div>
    <div class="memebot-detail-bottom">
      <div class="bottom-label">
        Customize Twitter Bot
      </div>
      <el-form
        ref="formRef"
        label-position="top"
        :model="form"
        @submit.prevent
      >
        <el-form-item
          label="Knowledge sources"
          prop="fileList"
        >
          <el-upload
            ref="uploadRef"
            :file-list="form.fileList"
            class="upload-part"
            :auto-upload="false"
            :disabled="form.fileList.length >= 5"
            :limit="5"
            :accept="'application/pdf,.txt,.pptx'"
            :on-change="handleFileSelect"
            :before-upload="beforeUpload"
            :on-exceed="handleExceed"
            :on-remove="handleFileRemove"
          >
            <div class="upload-custom">
              <svg-icon name="upload-file" class="upload-file-icon" />
              <div class="upload-custom-text-top">
                Click to upload file or drag it here
              </div>
              <div class="upload-custom-text-bottom">
                Up to 5 files, total 100 MB, PDF, TXT, PPTX
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="function"
          prop="grade"
        >
          <el-select
            v-model="form.grade"
            placeholder="Select"
            size="large"
            style="width: 240px"
          >
            <el-option label="basic" value="basic" />
            <el-option label="advanced" value="advanced" />
          </el-select>
        </el-form-item>
        <div v-show="form.grade === 'advanced'">
          <el-form-item
            label="Reply to Twitter Comments"
            prop="twitter_comment"
            class="switch-part"
          >
            <el-switch
              v-model="form.twitter_comment"
              active-color="#1da1f2"
              inactive-color="#ccc"
            />
          </el-form-item>
          <el-form-item
            label="Configure Telegram Bot"
            prop="telegram_config"
            class="switch-part"
          >
            <el-switch
              v-model="form.telegram_config"
              @change="toggleTelegramConfiguration"
              active-color="#1da1f2"
              inactive-color="#ccc"
            />
          </el-form-item>
          <div v-if="form.telegram_config">
            <div class="w-[552px] h-9 flex flex-col">
              <span class="text-white/70 text-[13px] font-normal font-['TT Norms Pro'] leading-none">Connect to Telegram bots and chat with this bot in Telegram App.</span>
              <span
                class="text-[#e1ff01] text-[13px] font-normal font-['TT Norms Pro'] mt-1 mb-2 leading-none cursor-pointer hover:"
                @click="getTgToken">How to get Telegram Bot adress and token?</span>
            </div>
            <el-form-item
              prop="telegram_bot_address"
            >
              <el-input
                v-model="form.telegram_bot_address"
                placeholder="Enter Telegram Bot address"
                maxlength="255"
                clearable
              />
            </el-form-item>
            <el-form-item
              prop="telegram_bot_token"
            >
              <div class="w-[552px] h-5 flex flex-col"></div>
              <el-input
                v-model="form.telegram_bot_token"
                placeholder="Please enter Telegram Bot token"
                maxlength="10000"
                clearable
              />
            </el-form-item>
          </div>

        </div>
        <el-form-item class="detail-button">
          <el-button>Cancel</el-button>
          <el-button type="primary" @click="submitFile">Confirm</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { getBotInfo, updateBotFile } from '@gptx/base/api/application.js';
import { ElMessage } from 'element-plus';
import { t } from '@gptx/base/i18n/index.js';
import { reactive, ref } from 'vue';
import coinImageUrl from '@/assets/images/coin.png';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { getOssPresignedUrlV2 } from '@gptx/base/api/user.js';

const route = useRoute();
const form = reactive({
  id: '',
  name: '',
  gender: null,
  classification: [],//  conversation
  symbol: '',
  introduction: '',
  icon: '',
  twitter: '',
  telegram: '',
  website: '',
  fileList: [],
  file_id_list: [],
  twitter_comment: false,
  telegram_config: false,
  telegram_bot_address: '',
  telegram_bot_token: '',
  grade: 'basic'
});
const loading = ref(false);
const formRef = ref(null);
const _getMemeDetail = async () => {
  const id = route.query.id;
  if (id) {
    try {
      const { code, data } = await getBotInfo({
        id: id
      });
      if (code === 200) {
        form.id = data.id;
        form.icon = data.icon;
        form.name = data.name;
        form.introduction = data.introduction;
        form.classification = data.classification;
        form.gender = data.gender;
        form.symbol = data.symbol;
        form.twitter = data.twitter;
        form.telegram = data.telegram;
        form.website = data.website;
      }
    } catch (error) {
      ElMessage.error(t('bots.error.getDetail'));
    } finally {

    }
  }
};
_getMemeDetail();
const getTgToken = () => {
  window.open('https://www.siteguarding.com/en/how-to-get-telegram-bot-api-token', '_blank');
};
const handleFileSelect = async (file) => {
  const actualFile = file.raw;

  if (!(actualFile instanceof File)) {
    console.error('Invalid file type received:', actualFile);
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
  removeDuplicateFiles(actualFile);
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
const removeDuplicateFiles = (newFile) => {
  form.fileList = form.fileList.filter((item) => item.name !== newFile.name);
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

const handleFileRemove = (file) => {
  // 从 fileList 中移除该文件
  form.fileList = form.fileList.filter((item) => item.file !== file.file);
  ElMessage.success('File removed successfully!');
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
const submitFile = async () => {
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
    await updateBotFile({
      bot_id: form.id,
      file_id_list: fileDataList,
    });
    ElMessage.success('Files updated successfully!');
    form.file_id_list = fileDataList;
  } catch (error) {
    console.error('文件上传失败:', error);
  } finally {

  }
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
const getPresignedUrl = async (fileName, fileSize, fileHash) => {
  try {
    const response = await getOssPresignedUrlV2({
      biz_type: 'users',
      file_name: fileName,
      file_size: fileSize,
      file_hash: fileHash
    });
    return response;
  } catch (error) {
    console.error('Failed to get presigned URL:', error);
    throw error;
  } finally {
  }
};
const toggleTelegramConfiguration = () => {
  if (!form.telegram_config) {
    form.telegram_bot_address = '';
    form.telegram_bot_token = '';
  }
};
const submitHandle = (el) => {

}
</script>

<style lang="scss" scoped>
.memebot-detail{
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(50px);
}
.memebot-detail-top{
  padding: 40px 40px 48px;
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.10);
  .detail-icon {
    margin-right: 31px;
    :deep(.el-image){
      border-radius: 12px;
      width: 103px;
      height: 103px;
    }
  }
  .detail-base{
    .detail-name{
      color: #FFF;
      font-family: Inter;
      font-size: 28px;
      font-style: normal;
      font-weight: 600;
      line-height: 19px; /* 67.857% */
      margin-bottom: 16px;
    }
    .detail-meme-socials{
      display: flex;
      align-items: center;
      gap: 90px;
      margin-bottom: 26px;
      .detail-meme{
        display: flex;
        align-items: center;
        color: #FFF;
        font-feature-settings: 'dlig' on;
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 23px; /* 143.75% */
        .symbol{
          margin-left: 4px;
        }
      }
      .detail-socials {
        display: flex;
        gap: 8px;
        .social{
          border-radius: 21.6px;
          background: var(--Style, #E1FF01);
          color: #000;
          font-feature-settings: 'dlig' on;
          font-family: Inter;
          font-size: 11.2px;
          font-style: normal;
          font-weight: 500;
          line-height: 20.8px; /* 185.714% */
          display: flex;
          padding: 1.6px 6.4px;
          align-items: center;
          gap: 3.2px;
          .icon{
            font-size: 16px;
          }
        }
      }
    }
    .detail-introduction{
      width: 471.059px;
      color: rgba(255, 255, 255, 0.70);
      font-feature-settings: 'dlig' on;
      font-family: "TT Norms Pro";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%; /* 21px */
    }
  }
}
.memebot-detail-bottom{
  padding: 44px 40px 40px 174px;
  :deep(.el-form-item__label) {
    margin-bottom: 16px;
  }
  .bottom-label{
    color: #FFF;
    font-feature-settings: 'dlig' on;
    font-family: "TT Norms Pro";
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 23px; /* 115% */
    margin-bottom: 42px;
  }
  .upload-part{
    width: 100%;

    :deep(.el-upload) {
      height: 180px;
      width: 100%;
      border-radius: 12px;
      border: 1px dashed rgba(255, 255, 255, 0.20);
      background: #202020;
      backdrop-filter: blur(50px);
      //height: 180px;
    }
    :deep(.el-icon--document) {
      color: #fff;
    }

    :deep(.el-upload-list__item:hover) {
      color: #000;
      .el-icon--document{
        color: #000;
      }
      .el-upload-list__item-file-name{
        color: #000;
      }
      .el-icon--close{
        color: #000;
      }
    }
    .upload-custom{
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .upload-file-icon{
        font-size: 36px;
      }
      //.upload-custom-text-top{
      //  width: 100%;
      //  text-align: center;
      //}
      //.upload-custom-text-bottom{
      //  width: 100%;
      //  text-align: center;
      //}
    }
  }
  .switch-part{
    display: flex;
    :deep(.el-form-item__label) {
      margin-bottom: 0px;
      line-height: 32px;
      display: inline-block;
      width: 545px !important;
    }
  }
  .detail-button{
    :deep(.el-form-item__content){
      display: flex;
      justify-content: flex-end;
    }
  }
}
:deep(.el-select) {
  width: 100% !important;
}
</style>

