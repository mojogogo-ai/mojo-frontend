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
const router = useRouter();
const isVisible = ref(false);

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
const publicKey = ref('') // publicKey就是address

const __sendTr = async () => {
    const provider = getProvider(); // see "Detecting the Provider"
    
    try {
      const resp = await provider.connect();
      console.log(resp,'resp')
      publicKey.value = resp.publicKey.toString()
      const params = {
          "bot_id": memeCoinInfo.value.bot_id,
          "chain_name": "solana",
          "name": memeCoinInfo.value.name,
          "symbol": memeCoinInfo.value.symbol,
          "image":  memeCoinInfo.value.icon,
          "address": publicKey.value,
          "description":''
      };
      console.log(params,'params')

      launchLoading.value = true;
      const res = await getTokenCreate(params);
      if (res.code === 200) {
        console.log(res,'token creation res');
        const binaryData = base64ToBinary(res.data.tx_base64);
        
        // const connection = new Connection(clusterApiUrl('mainnet'));
        // const connection = new Connection(clusterApiUrl('devnet'));

        try {

          let res = await provider.request({
              method: "signAndSendTransaction",
              params: {
                  message: bs58.encode(binaryData),
              },
          });
          if(res.signature){
            launchLoading.value = false;
            console.log(res, 'res----->signature')
            // let connectRes =  await connection.getSignatureStatus(signature);
            // if(connectRes.context){
            //   launchLoading.value = false;
            //   console.log(connectRes,'connectRes')
            // }
            close()
            // 发送交易成功后
            __memePaid(memeCoinInfo.value.bot_id, res.signature )
            router.push({ path: '/personal' });
          }
        
        } catch (error) {
          launchLoading.value = false;
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
