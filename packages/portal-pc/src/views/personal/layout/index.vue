<template>
  <div class="app-page app-design">
    <div class="app-page-top items-center">
      <div class="app-page-col flex items-center">
        <el-icon
          class="cursor-pointer text-[var(--el-text-color-regular)] hover:text-[var(--el-color-primary)]"
          size="20"
          @click="goBack"
        >
          <ArrowLeft />
        </el-icon>
      </div>
      <el-image
        class="page-list-img app-page-col"
        :src="__data.appInfo.icon"
      >
        <template #error>
          <div class="page-list-img__error">
            <el-icon>
              <Picture />
            </el-icon>
          </div>
        </template>
      </el-image>
      <div class="app-page-col mr-auto">
        <div class="flex items-center text-base font-black leading-none text-[var(--el-color-primary)]">
          {{ __data.appInfo.name }}&nbsp;
          <el-icon
            class="cursor-pointer hover:text-[var(--el-color-primary-light-9)]"
            @click="editBotBaseInfo"
          >
            <Edit />
          </el-icon>
        </div>
        <div
          :class="[
            'mt-1 flex items-center text-xs leading-none',
            __data.appInfo.published ? 'text-[var(--el-color-primary)]' : 'text-[var(--el-text-color-placeholder)]'
          ]"
        >
          <el-icon>
            <Promotion />
          </el-icon>
          {{ __data.appInfo.published ? t('bots.published') : t('bots.unpublished') }}
        </div>
      </div>
      <div
        v-if="__data.appInfo.published"
        class="app-page-col"
      >
        <el-segmented
          v-model="currentTab"
          :options="tabList.map((_) => _.label)"
          @change="onTabChange"
        />
      </div>
      <div class="ml-[auto!important]">
        <el-button
          type="primary"
          linear
          @click="toPublish"
        >
          {{ t('bots.publish.btn') }}
        </el-button>
      </div>
    </div>
    <div class="app-page-content">
      <slot />
    </div>
  </div>
  <bot-base-info
    ref="baseInfoRef"
    @after-update="_getAppInfo"
  />
</template>

<script setup>
import router from '@/router';
import { t } from '@gptx/base/i18n';
import { getAppInfo } from '@gptx/base/api/application';
import { ArrowLeft } from '@element-plus/icons-vue';

// eslint-disable-next-line no-unused-vars
const slot = useSlots();
const emits = defineEmits(['publish']);
const route = useRoute();
const currentTab = ref(route.meta.tab === 'a' ? t('bots.title.design') : t('bots.title.analyze'));
const tabList = [
  { value: 'a', label: t('bots.title.design') },
  { value: 'b', label: t('bots.title.analyze') }
];
const __data = reactive({
  appInfo: {}
});
/* ref dom */
const baseInfoRef = ref(null);

const goBack = () => router.back();
const onTabChange = (val) => {
  const id = __data.appInfo.id;
  const key = tabList.find((_) => _.label === val)['value'];
  switch (key) {
    case 'a':
      router.replace({
        path: `/design/${id}`
      });
      break;
    case 'b':
      router.replace({
        path: `/analyze/${id}`
      });
      break;
  }
};
const editBotBaseInfo = () => baseInfoRef.value.open(__data.appInfo);
const toPublish = () => {
  emits('publish');
};

const _getAppInfo = async () => {
  try {
    const { code, data } = await getAppInfo({ id: route.params.id });
    if (code === 200) {
      __data.appInfo = data;
      document.title = data.name;
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  _getAppInfo();
});
</script>

<style lang="scss">
.app-page {
  padding-top: 0;
  //background:
  //  url('@/assets/images/background/bg-l.png') no-repeat left top,
  //  url('@/assets/images/background/bg-r.png') no-repeat right top;
  //background-color: #000;

  &.app-design,
  &.app-publish {
    .page-list-img {
      width: 32px;
      height: 32px;
    }

    .app-page-top {
      display: flex;
      padding: 17px 26px;
      min-height: 67px;
      background-color: rgba(#fff, 0.1);
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
      backdrop-filter: blur(35px);
    }

    .app-page-content {
      padding: 0;
      overflow: hidden;
    }

    .page-list-img__error {
      background-color: #fff;
    }

    .design-form {
      height: 100%;
      padding: 14px 12px 16px;
      overflow: hidden auto;
    }

    .design-form-item {
      margin-bottom: 22px;
    }

    .design-form-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 16px;
      margin-bottom: 14px;
      font-size: 16px;
      font-weight: bold;
      color: var(--el-text-color-regular);
    }

    .design-form-content {
      padding-bottom: 12px;
    }
  }
}
</style>
