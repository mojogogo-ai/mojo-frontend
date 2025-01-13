<!-- <script setup>
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
    default:'/portal/conversation/chat-debug'
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
</template> -->









<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message" v-html="renderMarkdown(message)"></div>
    </div>
    <input
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Type a message..."
      class="message-input"
    />
  </div>
</template>

<script>
import { marked } from 'marked';

export default {
  name: 'ChatUi',  // 更新组件名称
  data() {
    return {
      newMessage: '', // 输入框的消息
      messages: [], // 消息记录
      sid: null, // 用于存储 SID
      botId: null,
      currentToken: null, // Store for current token
    };
  },
  async created() {  
    this.currentToken = await this.fetchToken(); // 在组件创建时获取 token  
  }, 
  methods: {
    renderMarkdown(message) {
      return marked(message); // 使用 marked 解析 Markdown
    },
    async fetchToken(){
      const response = await fetch('http://localhost:9004/portal/v1/open/auth/grant-token', {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({  
          appid: 'I6iz8SAHfimCuGQMCbwN',  
          appkey: 'PcpTHb2q6w39oxQqCP1s',  
          uid: 'sdfasfas',  
        }),  
      });  
      
      if (!response.ok) {  
        throw new Error('Failed to obtain token');  
      }  
      
      const data = await response.json();  
      return data.data.token; // Assume token is in the `token` field  
    },
    async twitterAuth(){
      const response = await fetch('http://localhost:9004/portal/v1/twitter/authorize', {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({  
          appid: 'I6iz8SAHfimCuGQMCbwN',  
          appkey: 'PcpTHb2q6w39oxQqCP1s',  
          uid: 'sdfasfas',  
        }),  
      });  
      
      if (!response.ok) {  
        throw new Error('Failed to obtain token');  
      }  
      
      const data = await response.json();  
      return data.data.token; // Assume token is in the `token` field  
    },
    async sendMessage() {
      if (this.newMessage.trim()) {
        // 将用户输入的消息添加到消息记录中
        this.messages.push(`You: ${this.newMessage}`);  
        
        // Define function to send chat request  
        const sendChatRequest = async (token) => {  
          console.log(token);
          const chatResponse = await fetch(`http://localhost:9004/portal/v1/bot/meme-chat?token=${token}`, {  
            method: 'POST',  
            headers: {  
              'Content-Type': 'application/json',  
            },  
            body: JSON.stringify({  
              bot_id: this.botId,  
              prompt: this.newMessage,  
              stream: true,  
              sid: this.sid,  
            }),  
          });
          
          return await chatResponse;  
        };  
        
        try {
          let response = await sendChatRequest(this.currentToken);  
          
          // If the code in response indicates token expiration, fetch a new token and retry  
          if (!response.ok) {
            throw new Error('Network response was not ok');  
          }

          // 使用流模式读取响应
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let result = '';

          this.messages.push("Server: "); // 更新聊天记录
          // 逐块读取数据并解析
          let isDone = false
          while (!isDone) {
            const { done, value } = await reader.read();
            if (done) {
              isDone = done
              break; // 如果读取完成，退出循环
            }
            result = decoder.decode(value, { stream: true });

            // 解析每一块数据并提取 content 字段
            const lines = result.split('\n'); // 按行分割
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonString = line.substring(6); // 去掉 'data: ' 前缀
                try {
                  const jsonData = JSON.parse(jsonString);
                  if (jsonData.content) {
                    this.messages[this.messages.length-1]+=jsonData.content; // 更新聊天记录
                  }
                  // 提取 sid
                  if (jsonData.sid) {
                    this.sid = jsonData.sid; // 更新 sid
                  }
                  if (jsonData.bot_id) {
                    this.botId = jsonData.bot_id; // 更新 sid
                  }
                } catch (e) {
                  console.error('JSON parse error:', e);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          this.messages.push(`Error: ${error.message}`); // 将错误信息添加到消息记录中
        }

        // 清空输入框
        this.newMessage = '';
      }
    },
  },
};
</script>

<style scoped>
  @media (max-width: 600px) {
  .chat-container {
    padding: 10px; /* 较小屏幕的内边距 */
  }

  .message-input {
    padding: 8px; /* 较小屏幕输入框的内边距 */
  }
}
*,
*::before,
*::after {
  box-sizing: border-box;
  }
  .chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 使聊天容器占满整个视口高度 */
  padding: 20px;
  overflow: hidden; /* 防止溢出 */
}

.messages {
  flex: 1; /* 使消息区域占据剩余空间 */
  overflow-y: auto; /* 允许垂直滚动 */
  margin-bottom: 10px;
  padding: 10px; /* 为消息区域添加内边距 */
  border: 1px solid #241c1c; /* 添加边框 */
  border-radius: 5px; /* 圆角 */
  background-color: #080606; /* 背景色 */
  opacity: 0.7; /* 透明度 */
}

.message {
  padding: 10px;
  margin: 5px 0;
  background-color: #85af10; /* 消息背景色 */
  border-radius: 5px;
}

.message-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%; /* 输入框宽度自适应 */
}
</style>
