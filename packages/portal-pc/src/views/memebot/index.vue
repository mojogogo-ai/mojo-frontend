<template>
  <div class="mx-auto">
    <div
      class="text-center mt-[80px] mb-[40px] text-[#e1ff01] text-[28px] font-bold font-['TT Norms Pro'] leading-[23px]">
      <span v-show="status ==='create'">{{t('bots.title')}}</span>
      <span v-show="status ==='edit'">{{t('bots.edit_title')}}</span>

    </div>
    <!-- 按钮用于切换页面 -->
    <div v-show="status ==='create'" class="switch-container mb-[40px]">
      <button @click="byFormHandle()" :class="['switch-button',{ 'selected': byForm }]"> {{t('bots.bot_form')}}</button>
      <button @click="byAiHandle()" :class="['switch-button',{ 'selected': !byForm }]"> {{t('bots.bot_ai')}}</button>
    </div>

    <div v-if="byForm" class="w-[550px] mx-auto">
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
              :label="t('bots.label.name')"
              prop="name">
              <el-input
                v-model="form.name"
                :placeholder="t('bots.label.name')"
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
                :placeholder="t('bots.label.gender')"
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
                :placeholder="t('bots.placeholder.classification')"
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
              :label="t('bots.label.symbol')"
              prop="symbol"
            >
              <el-input
                v-model="form.symbol"
                :placeholder="t('bots.placeholder.symbol')"
                maxlength="50"
                show-word-limit
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          :label="t('bots.label.description')"
          prop="introduction"
        >
          <el-input
            v-model="form.introduction"
            type="textarea"
            :rows="4"
            :placeholder="t('bots.placeholder.description')"
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
          <el-input
            v-model="form.twitter"
            :placeholder="t('bots.placeholder.twitter')"
            maxlength="255"
            clearable
          />
        </el-form-item>

        <el-form-item
          label="Telegram"
          prop="telegram"
        >
          <el-input
            v-model="form.telegram"
            :placeholder="t('bots.placeholder.telegram')"
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
            :placeholder="t('bots.placeholder.website')"
            maxlength="255"
            clearable
          />
        </el-form-item>
      </el-form>

      <div class="flex justify-center w-full my-20">
        <el-button
          style="width: 250px; background: #000;"
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
    <div v-else class="h-full transition-all chat-bg mx-auto" >
      <GptxChat v-if="botConfig" :bot-info="botConfig" :operation-config="operationConfig" :chat-api-url="chatApiUrl"
                :is-debug="false" style="max-width: 100%" />
    </div>
    <StartLaunch ref="startLaunchRef" width="600px" />
    <Unlocked
      ref="unlockedRef"
      width="520px"
    />
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { memeCreate, memeCheck } from '@gptx/base/api/meme-bot';
import StartLaunch from '@/components/StartLaunch/index.vue';
import { reactive, ref } from 'vue';
import GptxChat from '@gptx/components/src/components/GptxChat/index.vue';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { botEdit, botFileSave, getBotInfo } from '@gptx/base/api/application.js';
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
        form.id = data.id;
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
  id: '',
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
  if (loading.value) return;
  await el.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        if (form.fileList.length > 0) {
          // await submitFile();
        }
        if (status.value === 'create'){
          delete form.id
          const result = await memeCreate(form);
          if (result.code === 200) {
            submitText.value = 'Creating your bot...';
            setMemeCheckTimer(result.data.id);
          } else {
            loading.value = false;
          }
        }
        if(status.value === 'edit'){
          const result = await botEdit(form);
          if (result.code === 200) {
            submitText.value = 'Edit your bot...';
            setMemeCheckTimer(form.id);
          } else {
            loading.value = false;
          }
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
const startLaunchRef = ref(null);
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
        startLaunchRef.value.open({ ...result.data, bot_id});
      }
    } catch (error) {
      throw error;
    }
  }, 3000);
};


onUnmounted(() => {
  clearInterval(memeCheckTimer.value);
});

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
.chat-bg{
  background: url("../../assets/svg/chat-bg.svg") no-repeat center top;
  width: 1064px;
  height: 965px;
  box-shadow: 0px 25px 25px 0px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(40px);
}
</style>

