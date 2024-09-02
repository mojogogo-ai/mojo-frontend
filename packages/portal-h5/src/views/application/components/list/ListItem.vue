<template>
  <div
    class="relative page-list"
    :class="props.class"
  >
    <van-cell class="page-list__inner">
      <div class="flex mb-2">
        <div class="app-page-col">
          <van-image
            class="page-list-img"
            fit="cover"
            :src="bot.icon || defaultBotImage"
            @click="toBotDetail"
          >
            <template #error>
              <div class="page-list-img__error">
                <van-icon name="photo" />
              </div>
            </template>
          </van-image>
        </div>
        <div class="relative flex-1 app-page-col">
          <div class="flex">
            <div class="flex-1">
              <div
                class="line-clamp-1 h-[24px] pr-3 text-base"
                :title="bot.name"
                @click="toBotDetail"
              >
                {{ bot.name }}
              </div>
            </div>
            <div
              class="more-option-trigger"
              @click="isShowAction = true"
            >
              <van-button link>
                <van-icon
                  class="text-[#7a7a7a] hover:text-[var(--h5-color-primary)]"
                  name="weapp-nav"
                />
              </van-button>
            </div>
          </div>
          <div
            class="my-2 line-clamp-2 h-[44px] text-[#7a7a7a]"
            :title="bot.description"
            @click="toBotDetail"
          >
            {{ bot.description }}
          </div>
          <div
            v-if="bot.llm"
            class="flex items-center text-[#7a7a7a]"
          >
            <svg-icon name="plugin-store" />
            <span class="ml-1 text-xs">{{ bot.llm }}</span>
          </div>
        </div>
      </div>
      <div class="page-list-option">
        <span class="mr-auto text-xs text-[#7a7a7a]">
          <van-icon
            :class="{ 'text-primary': bot.published }"
            name="guide-o"
          />
          {{ bot.published ? t('bots.published') : t('bots.unpublished') }}
        </span>
        <div class="flex">
          <van-button
            v-if="platList.length && isWorldWide"
            class="mr-1"
            size="mini"
            @click.stop="openWith"
          >
            {{ t('store.action.plat') }}
          </van-button>
          <van-button
            type="primary"
            size="mini"
            linear
            @click.stop="toBotDetail"
          >
            {{ t('bots.view') }}
          </van-button>
        </div>
      </div>
    </van-cell>
  </div>
  <van-share-sheet
    v-model:show="showOpenWith"
    :options="platList"
    :title="t('store.action.plat')"
    :cancel-text="t('common.cancel')"
    @select="onDropDownClick"
  />
  <van-action-sheet
    v-model:show="isShowAction"
    :actions="actions"
    :cancel-text="t('common.cancel')"
    @select="onActionSelect"
  />
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { appDelete, removePublishApp } from '@gptx/base/api/application';
import router from '@/router';
import defaultBotImage from '@/assets/logo/bot-default-logo.svg';
import IconTelegram from '@/assets/images/bots/publish/telegram.svg';
import IconDiscord from '@/assets/images/bots/publish/discord.svg';
import IconLine from '@/assets/images/bots/publish/line.svg';
import IconMessenger from '@/assets/images/bots/publish/messenger.svg';
import IconSlack from '@/assets/images/bots/publish/slack.svg';
import IconInstagram from '@/assets/images/bots/publish/instagram.svg';
import IconReddit from '@/assets/images/bots/publish/reddit.svg';
import { showConfirmDialog } from 'vant';

const props = defineProps({
  bot: {
    type: Object,
    required: true
  },
  class: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['chat', 'delete', 'refresh-list']);
const actions = computed(() => {
  let arr = [];
  if (props.bot.published) {
    arr.push({ name: t('bots.unpublish'), action: 'unpublish' });
  }
  arr.push({ name: t('bots.delete'), className: 'is-delete', action: 'delete' });
  return arr;
});
const isShowAction = ref(false);
const showOpenWith = ref(false);
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

// open with click
const openWith = () => (showOpenWith.value = true);
// open with plat action
const onDropDownClick = (plat) => {
  emit('chat', plat.name);
  showOpenWith.value = false;
};
// open bot sub page design
const toBotDetail = () => {
  const { id } = props.bot;
  router.replace({
    path: `/design/${id}`
  });
};
const onActionSelect = ({ action }) => {
  const id = props.bot.id;
  switch (action) {
    case 'unpublish':
      onUnpublish(id);
      break;
    case 'publish':
      onPublish(id);
      break;
    case 'delete':
      onDelete(id);
      break;
  }
  isShowAction.value = false;
};
// dropdown command delete
const onDelete = async (id) => {
  try {
    const message = isWorldWide ? t('bots.deleteDesc') : t('bots.deleteDescCn');
    const action = await showConfirmDialog({
      title: t('bots.delete'),
      message,
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      showConfirmButton: true
    });
    if (action === 'confirm') {
      const { code } = await appDelete({ id });
      if (code === 200) emit('delete');
    }
  } catch (error) {
    console.log(error);
  }
};
// dropdown command publish
const onPublish = (id) =>
  router.push({
    path: `/publish/${id}`
  });
// dropdown command unpublish
const onUnpublish = async (id) => {
  try {
    const { href } = router.resolve({
      path: `/publish/${id}`
    });
    const action = await showConfirmDialog({
      title: t('bots.unpublish'),
      message: `${t('bots.unpublishDesc')}<a class="text-primary" href="${href}" >${t('bots.toPublish')}</a>`,
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      allowHtml: true
    });
    if (action === 'confirm') {
      const { code } = await removePublishApp({ app_id: id });
      if (code === 200) emit('refresh-list');
    }
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => props.bot,
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
.more-option-trigger {
  display: flex;
  align-items: center;
  border-radius: 4px;

  &:hover {
    background-color: #ecf5ff;
  }
}

:deep(.page-list__inner) {
  min-height: 178px;
}
</style>
<style lang="scss">
.van-action-sheet__item {
  &.is-delete {
    color: var(--van-danger-color);

    &.van-action-sheet__item--disabled {
      opacity: 0.3;
    }
  }
}

.text-primary {
  color: var(--van-primary-color);
}
</style>
