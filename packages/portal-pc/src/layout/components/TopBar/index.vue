<template>
  <el-header class="flex h-[80px] justify-center">
    <div class="flex w-full min-w-[800px] max-w-[1280px] items-center justify-between ">
      <div class="flex items-center">
        <Logo class="flex-none mr-10" />
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          :ellipsis="false"
          :router="true"
          class="font-[TTNormsPro] left-menu"
          @select="handleSelect"
        >
          <el-menu-item
            style="margin-right: 8px"
            index="/home"
          >
           Home
          </el-menu-item>
          <el-menu-item
            style="margin-right: 8px"
            index="/personal"
          >
            {{ t('menu.module.m') }}
          </el-menu-item>
          <el-menu-item
            style="margin-right: 8px"
            index="/assistant"
          >
            {{ t('menu.module.e') }}
          </el-menu-item>
        </el-menu>
      </div>
      <div class="create-bot-continer">
        <!-- <el-menu
          mode="horizontal"
          :ellipsis="false"
          class="font-[TTNormsPro] create-menu"
        > -->
        <el-button
              type="primary"
              class="create-bot-button font-['TT Norms Pro'] text-xl text-black"
              style="min-width: 150px;"
              @click="createHandleSelect('2')"
            >
                + Create
        </el-button>
          <!-- <el-sub-menu
            :popper-offset="15"
            popper-class="customs-sub-menu2"
          >
            <template #title>
              + Create
            </template>
            <el-menu-item
              style="min-width: 220px;"
              @click="createHandleSelect('1')"
            >
              <div class="flex px-[5px] justify-center items-center ">
                <div class="mr-[16px] flex h-9 w-9 items-center justify-center rounded-full bg-black">
                  <svg-icon
                    style="color: rgba(225, 255, 1, 1); font-size: 24px"
                    name="bot-store"
                  />
                </div>
                <div class="font-['Inter'] text-xl font-bold text-black">Bot</div>
              </div>
            </el-menu-item>
            <el-menu-item
              style="min-width: 240px;"
              @click="createHandleSelect('2')"
            >
              <div class="flex px-[5px] justify-center items-center ">
                <div class="mr-[16px] flex h-9 w-9 items-center justify-center rounded-full bg-black">
                  <svg-icon
                    style="color: rgba(225, 255, 1, 1); font-size: 24px"
                    name="lucide-bot"
                  />
                </div>
                <div class="font-['Inter'] text-xl font-bold text-black">Meme Bot</div>
              </div>
            </el-menu-item>
          </el-sub-menu> -->
        <!-- </el-menu> -->
      </div>
<!--      <el-dropdown>-->
<!--        <span class="el-dropdown-link">-->
<!--          <svg-icon name="language" class="icon-language"/>-->
<!--        </span>-->
<!--        <template #dropdown>-->
<!--          <el-dropdown-menu>-->
<!--            <el-dropdown-item @click="changeLanguage('en')">English</el-dropdown-item>-->
<!--            <el-dropdown-item @click="changeLanguage('zh-CN')">中文简体</el-dropdown-item>-->
<!--            <el-dropdown-item @click="changeLanguage('zh-TW')">中文繁体</el-dropdown-item>-->
<!--          </el-dropdown-menu>-->
<!--        </template>-->
<!--      </el-dropdown>-->
      <div class="flex items-center">
        <User v-if="isLogin" class="flex-none" />
        <NoLogin v-else @login="onLoginClick" />

        <div v-if="isLogin">
          <!-- <el-button v-if="isPhantomInstalled" type="primary" @click="connectWallet">PHANTOM WALLET</el-button> -->
          <div v-if="appInstance.appContext.config.globalProperties.$wallet.connected.value" class="flex flex-col items-center justify-center" @click="test()">
            <div class="flex items-center ">
              <img style="border-radius: 8px" width="30px" height="30px" :src="PhantomIcon" alt="" srcset="">
              <div
                style="border: 2px solid rgba(224, 255, 49, 0.5);"
                class="rounded-full flex items-center px-[6px] py-[1px] font-[500] ml-[4px] text-[11px] text-[#e1ff01]"
              >
                {{ curBalance }} SOL
              </div>
            </div>
            <span v-if="publicKey" style="color: rgba(255, 255, 255, 0.70);font-size: 14px;"> {{ publicKey.substring(0, 4) + "..." + publicKey.substring(publicKey.length - 4, publicKey.length) }}</span>
          </div>
          <!-- <el-button v-else type="primary" @click="installWallet">PHANTOM WALLET</el-button> -->
        </div>
      </div>
      <wallet-multi-button v-if="!appInstance.appContext.config.globalProperties.$wallet.connected.value">
      </wallet-multi-button>
    </div>
  </el-header>

  <!-- login or sign up -->
  <LoginAndSignup
    ref="loginRef"
    @dialog-close="onCloseLoginDialog"
    @close="onLoginClose"
  />

  <!-- create bot -->
  <bot-base-info
    ref="createBotRef"
    @after-create="afterCreateBot"
  />
  <UploadKnowledgeSources
    ref="uploadKnowledgeSourcesRef"
    width="600px"
    @after-upload-knowledge-sources="afterUploadKnowledgeSources"
  />
  <PublishDialog ref="publishDialogRef" />
  <!--  referral code  -->
  <referral-code
    ref="referralCodeRef"
    @confirm="onConfirmUserInvite"
  />

  <StartLaunch
    ref="startLaunchRef"
  />
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import Logo from './Logo';
import User from './User';
import NoLogin from './NoLogin';
import { getIsLogin } from '@gptx/base/utils/auth';
import useLoginStore from '@/store/modules/login';
import useBotStore from '@/store/modules/bot';
import useUserStore from '@/store/modules/user.js';
import { confirmUserInvite } from '@gptx/base/api/user.js';
import { useRoute, useRouter } from 'vue-router';
import LoginAndSignup from '@/components/LoginAndSignup';
import StartLaunch from '@/components/StartLaunch/index.vue';

