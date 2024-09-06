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
              class="line-clamp-1 flex-1 text-xl text-[var(--el-color-primary)]"
              :title="appInfo.app_name"
            >
              {{ appInfo.app_name }}
            </div>
          </div>
          <div class="mt-2">
            <el-avatar
              class="align-middle"
              :size="16"
            />
            <span class="mr-1 text-xs text-[var(--el-text-color-placeholder)]"> user1518405835467 </span>
            <span class="text-xs text-[var(--el-text-color-placeholder)]"> @{{ appInfo.author_name }} </span>
          </div>
          <div
            class="my-1 line-clamp-4 h-[80px] text-[var(--el-text-color-placeholder)]"
            :title="appInfo.app_description"
          >
            {{ appInfo.app_description }}
          </div>
          <div
            v-if="appInfo.app_categories && appInfo.app_categories.length"
            class="mt-2"
          >
            <el-tag
              v-for="{ name } in appInfo.app_categories"
              class="mr-1"
              type="info"
            >
              {{ t(name) }}
            </el-tag>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="page-list-option justify-end">
          <el-button
            v-for="{ s_name } in platList"
            size="small"
            link
            @click="emits('open-with', s_name)"
          >
            <el-image
              class="plat-icon"
              :src="platIcons[s_name]"
            />
          </el-button>
        </div>
      </template>
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

let platList = reactive([{ s_name: 'telegram' }]);
const platIcons = {
  telegram: IconTelegram,
  slack: IconSlack,
  instagram: IconInstagram,
  reddit: IconReddit,
  discord: IconDiscord,
  messenger: IconMessenger,
  line: IconLine
};

// watch(
//   () => props.appInfo,
//   ({ shared_social }) => {
//     platList = [...Object.values(shared_social).filter((_) => _.enabled === true)];
//   },
//   {
//     immediate: true
//   }
// );
</script>

<style lang="scss" scoped></style>
