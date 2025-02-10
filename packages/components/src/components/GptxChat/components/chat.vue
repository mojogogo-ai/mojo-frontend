<template>
  <div style="max-width: 100%" class="flex flex-col h-full">
    <main class="flex-1 overflow-hidden">
      <div
        id="scrollRef"
        ref="scrollRef"
        class="w-full h-full p-4 overflow-y-auto"
      >
        <div style="max-width: 780px;margin: 0 auto;">
          <template v-if="dataSources.length">
            <div>
              <Message
                v-for="(item, index) of dataSources"
                :key="index"
                date-time=""
                :text="item.text"
                :inversion="item.inversion"
                :error="item.error"
                :loading="item.loading"
                :is-good="item.isGood"
                :is-prologue="item.isPrologue"
                :is-home="item.isHome"
                :predefined-question="item.predefined_question||[]"
                :suggested-question="suggestedQuestion||[]"
                :last-flag="index == dataSources.length - 1"
                :conversation-options="item.conversationOptions"
                @predefined-question-handle="predefinedQuestionHandle"
              />
            </div>
          </template>
        </div>
      </div>
    </main>
    <footer
      class="mb-[36px]"
    >
      <div style="max-width: 780px;" class="m-auto">
        <div class="flex flex-col items-center justify-between">
          <div class="flex items-center justify-between w-full space-x-2">
            <div v-if="!isMobi()" class="flex flex-col justify-between w-full ">
            <div v-if="isStart()" class="start-button-continer">
              <button
                class="start-button"
                @click="startHandle()"
              >
                {{ $t("chat.start") }}
              </button>
            </div>
            <div v-else-if="readyForLaunch" class="start-button-continer">
              <button
                class="start-button"
                @click="Launch()"
              >
                Launch
              </button>
            </div>
            <div v-else>
              <NInput
                ref="inputRef"
                v-model:value="prompt"
                :allow-input="inputTrim"
                type="textarea"
                :placeholder="isMobi()?$t('chat.placeholder_h5'):$t('chat.placeholder')"
                :autosize="{ minRows: 3, maxRows: 8 }"
                class="prompt-input"
                @keypress="handleEnter"
              >
                <template #suffix>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="t('chat.tip6')"
                    placement="top"
                  >
                    <div
                      v-if="operationConfig.addFile"
                      class="flex items-center mr-2 cursor-pointer"
                      :style="{ 'opacity': loading ?'0.5':'1' }"
                    >
                      <el-icon size="26" color="#066BE9" @click="addFile">
                        <DocumentAdd />
                      </el-icon>
                    </div>
                  </el-tooltip>

                  <div
                    class="flex items-center cursor-pointer"
                    style="margin-right: 12px;" :style="{ 'opacity': loading || (!prompt.trim() && filetList.length===0) ?'0.5':'1' }"
                  >
                    <el-icon size="26" color="#E0FF31" @click="onConversation('')">
                      <Promotion />
                    </el-icon>
                  </div>
                </template>
              </NInput>
            </div>

              <div v-if="filetList.length" class="flex flex-wrap  w-full p-2 mt-2 rounded-lg align-center bg-[#fff]">
                <div v-for="file in filetList" class="relative flex  items-center m-1 rounded-lg bg-[#F6F7F9] p-4">
                  <img
                    style="width: 20px;height: 20px;"
                    :src="docIcons[/\.[^\.]+$/.exec(file.file_name)[0].toLocaleLowerCase()]"
                  >
                  <div class="flex flex-col justify-center h-full px-2 text-xs">
                    <div
                      class="truncate max-w-36 min-w-18"
                      :title="file.file_name"
                    >
                      {{ file.file_name }}
                    </div>
                    <div class="mt-1">
                      {{ filesize(file.file_size) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <StartLaunch
              ref="startLaunchRef"
              width="600px"
            />
            <NInput
              v-if="isMobi()"
              ref="inputRef"
              v-model:value="prompt"
              :allow-input="inputTrim"
              :placeholder="isMobi()?$t('chat.placeholder_h5'):$t('chat.placeholder')"
              class="prompt-input-h5"
              @keypress="handleEnter"
            >
              <template #suffix>
                <div
                  class="flex items-center cursor-pointer"
                  style="margin-right: 12px;" :style="{ 'opacity': loading || !prompt || !prompt.trim()?'0.5':'1' }"
                >
                  <el-icon size="30" color="#066BE9" @click="onConversation('')">
                    <Promotion />
                  </el-icon>
                </div>
              </template>
            </NInput>
          </div>
        </div>
      </div>
    </footer>
    <ImportFileDialog
      ref="baseFileUploadRef"
      @reload="onReload"
    />
  </div>
</template>
  <script setup>
  import DisLike from '../../DisLike'
  import ImportFileDialog from './ImportFileDialog';

  import { memeCheck } from '@gptx/base/api/meme-bot';

  import { NInput } from 'naive-ui'
  import Message from './Message/index.vue'
  import { useScroll } from '@gptx/base/useHooks/web/useChatScroll.js'
  import { useChatStore } from '@gptx/base/useHooks/store/useChatStore.js'
  import { fetchEventSource } from '@microsoft/fetch-event-source'
  import { ElMessageBox } from 'element-plus'
  import { showConfirmDialog } from 'vant';
  import { getToken } from '@gptx/base/utils/auth'
  // import { getCurLang } from '@gptx/base'
  import { t } from '@gptx/base/i18n'
  import { evaluateApi } from "@gptx/base/api/application";
  import { chatNewSession } from "@gptx/base/api/chat";
  import { shareNewSession } from "@gptx/base/api/share";
  import { isMobi } from '@gptx/base'
  // import StartLaunch from '@/components/StartLaunch/index.vue'; // TODO
  import { filesize } from 'filesize';
  import IconHtml from '@/assets/images/base/upload/html.svg';
  import IconMd from '@/assets/images/base/upload/md.svg';
  import IconPdf from '@/assets/images/base/upload/pdf.svg';
  import IconTxt from '@/assets/images/base/upload/txt.svg';
  import IconExcel from '@/assets/images/base/upload/xls.svg';
  import IconDoc from '@/assets/images/base/upload/doc.svg';
  import IconCsv from '@/assets/images/base/upload/csv.svg';

  let controller = new AbortController()
  // const lang = getCurLang()
  const chatStore = useChatStore()
  const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()
  const dataSources = computed(() => chatStore.getChatByUuid(chatStore.active))
  const prompt = ref('')
  const loading = ref(false)
  const clearLoading = ref(false)
  const inputRef = ref(null)
  const dialogRef = ref(null)
  const regenerateLoading = ref(false)
  const itemMsgId = ref("")
  const itemIndex = ref(0)
  const emit = defineEmits(['onError'])
  const suggestedQuestion = ref([])
  const iframeToken = ref(null)
  const props = defineProps({
    chatApiUrl:{
      type: String,
      default:''
    },
    isDebug: {
      type:Boolean,
      default: false
    },
    operationConfig: {
      type:Object,
      default:()=>{
        return {
          addFile: false
        }
      }
    }
  })

  let messages = []; // 消息记录
  let sid = null; // 用于存储 SID
  const botId = ref(null);
  let token = null;
  let currentToken = null; // Store for current token
  const startLaunchRef = ref(null);
  const launchRef = ref(null);
  const readyForLaunch = ref(false);

  const inputTrim= (value) => !value.startsWith(" ")

  watch(() => dataSources.value.length, (newLen,oldLen) => {
    if (newLen > 1) {
      scrollToBottom()
    }

  }, { deep: true })

  watch(botId,(newId,oldId)=>{
    console.log(oldId===null,newId,oldId)
    if (oldId===null && newId!==null){
      console.log("botid change")
      setMemeCheckTimer(newId)
    }

  },{ once: true })

  // 触发开场白预置问题
  function predefinedQuestionHandle (predefinedQuest) {
    onConversation(predefinedQuest)
  }

  function startHandle(){
    onConversation("/CreateBot")
  }

  function isStart(){
    return botId.value==null
  }

  async function onConversation (v) {
    regenerateLoading.value = false;
    let message = v ? v : prompt.value;
    message = message.trim()
    if (loading.value || (message.trim() === '' && filetList.value.length===0) ) {
      return
    }
    if(message.trim() === '' && filetList.value.length!==0){
      message = t('chat.tip4')
    }

    controller = new AbortController()
    // 问
    chatStore.addChatByUuid(chatStore.active,{
      text: message,
      inversion: true,
      error: false,
      conversationOptions: { refs: filetList.value.length ? filetList.value : []}
    })
    loading.value = true
    prompt.value = ''

    // 答
    chatStore.addChatByUuid(chatStore.active, {
      text: '',
      loading: true,
      inversion: false,
      error: false,
      conversationOptions: null
    })
    scrollToBottom()
    let lastText = ''

    // let authToken = await getToken() TODO: replace fetch with getToken()
    // const response = await fetch('http://localhost:9004/portal/v1/open/auth/grant-token', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     appid: 'I6iz8SAHfimCuGQMCbwN',
    //     appkey: 'PcpTHb2q6w39oxQqCP1s',
    //     uid: 'sdfasfas',
    //   }),
    // });
    // const data = await response.json();

    filetList.value = [];
    if (iframeToken.value!==null){
      fetchEventSource(`${window.BASE_API}v1/bot/chat?token=` + iframeToken.value,{ //props.chatApiUrl, {
      signal: controller.signal,
      method: 'POST',
      openWhenHidden: true,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: botId.value,
        prompt: message,
        stream: true,
        sid: sid,
        chat_type: 1
      }),
      onmessage (event) {
        const eData = JSON.parse(event.data)
        console.log('onmessage', eData)
        botId.value = eData.bot_id
        sid = eData.sid
        lastText = lastText + eData.content
        chatStore.updateChatByUuid(
          chatStore.active,
          dataSources.value.length - 1,
          {
            text: lastText,
            inversion: false,
            error: false,
            loading: true,
            conversationOptions: { mid: eData.mid, sid: eData.sid, extendsData:eData.data }
          }
        )
        scrollToBottom()
        chatStore.updateHistory(chatStore.active, {
          sid: eData.sid,
        })
      },
      onclose () {
        chatStore.updateChatSomeByUuid(chatStore.active, dataSources.value.length - 1, { loading: false })
        if (lastText === '') {
          chatStore.updateChatSomeByUuid(chatStore.active, dataSources.value.length - 1,
            {
              text: `[${t('common.wrong')}]`,
              error: true,
              loading: false
            }
          )
        }
        loading.value = false
        scrollToBottomIfAtBottom()
      }
    })
    }else{
      let authToken = await getToken();
      fetchEventSource(`${window.BASE_API}v1/bot/chat`,{
      signal: controller.signal,
      method: 'POST',
      openWhenHidden: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer '+authToken,
      },
      body: JSON.stringify({
        bot_id: botId.value,
        prompt: message,
        stream: true,
        sid: sid,
        chat_type: 1
      }),
      onmessage (event) {
        const eData = JSON.parse(event.data)
        console.log('onmessage', eData)
        botId.value = eData.bot_id
        sid = eData.sid
        lastText = lastText + eData.content
        chatStore.updateChatByUuid(
          chatStore.active,
          dataSources.value.length - 1,
          {
            text: lastText,
            inversion: false,
            error: false,
            loading: true,
            conversationOptions: { mid: eData.mid, sid: eData.sid, extendsData:eData.data }
          }
        )
        scrollToBottom()
        chatStore.updateHistory(chatStore.active, {
          sid: eData.sid,
        })
      },
      onclose () {
        chatStore.updateChatSomeByUuid(chatStore.active, dataSources.value.length - 1, { loading: false })
        if (lastText === '') {
          chatStore.updateChatSomeByUuid(chatStore.active, dataSources.value.length - 1,
            {
              text: `[${t('common.wrong')}]`,
              error: true,
              loading: false
            }
          )
        }
        loading.value = false
        scrollToBottomIfAtBottom()
      }
    })
    }

  }

  function handleEnter (event) {
    if (!isMobi()) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        onConversation()
      }
    } else {
      if (event.key === 'Enter' && event.ctrlKey) {
        event.preventDefault()
        onConversation()
      }
    }
  }

  const memeCheckTimer = ref(null);

  const setMemeCheckTimer = (bot_id) =>{
    console.log("memecheck",bot_id)
   memeCheckTimer.value = setInterval(async () => {
    try {
      if(iframeToken.value!==null){
        // check meme
        const response = await fetch(`${window.BASE_API}v1/bot/meme-check?token=`+iframeToken.value+'&bot_id='+bot_id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        //const result = await memeCheck({ bot_id,token });
        console.log(result)
        if (result.code === 200 && result.data.state === 2) { // 对话创建完成meme coin
          clearInterval(memeCheckTimer.value)
          // memeCoinInfo.value = result.data;
          loading.value = false;
          launchRef.value = { ...result.data, bot_id};
          readyForLaunch.value =true;
          //startLaunchRef.value.open({ ...result.data, bot_id,token});
        }
      }else{
        // check meme
        let authToken = await getToken();
        const response = await fetch(`${window.BASE_API}v1/bot/meme-check?bot_id=`+bot_id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':'Bearer '+authToken,
          },
        });
        const result = await response.json();
        //const result = await memeCheck({ bot_id,token });
        console.log(result)
        if (result.code === 200 && result.data.state === 2) { // 对话创建完成meme coin
          clearInterval(memeCheckTimer.value)
          // memeCoinInfo.value = result.data;
          loading.value = false;
          launchRef.value = { ...result.data, bot_id};
          readyForLaunch.value =true;
          //startLaunchRef.value.open({ ...result.data, bot_id,token});
        }
      }

    } catch (error) {
      console.log(error)
      throw error;
    }
  }, 3000);
}