import PhantomIcon from '@/assets/images/phantom.svg';
import BotBaseInfo from '@/components/BotBaseInfo'
import UploadKnowledgeSources from '@/components/uploadKnowledgeSources/index.vue';
import PublishDialog from '@/views/personal/components/publish/PublishDialog.vue';
import { eventBus } from '@gptx/base/utils/eventBus.js';

import { Connection, clusterApiUrl } from '@solana/web3.js';
import { useI18n } from "vue-i18n";


import { WalletMultiButton,useWallet } from "solana-wallets-vue";
import { watch } from 'vue';

const appInstance = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const useLogin = useLoginStore();
const useBot = useBotStore();
const useUser = useUserStore();

const loginRef = ref(null);
const createBotRef = ref(null);
const isLogin = ref(false);
const referralCodeRef = ref(null);

const activeIndex = ref('/home');
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath);
};
const publishDialogRef = ref(null);
eventBus.on('publishBot', ({id}) => {
  publishDialogRef.value.open({ id });
});
eventBus.on('createBot', async () => {
  isLogin.value = await getIsLogin();
  if(isLogin.value) {
    if (createBotRef.value) createBotRef.value.open({});
  } else {
    useLogin.setLoginDialogVisible(true, 'login');
  }
});
eventBus.on('editBot', async (option) => {
  isLogin.value = await getIsLogin();
  if(isLogin.value) {
    if (createBotRef.value) createBotRef.value.open(option);
  } else {
    useLogin.setLoginDialogVisible(true, 'login');
  }
});
onBeforeMount(async () => {
  await useUser.updateSysInfo();
  isLogin.value = await getIsLogin();
  const { query } = route;
  if (query && query.referral_code) window.sessionStorage.setItem('referral_code', query.referral_code);
});

const onCloseLoginDialog = () => {
  useLogin.setLoginDialogVisible(false);
};

const onLoginClose = async () => {
  await useUser.updateSysInfo();
  isLogin.value = await getIsLogin();
  onCloseLoginDialog();
};

const onOpenReferralCodeDialog = async () => {
  await nextTick();
  if (referralCodeRef.value) referralCodeRef.value.open();
};

const onConfirmUserInvite = async (refer_code) => {
  try {
    if (referralCodeRef.value) {
      referralCodeRef.value.setIsLoading(true);
      const { code } = await confirmUserInvite({ refer_code });
      if (code === 200) {
        referralCodeRef.value.setIsLoading(false);
        referralCodeRef.value.close();
      }
    }
  } catch (e) {
    console.log(e);
    if (referralCodeRef.value) referralCodeRef.value.setIsLoading(false);
  }
};

const uploadKnowledgeSourcesRef = ref(null);
const afterUploadKnowledgeSources = ({id}) => {
  publishDialogRef.value.open({ id });
};
const afterCreateBot = async (data) => {
  console.log('afterCreateBot', data);
  // 广播创建成功
  eventBus.emit('createBotSuccess', data);
  // TODO
  uploadKnowledgeSourcesRef.value.open({
    id: data?.id,
    files: data?.files || null
  });
};


