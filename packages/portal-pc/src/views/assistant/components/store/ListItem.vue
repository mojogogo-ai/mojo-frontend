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
            :src="appInfo.icon || defaultBotImage"
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
        <div class="flex-1 app-page-col">
          <div class="flex items-center">
            <div
              class="line-clamp-1 flex-1 text-xl text-[var(--el-color-primary)]"
              :title="appInfo.name"
            >
              {{ appInfo.name }}
            </div>
          </div>
          <div class="mt-2">
            <!-- <el-avatar
              class="align-middle"
              :size="16"
            /> -->
            <span class="text-xs text-[var(--el-text-color-placeholder)]"> @{{ appInfo.create_name }} </span>
          </div>
          <div
            class="my-1 line-clamp-4 h-[80px] text-[var(--el-text-color-placeholder)]"
            :title="appInfo.introduction"
          >
            {{ appInfo.introduction }}
          </div>
          <!-- <div
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
          </div> -->
        </div>
      </div>
      <template #footer>
        <div class="justify-end page-list-option">
          <!-- 大漂亮独有 -->
          <el-button
            v-if="appInfo.id===1"
            size="small"
            link
            @click="emits('open-dig')"
          >
            <el-image
              class="plat-icon"
              :src="IconAi"
            />
          </el-button>
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
// import { t } from '@gptx/base/i18n';
import defaultBotImage from '@/assets/logo/bot-default-logo.svg';
import IconTelegram from '@/assets/images/bots/publish/telegram.svg';
import IconDiscord from '@/assets/images/bots/publish/discord.svg';
import IconLine from '@/assets/images/bots/publish/line.svg';
import IconMessenger from '@/assets/images/bots/publish/messenger.svg';
import IconSlack from '@/assets/images/bots/publish/slack.svg';
import IconInstagram from '@/assets/images/bots/publish/instagram.svg';
import IconReddit from '@/assets/images/bots/publish/reddit.svg';
import IconAi from '@/assets/images/bots/publish/ai.svg';

defineProps({
  appInfo: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(['open-new-chat', 'open-with',  'open-dig', 'duplicate']);

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

</script>

<style lang="scss" scoped></style>