function Launch(){
  startLaunchRef.value.open(launchRef.value);
}

  const docIcons = {
  '.pdf': IconPdf,
  '.doc': IconDoc,
  '.docx': IconDoc,
  '.txt': IconTxt,
  '.html': IconHtml,
  '.md': IconMd,
  '.xls': IconExcel,
  '.xlsx': IconExcel,
  '.csv': IconCsv
};
  const baseFileUploadRef = ref(null);
  const addFile = ()=>{
    if (loading.value) {
      return
    }
    baseFileUploadRef.value.openModal()
  }

  // docs
  const filetList = ref([])
  const onReload = (file) => {
    filetList.value = [...file]
    console.log(filetList.value, 'filetList.value99')
  };

  onMounted(() => {
    scrollToBottom()
    //onConversation("/CreateBot")
  })

  onUnmounted(() => {
    if (loading.value){
      controller.abort()
    }
    clearInterval(memeCheckTimer.value);
    clearInterval(botId.value);
  })



  </script>
  <style lang="scss">
  .n-input.n-input--disabled .n-input__input-el, .n-input.n-input--disabled .n-input__textarea-el {
      cursor: default !important;
  }
  .prompt-input{
    --n-text-color: #fff !important;
    color: white !important;
    height: 50px;
    background-color: #FFFFFF26 !important;
    border-radius: 8px;
    border-width: 1px;
    border-color: #FFFFFF1A;
  }
  .prompt-input-h5{
    height: 44px !important;
    background-color: #FFFFFF26 !important;
    border-radius: 22px !important;
    border-width: 1px !important;
    border-color: #FFFFFF1A !important;
    .n-input__input-el{
      height: 44px !important;
      line-height: 44px !important;
    }
  }
  </style>
  <style scoped lang="scss">
  .chat-operation{
    min-width: 100px;
    height: 38px;
    background:rgb(255 255 255 / 50%);
    border-radius: 11px;
    border: 1px solid #E6E5E9;
    color: #307AFF;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
      &:hover{
        opacity: 0.8;
      }
    }

  #scrollRef::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  #scrollRef::-webkit-scrollbar {
    scrollbar-width: none; /* Firefox */
  }

  .start-button-continer{
    display: flex; /* 启用Flexbox */
    justify-content: center; /* 水平居中按钮 */
  }
  .start-button{

    font-family: TT Norms Pro;
    font-size: 20px;
    font-weight: 500;
    line-height: 23px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;

    width: 206px;
    height: 48px;
    gap: 0px; /* This might not have an effect on a button element */
    border-radius: 48px;
    opacity: 1; /* Assuming you meant for the buttons to be fully opaque */
    border: none; /* Assuming you might not want borders */
    cursor: pointer; /* Change cursor to pointer to indicate it's clickable */
    outline: none; /* Remove outline to improve aesthetics */

    background-color: #E0FF3133; /* Selected background */
    color: #E0FF31; /* Selected text color */
  }
  :deep(.n-input__border) {
    border: 1px solid #E0FF31;
    --n-border-focus: 1px solid #E0FF31 !important;
    --n-border-hover: 1px solid #E0FF31 !important;
    --n-box-shadow-focus: 1px solid #E0FF31 !important;
  }
  :deep(.n-input--focus) {
    border: 1px solid #E0FF31 !important;
  }
  :deep(.n-input--hover) {
    border: 1px solid #E0FF31 !important;
  }
  :deep(.n-input--stateful) {
    border: 1px solid #E0FF31 !important;
  }
  :deep(.n-input){
    border: 1px solid #E0FF31;
  }
</style>
