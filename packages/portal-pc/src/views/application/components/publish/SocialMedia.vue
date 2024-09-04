<template>
  <div class="pt-[52px] flex-1 overflow-hidden">
    <el-scrollbar class="h-full">
      <div class="p-3">
        <div
          v-for="publish in __data.publishList"
          class="page-list"
        >
          <el-card
            class="page-list__inner"
            shadow="hover"
          >
            <div class="flex">
              <div class="app-page-col">
                <el-image
                  class="page-list-img"
                  :style="{ width: '36px', height: '36px' }"
                  :src="publish.icon"
                />
              </div>
              <div class="flex-1 app-page-col">
                <div
                  class="h-[24px] text-base font-black line-clamp-1"
                  :title="publish.title"
                >
                  {{ publish.title }}
                </div>
                <div
                  class=" text-[var(--el-text-color-placeholder)] line-clamp-2 my-2 h-[42px]"
                  :title="publish.subtitle"
                >
                  {{ publish.subtitle }}
                </div>
                <div
                  v-if="publish?._?.enabled"
                  class="flex"
                >
                  <el-button
                    type="primary"
                    link
                    @click="unbind(publish)"
                  >
                    {{ t('common.unbind') }}
                  </el-button>
                </div>
                <div
                  v-else
                  class="flex"
                >
                  <el-button
                    v-if="publish?._?.supported"
                    link
                    @click="onOpenBindDialog(publish)"
                  >
                    <svg-icon
                      class="mr-[2px] opacity-80"
                      name="option"
                    />
                    {{ t('bots.publish.label.option') }}
                  </el-button>
                  <el-button
                    v-else
                    link
                    @click="ElMessage.info(t('bots.notReadyYet'));"
                  >
                    <svg-icon
                      class="mr-[2px] opacity-80"
                      name="option"
                    />
                    {{ t('bots.publish.label.wait') }}
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </el-scrollbar>
    <third-part-bind
      ref="thirdPartyBindRef"
      :bot-id="botId"
      @update-option="emits('update-option')"
    />
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { configureSocialShare } from '@gptx/base/api/application';
import IconTelegram from '@/assets/images/bots/publish/telegram.svg';
import IconDiscord from '@/assets/images/bots/publish/discord.svg';
import IconLine from '@/assets/images/bots/publish/line.svg';
import IconMessenger from '@/assets/images/bots/publish/messenger.svg';
import IconSlack from '@/assets/images/bots/publish/slack.svg';
import IconInstagram from '@/assets/images/bots/publish/instagram.svg';
import IconReddit from '@/assets/images/bots/publish/reddit.svg';
import ThirdPartBind from './ThirdPartBind/index.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const props = defineProps({
  botId: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(['update-option']);

const __data = reactive({
  publishList: [
    {
      title: 'Telegram',
      name: 'telegram',
      subtitle: t('bots.publish.telegram'),
      icon: IconTelegram,
      _: {}
    },
    {
      title: 'Discord',
      name: 'discord',
      subtitle: t('bots.publish.discord'),
      icon: IconDiscord,
      _: {}
    },
    {
      title: 'LINE',
      name: 'line',
      subtitle: t('bots.publish.line'),
      icon: IconLine,
      _: {}
    },
    {
      title: 'Messenger',
      name: 'messenger',
      subtitle: t('bots.publish.messenger'),
      icon: IconMessenger,
      _: {}
    },
    {
      title: 'Slack',
      name: 'slack',
      subtitle: t('bots.publish.slack'),
      icon: IconSlack,
      _: {}
    },
    {
      title: 'Instagram',
      name: 'instagram',
      subtitle: t('bots.publish.instagram'),
      icon: IconInstagram,
      _: {}
    },
    {
      title: 'Reddit',
      name: 'reddit',
      subtitle: t('bots.publish.reddit'),
      icon: IconReddit,
      _: {}
    }
  ]
});
/* ref dom */
const thirdPartyBindRef = ref(null);

const onOpenBindDialog = (publish) => thirdPartyBindRef.value.open(publish);
const unbind = async ({ _ }) => {
  try {
    const method = await ElMessageBox.confirm(t('common.unbindTip'), t('common.unbind'), {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
      customClass: 'customize-message-box'
    });
    if (method === 'confirm') {
      const { code } = await configureSocialShare({
        app_id: props.botId,
        s_type: _.s_type,
        enabled: false,
        credential: { bot_token: '' }
      });
      if (code === 200) {
        emits('update-option');
      }
    }
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => props.data,
  (value) => __data.publishList.forEach((option) => (option._ = value[option.name] || {}))
);
</script>
