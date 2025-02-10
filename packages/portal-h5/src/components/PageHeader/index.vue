<template>
  <div class="page-header">
    <div class="sidebar-logo__link" @click="toPage()">
      <svg-icon
        name="logo"
        class="sidebar-logo__icon"
      />
      {{ isCn ? $t('common.productName_Cn') : $t('common.productName') }}
    </div>
    <div class="page-header-icon">
<!--      <svg-icon-->
<!--          name="language"-->
<!--          class="sidebar-language__icon"-->
<!--          @click="onLanguageIconClick"-->
<!--      />-->
      <van-icon
        name="wap-nav"
        size="18"
        color="var(--van-blue)"
        @click="onLeftIconClick"
      />
    </div>

    <BotBaseInfo
      ref="baseInfoRef"
      @after-create="afterCreateBot"
    />
    <uploadKnowledgeSources
      ref="uploadKnowledgeSourcesRef"
      width="600px"
      @after-upload-knowledge-sources="afterUploadKnowledgeSources"
    />
    <PublishDialog ref="publishDialogRef" />
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n/index.js';
import { useLayoutStore } from '@/store/modules/layout';
import { eventBus } from '@gptx/base/utils/eventBus.js';
import useLoginStore from '@/store/modules/login';
import useUserStore from '@/store/modules/user.js';
import { getIsLogin } from '@/utils/firebase.js';
import PublishDialog from '@/components/publish/PublishDialog.vue';
import uploadKnowledgeSources from '@/components/uploadKnowledgeSources/index.vue';
import BotBaseInfo from '@/components/BotBaseInfo/index.vue';

const storeLayout = useLayoutStore();
defineProps({
  rightIcon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  customStyle: {
    type: Object,
    default: () => ({})
  },
  inputArea: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: t('common.search')
  }
});

const isCn = computed(() => {
  return window.SITE_TYPE && window.SITE_TYPE === '2';
});

const onLanguageIconClick = () => {
  storeLayout.setLanguageVisible(true);
}
const onLeftIconClick = () => {
  storeLayout.setSidebarVisible(true);
};


const useLogin = useLoginStore();
const baseInfoRef = ref(null);
const isLogin = ref(false);
const publishDialogRef = ref(null);
eventBus.on('publishBot', ({id}) => {
  publishDialogRef.value.open({ id });
});
eventBus.on('createBot', () => {
  isLogin.value = getIsLogin();
  if(isLogin.value) {
    if (baseInfoRef.value) baseInfoRef.value.open({});
  } else {
    useLogin.setLoginDialogVisible(true, 'login');
  }
});
eventBus.on('editBot', (option) => {
  isLogin.value = getIsLogin();
  if(isLogin.value) {
    if (baseInfoRef.value) baseInfoRef.value.open(option);
  } else {
    useLogin.setLoginDialogVisible(true, 'login');
  }
});

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
  uploadKnowledgeSourcesRef.value.open({
    id: data?.id,
    files: data?.files || null
  });
};
onBeforeMount(async () => {
  isLogin.value = getIsLogin();
  const user = useUserStore();
  user.updateSysInfo();
});

const router = useRouter();
const toPage = () => {
  router.push({ path: '/home' })
};

</script>

<style lang="scss">
.page-header {
  position: sticky;
  top: 0;
  width: 100%;
  height: var(--van-action-bar-height);
  padding: 0 8px 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--h5-bg-color-primary);
  backdrop-filter: var(--backdrop-blur);
  border-bottom: 1px solid var(--van-border-color);
  z-index: 1;

  &[border='bottom'] {
    border-bottom: var(--van-border);
  }

  .sidebar-logo__link {
    margin-top: 0;
    font-size: 18px;
  }

  .sidebar-logo__icon {
    font-size: 20px;
  }
}
.page-header-icon {
  position: absolute;
  top: 50%;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  //height: 40px;
  //width: 40px;
  transform: translateY(-50%);

  &.right {
    left: unset;
    right: 8px;
    height: 24px;
    width: 24px;
    transition: left 0.3s ease-out;

    &.is-show-search {
      width: calc(100% - 16px);

      .van-search {
        width: 100%;
        padding: 0;
      }
    }
  }
  .sidebar-language__icon{
    font-size: 24px;
    color: #E1FF01;
    margin-right: 20px;
  }
}
</style>
