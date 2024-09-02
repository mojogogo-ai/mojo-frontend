<template>
  <div class="app-page">
    <page-header
      :title="botConfig?.app?.name"
      :right-icon="botConfig?.app?.icon || DefaultBotImg"
      @right-icon-click="onRightIconClick"
    />
    <div class="app-page-content">
      <div class="relative w-full h-full mx-auto overflow-hidden">
        <GptxChat
          :bot-info="botConfig"
          chat-api-url="/portal/conversation/chat"
          :is-debug="false"
          style="max-width: 100%"
        />
      </div>
    </div>
    <assistant-info
      ref="botInfoRef"
      :bot-info="botConfig"
      @duplicate="duplicate"
    />
    <bot-base-info
      ref="baseInfoRef"
      @after-create="afterCreateBot"
    />
  </div>
</template>

<script setup>
import { getStoreAppDetail } from '@gptx/base/api/chat.js';
import DefaultBotImg from '@/assets/logo/bot-default-logo.svg';
import { t } from '@gptx/base/i18n/index.js';

const botConfig = ref(null);
const route = useRoute();
const router = useRouter();
/* ref dom */
const botInfoRef = ref(null);
const baseInfoRef = ref(null);

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
      document.title = data.app.name;
    }
  } catch (error) {
    console.log(error);
  }
};
const onRightIconClick = () => {
  botInfoRef.value.open();
};
const duplicate = () => {
  const { app } = botConfig.value;
  baseInfoRef.value.open({
    from_id: app.id,
    name: `${app.name}${t('bots.backup')}`,
    icon: app.icon,
    description: app.description,
    category_id: app.categories.map((_) => _.id)
  });
};
const afterCreateBot = async (option) => {
  if (option && option.app_id) router.push({ path: `/design/${option.app_id}` });
};

onMounted(() => {
  _getAppInfo();
});
</script>

<style lang="scss" scoped>
.app-page {
  padding-top: 0;
}

.app-page-content {
  padding: 0;
  overflow: hidden;
}
</style>
