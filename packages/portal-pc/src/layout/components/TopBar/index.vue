<template>
  <el-header class="flex h-[80px] justify-center">
    <div class="flex w-full min-w-[800px] max-w-[1280px] items-center ">
      <div class="flex items-center">
        <Logo class="mr-10 flex-none" />
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          :ellipsis="false"
          :router="true"
          class="font-[TTNormsPro]"
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
            Personal
          </el-menu-item>
          <el-sub-menu
            index="/assistant-group"
            :popper-offset="15"
            popper-class="customs-sub-menu"
          >
            <template #title>
              Explore
            </template>
            <el-menu-item
              style="min-width: 240px;"
              index="/assistant"
            >
              <div class="flex  px-[5px] ">
                <div class="mr-[16px] flex h-9 w-9 items-center justify-center rounded-full bg-black">
                  <svg-icon
                    style="color: rgba(225, 255, 1, 1); font-size: 24px"
                    name="bot-store"
                  />
                </div>
                <div class="flex flex-col">
                  <div class="mb-3 font-['Inter'] text-xl font-bold text-black">{{ $t('menu.ass') }}</div>
                  <div
                    class="text-sm font-medium text-wrap
                   text-black w-[243px]"
                  >
                    Offer daily clothing inspirations for you every day.
                  </div>
                </div>
              </div>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <div class="create-bot-button">
        <!--        create bot button-->
        <el-button round class="font-[TTNormsPro]" @click="onCreateClick">
          + Create Bot
        </el-button>
      </div>
      <div class="lang-select mr-[34px]">
        <el-dropdown v-if="langList.length" style="--el-dropdown-menuItem-hover-color: red" placement="bottom-start">
          <el-button circle style="border: none!important;outline: none;width: 40px;height: 40px;">
            <template #icon>
              <el-icon style="width: 40px;height: 40px;">
                <template #default>
                  <svg style="width: 40px;height: 40px;display: block;font-size: 40px;" width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="bitcoin-icons:globe-outline">
                      <rect y="0.5" width="40" height="40" rx="20" fill="white" fill-opacity="0.1"/>
                      <rect x="0.5" y="1" width="39" height="39" rx="19.5" stroke="white" stroke-opacity="0.1"/>
                      <g id="Group">
                        <path id="Vector" d="M20.0003 30.5057C22.137 30.5057 23.8691 26.0297 23.8691 20.5082C23.8691 14.9868 22.137 10.5107 20.0003 10.5107C17.8637 10.5107 16.1316 14.9868 16.1316 20.5082C16.1316 26.0297 17.8637 30.5057 20.0003 30.5057Z" stroke="#E1FF01" stroke-width="1.25"/>
                        <path id="Vector_2" d="M20.0002 30.501C25.5231 30.501 30.0002 26.0238 30.0002 20.501C30.0002 14.9781 25.5231 10.501 20.0002 10.501C14.4774 10.501 10.0002 14.9781 10.0002 20.501C10.0002 26.0238 14.4774 30.501 20.0002 30.501Z" stroke="#E1FF01" stroke-width="1.25"/>
                        <path id="Vector_3" d="M10.0005 20.4951L30.0005 20.5076" stroke="#E1FF01" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                      </g>
                    </g>
                  </svg>
                </template>
              </el-icon>
            </template>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in langList" @click="changeLangCommand(item)">
                {{ item.lable }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="flex items-center">
        <User v-if="isLogin" class="flex-none" />
        <NoLogin v-else @login="onLoginClick" />
      </div>
    </div>
  </el-header>

  <!-- login or sign up -->
  <LoginAndSignup
    ref="loginRef"
    @dialog-close="onCloseLoginDialog"
    @close="onLoginClose"
    @referral="onOpenReferralCodeDialog"
  />

  <!-- create bot -->
  <bot-base-info
    ref="baseInfoRef"
    @after-create="afterCreateBot"
  />
  <UploadKnowledgeSources
    ref="uploadKnowledgeSourcesRef"
    width="600px"
    @after-upload-knowledge-sources="afterUploadKnowledgeSources"
  />
  <PublishDialog ref="publishDialogRef"/>
  <!--  referral code  -->
  <referral-code
    ref="referralCodeRef"
    @confirm="onConfirmUserInvite"
  />
</template>

<script setup>
import Logo from './Logo';
import User from './User';
import NoLogin from './NoLogin';
import { getIsLogin } from '@gptx/base/utils/auth';
import useLoginStore from '@/store/modules/login';
import useBotStore from '@/store/modules/bot';
import useUserStore from '@/store/modules/user.js';
import { confirmUserInvite } from '@gptx/base/api/user.js';
import { useRoute } from 'vue-router';
import LoginAndSignup from '@/components/LoginAndSignup';
import CreateBot from '@/components/CreateBot';
import { getCurLang, supportLang } from '@gptx/base';
import BotBaseInfo from '@/components/BotBaseInfo'
import UploadKnowledgeSources from '@/components/uploadKnowledgeSources/index.vue';
import PublishDialog from '@/views/personal/components/publish/PublishDialog.vue';
import { eventBus } from '@gptx/base/utils/eventBus.js';

const route = useRoute();
const useLogin = useLoginStore();
const useBot = useBotStore();
const useUser = useUserStore();

const loginRef = ref(null);
const baseInfoRef = ref(null);
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
eventBus.on('createBot', () => {
  if(isLogin.value) {
    if (baseInfoRef.value) baseInfoRef.value.open({});
  } else {
    useLogin.setLoginDialogVisible(true, 'login');
  }
});
eventBus.on('editBot', (option) => {
  if(isLogin.value) {
    if (baseInfoRef.value) baseInfoRef.value.open(option);
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



const onCreateClick = () => {
  if (isLogin.value && baseInfoRef.value) {
    baseInfoRef.value.open();
  } else {
    useLogin.setLoginDialogVisible(true);
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
const uploadKnowledgeSourcesRef = ref(null);
const afterUploadKnowledgeSources = ({id}) => {
  publishDialogRef.value.open({ id });
};
const afterCreateBot = async (data) => {
  // router.push(`/design/${app_id}`);
  console.log('afterCreateBot', data);
  // 广播创建成功
  eventBus.emit('createBotSuccess', data);
  // TODO
  uploadKnowledgeSourcesRef.value.open({ id: data.id });
};

watch(
  () => useBot.createBotDialog,
  () => {
    if (baseInfoRef.value) baseInfoRef.value.open({});
  },
  { immediate: false }
);

const curLang = getCurLang();
const langList = supportLang(); // 支持切换的语言
// const language = computed(() => {
//   return langList.find((i) => {
//     return i.value === curLang;
//   }).value;
// });
const changeLangCommand = (item) => {
  console.log(item);
  localStorage.setItem('lang', item.value);
  window.location.reload();
};

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




.create-bot-button{
  padding: 0 20px;
  .el-button{
    display: flex;
    padding: 12px 51px;
    justify-content: center;
    align-items: center;
    border-radius: 43px;
    background: var(--Style, #E1FF01);
    color: #000;
    font-feature-settings: 'dlig' on;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 23px; /* 127.778% */
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
</style>