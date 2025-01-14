<script setup>
import { NConfigProvider } from 'naive-ui'
import { useChatStore } from "@gptx/base/useHooks/store/useChatStore.js";
import Chat from "./components/chat.vue"
const chatStore = useChatStore();

const props = defineProps({
  botInfo: {
    type:Object,
    default:()=>{
      return {}
    }
  },
  chatApiUrl:{
    type: String,
    default:'v1/bot/meme-chat?token=${token}'
  },
  isDebug: {
    type:Boolean,
    default: false
  },
  operationConfig: {
    type:Object,
    default:()=>{
      return  {
          addFile: false
      }
    }
  }
})

const themeOverrides = {
    common: {
      primaryColor: '#076dea',
      primaryColorHover: '#076dea',
    }
  }
const emit = defineEmits(['onError'])

const initBot = () =>{
  console.log(chatStore.history, 'history66')
  let storeBot = {
    "id": props.botInfo.app.id,
    "name": props.botInfo.app.name,
    "icon": props.botInfo.app.icon,
    "avatar": props.botInfo.app.avatar || '', // share page userAvatar
    "system": props.botInfo.app.system,
    "prologue": props.botInfo.prologue,
    "predefined_question": props.botInfo.predefined_question,
    "shared_key": props.botInfo.shared_key || '',
    "isHome": props.botInfo.isHome
  }
  if(!chatStore.history||chatStore.history.length===0) {
      chatStore.addHistory({
        ...storeBot,
      });
        // first chat --- prologue
      chatStore.addChatByUuid(storeBot.id,
        {
          text: storeBot.prologue.content,
          inversion: false,
          isPrologue: true,
          predefined_question:storeBot.predefined_question,
          error: false,
          "isHome": storeBot.isHome,
          conversationOptions: null
        }
      );
      // add chat record
      addchatRecord(storeBot)
  } else {
    // Syn prologue and preset questions
    chatStore.updateChatSomeByUuid(storeBot.id, 0, {
      text: storeBot.prologue.content,
      predefined_question:storeBot.predefined_question
    })
    chatStore.updateHistory(chatStore.active, {
      prologue: storeBot.prologue,
      predefined_question: storeBot.predefined_question
    })
  }
}

const addchatRecord = async (storeBot) => {
  try {
    if (props.botInfo) {
      let sourceRecordList = props.botInfo.record_list || []
      let sid = props.botInfo.sid || ''
      let chatRecordList = recordDataStructureChange(sourceRecordList, sid)
      chatStore.chatRecordByUuid(storeBot.id, chatRecordList)
    }
  } catch (e) {
    console.log(e,'eee9')
  }
};

// Keep consistent with existing chat data structure (to be optimized)
const recordDataStructureChange = (sourceRecordList, sids) =>{
  let chatRecordList = []
  let sid = sids || ''
  for (let i = 0; i < sourceRecordList.length; i++) {
    const item = sourceRecordList[i];
    // ask
    chatRecordList.push({
      conversationOptions:{
        mid:item.mid,
        sid:sid,
        refs: sourceRecordList[i].refs
      },
      error: false,
      inversion: true,
      isGood:item.evaluate,
      // isGood:'',
      loading: false,
      text: item.question,

      // reserved fields (no use)
      answer_type:item.answer_type,
      // content:item.content,
      evaluate:item.evaluate,
      extra_info:item.extra_info,
      question_type:item.question_type,
      status:item.status,
      tap_type:item.tap_type
    })   
    // answer
    chatRecordList.push({
      conversationOptions:{
        mid:item.mid,
        sid:sid,
      },
      error: false,
      inversion: false,
      isGood:item.evaluate,
      loading: false,
      text: item.answer,

      // reserved fields (no use)
      answer_type:item.answer_type,
      // content:item.content,
      evaluate:item.evaluate,
      extra_info:item.extra_info,
      question_type:item.question_type,
      status:item.status,
      tap_type:item.tap_type
    })   
    
  }
  return chatRecordList
}

const onErrorHandle =(res)=>{
  emit('onError', res)
}

watch(() => props.botInfo, (val) => {
  console.log(val,'watchwatch')
  if (val) {
    initBot()
  }
}, { deep: true })

onMounted(()=>{
  if(props.botInfo){
    initBot()
  }
})
onUnmounted(() => {
  chatStore.deleteALLHistory()
})
</script>

<template>
  <NConfigProvider class="h-full" :theme-overrides="themeOverrides">
    <div class="h-full overflow-hidden transition-all">
      <Chat :chat-api-url="chatApiUrl" :operation-config="operationConfig" :is-debug="isDebug" @on-error="onErrorHandle" />
    </div>
  </NConfigProvider>
</template>
