<template>
  <div
    class="text-center mt-[80px] mb-[80px] text-[#e1ff01] text-[28px] font-bold font-['TT Norms Pro'] leading-[23px] relative w-[800px] mx-auto">
    Coin Detail
    <div class="absolute left-0 top-0">
      <svg-icon name="arrow-right" @click="backPage"/>
    </div>
  </div>
  <div class="w-[800px] mx-auto memebot-detail mb-[40px]" v-if="isDetail">
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
            <div class="social cursor-pointer" v-if="form.twitter" @click="goLink(form.twitter)">
              <svg-icon
                name="prime_twitter"
                class="icon"
              />

              Twitter
            </div>
            <div class="social cursor-pointer" v-if="form.telegram" @click="goLink(form.telegram)">
              <svg-icon
                name="telegram"
                class="icon"
              />
              Telegram
            </div>
            <div class="social cursor-pointer" v-if="form.website" @click="goLink(form.website)">
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
        Customize Bot
      </div>
      <el-form
        ref="formRef"
        label-position="top"
        :model="form"
        :disabled="loading"
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
          label="Function"
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
                class="text-[#e1ff01] text-[13px] font-normal font-['TT Norms Pro'] mt-1 mb-2 leading-none cursor-pointer"
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
          <el-form-item
            label="Configure Twitter Bot"
            prop="twitter_config"
            class="switch-part"
          >
            <el-switch
              v-model="form.twitter_config"
              active-color="#1da1f2"
              inactive-color="#ccc"
            />
          </el-form-item>
          <div v-if="form.twitter_config">
            <el-form-item
              label="Connect Bot Twitter Account"
              prop="twitter_connect"
              class="switch-part"
            >
              <el-switch
                v-model="form.twitter_connect"
                active-color="#1da1f2"
                inactive-color="#ccc"
                @change="toggleTwitterConnection"
              />
            </el-form-item>
            <div class="text-white/70 text-[13px] font-normal font-['TT Norms Pro'] leading-none ">Each post, comment, or like will cost 10 points.</div>
            <div v-show="form.twitter_connect">
              <el-form-item
                prop="twitter_post_day"
                label="Number of Twitter Per Day"
              >
                <el-input
                  v-model="form.twitter_post_day"
                  clearable
                  type="number"
                  :min="1"
                  :max="15"
                />
              </el-form-item>
              <el-form-item
                prop="twitter_reply_comment_day"
                label="Number of Comment Per Day"
              >
                <el-input
                  v-model="form.twitter_reply_comment_day"
                  clearable
                  type="number"
                  :min="1"
                  :max="15"
                />
              </el-form-item>
              <el-form-item
                prop="twitter_like_day"
                label="Number of Likes Per Day"
              >
                <el-input
                  v-model="form.twitter_like_day"
                  clearable
                  type="number"
                  :min="1"
                  :max="15"
                />
              </el-form-item>

              <el-form-item
                prop="ad_post_day"
                label="Number of topics Interaction per day"
              >
                <el-input
                  v-model="form.ad_post_day"
                  clearable
                  type="number"
                  :min="1"
                  :max="15"
                />
              </el-form-item>
              <el-form-item prop="" label="System Topics" class="topic-form">
              </el-form-item>
              <div class="flex gap-[10px] flex-wrap mb-[5px]">
                <div v-for="(topicItem, index) in form.sys_topics" :key="index" >
                  <div class="topic cursor-pointer" @click="addTopicArray(topicItem)">
                    {{topicItem}}
                  </div>
                </div>
              </div>

              <el-form-item prop="" label="Add Tags" class="topic-form">
                <el-input
                  v-model="topic"
                  clearable
                  type="text"
                  maxlength="20"
                />
                <el-image
                  class="topic-add"
                  @click="addTopic"
                :src="add"/>
              </el-form-item>
              <div v-if="form.topics?.length > 0" class="flex  flex-wrap gap-[10px]">
                <div v-for="(topic, index) in form.topics" :key="index" >
                  <div class="topic">
                    {{ topic.content }}
                    <el-image
                      @click="deleteTopic(index)"
                      :src="close"
                      class="close-svg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <el-form-item class="detail-button mt-[20px]">
          <el-button @click="cancelForm">Cancel</el-button>
          <el-button type="primary" @click="submitForm" :loading="loading"
                     :disabled="loading">Confirm
          </el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
  <div class="w-[800px] mx-auto memebot-detail mb-[40px]" v-else>
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
            <div v-if="form.twitter" class="social cursor-pointer" @click="goLink(form.twitter)">
              <svg-icon
                name="prime_twitter"
                class="icon"
              />

              Twitter
            </div>
            <div v-if="form.telegram"  class="social cursor-pointer" @click="goLink(form.telegram)">
              <svg-icon
                name="telegram"
                class="icon"
              />
              Telegram
            </div>
            <div v-if="form.website" class="social cursor-pointer" @click="goLink(form.website)">
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

  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { botAuthorize, botEdit, botFileSave, getBotInfo, updateBotFile } from '@gptx/base/api/application.js';
