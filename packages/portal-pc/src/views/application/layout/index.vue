<template>
  <div class="app-page">
    <div class="items-center app-page-top">
      <div class="flex items-center app-page-col">
        <el-icon
          class="cursor-pointer hover:text-[var(--el-color-primary)]"
          size="20"
          @click="goBack"
        >
          <el-popover
            popper-class="sidebar-mini-popover"
            width="232px"
          >
            <template #reference>
              <ArrowLeft />
            </template>
            <template #default>
              <div class="relative h-[460px]">
                <sidebar
                  class="sidebar-container"
                  :logo="false"
                />
              </div>
            </template>
          </el-popover>
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
      <div class="mr-auto app-page-col">
        <div class="flex items-center text-base font-black leading-none">
          {{ __data.appInfo.name }}&nbsp;
          <el-icon
            class="cursor-pointer hover:text-[var(--el-color-primary)]"
            @click="editBotBaseInfo"
          >
            <Edit />
          </el-icon>
        </div>
        <div class="flex items-center mt-1 text-xs leading-none">
          <el-icon
            :class="{
              'text-[var(--el-color-primary)]': __data.appInfo.published
            }"
          >
            <Promotion />
          </el-icon>
          {{ __data.appInfo.published ? t('bots.published') : t('bots.unpublished') }}
        </div>
      </div>
      <div
        v-if="__data.appInfo.published"
        class="app-page-col"
      >
        <el-radio-group
          v-model="currentTab"
          @change="onTabChange"
        >
          <el-radio-button
            v-for="{ label, value } in tabList"
            :label="label"
            :value="value"
            linear
          />
        </el-radio-group>
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
import Sidebar from '@/layout/components/Sidebar/Sidebar.vue';

// eslint-disable-next-line no-unused-vars
const slot = useSlots();
const emits = defineEmits(['publish']);
const route = useRoute();
const currentTab = ref(route.meta.tab);
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
  switch (val) {
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
  emits('publish')
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

<style lang="scss" scoped>
.app-page {
  padding-top: 0;
}

.page-list-img {
  width: 32px;
  height: 32px;
}

.app-page-top {
  display: flex;
  padding: 17px 26px;
  min-height: 67px;
  background: rgba(#fff, 0.41);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
}

.app-page-content {
  padding: 0;
  overflow: hidden;
}

.page-list-img__error {
  background-color: #fff;
}
</style>
