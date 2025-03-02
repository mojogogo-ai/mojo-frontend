<template>
  <div class="app-page">
    <page-header
      title="Bot Store"
      placeholder="Enter an application name"
      input-area
      @search="onSearch"
    />

    <div
      class="text-center mt-[26px] mb-[26px] text-[#e1ff01] text-[20px] font-bold font-['TT Norms Pro'] leading-[23px] relative w-[310px] mx-auto">
      Coin Detail
      <div class="absolute left-0 top-0">
        <svg-icon name="arrow-right" @click="backPage"/>
      </div>
    </div>
    <div class="w-[343px] mx-auto memebot-detail mb-[40px]" v-if="isDetail">
      <div class="memebot-detail-top">
        <div class="detail-icon">
          <van-image
            class="cursor-pointer bmicl-avatar-img"
            width="80px"
            height="80px"
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
          </div>
          <div class="social-title">
            Socials
          </div>
          <div class="detail-socials">
            <div class="social cursor-pointer" v-if="form.twitter" @click="goLink('twitter')">
              <svg-icon
                name="prime_twitter"
                class="icon"
              />

              Twitter
            </div>
            <div class="social cursor-pointer" v-if="form.telegram" @click="goLink('telegram')">
              <svg-icon
                name="telegram"
                class="icon"
              />
              Telegram
            </div>
            <div class="social cursor-pointer" v-if="form.website" @click="goLink('website')">
              <svg-icon
                name="web-fill"
                class="icon"

              />
              Website
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
        <div class="knowledge-label">
          Knowledge sources
        </div>
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
              <svg-icon name="upload-file" class="upload-file-icon" />
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
          <van-field
            name="grade"
            label="function"
            class="memebot-detail-grade"
            label-align="top"
          >
            <template #input>
              <selector
                v-model="form.grade"
                :columns="gradeList.map((_) => ({ ..._, label: t(_.name) }))"
                :columns-field-names="{ text: 'label', value: 'id' }"
              />
            </template>
          </van-field>

          <div v-show="form.grade === 'advanced'">
            <van-field name="switch" label="Configure Telegram Bot" class="form-switch">
              <template #input>
                <van-switch size="16px" v-model="form.telegram_config" />
              </template>
            </van-field>
            <div v-if="form.telegram_config">
              <div class="h-9 flex flex-col leading-[18px] h-[36px]">
                <span class="text-[11px] font-normal leading-none break-words">Connect to Telegram bots and chat with this bot in Telegram App.
                <span class="text-[#e1ff01] " @click="getTgToken">How to get Telegram Bot adress and token?</span>
                </span>
              </div>
              <van-field
                name="telegram_bot_address"
                placeholder="Enter Telegram Bot address"
                label-align="top"
              />
              <van-field
                name="telegram_bot_token"
                placeholder="Please enter Telegram Bot token"
                label-align="top"
              />

            </div>
            <van-field name="switch" label="Configure Twitter Bot" class="form-switch">
              <template #input>
                <van-switch size="16px" v-model="form.twitter_config" />
              </template>
            </van-field>
            <div v-if="form.twitter_config">
              <van-field name="switch" label="Connect Bot Twitter Account" class="form-switch">
                <template #input>
                  <van-switch size="16px" v-model="form.twitter_connect" @change="toggleTwitterConnection" />
                </template>
              </van-field>
              <div v-show="form.twitter_connect">
                <van-field
                  v-model="form.twitter_post_day"
                  name="twitter_post_day"
                  label-align="top"
                  label="Number of Twitter Per Day"
                />
                <van-field
                  v-model="form.twitter_reply_comment_day"
                  name="twitter_reply_comment_day"
                  label-align="top"
                  label="Number of Comment Per Day"
                />
                <van-field
                  v-model="form.twitter_like_day"
                  name="twitter_like_day"
                  label-align="top"
                  label="Number of Likes Per Day"
                />
                <van-field
                  v-model="form.ad_post_day"
                  name="ad_post_day"
                  label-align="top"
                  label="Number of topics Interaction per day"
                />


                <div class="mb-[5px] text-[12px]">
                  System Topics
                </div>
                <div class="flex gap-[10px] flex-wrap mb-[5px]">
                  <div v-for="(topicItem, index) in form.sys_topics" :key="index" >
                    <div class="topic cursor-pointer" @click="addTopicArray(topicItem)">
                      {{topicItem}}
                    </div>
                  </div>
                </div>

                <div class="topic-form">
                  <van-field v-model="topic" label="Add Tags" label-align="top">
                  </van-field>
                  <el-image
                    class="topic-add"
                    @click="addTopic"
                    :src="add"/>
                </div>
                <div v-if="form.topics?.length > 0" class="flex  flex-wrap gap-[10px]">
                  <div v-for="(topic, index) in form.topics" :key="index" >
                    <div class="topic">
                      {{ topic.content }}
                      <el-image
                        @click="deleteTopic(index)"
                        :src="closeTopic"
                        class="close-svg"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="button-row">
            <van-button :disabled="loading" native-type="submit" class="cancel-button btn" @click="close">
              Cancel
            </van-button>
            <van-button :disabled="loading" :loading="loading" type="primary" class="btn" @click="submitForm">
              Confirm
            </van-button>
          </div>
        </van-form>

      </div>
    </div>
    <div class="w-[343px] mx-auto memebot-detail-show mb-[40px]" v-else>
      <div class="memebot-detail-top" >
        <div class="detail-icon">
          <van-image
            class="cursor-pointer bmicl-avatar-img"
            width="80px"
            height="80px"
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
          </div>
          <div class="social-title">
            Socials
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
          <div class="detail-introduction">
            {{ form.introduction }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import useUserStore from '@/store/modules/user.js';
import { t } from '@gptx/base/i18n/index.js';
import { getList } from '@gptx/base/api/assistant-store.js';
import { reactive, ref } from 'vue';
import { botAuthorize, botEdit, getBotInfo, updateBotFile } from '@gptx/base/api/application.js';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { showFailToast, showSuccessToast } from 'vant';
import { getTwitter, setTwitter, twitterAuth } from '@gptx/base/api/meme-bot.js';
import CryptoJS from 'crypto-js';
import { getOssPresignedUrlV2 } from '@gptx/base/api/user.js';
import axios from 'axios';
import closeTopic from '@/assets/images/close.png';
import add from '@/assets/images/addtopic.png';

const user = useUserStore();
onMounted(() => {
  user.updateSysInfo(); // 调用更新用户信息的方法
});
console.log(user.nickName, 'user')

const route = useRoute();
const router = useRouter();

const __data = reactive({
  storeList: []
});
let isLoadMore = true;
let timer = null;
const isUploading = ref(false);
const loading = ref(false);

const onSearch = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  timer = setTimeout(() => {
    isLoadMore = true;
    __data.storeList = [];
    isLoading.value = true;
    getStoreList();
  }, 300);
};
const getStoreList = async () => {
  if (!isLoadMore) return;
  try {
    const { code, data } = await getList({});
    if (code === 200) {
      const {
        list,
        total
      } = data;
      __data.storeList.push(...list);
      if (__data.storeList.length >= total) {
        isLoadMore = false;
      }
    }
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  } catch (error) {
    console.log(error);
  }
};
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
// gradeList
const gradeList = reactive([
  { id: 'basic', name: 'basic' },
  { id: 'advanced', name: 'advanced' }
]);
const isDetail = ref(false)
const userInfo = localStorage.getItem('user')
const _getMemeDetail = async () => {
  const id = route.query.id;
  if (route.query.nickName ===JSON.parse(userInfo).nickname) {
    isDetail.value = true
  }
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
        let files = []
        files = data?.files !== null && data?.files.map(item => {
          return {
            name: item.storage_file_path,
            url: item.file_name
          }
        })
        form.fileList = files || [];
        let file_id_list = []
        data?.files !== null && data?.files.map(item => {
          file_id_list.push(item.id)
        })
        form.file_id_list = file_id_list || [];
        form.telegram_bot_address = data?.telegram_bot_address || '';
        form.telegram_bot_token = data?.telegram_bot_token || '';
        if (data?.telegram_bot_address || data?.telegram_bot_token) {
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
        // if (form.telegram_bot_address || form.telegram_bot_token || form.twitter_post_day || form.twitter_reply_comment_day || form.twitter_like_day) {
        //   form.grade = 'advanced';
        // } else {
        //   form.grade = 'basic';
        // }
        // if (form.twitter_post_day || form.twitter_reply_comment_day || form.twitter_like_day) {
        //   form.twitter_config = true
        //   form.twitter_connect = true
        // }
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
      ElMessage.error("Unable to retrieve details for this meme bot.");
    } finally {

    }
  }
};
_getMemeDetail();

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
const handleFileSelect = async (files) => {
  // 确保处理的是数组
  console.log('handleFileSelect', files);
  const fileList = Array.isArray(files) ? files : [files];

  for (const file of fileList) {
    const actualFile = file.file || file; // 根据具体情况获取 File 对象

    if (!(actualFile instanceof File)) {
      console.error('接收到的文件类型无效:', actualFile);
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
      console.error('生成文件哈希失败:', error);
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
const handleExceed = () => {
  showFailToast('You can upload up to 5 files only.');
};
const getTgToken = () => {
  window.open('https://www.siteguarding.com/en/how-to-get-telegram-bot-api-token', '_blank');
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
  }
};
const disconnectTwitter = () => {
  // form.twitter_state = ''
  form.twitter_post_day = 0
  form.twitter_reply_comment_day = 0
  form.twitter_like_day = 0
};
const close = () => {

};
const submitForm = async () => {
  if (loading.value) return;
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
    await updateBotFile({
      bot_id: form.id,
      file_id_list: fileDataList
    });
    showSuccessToast('Files updated successfully!');
    await botEdit(form);
    if (form.twitter_connect) {
      await setTwitter({
        bot_id: form.id,
        post_day: Number(form.twitter_post_day),
        reply_comment_day: Number(form.twitter_reply_comment_day),
        like_day: Number(form.twitter_like_day)
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
    showSuccessToast('save successfully!');
  } catch (error) {

  } finally {
    loading.value = false;
  }
};
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
    console.error('Failed to get presigned URL:', error);
    throw error;
  } finally {
    isUploading.value = false;
  }
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
const goLink = (link) => {
  if (link && link.length) {
    window.open(link, '_blank');
  }
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
  padding: 32px 16px 40px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(50px);
}
.memebot-detail-show {
  padding: 32px 16px 40px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.15);
}
.memebot-detail-top {
  padding-bottom: 16px;
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.10);

  .detail-icon {
    margin-right: 16px;

    :deep(.van-image__img) {
      border-radius: 12px;
    }
  }

  .detail-base {
    .detail-name {
      color: #FFF;
      font-family: Inter;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 19px; /* 67.857% */
    }

    .detail-meme-socials {
      display: flex;
      align-items: center;

      .detail-meme {
        display: flex;
        align-items: center;
        color: #FFF;
        font-feature-settings: 'dlig' on;
        font-family: Inter;
        font-size: 13px;
        font-style: normal;
        font-weight: 700;
        line-height: 23px; /* 143.75% */
        .symbol {
          margin-left: 4px;
        }
      }
    }

    .social-title {
      color: #B3B3B3;
      font-size: 11px;
      height: 23px;
      line-height: 23px;
    }

    .detail-socials {
      display: flex;
      gap: 4px;
      margin-bottom: 16px;

      .social {
        border-radius: 21.6px;
        background: var(--Style, #E1FF01);
        color: #000;
        font-feature-settings: 'dlig' on;
        font-family: Inter;
        font-size: 10px;
        font-style: normal;
        font-weight: 500;
        line-height: 20.8px; /* 185.714% */
        display: flex;
        padding: 1px 4px;
        align-items: center;
        gap: 2px;

        .icon {
          font-size: 10px;
        }
      }
    }

    .detail-introduction {
      width: 471.059px;
      color: rgba(255, 255, 255, 0.70);
      font-feature-settings: 'dlig' on;
      font-family: "TT Norms Pro";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%; /* 21px */
    }
  }

}

.memebot-detail-bottom {
  padding-top: 24px;

  .bottom-label {
    color: #FFF;
    font-feature-settings: 'dlig' on;
    font-family: "TT Norms Pro";
    font-size: 13px;
    font-style: normal;
    font-weight: 700;
    line-height: 23px; /* 115% */
    margin-bottom: 20px;
  }

  .knowledge-label {
    color: rgba(255, 255, 255, 0.70);
    font-size: 13px;
  }

  .upload-demo {
    /* margin-top: 16px; */
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;

    :deep(.van-uploader__wrapper) {
      width: 309px;
      display: flex;
      flex-direction: column-reverse;

      .van-uploader__file {
        width: 277px;
        height: 32px;
        flex-direction: row;
        justify-content: flex-start;
        background: transparent;
        color: #fff;
      }

      .van-uploader__file-name {
        margin-top: 0;
        width: auto;
        background: transparent;
        color: #fff;
      }

      .van-uploader__file-icon {
        font-size: 16px;
      }

      .van-uploader__preview-delete {
        top: 12px;
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
    border: 1px dashed rgba(255, 255, 255, 0.20);
    background: #202020;
    backdrop-filter: blur(50px);
    height: 180px;
    padding: 10px 16px;
    justify-content: center;
    gap: 10px;

    .upload-file-icon {
      font-size: 28px;
      color: #ffffff;
    }

    .upload-custom-text {
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .upload-custom-text-top {
        color: #FFF;
        font-feature-settings: 'dlig' on;
        font-family: "TT Norms Pro";
        font-size: 12px;
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

  .memebot-detail-grade {

    :deep(.selector-row) {
      border-radius: 12px;
      border: 1px solid #3A3A3A;
      backdrop-filter: blur(50px);
      display: inline-flex;
      height: 40px;
      padding: 10px 16px;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
  }

  :deep(input) {
    border-radius: 12px;
    border: 1px solid #3A3A3A;
    backdrop-filter: blur(50px);
    display: inline-flex;
    height: 40px;
    padding: 10px 16px;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  :deep(.van-field__control) {
    font-size: 12px;
  }

  :deep(label) {
    font-size: 12px;
    white-space: nowrap;
  }

  :deep(.van-field) {
    background: transparent !important;
    backdrop-filter: none;
    padding: 0;
    margin-bottom: 18px;
    color: #fff;
  }

  :deep(.selector-row) {
    background: rgba(0, 0, 0, 0.50) !important;
  }

  :deep(input) {
    background: rgba(0, 0, 0, 0.50) !important;
    color: #fff;
  }

  .form-switch {
    :deep(.van-field__value) {
      display: flex;
      justify-content: flex-end;
    }
  }

}

.button-row {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  .cancel-button {
    border: 1px solid #FFF;
    background: #000000;
    color: #FFFFFF;
  }

  .btn {
    width: 150px;
    height: 43px;
    border-radius: 12px;
  }
}
.topic {
  display: flex;
  padding: 5px 12px;
  align-items: center;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.20);
  background: rgba(0, 0, 0, 0.30);
  backdrop-filter: blur(50px);
  color: rgba(255, 255, 255, 0.70);
  font-feature-settings: 'dlig' on;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 23px; /* 164.286% */
  position: relative;
}
.close-svg {
  position: absolute;
  right: -4px;
  top: -4px;
}
.topic-form {
  position: relative;
}
.topic-add {
  position: absolute;
  right: 7px;
  top: 40px;
}
</style>
