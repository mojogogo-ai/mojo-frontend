<template>
  <div class="app-page">
    <div class="items-center app-page-top">
      <div class="app-page-col">
        <el-popover
          width="360px"
          popper-class="bot-info-popper"
          :show-arrow="false"
        >
          <template #reference>
            <div class="flex">
              <el-image
                class="page-list-img app-page-col"
                :src="__data.appInfo.icon || defaultBotImage"
              >
                <template #error>
                  <div class="page-list-img__error">
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <div class="app-page-col">
                <div class="flex items-center text-base font-black leading-none">{{ __data.appInfo.name }}&nbsp;</div>
                <div class="mt-1 flex items-center text-xs leading-none text-[#7a7a7a]">
                  <div class="mr-2">@ {{ __data.appInfo.author_name }}</div>
                  <div class="pl-2 border-l chat-separator">
                    {{ t('bots.publishAt') }}
                    {{
                      dayjs(__data.appInfo.published_at)
                        .subtract(new Date().getTimezoneOffset(), 'minute')
                        .format('YYYY-MM-DD HH:mm:ss')
                    }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #default>
            <el-image
              class="bot-info-img"
              fit="cover"
              :src="__data.appInfo.icon || defaultBotImage"
            >
              <template #error>
                <div class="page-list-img__error">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
            <div class="flex flex-col bot-info">
              <el-scrollbar class="h-full">
                <div class="px-3">
                  <div class="w-full mb-1 text-lg font-black">{{ __data.appInfo.name }}</div>
                  <div class="mb-2 w-full text-[#7a7a7a]">
                    <n-ellipsis
                      expand-trigger="click"
                      line-clamp="10"
                      :tooltip="false"
                    >
                      <div v-html="(__data.appInfo?.description || '').replace(/\n/g, '<br/>')" />
                    </n-ellipsis>
                  </div>
                  <div class="mb-3">
                    <div class="mb-1 font-black">{{ t('bots.label.catalog') }}</div>
                    <el-button
                      v-for="{ name } in __data.appInfo?.categories"
                      type="primary"
                      size="small"
                      linear
                    >
                      {{ t(name) }}
                    </el-button>
                  </div>
                  <div class="mb-3">
                    <div class="mb-1 font-black">{{ t('bots.n') }}</div>
                    <el-button
                      type="primary"
                      size="small"
                      linear
                    >
                      {{ __data.llm?.llm }}
                    </el-button>
                  </div>
                  <!-- <div class="mb-3">
                <div class="mb-1 font-black">插件</div>
                <div class="flex flex-wrap">
                  <el-button
                    type="primary"
                    size="small"
                    linear
                  >
                    谷歌搜索
                  </el-button>
                </div>
              </div> -->
                </div>
              </el-scrollbar>
            </div>
          </template>
        </el-popover>
      </div>
      <div class="ml-[auto!important]">
        <el-button @click="share">
          {{ t('bots.a3') }}
        </el-button>
        <el-button
          v-if="__data.app_copyable"
          type="primary"
          linear
          @click="duplicate"
        >
          {{ t('bots.copy') }}
        </el-button>
      </div>
    </div>
    <div class="app-page-content">
      <div class="relative w-full h-full mx-auto overflow-hidden">
        <GptxChat
          chat-api-url="/portal/conversation/chat"
          :bot-info="botConfig"
          :is-debug="false"
          style="max-width: 100%"
        />
      </div>
    </div>
    <bot-base-info
      ref="baseInfoRef"
      @after-create="afterCreateBot"
    />
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { getStoreAppDetail } from '@gptx/base/api/chat.js';
import { NEllipsis } from 'naive-ui';
import defaultBotImage from '@/assets/logo/bot-default-logo.svg';
import dayjs from 'dayjs';
import { useClipboard } from '@vueuse/core';

const route = useRoute();
const router = useRouter();
const __data = reactive({
  appInfo: {},
  llm: {},
  app_copyable: false
});
const baseInfoRef = ref(null);

const share = () => {
  const code = location.href;
  if (code) {
    const { copy, copied } = useClipboard({ code, legacy: true });
    copy(code);
    if (copied) {
      ElMessage.success(t('bots.bb'));
    } else {
      ElMessage.error(t('chat.copy2'));
    }
  }
};
const duplicate = () => {
  baseInfoRef.value.open({
    from_id: __data.appInfo.id,
    name: `${__data.appInfo.name}${t('bots.backup')}`,
    icon: __data.appInfo.icon,
    description: __data.appInfo.description,
    category_id: __data.appInfo.categories.map((_) => _.id)
  });
};
const botConfig = ref(null);
const _getAppInfo = async () => {
  try {
    const { data, code } = await getStoreAppDetail({
      // "sid": "S1234567890",
      system_builtin: false,
      max_context_length: 0,
      debug: false,
      app_id: route.params.id
    });
    if (code === 200) {
      botConfig.value = data;
      __data.appInfo = data.app;
      __data.llm = data.llm;
      __data.app_copyable = data.app_copyable;
      document.title = __data.appInfo.name;
    }
  } catch (error) {
    console.log(error);
  }
};
const afterCreateBot = async (data) => {
  if (data && data.app_id) router.push(`/design/${data.app_id}`);
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
  margin-bottom: 0;
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

.chat-separator {
  position: relative;

  &::before {
    position: absolute;
    top: 2px;
    bottom: 1px;
    left: -1px;
    width: 1px;
    background-color: #ddd;
    content: '';
  }
}

.bot-info {
  height: 464px;
  padding: 39px 0 12px;
  background-color: var(--el-color-white);
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.bot-info-img {
  position: absolute;
  top: 3px;
  left: 4px;
  height: 66px;
  width: 66px;
  border-radius: 50%;
  border: 2px solid var(--el-color-white);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
}
</style>
<style lang="scss">
.bot-info-popper {
  &.el-popover.el-popper {
    background: unset;
    box-shadow: unset;
    border: unset;
    padding: 33px 0 0;
    color: #36353a;
  }
}
</style>
