<template>
  <div class="page-list">
    <van-cell class="page-list__inner">
      <div class="flex">
        <div class="app-page-col">
          <van-image
            class="page-list-img"
            fit="cover"
            :src="appInfo.app_icon || defaultBotImage"
            radius="10"
          >
            <template #error>
              <div class="page-list-img__error">
                <van-icon name="photo" />
              </div>
            </template>
          </van-image>
        </div>
        <div class="app-page-col flex-1">
          <div class="flex items-center">
            <div
              class="line-clamp-1 flex-1 text-base text-[var(--van-blue)]"
              :title="appInfo.app_name"
            >
              {{ appInfo.app_name }}
            </div>
            <van-button
              v-if="platList && platList.length && isWorldWide"
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
            <van-image
              class="align-middle"
              width="16px"
              round
              :src="defaultBotImage"
            />
            <span class="mr-1 text-xs text-[var(--el-text-color-placeholder)]"> user1518405835467 </span>
            <span class="text-xs text-[var(--el-text-color-placeholder)]"> @{{ appInfo.author_name }} </span>
          </div>
          <div
            class="text-placeholder my-2 line-clamp-4 h-[100px]"
            :title="appInfo.app_description"
          >
            {{ appInfo.app_description }}
          </div>
          <div v-if="appInfo.app_categories && appInfo.app_categories.length">
            <van-tag
              v-for="{ name } in appInfo.app_categories"
              class="my-2 mr-1"
              size="large"
            >
              {{ t(name) }}
            </van-tag>
          </div>
        </div>
      </div>
      <div class="page-list-option justify-end">
        <svg-icon
          name="chat"
          size="20"
          @click="emits('open-new-chat')"
        />
      </div>
    </van-cell>
    <van-action-sheet
      v-model:show.lazy="showMoreAction"
      :actions="actions"
      :cancel-text="t('common.cancel')"
      @select="onSelect"
    />
    <van-share-sheet
      v-model:show="showOpenWith"
      :options="platList"
      :title="t('store.action.plat')"
      :cancel-text="t('common.cancel')"
      @select="onShareSelect"
    />
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
const isWorldWide = window.SITE_TYPE && window.SITE_TYPE === '1';
const showMoreAction = ref(false);
const showOpenWith = ref(false);
const actions = computed(() => {
  let arr = [];
  if (platList.length && isWorldWide) {
    arr.push({ name: t('store.action.plat'), icon: 'comment-o', action: 'openWith' });
  }
  // if (props.appInfo?.app_copyable) {
  //   arr.push({ name: t('bots.copy'), icon: 'description-o', action: 'copy' });
  // }
  return arr;
});

const onSelect = ({ action }) => {
  switch (action) {
    case 'openWith':
      showOpenWith.value = true;
      break;
    case 'copy':
      emits('duplicate');
      break;
  }
  showMoreAction.value = false;
};
const onShareSelect = (plat) => {
  emits('open-with', plat.name);
  showOpenWith.value = false;
};

watch(
  () => props.appInfo,
  ({ shared_social }) => {
    const plat = Object.values(shared_social).filter((_) => _.enabled === true);
    platList = [
      ...plat.map((_) => ({
        name: _?.s_name,
        icon: platIcons[_?.s_name],
        className: 'capitalize'
      }))
    ];
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
.h-\[38px\] {
  height: 38px;
}

.line-clamp-4 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.h-\[100px\] {
  height: 100px;
}

.text-\[var\(--van-blue\)\] {
  color: var(--van-blue);
}

.text-xl {
}
</style>
