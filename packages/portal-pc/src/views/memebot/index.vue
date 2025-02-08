<template>
  <div class="w-[562px] mx-auto">
    <div
      class="text-center mt-[60px] mb-[40px] text-[#e1ff01] text-[28px] font-bold font-['TT Norms Pro'] leading-[23px]">
      <span v-show="status ==='create'">{{t('bots.title')}}</span>
      <span v-show="status ==='edit'">Edit Meme Bot</span>

    </div>
    <!-- 按钮用于切换页面 -->
    <div v-show="status ==='create'" class="switch-container mb-[40px]">
      <button @click="byFormHandle()" :class="['switch-button',{ 'selected': byForm }]"> {{t('bots.bot_form')}}</button>
      <button @click="byAiHandle()" :class="['switch-button',{ 'selected': !byForm }]"> {{t('bots.bot_ai')}}</button>
    </div>

    <div v-if="byForm">
      <el-form
        ref="formRef"
        label-position="top"
        :model="form"
        :rules="rules"
        :disabled="loading || isAIloading"
        @submit.prevent
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="Bot name"
              prop="name">
              <el-input
                v-model="form.name"
                placeholder="Bot name"
                maxlength="50"
                show-word-limit
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="t('bots.label.gender')"
              prop="gender"
            >
              <el-select
                v-model="form.gender"
                placeholder="Bot gender"
              >
                <el-option
                  v-for="item in genderList"
                  :key="item.id"
                  :label="t(item.name)"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              :label="t('bots.label.conversationStyle')"
              prop="classification"
            >
              <el-select
                v-model="form.classification"
                placeholder="Bot conversation Style"
              >
                <el-option
                  v-for="item in conversationList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Coin Symbol"
              prop="symbol"
            >
              <el-input
                v-model="form.symbol"
                placeholder="Meme coin symbol"
                maxlength="50"
                show-word-limit
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          label="Description"
          prop="introduction"
        >
          <el-input
            v-model="form.introduction"
            type="textarea"
            :rows="4"
            placeholder="Describe your bot's functions and usage."
            maxlength="800"
            show-word-limit
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="t('bots.icon')"
          prop="icon"
        >
          <BotAvatarGenerator
            :custom-style="{
            width: '90px',
            height: '90px',
          }"
            :default-avatar="form.icon"
            :name="form.name"
            :gender="form.gender"
            :introduction="form.introduction"
            :title="t('bots.icon')"
            :disabled-tooltip-text="t('bots.generateIconTooltip')"
            @before-generate="isAIloading = true"
            @after-generate="isAIloading = false"
            @change="onImageChange"
          />
        </el-form-item>
        <el-form-item
          label="Twitter"
          prop="twitter"
        >
          <TwitterButton
            @updateTwitterLink="updateTwitterLink"
            @update-auth-status="handleAuthStatusUpdate" />
        </el-form-item>

        <el-form-item
          label="Telegram"
          prop="telegram"
        >
          <el-input
            v-model="form.telegram"
            placeholder="Enter your Telegram address"
            maxlength="255"
            clearable
          />
        </el-form-item>

        <el-form-item
          label="Website"
          prop="website"
        >
          <el-input
            v-model="form.website"
            placeholder="Enter your website link"
            maxlength="255"
            clearable
          />
        </el-form-item>
      </el-form>

      <div class="flex justify-center w-full my-20">
        <el-button
          style="width: 250px;"
          @click="close"
        >
          {{ t('common.cancel') }}
        </el-button>
        <el-button
          style="width: 250px;"
          type="primary"
          :loading="loading"
          :disabled="loading"
          linear
          @click="submitHandle(formRef)"
        >
          {{ submitText }}
        </el-button>
      </div>
    </div>
    <div v-else class="h-full transition-all chat-bg">
      <GptxChat v-if="botConfig" :bot-info="botConfig" :operation-config="operationConfig" :chat-api-url="chatApiUrl"
                :is-debug="false" style="max-width: 100%" />
    </div>
    <Launcher ref="launcherDialog" />
    <Unlocked
      ref="unlockedRef"
      width="520px"
    />
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { memeCreate, memeCheck } from '@gptx/base/api/meme-bot';
import Launcher from './launcher/index.vue';
import { reactive, ref } from 'vue';
import TwitterButton from './twitterbutton/index.vue';
import GptxChat from '@gptx/components/src/components/GptxChat/index.vue';
import { ElMessage } from 'element-plus';
import { getOssPresignedUrlV2 } from '@gptx/base/api/user.js';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { getBotInfo } from '@gptx/base/api/application.js';
const router = useRouter();
const byForm = ref(true);
const isVisible = ref(false);
const chatApiUrl = '/portal/conversation/chat-anonymous';
const botConfig = ref(null);
const route = useRoute();
const id = route.query.id;
const status = ref('create'); // create，edit
const _getMemeDetail = async () => {
  if (id) {
    status.value = 'edit';
    try {
      const { code, data } = await getBotInfo({
        id: id
      });
      if (code === 200) {
        form.icon = data.icon;
        form.name = data.name;
        form.introduction = data.introduction;
        form.classification = data.classification;
        form.gender = data.gender
        form.symbol = data.symbol;
        form.twitter = data.twitter;
        form.telegram = data.telegram;
        form.website = data.website;
      }
    } catch (error){
      ElMessage.error(t('bots.error.getDetail'));
    } finally {

    }
  }
}
_getMemeDetail();
const _getChatDetail = async () => {
  let systemBot = JSON.parse('{"id":"SafeGen-AI-Chat","name":"SafeGen AI","icon":"","prologue":"Welcome to MojoGogo. Click start to start the journey","description":"","system":true}');
  let predefined_question = systemBot.predefined_question ? systemBot.predefined_question.map((i) => {
    return { content: i };
  }) : [];
  let prologue = { content: systemBot.prologue || '' };
  let resData = { app: { ...systemBot, system: true }, predefined_question, prologue, isHome: true };
  botConfig.value = resData;
  return;
};
_getChatDetail();
const form = reactive({
  name: '',
  gender: null,
  classification: [],//  conversation
  audio: '',
  symbol: '',
  twitter_state: '',
  twitter: '',
  website: '',
  telegram: '',
  telegram_bot_address: '',
  telegram_bot_token: '',
  introduction: '',
  icon: '',
  third_company: '',
  fileList: [],
  file_id_list: [],
  is_personalize_image_icon: false
});
const rules = reactive({
  name: [{ required: true, message: 'Please enter meme bot name' }],
  symbol: [{ required: true, message: 'Please enter meme coin symbol' }],
  gender: [{ required: true, message: 'Please select bot gender' }],
  classification: [{ required: true, message: t('bots.ruleMessage.catalog'), trigger: 'change' }],
  icon: [{ required: true, message: t('bots.ruleMessage.icon'), trigger: 'change' }],
  introduction: [{ required: true, message: 'Please enter your bot description' }]
});

