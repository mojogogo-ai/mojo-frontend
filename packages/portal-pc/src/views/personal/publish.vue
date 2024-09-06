<template>
  <div class="app-page app-publish">
    <div class="items-center app-page-top">
      <div class="flex items-center app-page-col">
        <el-icon
          class="cursor-pointer hover:text-[var(--el-color-primary)]"
          size="20"
          @click="goBack"
        >
          <ArrowLeft />
        </el-icon>
      </div>
      <div class="mr-auto app-page-col">
        <div class="flex items-center text-base font-black leading-none">
          {{ t('bots.publish.pageTitle') }}
        </div>
      </div>
      <div class="ml-[auto!important]">
        <el-button
          type="primary"
          linear
          @click="onPublish"
        >
          {{ t('common.done') }}
        </el-button>
      </div>
    </div>
    <div class="app-page-content">
      <div class="w-[784px] flex flex-col flex-1 overflow-hidden">
        <div class="text-base font-black">{{ t('bots.publish.title') }}</div>
        <div class="mt-2 text-sm">
          {{ t('bots.publish.subtitle') }}
        </div>
        <div class="flex-1 mt-[32px] flex flex-col overflow-hidden">
          <el-segmented
            v-model="currentTab"
            class="w-[480px] mx-auto"
            :options="tabList.map((_) => _.name)"
            @change="onTabChange"
          />
          <website
            v-show="currentTab === 'website'"
            :bot-id="botId"
            :data="appPublishInfo.web"
            @update-option="_getAppPublishInfo"
          />
          <platform
            v-show="currentTab === 'plat'"
            :bot-id="botId"
            :data="appPublishInfo.store"
          />
          <social-media
            v-show="currentTab === 'social'"
            :bot-id="botId"
            :data="appPublishInfo.social"
            @update-option="_getAppPublishInfo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router';
import { t } from '@gptx/base/i18n';
import { getAppPublishInfo, confirmPublishApp, getAppInfo } from '@gptx/base/api/application';
// import { NTabs, NTabPane } from 'naive-ui';
import Website from './components/publish/Website.vue';
import Platform from './components/publish/Platform.vue';
import SocialMedia from './components/publish/SocialMedia.vue';
// import Sidebar from '@/layout/components/Sidebar/Sidebar.vue';

const {
  params: { id: botId }
} = useRoute();
const appPublishInfo = reactive({
  social: [],
  store: {},
  web: {}
});
const AllTabList = ref([
  {
    name: 'plat',
    tab: t('bots.publishWay.plat')
  },
  {
    name: 'website',
    tab: t('bots.publishWay.website')
  },
  {
    name: 'social',
    tab: t('bots.publishWay.social')
  }
]);

const tabList = computed(()=>{
  if (window.SITE_TYPE && window.SITE_TYPE === '2') {
    return AllTabList.value.filter((i)=>{ return i.name!=='social' })
  } else {
    return AllTabList.value
  }
})
const currentTab = ref('plat');

const goBack = () => router.push({path:'/application'});
const onPublish = async () => {
  try {
    const { code } = await confirmPublishApp({
      app_id: botId
    });
    if (code === 200) goBack();
  } catch (error) {
    console.log(error);
  }
};
const onTabChange = (name) => {
  currentTab.value = name;
};
const _getAppPublishInfo = async () => {
  try {
    const { code, data } = await getAppPublishInfo({
      app_id: botId
    });
    if (code === 200) {
      appPublishInfo.social = data.social;
      appPublishInfo.store = data.store;
      appPublishInfo.web = data.web;
    }
  } catch (error) {
    console.log(error);
  }
};
const _getAppInfo = async () => {
  try {
    const { code, data } = await getAppInfo({ id: botId });
    if (code === 200) {
      document.title = data.name;
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  _getAppInfo();
  _getAppPublishInfo();
});
</script>

<style lang="scss" scoped>
.app-page {
  padding-top: 0;
}
.app-page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 0 0;
  overflow: hidden;
}
.page-list-img__error {
  background-color: #fff;
}
</style>
<style lang="scss">
.app-publish {
  .page-list {
    max-width: unset;
    width: 355px;
    padding: 0;
    margin-bottom: 40px;
    &:not(:nth-child(2n-1)) {
      margin-left: 44px;
    }
    &__inner {
      .el-card__body {
        min-height: unset;
      }
    }
  }
}
.publish-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--el-text-color-placeholder);
  &:hover {
    color: var(--el-color-primary);
  }
  & + & {
    margin-left: 12px;
  }
}
</style>
