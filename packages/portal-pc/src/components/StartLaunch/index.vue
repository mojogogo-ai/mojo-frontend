<template>
  <el-dialog
    v-model="isVisible"
    width="600px"
    title="Confirm and launch"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    destroy-on-close
    align-center
  >
    <div class="success-result-content">
      <p class="">Successfully created. Confirm and launch your coin.</p>
    </div>
    <template #footer>
      <div class="flex justify-center w-full">
        <el-button
          style="width: 220px;"
          :disabled="launchLoading"
          @click="close"
        >
          {{ t('common.cancel') }}
        </el-button>
        <el-button
          style="width: 220px;"
          type="primary"
          :loading="launchLoading"
          :disabled="launchLoading"
          linear
          @click="__sendTr()"
        >
          {{ 'Launch' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import bs58 from "bs58";
import { getTokenCreate, memePaid } from '@gptx/base/api/meme-bot';
import { WalletMultiButton,useWallet } from "solana-wallets-vue";
import { Connection, clusterApiUrl, Keypair, SystemProgram, Transaction,VersionedTransaction } from '@solana/web3.js';
const router = useRouter();
const isVisible = ref(false);
const appInstance = getCurrentInstance();

const launchLoading = ref(false);
const memeCoinInfo = ref({});

const open = async (coinInfo) => {
  memeCoinInfo.value = coinInfo;
  console.log(memeCoinInfo.value,'memecoinInfo')

  isVisible.value = true;
};
const close = () => {
  isVisible.value = false;
};

// commit action
const address = ref('') // publicKey就是address

const __sendTr = async () => {
    // const provider = getProvider(); // see "Detecting the Provider"
    
    try {
      // const resp = await provider.connect();
      // console.log(resp,'resp')
      // const publicKey = await useWallet();
      // address.value = publicKey.value.toBase58();
      // publicKey.value = resp.publicKey.toString()
      //const sendTransaction = useWallet();
      console.log("wallet",appInstance.appContext.config.globalProperties.$wallet);
      const connection = new Connection(clusterApiUrl('mainnet-beta'));
      const params = {
          "bot_id": memeCoinInfo.value.bot_id,
          "chain_name": "solana",
          "name": memeCoinInfo.value.name,
          "symbol": memeCoinInfo.value.symbol,
          "image":  memeCoinInfo.value.icon,
          "address": appInstance.appContext.config.globalProperties.$wallet.publicKey.value.toBase58(),
          "description":''
      };
      console.log(params,'params')

      launchLoading.value = true;
      const res = await getTokenCreate(params);
      if (res.code === 200) {
        const sendTransaction = appInstance.appContext.config.globalProperties.$wallet.sendTransaction;
        console.log(res,'token creation res');
        const buffer = Buffer.from(res.data.tx_base64, 'base64');
        console.log("buffer",buffer)
        const transaction = VersionedTransaction.deserialize(buffer);
        console.log("transaction",transaction)
        const binaryData = base64ToBinary(res.data.tx_base64);
        
        
        // const connection = new Connection(clusterApiUrl('mainnet'));
        // const connection = new Connection(clusterApiUrl('devnet'));
       
        try {

          const signature = await sendTransaction(transaction, connection);
          console.log("signature",signature)
          // await connection.confirmTransaction(signature, 'processed');
        //   //const signature = await sendTransaction();
        //   let res = await provider.request({
        //       method: "signAndSendTransaction",
        //       params: {
        //           message: bs58.encode(binaryData),
        //       },
        //   });
          if(signature){
            launchLoading.value = false;
            // let connectRes =  await connection.getSignatureStatus(signature);
            // if(connectRes.context){
            //   launchLoading.value = false;
            //   console.log(connectRes,'connectRes')
            // }
            close()
            // 发送交易成功后
            __memePaid(memeCoinInfo.value.bot_id, signature )
            router.push({ path: '/personal' });
          }
        
        } catch (error) {
          launchLoading.value = false;
            console.error("Transaction confirmation failed:", error);
        }
      }
    } catch  (error){
      console.error("Transaction confirmation failed:", error);
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
    // 解码 Base64 字符串
    const decoded = atob(base64);
    // 创建一个数组用于存储二进制数据
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
    console.log(params,'params__memePaid')
    const res = await memePaid(params);
    if (res.code === 200) {
      console.log(res,'__memePaid')
    }
}

defineExpose({ open });
onMounted( () => {
});
</script>

<style lang="scss">
.success-result-content{
  .el-result__title p{
    color: #fff !important;
  }
}

</style>
