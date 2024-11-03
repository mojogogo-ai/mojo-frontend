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
            <el-avatar
              class="align-middle"
              :size="16"
              :src="appInfo.icon || defaultBotImage"
            />
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
        <div class=" page-list-option flex justify-between">
          <div class="flex gap-5 custom-toolbar">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path d="M12 3.5C13.1935 3.5 14.3381 3.97411 15.182 4.81802C16.0259 5.66193 16.5 6.80653 16.5 8C16.5 9.19347 16.0259 10.3381 15.182 11.182C14.3381 12.0259 13.1935 12.5 12 12.5C10.8065 12.5 9.66193 12.0259 8.81802 11.182C7.97411 10.3381 7.5 9.19347 7.5 8C7.5 6.80653 7.97411 5.66193 8.81802 4.81802C9.66193 3.97411 10.8065 3.5 12 3.5ZM12 21.5C12 21.5 21 21.5 21 19.25C21 16.55 16.6125 13.625 12 13.625C7.3875 13.625 3 16.55 3 19.25C3 21.5 12 21.5 12 21.5Z" fill="white" fill-opacity="0.7" />
              </svg>9
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.95556 5.40771C3.34373 6.01955 3 6.84938 3 7.71465V14.6896C3 15.5549 3.34373 16.3847 3.95556 16.9966C4.5674 17.6084 5.39723 17.9521 6.2625 17.9521H6.6V20.5711C6.6 21.3919 7.5261 21.8716 8.19615 21.3982L13.0786 17.9521H17.7375C18.6028 17.9521 19.4326 17.6084 20.0444 16.9966C20.6563 16.3847 21 15.5549 21 14.6896V7.71465C21 6.84938 20.6563 6.01955 20.0444 5.40771C19.4326 4.79588 18.6028 4.45215 17.7375 4.45215H6.2625C5.39723 4.45215 4.5674 4.79588 3.95556 5.40771ZM8 12.5C8.55229 12.5 9 12.0523 9 11.5C9 10.9477 8.55229 10.5 8 10.5C7.44772 10.5 7 10.9477 7 11.5C7 12.0523 7.44772 12.5 8 12.5ZM12 12.5C12.5523 12.5 13 12.0523 13 11.5C13 10.9477 12.5523 10.5 12 10.5C11.4477 10.5 11 10.9477 11 11.5C11 12.0523 11.4477 12.5 12 12.5ZM17 11.5C17 12.0523 16.5523 12.5 16 12.5C15.4477 12.5 15 12.0523 15 11.5C15 10.9477 15.4477 10.5 16 10.5C16.5523 10.5 17 10.9477 17 11.5Z" fill="white" fill-opacity="0.7" />
              </svg>77
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path d="M9.72245 7.22634C10.736 5.40878 11.2424 4.5 12 4.5C12.7576 4.5 13.264 5.40878 14.2775 7.22634L14.5399 7.69672C14.8279 8.21351 14.9719 8.47191 15.1959 8.6423C15.4199 8.8127 15.6999 8.8759 16.2599 9.00229L16.7687 9.11749C18.7366 9.56308 19.7198 9.78548 19.9542 10.5383C20.1878 11.2902 19.5174 12.075 18.1759 13.6438L17.8287 14.0494C17.4479 14.495 17.2567 14.7182 17.1711 14.9934C17.0855 15.2693 17.1143 15.5669 17.1719 16.1613L17.2247 16.7029C17.4271 18.7965 17.5287 19.8428 16.9159 20.3076C16.3031 20.7724 15.3815 20.3484 13.54 19.5004L13.0624 19.2813C12.5392 19.0397 12.2776 18.9197 12 18.9197C11.7224 18.9197 11.4608 19.0397 10.9376 19.2813L10.4608 19.5004C8.61848 20.3484 7.6969 20.7724 7.08492 20.3084C6.47133 19.8428 6.57293 18.7965 6.77532 16.7029L6.82812 16.1621C6.88572 15.5669 6.91452 15.2693 6.82812 14.9942C6.74332 14.7182 6.55213 14.495 6.17134 14.0502L5.82415 13.6438C4.48258 12.0758 3.81219 11.291 4.04579 10.5383C4.27938 9.78548 5.26416 9.56228 7.23211 9.11749L7.7409 9.00229C8.30009 8.8759 8.57928 8.8127 8.80408 8.6423C9.02887 8.47191 9.17207 8.21351 9.46006 7.69672L9.72245 7.22634Z" fill="white" fill-opacity="0.7" />
              </svg>9.8K
            </div>
          </div>
          <div>
            <!-- 大漂亮独有 -->
            <el-button
              v-if="appInfo.id===1"
              size="small"
              link
              @click="emits('open-dig')"
            >
              <svg-icon
                name="chat"
                class="text-[#409eff]  text-[24px] mr-1"
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

<style lang="scss" scoped>
 .custom-toolbar{
   display: flex;
   div{
     display: flex;
     align-items: center;
     color: rgba(255, 255, 255, 0.70);
     font-feature-settings: 'dlig' on;
     font-family: Inter;
     font-size: 14px;
     font-style: normal;
     font-weight: 500;
     line-height: 19px; /* 135.714% */
     svg{
       width: 24px;
       height: 24px;
       margin-right: 4px;
     }
   }
 }
</style>
