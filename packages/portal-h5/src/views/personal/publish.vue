<template>
  <div class="app-page app-publish">
    <page-header :title="appPublishInfo.app?.name" />
    <div class="flex-col app-page-top">
      <div class="flex items-center">
        <div class="mr-auto app-page-col">
          <div class="flex items-center text-base font-black leading-none">{{ t('bots.publish.title') }}</div>
        </div>
        <div class="ml-[auto!important]">
          <van-button
            type="primary"
            size="small"
            linear
            @click="onPublish"
          >
            {{ t('common.done') }}
          </van-button>
        </div>
      </div>
      <div class="mt-2 text-sm">
        {{ t('bots.publish.subtitle') }}
      </div>
      <van-tabs
        v-model:active="currentTab"
        class="mb-2 cover-tab"
        :class="{ 'is-cn': isCn }"
        @change="onTabChange"
      >
        <van-tab
          v-for="{ value, label } in tabList"
          :name="value"
          :title="label"
        />
      </van-tabs>
    </div>
    <div class="app-page-content">
      <div
        ref="scrollbarRef"
        class="publish-scroll"
      >
        <div class="p-1">
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
            @update-option="_getAppPublishInfo"
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
import { confirmPublishApp, getAppPublishInfo } from '@gptx/base/api/application';
import Website from './components/publish/Website.vue';
import Platform from './components/publish/Platform.vue';
import SocialMedia from './components/publish/SocialMedia.vue';
import { ref } from 'vue';

const {
  params: { id: botId }
} = useRoute();
const appPublishInfo = reactive({
  social: [],
  store: {},
  web: {},
  app: {}
});
const AllTabList = ref([
  {
    value: 'plat',
    label: t('bots.publishWay.plat')
  },
  {
    value: 'website',
    label: t('bots.publishWay.website')
  },
  {
    value: 'social',
    label: t('bots.publishWay.social')
  }
]);
const isCn = window.SITE_TYPE && window.SITE_TYPE === '2';

const tabList = computed(() => {
  if (isCn) {
    return AllTabList.value.filter((i) => {
      return i.value !== 'social';
    });
  } else {
    return AllTabList.value;
  }
});
const currentTab = ref('plat');
/* ref dom */
const scrollbarRef = ref(null);

const goBack = () => router.push({ path: '/application' });
const onPublish = async () => {
  const { code } = await confirmPublishApp({
    app_id: botId
  });
  if (code === 200) goBack();
};
const onTabChange = async () => {
  await nextTick();
  scrollbarRef.value.scrollTop = 0;
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
      appPublishInfo.app = data.app;
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  _getAppPublishInfo();
});
</script>

<style lang="scss" scoped>
.app-page {
  padding-top: 0;
}

.app-page-top {
  display: flex;
  padding: 10px 12px;
  margin-bottom: 0;
}

.app-page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}

:deep(.n-tabs) {
  display: flex;
  flex-direction: column;

  .n-tabs-nav {
    width: 100%;
    margin-top: 16px;
  }

  .n-tabs-pane-wrapper,
  .n-tab-pane {
    display: none;
  }
}

:deep(.cover-tab) {
  width: 366px;
  margin: 0.75rem auto;

  .van-tabs__line {
    width: 122px;
  }

  &.is-cn {
    .van-tabs__line {
      width: 183px;
    }
  }
}

.publish-scroll {
  height: 100%;
  overflow: hidden auto;
}
</style>
<style lang="scss">
.app-publish {
  .page-list {
    max-width: unset;
    padding: 0 8px;
    margin-bottom: 8pxpx;

  }
}

.publish-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #7a7a7a;

  &:hover {
    color: var(--h5-color-primary);
  }

  & + & {
    margin-left: 12px;
  }
}
</style>
