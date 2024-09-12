<template>
  <div class="page-list">
    <van-cell class="page-list__inner">
      <div class="flex">
        <div class="app-page-col">
          <van-image
            class="page-list-img"
            fit="cover"
            :src="appInfo.icon || defaultBotImage"
            radius="10"
          >
            <template #error>
              <div class="page-list-img__error">
                <van-icon name="photo" />
              </div>
            </template>
          </van-image>
        </div>
        <div class="flex-1 app-page-col">
          <div class="flex items-center">
            <div
              class="line-clamp-1 flex-1 text-base text-[var(--van-blue)]"
              :title="appInfo.name"
            >
              {{ appInfo.name }}
            </div>
            <van-button
              v-if="platList && platList.length"
              link
              @click="showMoreAction = true"
            >
              <van-icon
                class="text-placeholder hover:text-[var(--h5-color-primary)]"
                name="weapp-nav"
              />
            </van-button>
          </div>
          <div class="mt-2">
            <!-- <van-image
              class="align-middle"
              width="16px"
              round
              :src="defaultBotImage"
            />
            <span class="mr-1 text-xs text-[var(--el-text-color-placeholder)]"> user1518405835467 </span>
             -->
            <span class="text-xs text-[var(--el-text-color-placeholder)]"> @{{ appInfo.create_name }} </span>
          </div>
          <div
            class="text-placeholder my-2 line-clamp-4 h-[100px]"
            :title="appInfo.introduction"
          >
            {{ appInfo.introduction }}
          </div>
          <!-- <div v-if="appInfo.app_categories && appInfo.app_categories.length">
            <van-tag
              v-for="{ name } in appInfo.app_categories"
              class="my-2 mr-1"
              size="large"
            >
              {{ t(name) }}
            </van-tag>
          </div> -->
        </div>
      </div>
      <div class="justify-end page-list-option">
        <!-- <svg-icon
          name="chat"
          size="20"
          @click="emits('open-with', addClass)"
        /> -->
        <svg-icon
          name="telegram"
          size="20"
          @click="openTg()"
        />
      </div>
    </van-cell>
  </div>
</template>

<script setup>
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
const showMoreAction = ref(false);
const openTg = ()=>{
  window.open(props.appInfo.address, '_blank');
}

</script>

<style lang="scss" scoped>
.h-\[38px\] {
  height: 38px;
}

.line-clamp-4 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.h-\[100px\] {
  height: 100px;
}

.text-\[var\(--van-blue\)\] {
  color: var(--van-blue);
}

</style>