// user gender,0 none-binary 1 male 2 female
const genderList = reactive([
  { id: 0, name: 'None-binary' },
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' }
]);
const conversationList = reactive([
  // Natural Professional Passionate Customize
  { id: 'Natural', name: 'Natural' },
  { id: 'Professional', name: 'Professional' },
  { id: 'Passionate', name: 'Passionate' },
  { id: 'Customize', name: 'Customize' }
]);


const formRef = ref(null);
const loading = ref(false);
const isAIloading = ref(false);

const isTelegramConfigured = ref(false);

function handleAuthStatusUpdate(newStatus) {
  form.twitter_state = newStatus;
}

function updateTwitterLink(newLink) {
  form.twitter = newLink;
}

function byFormHandle() {
  console.log(byForm);
  byForm.value = true;
}

function byAiHandle() {
  console.log(byForm);
  byForm.value = false;
}

const close = () => {
  isVisible.value = false;
  form.name = '';
  form.id = '';
  form.icon = '';
  form.introduction = '';
  form.telegram_bot_address = '';
  form.telegram_bot_token = '';
  form.classification = [];
  form.gender = null;
  form.is_personalize_image_icon = false;
  formRef.value.resetFields();

  router.push({ path: '/personal' });
};
const onImageChange = (url, is_personalize_image_icon) => {
  form.icon = url;
  form.is_personalize_image_icon = is_personalize_image_icon;
};


// commit action
const submitText = ref('Create');

const submitHandle = async (el) => {
  // TODO 编辑 和 创建接口 分开
  if (loading.value) return;
  await el.validate(async (valid) => {
    if (valid) {
      try {
        console.log(form.twitter);
        loading.value = true;
        if (form.fileList.length > 0) {
          await submitFile();
        }
        const result = await memeCreate(form);
        if (result.code === 200) {
          submitText.value = 'Creating your bot...';
          setMemeCheckTimer(result.data.id);
        } else {
          loading.value = false;
        }
      } catch (e) {
        console.log(e);
        loading.value = false;
      }
    }
  });
};



const unlockedRef = ref(null);
// 轮询查询状态
const launcherDialog = ref(null);
const memeCheckTimer = ref(null);
const setMemeCheckTimer = (bot_id) => {
  memeCheckTimer.value = setInterval(async () => {
    try {
      const result = await memeCheck({ bot_id });
      console.log(result, 'memeCheck result');
      if (result.code === 200 && result.data.state === 2) { // 对话创建完成meme coin
        clearInterval(memeCheckTimer.value);
        loading.value = false;
        submitText.value = 'Create';
        formRef.value.resetFields();
        launcherDialog.value.openPopup({ ...result.data, bot_id });
      }
    } catch (error) {
      throw error;
    }
  }, 3000);
};

const toggleTelegramConfiguration = () => {
  if (!isTelegramConfigured.value) {
    form.telegram_bot_address = '';
    form.telegram_bot_token = '';
  }
};

const getTgToken = () => {
  window.open('https://www.siteguarding.com/en/how-to-get-telegram-bot-api-token', '_blank');
};

onUnmounted(() => {
  clearInterval(memeCheckTimer.value);
});

// upload file

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
</script>

<style lang="scss" scoped>
:deep(.el-upload) {
  width: 100%;
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

.upload-custom {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  width: 100%;
  transition: border-color 0.3s;
  display: inline-flex;
  height: 125px;
  padding: 5px;
  flex-shrink: 0;
  border-radius: 12px;
  border: 1px dashed #C5C5C5;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(50px);

  .upload-file-icon {
    font-size: 36px;
    color: #c5c5c5;
  }

  .upload-custom-text {
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .upload-custom-text-top {
      color: #FFF;
      text-align: center;
      font-feature-settings: 'dlig' on;
      font-family: "TT Norms Pro";
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
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

.toggle-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  width: 100%;
}

.additional-config {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  margin-right: 10px;
  font-size: 14px;
  color: #fff;
}

.switch-button {
  font-family: TT Norms Pro;
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  text-align: center;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

  width: 206px;
  height: 48px;
  gap: 0px;
  border-radius: 48px;
  opacity: 1;
  background-color: #FFFFFF1A;
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  outline: none;
}

.selected {
  background-color: #E0FF3133;
  color: #E0FF31;
}

.switch-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>

