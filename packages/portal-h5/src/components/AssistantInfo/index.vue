<template>
  <van-popup
    v-model:show="isShowDrawer"
    class="cover-popup is-detail"
    position="bottom"
    round
  >
    <div class="cover-popup-head">
      <div class="ml-auto">
        <van-popover
          placement="bottom-end"
          :actions="actions"
          @select="onActionSelected"
        >
          <template #reference>
            <van-button
              icon="weapp-nav"
              link
            />
          </template>
        </van-popover>
      </div>
    </div>
    <div class="cover-popup-body">
      <van-image
        class="bot-info-img"
        fit="cover"
        round
        :src="botInfo.app.icon"
      >
        <template #error>
          <div class="page-list-img__error">
            <van-icon name="photo" />
          </div>
        </template>
      </van-image>
      <div class="flex flex-col bot-info">
        <div class="ass-info-scroll">
          <div class="px-6">
            <div class="w-full text-lg font-black">{{ botInfo.app.name }}</div>
            <div class="mb-2 flex items-center text-xs leading-none text-[#7a7a7a]">
              <div class="mr-2">@ {{ botInfo.app.author_name }}</div>
              <div class="pl-2 border-l chat-separator">
                {{ t('bots.publishAt') }}
                {{
                  dayjs(botInfo.app.published_at)
                    .subtract(new Date().getTimezoneOffset(), 'minute')
                    .format('YYYY-MM-DD HH:mm:ss')
                }}
              </div>
            </div>
            <div class="mb-2 w-full text-[#7a7a7a]">
              <van-text-ellipsis
                rows="8"
                :content="botInfo.app?.description"
                :expand-text="t('common.expand')"
                :collapse-text="t('common.fold')"
              />
            </div>
            <div class="mb-3">
              <div class="mb-1 font-black">{{ t('bots.label.catalog') }}</div>
              <van-tag
                v-for="{ name } in botInfo.app?.categories"
                class="mr-1"
                type="primary"
                size="medium"
              >
                {{ t(name) }}
              </van-tag>
            </div>
            <div class="mb-3">
              <div class="mb-1 font-black">{{ t('bots.n') }}</div>
              <van-tag
                type="primary"
                size="medium"
              >
                {{ botInfo.llm?.llm }}
              </van-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { t } from '@gptx/base/i18n/index';
import { useClipboard } from '@vueuse/core';
import { showToast } from 'vant';
import dayjs from 'dayjs';

const props = defineProps({
  botInfo: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(['duplicate']);

const isShowDrawer = ref(false);
const actions = computed(() => {
  return props.botInfo.app_copyable
    ? [
        { text: t('bots.a3'), icon: 'share-o', action: 'share' },
        { text: t('bots.copy'), icon: 'description-o', action: 'duplicate' }
      ]
    : [{ text: t('bots.a3'), icon: 'share-o', action: 'share' }];
});

const open = () => {
  isShowDrawer.value = true;
};
const onActionSelected = ({ action }) => {
  switch (action) {
    case 'share':
      share();
      break;
    case 'duplicate':
      emits('duplicate');
      isShowDrawer.value = false;
      break;
  }
};

const share = () => {
  const code = location.href;
  if (code) {
    const { copy, copied } = useClipboard({ code, legacy: true });
    copy(code);
    if (copied) {
      showToast({
        message: t('bots.bb'),
        position: top
      });
    } else {
      showToast({
        message: t('chat.copy2'),
        position: top
      });
    }
  }
};

defineExpose({ open });
</script>

<style lang="scss" scoped>
.bot-info-img-row {
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
}

.bot-info-img {
  position: absolute;
  height: 88px;
  width: 88px;
  top: 0;
  left: 8px;
  margin-top: -36px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
}

.ass-info-scroll {
  height: 100%;
  overflow: hidden auto;
}
</style>
<style lang="scss">
.cover-popup {
  &.is-detail {
    overflow: visible;
  }
}
</style>
