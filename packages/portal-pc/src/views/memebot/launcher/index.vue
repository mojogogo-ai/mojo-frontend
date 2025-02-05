<template>  
    <div v-if="isPopupOpen" class="popup-overlay">  
      <div class="popup-window">  
        <div class="dialog-box">  
          <div  
            v-for="(line, index) in displayedLines"  
            :key="index"  
            :class="['dialog-text', line.sender === 'user' ? 'right' : 'left']"  
          >  
            <div class="bubble" :class="line.sender === 'user' ? 'right' : 'left'">  
              {{ line.text }}  
            </div>  
          </div>  
        </div>  

        <!-- 动态显示按钮 -->  
        <div class="action-button">  
          <el-button  
            type="primary"
            v-if="currentStep === 1"  
            :disabled="isTyping"  
            @click="nextStep"  
          >  
            Let’s Launch!  
          </el-button>  
          <el-button  
            type="primary"
            v-else-if="currentStep === 2" 
            :loading="isTyping" 
            :disabled="isTyping"  
            @click="sendTx"  
          >  
            Confirm  
          </el-button>  
          <el-button  
            type="primary"
            v-else-if="currentStep === 3"  
            :disabled="isTyping"  
            @click="finishProcess"  
          >  
            Check My Coins 
          </el-button>  
        </div>  
      </div>  
    </div>  
  </template>  
  
  <script>  
  import { ref, computed } from "vue"; 
  import bs58 from "bs58";
  import { getTokenCreate, memePaid } from '@gptx/base/api/meme-bot';
  import useUserStore from '@/store/modules/user.js';
  
  import { WalletMultiButton,useWallet } from "solana-wallets-vue";
  import { Connection, clusterApiUrl, Keypair, SystemProgram, Transaction,VersionedTransaction } from '@solana/web3.js';
  export default {  
    name: "launcherDialog",
    props: {  
      username: {  
        type: String,  
        required: true,  
      },  
      coin: {  
        type: String,  
        required: true,  
      },  
    }, 

    setup(props, { expose }) { 
      
      const appInstance = getCurrentInstance();
      const user = useUserStore();
      const router = useRouter();  
      let coin = props.coin;
      const isPopupOpen = ref(false); // 控制弹窗显示状态  
      const steps = computed(() => [  
        [  
          { text: `Hi ${user.nickname}! 🚀 I'm ${coin} agent, your personal AI agent for launching and managing ${coin} coin.`, sender: "system" },  
          { text: `Together, we’re about to make ${coin} the next big thing on Web3!`, sender: "system" },  
          { text: "Ready? Let’s take it step by step.", sender: "system" }  
        ],  
        [  
          { text: "Great choice! 🎉 Your wallet should now pop up.", sender: "system" },  
          { text: "Double-check all details (like gas fees and token info).", sender: "system" },  
          { text: "Once you're happy with it, click Confirm.", sender: "system" }  
        ],  
        [  
          { text: `BOOM! 💥 ${coin} is officially live! 🚀`, sender: "system" },  
          { text: "Check your coin at my memes page.", sender: "system" },  
          { text: "Spread the word and build the hype together!", sender: "system" },  
        ]  
      ]);  
  
      const currentStep = ref(0); // 当前步骤  
      const displayedLines = ref([]); // 当前显示的所有句子，每条是 { text, sender }  
      const isTyping = ref(false); // 是否正在打字  
      let currentLineIndex = 0; // 当前步骤中的句子索引  
  
      const showTypingEffect = (sentence, onComplete) => {  
        isTyping.value = true; // 设置为打字中  
        let currentText = "";  
        let index = 0;  
  
        const interval = setInterval(() => {  
          if (index < sentence.text.length) {  
            currentText += sentence.text[index++]; // 逐字更新当前句子  
            displayedLines.value[currentLineIndex].text = currentText; // 更新文字视图  
          } else {  
            clearInterval(interval); // 完成当前句子的打印  
            onComplete && onComplete(); // 触发回调函数（显示下一句）  
          }  
        }, 25); // 每个字符的显示间隔  
      };  
  
      const displayCurrentStep = () => {  
        const sentences = steps.value[currentStep.value - 1]; 
        currentLineIndex = 0;  
        displayedLines.value = [{ text: "", sender: sentences[0].sender }];  
        const displayNextLine = () => {  
          if (currentLineIndex < sentences.length) {  
            const sentence = sentences[currentLineIndex];  
            displayedLines.value[currentLineIndex].sender = sentence.sender;  
            showTypingEffect(sentence, () => {  
              currentLineIndex++;  
              if (currentLineIndex < sentences.length) {  
                displayedLines.value.push({ text: "", sender: sentences[currentLineIndex].sender });  
                displayNextLine();  
              } else {  
                isTyping.value = false; 
                if (currentStep.value === 2) {  
                  isTyping.value = true;  
                } 
              }  
            });  
          }  
        };  
        displayNextLine();  
      };
  
      const nextStep = () => {  
        if (isTyping.value) return;  
        if (currentStep.value < steps.value.length) {   
          currentStep.value++;  
          displayCurrentStep();  
        }  
        if (currentStep.value === 2) {  
          isTyping.value = true;  
          __sendTr();  
        }
      };

      const sendTx = () => {  
        __sendTr();  
      };
  
      const finishProcess = () => {  
        router.push('/personal'); 
      };  
  
      const memeCoinInfo = ref({});
      const openPopup = (coinInfo) => {  
        memeCoinInfo.value = coinInfo;
        console.log(memeCoinInfo.value,'memecoinInfo');
        coin = memeCoinInfo.value.name;
        isPopupOpen.value = true; // 打开弹窗  
        currentStep.value = 0; // 重置步骤  
        nextStep(); // 开始第一步  
      };  

      const address = ref('') 
      
      const __sendTr = async () => {
        // const provider = getProvider(); // see "Detecting the Provider"
        
        try {
          // const resp = await provider.connect();
          
          
          console.log("wallet",appInstance.appContext.config.globalProperties.$wallet);
          const connection = new Connection(clusterApiUrl('mainnet-beta'));
          const params = {
              "bot_id": memeCoinInfo.value.bot_id,
              "chain_name": "solana",
              "name": memeCoinInfo.value.name,
              "symbol": memeCoinInfo.value.symbol,
              "image":  memeCoinInfo.value.icon,
              "address": address.value,
              "description":''
          };

          isTyping.value = true;
          const res = await getTokenCreate(params);
          if (res.code === 200) {
            const sendTransaction = appInstance.appContext.config.globalProperties.$wallet.sendTransaction;
            console.log(res,'token creation res');
            const buffer = Buffer.from(res.data.tx_base64, 'base64');
            console.log("buffer",buffer)
            const transaction = VersionedTransaction.deserialize(buffer);
            console.log("transaction",transaction)
            const binaryData = base64ToBinary(res.data.tx_base64);
            
                
            try {

              const signature = await sendTransaction(transaction, connection);
              console.log("signature",signature)
              await connection.confirmTransaction(signature, 'processed');
        
              if(signature){
                isTyping.value = false;
                
                __memePaid(memeCoinInfo.value.bot_id, signature );
                nextStep();
              }
            
            } catch (error) {
              isTyping.value = false;
                console.error("Transaction confirmation failed:", error);
            }
          }
        } catch  {
          ElMessage({
              message: 'Please connect to Phantom wallet.',
              type: 'error',
              duration: 4000
            });
        }
      };

      const getProvider = () => {
        if ('phantom' in window) {
          const provider = window.phantom?.solana;
          if (provider?.isPhantom) {
            return provider;
          }
        }
      };


      function base64ToBinary(base64) {
          const decoded = atob(base64);
          const binaryArray = new Uint8Array(decoded.length);

          // 将解码后的字符串转换为二进制
          for (let i = 0; i < decoded.length; i++) {
            binaryArray[i] = decoded.charCodeAt(i);
          }

          return binaryArray;
      }

      // 更新状态
      const __memePaid = async (bot_id, tx_signature )=>{
        const params = {
              "bot_id": bot_id,
              "tx_signature": tx_signature,
          };
          const res = await memePaid(params);
          if (res.code === 200) {
            console.log(res,'__memePaid')
          }
      }
      watch(connectedWallet, async (currentValue) => {
        console.log(currentValue);
        address.value = currentValue.value.toBase58();
      })

      expose({  
        openPopup,  
      });  

      return {  
        isPopupOpen,  
        displayedLines,  
        currentStep,  
        isTyping,  
        nextStep,  
        sendTx,
        finishProcess,  
        openPopup 
      };  
    }  
  };  
  </script>  
  
  <style scoped>  
  div {
      font-family: "Inter";
  }

  /* 弹窗背景遮罩 */  
  .popup-overlay {  
    position: fixed;  
    top: 0;  
    left: 0;  
    width: 100%;  
    height: 100%;  
    background: rgba(0, 0, 0, 0);  
    display: flex;  
    justify-content: center;  
    align-items: center;  
    z-index: 999;  
  }  
  
  /* 弹窗主体 */  
  .popup-window {  
    backdrop-filter: blur(100px);
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;  
    width: 500px;  
    max-width: 90%;  
    padding: 20px;  
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);  
    display: flex;  
    flex-direction: column; 
  }  
  
  /* 对话框区域 */  
  .dialog-box {  
    display: flex;  
    flex-direction: column;  
    gap: 10px;  
    margin-bottom: 20px;  
  }  
  
  /* 气泡样式 */  
  .bubble {  
    display: inline-block;  
    max-width: 80%;  
    padding: 10px 15px;  
    border-radius: 15px;  
    line-height: 1.5;  
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);  
  }  
  
  /* 左侧气泡样式 */  
  .bubble.left {  
    background-color: #e0f7fa;  
    color: #000;  
    align-self: flex-start;  
  }  
  
  /* 右侧气泡样式 */  
  .bubble.right {  
    background-color: #dcedc8;  
    color: #000;  
    align-self: flex-end;  
  }  
  
  /* 按钮区域 */  
  .action-button {  
    text-align: center;  
    margin-top: 20px;  
  }  
  </style>