const onCreateClick = async() => {
  isLogin.value = await getIsLogin();
  if (isLogin.value && createBotRef.value) {
    createBotRef.value.open();
  } else {
    useLogin.setLoginDialogVisible(true);
  }
};

// create bot
const createHandleSelect = async (type) => {
  if (type === '1') { // bot
    onCreateClick()
  } else { // meme bot
    // useBot.setCreateBotDialog(false);
    isLogin.value = await getIsLogin();
    if (isLogin.value && createBotRef.value) {
      if (isPhantomInstalled) {
        router.push({ path: '/memebot' });
      } else {
        installWallet();
      }
    } else {
      useLogin.setLoginDialogVisible(true);
    }
  }
};

const onLoginClick = (val) => {
  if(val) {
    useLogin.setLoginDialogVisible(true, 'login');
  } else {
    // useLogin.setLoginDialogVisible(false);
    // console.log('login');
    useLogin.setLoginDialogVisible(true, 'signup');
  }
};


const connectWallet = async () => {
  if (window.phantom?.solana?.isPhantom) {
    const provider = window.phantom?.solana;
    if (provider?.isPhantom) {
      try {
        const resp = await provider.connect();
        publicKey.value = resp.publicKey.toString()
        console.log('Public Key:', publicKey.value);
      } catch (error) {
        console.error('Error connecting to Phantom:', error);
      }
    }
  } else {
    console.error('Phantom not installed');
  }
}

const installWallet= async () => {
  window.open('https://phantom.app/', '_blank');
}


const getProvider =  () => {
  if ('phantom' in window) {
    const provider = window.phantom?.solana;
    if (provider?.isPhantom) {
      return provider;
    }
  }
  // window.open('https://phantom.app/', '_blank');
};


// 发送交易(创建token)
const publicKey = ref('') // publicKey就是address

// 获取Balance
const curBalance = ref('')
const getBalance = async () => {
  try {
    // const provider = getProvider(); // see "Detecting the Provider"
    // const resp = await provider.connect();
    // const connection = new Connection(clusterApiUrl('mainnet'));
    const connection = new Connection("https://dimensional-quick-sanctuary.solana-mainnet.quiknode.pro/b73ef3c61afe76bafce8615881ea46ce856db8a6");

    publicKey.value = appInstance.appContext.config.globalProperties.$wallet.publicKey.value.toBase58();
    const balance = await connection.getBalance(appInstance.appContext.config.globalProperties.$wallet.publicKey.value);
    const accountInfo = await connection.getAccountInfo(appInstance.appContext.config.globalProperties.$wallet.publicKey.value);


    curBalance.value = (balance/1000000000).toFixed(2)

    console.log(accountInfo,'accountInfo')
  } catch(error) {
    console.error(error)
    curBalance.value = 0
  }
}

const isPhantomInstalled = window.phantom?.solana?.isPhantom

// test
const startLaunchRef = ref(null);
const test = () => {
  // startLaunchRef.value.open({
  //   "name": "Dem Token6",
  //   "symbol": "Dem6",
  //   "image": "https://s1.locimg.com/2024/12/11/3964164cf2a43.png",
  // });
  // console.log('test')
}
onMounted(() => {
  // connectWallet()
  getBalance()
})

watch(
  () => appInstance.appContext.config.globalProperties.$wallet.publicKey.value,
  () => {
    getBalance()
  }
);
watch(
  () => route.path,
  (newPath, oldPath) => {
    let routeList = ['/home', '/assistant', '/personal'];
    console.log(newPath, oldPath, 'oldPath');
    if (routeList.indexOf(newPath) === -1) {
      activeIndex.value = '';
    } else {
      activeIndex.value = newPath;
    }
  },
  { immediate: true }
);

watch(
  () => useLogin.loginDialogVisible,
  (open) => {
    if (open && loginRef.value) loginRef.value.open();
  },
  { immediate: false }
);

watch(
  () => useLogin.isLogOut,
  () => {
    isLogin.value = false;
  },
  { immediate: false }
);

// watch(() => wallet.connected, (newVal, oldVal) => {
//   if (newVal) {
//     console.log("钱包已经连接");
//     // 钱包连接后的逻辑
//   } else {
//     console.log("钱包已经断开");
//     // 钱包断开后的逻辑
//   }
// });

watch(
  () => useBot.createBotDialog,
  () => {
    if (createBotRef.value) createBotRef.value.open({});
  },
  { immediate: false }
);

// const curLang = getCurLang();
// const langList = supportLang(); // 支持切换的语言
// const language = computed(() => {
//   return langList.find((i) => {
//     return i.value === curLang;
//   }).value;
// });
// const changeLangCommand = (item) => {
//   console.log(item);
//   localStorage.setItem('lang', item.value);
//   window.location.reload();
// };
const { locale } = useI18n()

const changeLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem('lang', lang);
};
onBeforeMount(() => {
  const savedLang = localStorage.getItem('lang');
  if (savedLang) {
    locale.value = savedLang;
  }
});

</script>


<style lang="scss" scoped>
 :deep(.el-menu.el-menu--horizontal){
   height: 47px;
 }

 :deep(.el-sub-menu__icon-arrow) {
   display: block;
   width: 12px;
   height: 12px;

   svg {
     visibility: hidden; /* 隐藏 SVG，但保留布局 */
   }

   &::before {
     content: ""; /* 伪元素不需要内容 */
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%); /* 水平垂直居中并旋转 */

     /* CSS 三角形 */
     width: 0;
     height: 0;
     border-left: 6px solid transparent; /* 左边透明 */
     border-right: 6px solid transparent; /* 右边透明 */
     border-top: 6px solid rgba(255, 255, 255, 0.70); /* 上边绘制蓝色三角形 */
   }
 }

:deep(.el-menu-item) {
  padding: 0 35px;
  color: rgba(255, 255, 255, 0.70);
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 23px; /* 127.778% */
  &.is-active {
    background: #000000!important;
  }
}
:deep(.el-sub-menu__title.el-tooltip__trigger.el-tooltip__trigger){
  border-bottom-width: 0;
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  padding-left: 39.5px;
  padding-right: 50.5px;
  line-height: 23px; /* 127.778% */
  .el-icon.el-sub-menu__icon-arrow{
    right: 23.5px;
    bottom: 11.5px;
  }
}

 :deep(.el-dropdown-menu__item) {
   color: #000000!important;
 }

</style>
<style lang="scss">
/* 自定义钱包按钮样式 */
.wallet-button-wrapper .swv-button-trigger,
.swv-button-trigger {
  position: relative;
  //padding-left: 40px !important;
  font-size: 0 !important;
  &::after {
    content: 'Connect'; /* 添加新文本 */
    font-size: 14px; /* 恢复字体大小 */
    margin-left: 24px; /* 向右移动5px */
  }
}

.wallet-button-wrapper .swv-button-trigger::before,
.swv-button-trigger::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: url('@/assets/svg/wallet-icon.svg') no-repeat center center;
  background-size: contain;
  z-index: 2;
  p{
    visibility: hidden;
    clip-path: inset(100%);
  }
}
.swv-button-icon {
  visibility: hidden;
  clip-path: inset(100%);
}
.swv-button-trigger{
  width: 130px;
  background: rgba(255, 255, 255, 0.10) !important;
  border-radius: 40px !important;
  border: 1px solid rgba(255, 255, 255, 0.10) !important;
  display: flex !important;
  height: 40px !important;
  padding: 0px 20px !important;
  justify-content: center !important;
  align-items: center !important;
  color: #e1ff00 !important;
  //

  //font-size: 1.25rem !important;
  //transition: transform 0.3s ease-out !important;
  //font-family: Arial !important;
  //font-weight: var(--el-button-font-weight) !important;
  //border-radius: var(--el-border-radius-base) !important;
  //white-space: nowrap !important;
}

.customs-sub-menu {
  border-radius: 20px!important;
  overflow: hidden;
  //padding: 10px 0;
 .el-menu--popup{
   padding: 0;
 }

  &.el-menu--horizontal {
    .el-menu {
      box-shadow: none !important;
    }

    .el-menu-item {
      min-height: 70px;
      height: auto !important;
      padding: 20px 15px;
      line-height: unset !important;
    }
  }
}

.el-popper .el-menu--horizontal .el-menu .el-menu-item:not(.is-disabled):focus,
.el-popper .el-menu--horizontal .el-menu .el-menu-item:not(.is-disabled):hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.customs-sub-menu2 {
  .el-menu-item {
    min-height: 50px;
    height: auto !important;
    padding: 10px 15px;
    margin: 10px 0;
    line-height: unset !important;
  }
}
.create-bot-continer{
    .el-sub-menu__title {
      color: #000000;
    }
    .el-menu--horizontal>.el-sub-menu:hover .el-sub-menu__title {
        color: #000000 !important;
    }
    .el-sub-menu__icon-arrow{
      display: none !important;
    }
  }

.create-bot-button{
  width: 205px;
  height: 47px;
  gap: 10px;
  border-radius: 43px;
  opacity: 0px;
  background-color: #E1FF01;
  border-width: 0px;
}
.icon-language{
  font-size: 40px;
  color: #E1FF01;
}

</style>
