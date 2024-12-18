<template>
  <div class="w-[562px] mx-auto">
    <div class="text-center  mt-[60px] mb-[40px] text-[#e1ff01] text-[28px] font-bold font-['TT Norms Pro'] leading-[23px]">Create Meme Bot</div>
    <div class="w-full h-[38px] mb-2 px-3.5 py-3 bg-[#e1ff01]/5 rounded-xl justify-start items-start gap-3 inline-flex">
      <div class="w-3.5 h-3.5 relative"><el-icon color="#e1ff01"><WarningFilled /></el-icon></div>
      <div class="grow shrink basis-0 opacity-80 text-[#e1ff01] text-[12px] font-medium font-['Inter']">Cost to launch an AI agent is 0.02 SOL.</div>
    </div>
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
            label="Your name"
            prop="name"
          >
            <el-input
              v-model="form.name"
              placeholder="Your name"
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
              placeholder="Your gender"
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
              placeholder="Your conversation Style"
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
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="Twitter"
        prop="twitter"
      >
        <el-input
          v-model="form.twitter"
          placeholder="twitter"
          maxlength="255"
          clearable
        />
      </el-form-item>
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
        label="Knowledge sources"
        prop="file_id_list"
      >
        <div class="upload-custom" @click="openUploadKnowledge">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="37" viewBox="0 0 36 37" fill="none">
            <path d="M16.5 24.5V12.275L12.6 16.175L10.5 14L18 6.5L25.5 14L23.4 16.175L19.5 12.275V24.5H16.5ZM9 30.5C8.175 30.5 7.469 30.2065 6.882 29.6195C6.295 29.0325 6.001 28.326 6 27.5V23H9V27.5H27V23H30V27.5C30 28.325 29.7065 29.0315 29.1195 29.6195C28.5325 30.2075 27.826 30.501 27 30.5H9Z" fill="#C5C5C5" />
          </svg>
          <div class="upload-custom-text">
            <div class="upload-custom-text-top">
              Click to upload file
            </div>
          </div>
        </div>
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

    <UploadKnowledge
      ref="uploadKnowledgeRef"
      width="600px"
      @after-upload-knowledge="afterUploadKnowledge"
    />
    <StartLaunch
      ref="startLaunchRef"
      width="600px"
    />
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { memeCreate, memeCheck } from '@gptx/base/api/meme-bot';
import UploadKnowledge from './uploadKnowledge/index.vue';
import StartLaunch from '@/components/StartLaunch/index.vue';
const router = useRouter();
// const emits = defineEmits(['after-create', 'after-update']);
const isVisible = ref(false);
const form = reactive({
  name: '',
  gender: null,
  classification: [],//  conversation
  audio: '',

  twitter: '',
  telegram_bot_address: '',
  telegram_bot_token: '',

  introduction: '',
  icon: '',
  third_company:'',
  file_id_list: [],
  is_personalize_image_icon: false
});
const rules = reactive({
  name: [{ required: true, message: t('bots.ruleMessage.name') }],
  classification: [{ required: true, message: t('bots.ruleMessage.catalog'), trigger: 'change' }],
  telegram_bot_address: [{ required: true, message: 'Telegram address' }],
  telegram_bot_token: [{ required: true, message: 'Please enter Telegram Bot token' }],
  icon: [{ required: true, message: t('bots.ruleMessage.icon'), trigger: 'change' }],
  introduction: [{ required: true, message: t('bots.ruleMessage.introduction') }],
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

const audioList = reactive([
  { id: 'Aiden', name: 'Aiden' },
  { id: 'Eva', name: 'Eva' },
  { id: 'Jason', name: 'Jason' },
  { id: 'Sara', name: 'Sara' }
]);


const formRef = ref(null);
const loading = ref(false);
const isAIloading = ref(false);

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
const afterUploadKnowledge = ({file_id_list}) => {
  console.log(file_id_list,'id9999')
  // publishDialogRef.value.open({ id });
};


// commit action
const submitText = ref('Create')
const submitHandle = async (el) => {
  if (loading.value) return;
  await el.validate(async (valid) => {
    if (valid) {
      try {
        console.log(form,'form66666')
        loading.value = true;
        const result = await memeCreate(form);
        if (result.code === 200) {
          // loading.value = false;
          // emits('after-create', result.data);
          submitText.value = 'Pending...'
          let url = form.telegram_bot_address;
          if (url.startsWith('t.me')) {
            url =  'https://' + url
          }
          setMemeCheckTimer(result.data.id)
          window.open(url, '_blank');
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


// 轮询查询状态
const startLaunchRef = ref(null);
const memeCheckTimer = ref(null);
// const memeCoinInfo = ref({});
const setMemeCheckTimer = (bot_id) =>{
   memeCheckTimer.value = setInterval(async () => {
    try {
      const result = await memeCheck({ bot_id });
      if (result.code === 200 && result.data.state === 1) { // 对话创建完成meme coin
        clearInterval(memeCheckTimer.value)
        // memeCoinInfo.value = result.data;
        loading.value = false;
        submitText.value = 'Create'
        formRef.value.resetFields();
        // startLaunchRef.value.open({ ...result.data, bot_id});
        startLaunchRef.value.open({ // test
          "name": "Demo Token8",
          "symbol": "Demo8",
          "image": "https://s1.locimg.com/2024/12/11/3964164cf2a43.png",
          bot_id
        });
      }
    } catch (error) {
      throw error;
    }
  }, 30000);
}

const getTgToken = () => {
  window.open('https://www.siteguarding.com/en/how-to-get-telegram-bot-api-token', '_blank')
};

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
    width: 125px;
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
