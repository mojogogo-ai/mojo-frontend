<template>
  <div class="w-[562px] mx-auto">
    <div class="text-center  mt-[60px] mb-[40px] text-[#e1ff01] text-[28px] font-bold font-['TT Norms Pro'] leading-[23px]">Create Meme Bot</div>
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
            prop="name"
          >
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
            label="Audio Selection"
            prop="audio"
          >
            <el-select
              v-model="form.audio"
              placeholder="Select audio"
            >
              <el-option
                v-for="item in audioList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <div class="flex items-center justify-between hover-operation">
                  <div class="flex items-center">
                    <svg-icon
                      class="text-xl"
                      :name="item.icon"
                    />
                    <span class="ml-2">{{ item.name }}</span>
                  </div>
                  <div class="items-center justify-between play-item">
                    <svg-icon
                      class="text-[#000]"
                      name="Play_voice"
                    />
                    <span>play</span>
                  </div>
                </div>
              </el-option>

              <template #footer>
                <div class="flex items-center justify-between text-[#000] pl-[10px] pr-[22px] py-2 border">
                  <div class="flex items-center">
                    <svg-icon
                      class="text-[#000] text-xl"
                      name="Custom_voice"
                    />
                    <span class="mx-[4px]">Custom Voice</span>

                    <div class="flex items-center justify-between px-2 py-[4px] ml-2 bg-black rounded-lg">
                      <svg-icon
                        class="text-[#e1ff01] text-[13px] mr-1"
                        name="star"
                      />
                      <span class="text-[#e1ff01] text-[12px]">AI</span>
                    </div>
                    <div class="flex items-center justify-between px-2 py-[4px] ml-4 bg-black rounded-lg">
                      <svg-icon
                        class="text-[#e1ff01] text-[13px] mr-1"
                        name="star2"
                      />
                      <span class="text-[#e1ff01] text-[12px]">premium</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
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
        <el-col :span="12">
          <el-form-item
            label="Twitter"
            prop="twitter"
          >
            <TwitterButton @update-auth-status="handleAuthStatusUpdate" />
          </el-form-item>
        </el-col>
      </el-row>

      
      <el-form-item
        label="Configure Telegram address"
        prop="telegram_bot_address"
      >
        <div class="w-[552px] h-9 flex flex-col">
          <span class="text-white/70 text-[13px] font-normal font-['TT Norms Pro'] leading-none">Connect to Telegram bots and chat with this bot in Telegram App.</span>
          <span class="text-[#e1ff01] text-[13px] font-normal font-['TT Norms Pro'] mt-1 mb-2 leading-none cursor-pointer hover:" @click="getTgToken">How to get Telegram Bot address ?</span>
        </div>
        <el-input
          v-model="form.telegram_bot_address"
          placeholder="telegram address"
          maxlength="255"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="Configure Telegram bot"
        prop="telegram_bot_token"
      >
        <div class="w-[552px] h-9 flex flex-col">
          <span class="text-white/70 text-[13px] font-normal font-['TT Norms Pro'] leading-none">Connect to Telegram bots and chat with this bot in Telegram App.</span>
          <span class="text-[#e1ff01] text-[13px] font-normal font-['TT Norms Pro'] mt-1 mb-2 leading-none cursor-pointer hover:" @click="getTgToken">How to get Telegram Bot token ?</span>
        </div>
        <el-input
          v-model="form.telegram_bot_token"
          placeholder="Please enter Telegram Bot token"
          maxlength="10000"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="Description"
        prop="introduction"
      >
        <el-input
          v-model="form.introduction"
          type="textarea"
          :rows="4"
          placeholder="Describe your bot’s functions and usage."
          maxlength="800"
          show-word-limit
          clearable
        />
      </el-form-item>
      <!--<el-form-item
        required
        label=""
        prop=""
        style="position: relative;"
      >
        <template #label>
          <span>I would like to create a V-human with my bot</span>
          <div
            class="w-[100px] flex items-center justify-center px-2 py-[2px] bg-black " 
            style="border-radius: 15px; border: 1px solid rgba(224, 255, 49, 0.5);position: absolute; top: -2px;right: 150px;"
          >
            <span class="text-[#e1ff01] text-[15px]">premium</span>
            <svg-icon
              class="text-[#e1ff01] text-[15px]"
              name="star2"
            />
          </div>
        </template>
        <el-switch v-model="unlockValue" @change="changeValue1" />
      </el-form-item>-->

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
      
    </el-form>
    <div class="h-full transition-all chat-bg">
      <GptxChat v-if="botConfig" :bot-info="botConfig" :operation-config="operationConfig" :chat-api-url="chatApiUrl" :is-debug="false" style="max-width: 100%"  />
    </div>
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
      <el-button
        style="width: 250px;"
        type="primary"
        :loading="loading"
        :disabled="loading"
        linear
        @click="conversationBot()"
      >
        {{ conversationText }}
      </el-button>
    </div>

    <UploadKnowledge
      ref="uploadKnowledgeRef"
      width="600px"
      @after-upload-knowledge="afterUploadKnowledge"
    />
    <StartLaunch
      ref="startLaunchRef"
      width="600px"
    />
    <Unlocked
      ref="unlockedRef"
      width="520px"
    />
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { memeCreate, memeCheck } from '@gptx/base/api/meme-bot';
import UploadKnowledge from './uploadKnowledge/index.vue';
import StartLaunch from '@/components/StartLaunch/index.vue';
import { ref } from 'vue';
import TwitterButton from './twitterbutton/index.vue';

