<template>
  <div class="app-page">
    <page-header
      :title="t('menu.ass')"
      :placeholder="t('store.placeholder.name')"
      input-area
      @search="onSearch"
    />

    <div
      class="text-center mt-[26px] mb-[26px] text-[#e1ff01] text-[20px] font-bold font-['TT Norms Pro'] leading-[23px]">
      Coin Detail
    </div>
    <div class="w-[348px] mx-auto memebot-detail mb-[40px]">
      <div class="memebot-detail-top">
        <div class="detail-icon">
          <van-image
            class="cursor-pointer bmicl-avatar-img"
            width="65px"
            height="65px"
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
          <div class="detail-socials">
            <div class="social">
              <svg-icon
                name="prime_twitter"
                class="icon"
              />

              Twitter
            </div>
            <div class="social">
              <svg-icon
                name="telegram"
                class="icon"
              />
              Telegram
            </div>
            <div class="social">
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
          Customize Twitter Bot
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
            :disabled="isUploading"
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
                <van-switch size="16px"/>
              </template>
            </van-field>
            <div>
              <div class="w-[552px] h-9 flex flex-col">
                <span class="text-white/70 text-[13px] font-normal font-['TT Norms Pro'] leading-none">Connect to Telegram bots and chat with this bot in Telegram App.</span>
                <span
                  class="text-[#e1ff01] text-[13px] font-normal font-['TT Norms Pro'] mt-1 mb-2 leading-none cursor-pointer hover:"
                  @click="getTgToken">How to get Telegram Bot adress and token?</span>
              </div>
              <van-field
                name="telegram_bot_address"
                label="telegram_bot_address"
                label-align="top"
              />

            </div>
            <van-field name="switch" label="Configure Twitter Bot" class="form-switch">
              <template #input>
                <van-switch size="16px"/>
              </template>
            </van-field>
            <div>

            </div>
          </div>

        </van-form>

      </div>
    </div>
  </div>
</template>

<script setup>

import { t } from '@gptx/base/i18n/index.js';
import { getList } from '@gptx/base/api/assistant-store.js';
import { reactive, ref } from 'vue';
import { getBotInfo } from '@gptx/base/api/application.js';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { showFailToast, showSuccessToast } from 'vant';

const route = useRoute();

const __data = reactive({
  storeList: []
});
let isLoadMore = true;
let timer = null;
const isUploading = ref(false);

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
  twitter_state: '',
  twitter_post_day: 0,
  twitter_reply_comment_day: 0,
  twitter_like_day: 0,
  grade: 'basic'
});
// gradeList
const gradeList = reactive([
  { id: 'basic', name: 'basic' },
  { id: 'advanced', name: 'advanced' }
]);
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
const handleExceed = () => {
  showFailToast('You can upload up to 5 files only.');
};
const getTgToken = () => {
  window.open('https://www.siteguarding.com/en/how-to-get-telegram-bot-api-token', '_blank');
};

</script>

<style lang="scss" scoped>
.memebot-detail {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(50px);
}

.memebot-detail-top {
  padding: 18px 18px 20px;
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.10);

  .detail-icon {
    margin-right: 12px;

    :deep(.van-image__img) {
      border-radius: 12px;
    }
  }

  .detail-base {
    .detail-name {
      color: #FFF;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 19px; /* 67.857% */
      margin-bottom: 8px;
    }

    .detail-meme-socials {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

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

    .detail-socials {
      display: flex;
      gap: 4px;
      margin-bottom: 8px;

      .social {
        border-radius: 21.6px;
        background: var(--Style, #E1FF01);
        color: #000;
        font-feature-settings: 'dlig' on;
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 20.8px; /* 185.714% */
        display: flex;
        padding: 1px 4px;
        align-items: center;
        gap: 2px;

        .icon {
          font-size: 12px;
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
  padding: 18px 18px 18px 95px;

  .bottom-label {
    color: #FFF;
    font-feature-settings: 'dlig' on;
    font-family: "TT Norms Pro";
    font-size: 13px;
    font-style: normal;
    font-weight: 700;
    line-height: 23px; /* 115% */
    margin-bottom: 18px;
  }

  .upload-demo {
    width: 100%;
    /* margin-top: 16px; */
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;

    :deep(.van-uploader__wrapper) {
      width: 100%;
      display: flex;
      flex-direction: column-reverse;

      .van-uploader__file {
        width: 100%;
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
    border: 1px dashed #C5C5C5;
    background: rgba(0, 0, 0, 0.50);
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
  .memebot-detail-grade{
    //background: transparent !important;
    //backdrop-filter: none;
    //padding: 0;
    //margin-bottom: 18px;

    :deep(.selector-row){
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
  :deep(input){
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
  :deep(label) {
    font-size: 12px;
    white-space: nowrap;
  }
  :deep(.van-field){
    background: transparent !important;
    backdrop-filter: none;
    padding: 0;
    margin-bottom: 18px;
  }
  .form-switch{
    :deep(.van-field__value){
      display: flex;
      justify-content: flex-end;
    }
  }

}
</style>
