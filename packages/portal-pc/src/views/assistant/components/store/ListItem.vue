<template>
  <div class="page-list">
    <el-card
      class="page-list__inner"
      shadow="hover"
    >
      <div class="flex">
        <div class="app-page-col">
          <el-image
            class="page-list-img"
            fit="cover"
            :src="appInfo.app_icon || defaultBotImage"
          >
            <template #error>
              <div class="page-list-img__error">
                <el-icon>
                  <Picture />
                </el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="app-page-col flex-1">
          <div class="flex items-center">
            <div
              class="line-clamp-1 h-[20px] flex-1"
              :title="appInfo.app_name"
            >
              {{ appInfo.app_name }}
            </div>
          </div>
          <div
            class="mt-2 line-clamp-2 h-[40px] text-[#7a7a7a]"
            :title="appInfo.app_description"
          >
            {{ appInfo.app_description }}
          </div>
          <div class="my-1">
            <span class="text-xs text-[#7a7a7a]"> @{{ appInfo.author_name }} </span>
          </div>
        </div>
      </div>
      <div class="page-list-option justify-end">
        <el-dropdown v-if="platList && platList.length && isWorldWide">
          <el-button
            class="ml-1"
            size="small"
            @click.stop="() => {}"
          >
            {{ t('store.action.plat') }}
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="{ s_name } in platList"
                @click="emits('open-with', s_name)"
              >
                <el-image
                  class="plat-icon"
                  :src="platIcons[s_name]"
                />
                <span class="capitalize">{{ s_name }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button
          class="ml-1"
          type="primary"
          size="small"
          linear
          @click="emits('open-new-chat')"
        >
          {{ t('store.action.new') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import defaultBotImage from '@/assets/logo/bot-default-logo.svg';
import IconTelegram from '@/assets/images/bots/publish/telegram.svg';
import IconDiscord from '@/assets/images/bots/publish/discord.svg';
import IconLine from '@/assets/images/bots/publish/line.svg';
import IconMessenger from '@/assets/images/bots/publish/messenger.svg';
import IconSlack from '@/assets/images/bots/publish/slack.svg';
import IconInstagram from '@/assets/images/bots/publish/instagram.svg';
import IconReddit from '@/assets/images/bots/publish/reddit.svg';

const props = defineProps({
  appInfo: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(['open-new-chat', 'open-with', 'duplicate']);
const isWorldWide = window.SITE_TYPE && window.SITE_TYPE === '1';

let platList = reactive([]);
const platIcons = {
  telegram: IconTelegram,
  slack: IconSlack,
  instagram: IconInstagram,
  reddit: IconReddit,
  discord: IconDiscord,
  messenger: IconMessenger,
  line: IconLine
};

watch(
  () => props.appInfo,
  ({ shared_social }) => {
    platList = [...Object.values(shared_social).filter((_) => _.enabled === true)];
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped></style>