import GptxChat from '@gptx/components/src/components/GptxChat/index.vue';
const router = useRouter();
// const emits = defineEmits(['after-create', 'after-update']);
const isVisible = ref(false);
const chatApiUrl =  '/portal/conversation/chat-anonymous';
const botConfig = ref(null)
const _getChatDetail = async () => {
  let systemBot = JSON.parse('{"id":"SafeGen-AI-Chat","name":"SafeGen AI","icon":"","prologue":"Welcome to meme bot. Click start to start the journey","description":"","system":true}')
  let predefined_question = systemBot.predefined_question ? systemBot.predefined_question.map((i)=>{ return { content:i } }):[]
  let prologue =  { content: systemBot.prologue ||"" }
  let resData = { app:{ ...systemBot, system:true}, predefined_question, prologue, isHome: true }
  botConfig.value = resData;
  return
};
_getChatDetail()
const form = reactive({
  name: '',
  gender: null,
  classification: [],//  conversation
  audio: '',
  symbol: '',
  twitter_state: '',
  telegram_bot_address: '',
  telegram_bot_token: '',
  introduction: '',
  icon: '',
  third_company:'',
  file_id_list: [],
  is_personalize_image_icon: false
});
const rules = reactive({
  name: [{ required: true, message: 'Please enter meme bot name' }],
  symbol: [{ required: true, message: 'Please enter meme coin symbol' }],
  gender: [{ required: true, message: 'Please select bot gender' }],
  classification: [{ required: true, message: t('bots.ruleMessage.catalog'), trigger: 'change' }],
  icon: [{ required: true, message: t('bots.ruleMessage.icon'), trigger: 'change' }],
  introduction: [{ required: true, message: 'Please enter your bot description' }],
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

const unlockValue = ref(false)
const audioList = reactive([
  { 
    id: 'Aiden', 
    name: 'Aiden',
    icon: 'Aiden_voice'
   },
  { 
    id: 'Eva', 
    name: 'Eva' ,
    icon: 'Eva_voice'
  },
  { 
    id: 'Jason',
    name: 'Jason' ,
    icon: 'Jason_voice'
  },
  { 
    id: 'Sara', 
    name: 'Sara' ,
    icon: 'Sara_voice'
  }
]);


const formRef = ref(null);
const loading = ref(false);
const isAIloading = ref(false);
const parentAuthStatus = ref("unauthorized");

function handleAuthStatusUpdate(newStatus) {
  form.twitter_state = newStatus;
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
  form.icon = url
  form.is_personalize_image_icon = is_personalize_image_icon
};


const uploadKnowledgeRef = ref(null);
const openUploadKnowledge = () => {
  uploadKnowledgeRef.value.open();
};

let AllFileList = [];
const afterUploadKnowledge = ({formFileList, file_id_list}) => {
  AllFileList = [...formFileList]
  console.log(AllFileList,'AllFileList')
  
  form.file_id_list = [...file_id_list]
  // publishDialogRef.value.open({ id });
};

// commit action
const submitText = ref('Create')

const submitHandle = async (el) => {
  if (loading.value) return;
  await el.validate(async (valid) => {
    if (valid) {
      try {
        console.log(form.twitter);
        loading.value = true;
        const result = await memeCreate(form);
        if (result.code === 200) {
          submitText.value = 'Pending...'
          setMemeCheckTimer(result.data.id)
        } else {
          loading.value = false;
        }
        // loading.value = false;
      } catch (e) {
        console.log(e);
        loading.value = false;
      }
    }
  });
};

const conversationText = ref('Conversation')
const conversationBot = async (el) => {
   router.push({ path: '/conversation' });
  
};

const unlockedRef = ref(null)
// 轮询查询状态
const startLaunchRef = ref(null);
const memeCheckTimer = ref(null);
// const memeCoinInfo = ref({});
const setMemeCheckTimer = (bot_id) =>{
   memeCheckTimer.value = setInterval(async () => {
    try {
      const result = await memeCheck({ bot_id });
      if (result.code === 200 && result.data.state === 2) { // 对话创建完成meme coin
        clearInterval(memeCheckTimer.value)
        // memeCoinInfo.value = result.data;
        loading.value = false;
        submitText.value = 'Create'
        formRef.value.resetFields();
        startLaunchRef.value.open({ ...result.data, bot_id});
      }
    } catch (error) {
      throw error;
    }
  }, 3000);
}

const getTgToken = () => {
  window.open('https://www.siteguarding.com/en/how-to-get-telegram-bot-api-token', '_blank')
};

const changeValue1 = () => {
  unlockedRef.value.open();
  unlockValue.value = false;
}

onUnmounted(() => {
  clearInterval(memeCheckTimer.value);
});

</script>

<style lang="scss" scoped>
.base-info-img {
  position: relative;
  width: 88px;
  height: 88px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;

  &::after {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #eee;
    font-size: 24px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: rgba(#000, 0.4);
    content: '+';
    opacity: 0;
  }

  &:hover {
    &::after {
      opacity: 1;
    }
  }
}

.base-info-avatar {
  width: 100%;
  height: 100%;
}

.base-list-row {
  display: flex;
}

.base-list-col {
  & + & {
    margin-left: 16px;
  }
}

.base-list-img {
  width: 56px;
  height: 56px;
  border-radius: 8px;

  &__error {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 20px;
  }
}

.base-list-option {
  padding-top: 4px;
  color: #999;
  font-size: 20px;
  line-height: 32px;
  border-top: 1px solid #eee;

  .base-list-col {
    display: flex;
    align-items: center;

    & + .base-list-col {
      margin-left: 8px;
    }
  }
}

.el-card__body {
  padding: 12px 16px !important;
}

.upload-custom {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;
    cursor: pointer;
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
  }
}
</style>

<style lang="scss">
.play-item {
  display: none;
}
.hover-operation:hover {
  .play-item {
      transition: 0.1s;
      display: flex;
  }
}
</style>
