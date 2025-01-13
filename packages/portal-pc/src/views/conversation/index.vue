<template>
  <div class="h-full transition-all chat-bg">
    <GptxChat v-if="botConfig" :bot-info="botConfig" :operation-config="operationConfig" :chat-api-url="chatApiUrl" :is-debug="false" style="max-width: 100%"  />
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { memeCreate, memeCheck } from '@gptx/base/api/meme-bot';
import StartLaunch from '@/components/StartLaunch/index.vue';
import GptxChat from '@gptx/components/src/components/GptxChat/index.vue';
import { ref } from 'vue';
const router = useRouter();
const chatApiUrl =  '/portal/conversation/chat-anonymous';
const botConfig = ref(null)
const _getChatDetail = async () => {
  let systemBot = JSON.parse('{"id":"SafeGen-AI-Chat","name":"SafeGen AI","icon":"","prologue":"When you have the inspiration to create an assistant, just tell me your ideas, and I can help you create one. Additionally, if you need inspiration, feel free to browse the assistant store anytime to see what other developers have made; it might just spark your creativity!","description":"","system":true}')
  let predefined_question = systemBot.predefined_question ? systemBot.predefined_question.map((i)=>{ return { content:i } }):[]
  let prologue =  { content: systemBot.prologue ||"" }
  let resData = { app:{ ...systemBot, system:true}, predefined_question, prologue, isHome: true }
  botConfig.value = resData;
  return
};
_getChatDetail()

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
  name: [{ required: true, message: 'Meme bot name' }],
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
