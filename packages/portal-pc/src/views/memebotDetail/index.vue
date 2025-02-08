<template>
  <div class="w-[800px] mx-auto">
    <div class="detail">
      <div class="icon-image">
        <el-image
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
          <div class="meme">
            <el-avatar
              class="coin-logo"
              size="small"
              :src="coinImageUrl"
            />
            <span class="ml-2 meme-symbol"> {{ form.symbol }}</span>
          </div>
          <div class="socials">
<!--            v-if="form.twitter"-->
            <div>
              Twitter
            </div>
<!--            v-if="form.telegram"-->
            <div>
              Telegram
            </div>
<!--            v-if="form.website"-->
            <div>
              Website
            </div>
          </div>
        </div>
      </div>
      <div class="detail-introduction">
        {{ form.introduction }}
      </div>
    </div>
    <div class="detail-advanced">
      <div>
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
          class="upload-demo w-full mt-[16px]"
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
        <div class="function">
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
      </div>
      <div v-if="grade === 'advanced'">

      </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { getBotInfo } from '@gptx/base/api/application.js';
import { ElMessage } from 'element-plus';
import { t } from '@gptx/base/i18n/index.js';
import { reactive } from 'vue';
import coinImageUrl from '@/assets/images/coin.png';

const route = useRoute();
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
  is_personalize_image_icon: false,
  grade: ''
});
const grade = ref('basic')
const _getMemeDetail = async () => {
  const id = route.query.id;
  if (id) {
    try {
      const { code, data } = await getBotInfo({
        id: id
      });
      if (code === 200) {
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

const handleFileSelect = () => {}
const beforeUpload = () => {}
const handleExceed = () => {}
const handleFileRemove = () => {}

</script>

<style lang="scss" scoped>
.detail {
  display: flex;
}
</style>