import { ElMessage } from 'element-plus';
import { t } from '@gptx/base/i18n/index.js';
import { reactive, ref } from 'vue';
import coinImageUrl from '@/assets/images/coin.png';
import useUserStore from '@/store/modules/user.js';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { getOssPresignedUrlV2 } from '@gptx/base/api/user.js';
import { twitterAuth, setTwitter, getTwitter } from '@gptx/base/api/meme-bot.js';
import close from '@/assets/images/close.png';
import add from '@/assets/images/addtopic.png';

const router = useRouter();
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
  telegram_config: false,
  telegram_bot_address: '',
  telegram_bot_token: '',
  twitter_config: false,
  twitter_connect: false,
  // twitter_state: '',
  twitter_post_day: 0,
  twitter_reply_comment_day: 0,
  twitter_like_day: 0,
  ad_post_day: 0,
  grade: 'basic',
  topics: [],
  sys_topics: []
});
const topic = ref('');
const formatter = (value) => {
  let num = parseInt(value, 10);
  if (isNaN(num)) {
    return '';
  }
  if (num > 15) {
    return '15';
  }
  if (num < 0) {
    return '0';
  }
  return num.toString();
};

const parser = (value) => {
  const regex = /^(0|1[0-5])$/;
  if (regex.test(value)) {
    return value;
  }
  return '';
};
const user = useUserStore();
onMounted(() => {
  user.updateSysInfo(); // 调用更新用户信息的方法
});
const loading = ref(false);
const formRef = ref(null);
const isDetail = ref(false)
const userInfo = localStorage.getItem('user')
const _getMemeDetail = async () => {
  const id = route.query.id;
  if (route.query.nickName ===  JSON.parse(userInfo).nickname) {
    isDetail.value = true
  }
  if (id) {
    try {
      const { code, data } = await getBotInfo({
        id: id
      });
      if (code === 200) {
        form.id = data.id;
        form.name = data.name;
        form.gender = data.gender;
        form.classification = data.classification;
        form.symbol = data.symbol;
        form.introduction = data.introduction;
        form.icon = data.icon;
        form.twitter = data.twitter;
        form.telegram = data.telegram;
        form.website = data.website;
        let files = []
        files = data?.files !== null && data?.files.map(item => {
          return {
            name: item.file_name,
            url: item.storage_file_path
          }
        })
        form.fileList = files || [];
        let file_id_list = []
        data?.files !== null  && data?.files.map(item => {
          file_id_list.push(item.id)
        })
        form.file_id_list = file_id_list || [];
        form.telegram_bot_address = data?.telegram_address || '';
        form.telegram_bot_token = data?.telegram_token || '';
        if (data?.telegram_address || data?.telegram_address) {
          form.telegram_config = true;
        } else {
          form.telegram_config = false;
        }
        form.twitter_connect = data?.twitter_connect || false;
        // form.twitter_state = data?.twitter_state || '';
        form.twitter_post_day = data?.twitter_post_day || 0;
        form.twitter_reply_comment_day = data?.twitter_reply_comment_day || 0;
        form.twitter_like_day = data?.twitter_like_day || 0;
        form.ad_post_day= data?.ad_post_day || 0
      }
      const { code: twitterCode, data: twitterData } = await getTwitter({bot_id: form.id})
      if(twitterCode === 200 ) {
        form.twitter_post_day= twitterData.post_day
        form.twitter_reply_comment_day = twitterData.reply_comment_day
        form.twitter_like_day = twitterData.like_day
        form.sys_topics = twitterData.sys_topics || []
        form.topics = twitterData.topics || []
        form.ad_post_day= twitterData?.ad_post_day || 0

      }
      if (form.telegram_bot_address || form.telegram_bot_token || form.twitter_post_day || form.twitter_reply_comment_day || form.twitter_like_day || form.ad_post_day) {
        form.grade = 'advanced';
      } else {
        form.grade = 'basic';
      }
      if (form.twitter_post_day || form.twitter_reply_comment_day || form.twitter_like_day || form.ad_post_day) {
        form.twitter_config = true
        form.twitter_connect = true
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
  console.log(form.fileList)
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
const cancelForm = async () => {
  _getMemeDetail()
};
const submitForm = async () => {

  if (loading.value) return;
  try {
    loading.value = true;
    const fileDataList = [];
    console.log(form.fileList, 'form.fileList');
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
    // await botFileSave({
    //   bot_id: form.id,
    //   file_id_list: fileDataList
    // });
    await updateBotFile({
      bot_id: form.id,
      file_id_list: fileDataList,
    });
    await botEdit(form);
    if (form.twitter_connect) {
      await setTwitter({
        bot_id: form.id,
        post_day: Number(form.twitter_post_day),
        reply_comment_day: Number(form.twitter_reply_comment_day),
        like_day: Number(form.twitter_like_day),
        topics: form.topics,
        ad_post_day: form.ad_post_day
      });
    }
    if (form.telegram_config) {
      await botAuthorize({
        id: form.id,
        token: form.telegram_bot_token,
        token_type: 1,
        address: form.telegram_bot_address

      })
    }
    ElMessage.success('save successfully!');
  } catch (error) {
    console.error('文件上传失败:', error);
  } finally {
    loading.value = false;
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
const goLink = (link) => {
  const pattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
  if (pattern.test(link) && link && link.length) {
    window.open(link, '_blank');
  } else{
  ElMessage.warning("Please enter the correct link (with the prefix https://), e.g., https://dev.mojogogo.ai/#/");
  }
};
const toggleTwitterConnection = async () => {
  if (form.twitter_connect) {
    await connectTwitter();
  } else {
    disconnectTwitter();
  }
};
const connectTwitter = async () => {
  const response = await twitterAuth({ bot_id: form.id });
  if (response.code === 200) {
    let authStatus = response.data.state;
    const twitterAuthUrl = response.data.redirect_uri;
    // form.twitter_state = authStatus;
    window.open(twitterAuthUrl, 'twitterAuthPopup', 'width=500,height=600');
  } else {
    console.error('Failed to obtain twitter auth url');
    // twitterLink.value = '';
  }
};
const disconnectTwitter = () => {
  // form.twitter_state = ''
  form.twitter_post_day = 0
  form.twitter_reply_comment_day = 0
  form.twitter_like_day = 0
};
const backPage = () => {
  router.push({ path: '/assistant' })
}
const deleteTopic = (index) => {
  form.topics.splice(index, 1);
}
const addTopic = () => {
  if (topic.value.trim()) { // 检查输入框内容是否为空
    form.topics.push({
      content: topic.value.trim(), // 用户输入的内容
      is_user_input: false // 默认的
    });
    topic.value = ''; // 清空输入框
  } else {
    ElMessage.warning('Please enter a topic before adding.'); // 提示用户输入内容
  }
};
const addTopicArray = (item ) => {
  const index = form.topics.findIndex(topic => topic.content === item);
  if (index !== -1) {
    // 如果存在，则删除该项
    form.topics.splice(index, 1);
  } else {
    // 如果不存在，则添加该项
    form.topics.push({
      content: item, // 用户输入的内容
      is_user_input: true // 默认的
    });
  }
}
</script>

<style lang="scss" scoped>
.memebot-detail {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(50px);
}

.memebot-detail-top {
  padding: 40px 40px 48px;
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.10);

  .detail-icon {
    margin-right: 31px;

    :deep(.el-image) {
      border-radius: 12px;
      width: 103px;
      height: 103px;
    }
  }

  .detail-base {
    .detail-name {
      color: #FFF;
      font-family: Inter;
      font-size: 28px;
      font-style: normal;
      font-weight: 600;
      line-height: 19px; /* 67.857% */
      margin-bottom: 16px;
    }

    .detail-meme-socials {
      display: flex;
      align-items: center;
      gap: 90px;
      margin-bottom: 26px;

      .detail-meme {
        display: flex;
        align-items: center;
        color: #FFF;
        font-feature-settings: 'dlig' on;
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 23px; /* 143.75% */
        .symbol {
          margin-left: 4px;
        }
      }

      .detail-socials {
        display: flex;
        gap: 8px;

        .social {
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

          .icon {
            font-size: 16px;
          }
        }
      }
    }

    .detail-introduction {
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

.memebot-detail-bottom {
  padding: 44px 40px 40px 174px;

  :deep(.el-form-item__label) {
    margin-bottom: 16px;
  }

  .bottom-label {
    color: #FFF;
    font-feature-settings: 'dlig' on;
    font-family: "TT Norms Pro";
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 23px; /* 115% */
    margin-bottom: 42px;
  }

  .upload-part {
    width: 100%;

    :deep(.el-upload) {
      height: 180px;
      width: 100%;
      border-radius: 12px;
      border: 1px dashed rgba(255, 255, 255, 0.20);
      background: rgba(0, 0, 0, 0.50);
      backdrop-filter: blur(50px);
    }

    :deep(.el-icon--document) {
      color: #fff;
    }

    :deep(.el-upload-list__item:hover) {
      color: #000;

      .el-icon--document {
        color: #000;
      }

      .el-upload-list__item-file-name {
        color: #000;
      }

      .el-icon--close {
        color: #000;
      }
    }

    .upload-custom {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .upload-file-icon {
        font-size: 36px;
      }
    }
  }

  .switch-part {
    display: flex;

    :deep(.el-form-item__label) {
      margin-bottom: 0px;
      line-height: 32px;
      display: inline-block;
      width: 545px !important;
    }
  }

  .detail-button {
    :deep(.el-form-item__content) {
      display: flex;
      justify-content: flex-end;
    }
  }
}

:deep(.el-select) {
  width: 100% !important;
}
.topic {
  display: flex;
  height: 48px;
  padding: 10px 24px;
  align-items: center;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.20);
  background: rgba(0, 0, 0, 0.30);
  backdrop-filter: blur(50px);
  color: rgba(255, 255, 255, 0.70);
  font-feature-settings: 'dlig' on;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 23px; /* 164.286% */
  position: relative;
}
.close-svg {
  position: absolute;
  right: 0;
  top: 0;
}
.topic-form {
  position: relative;
}
.topic-add {
  position: absolute;
  right: 15px;
  top: 15px;
}

</style>

