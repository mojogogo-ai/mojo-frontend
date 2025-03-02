<template>
  <div class="flex">
    <user-avatar
      v-model="iconUrl"
      :custom-style="{
        height: '80px',
        width: '80px',
        borderRadius: '8px',
        ...customStyle
      }"
      :title="title"
    />
    <div class="ai-icon-list">
      <div
        v-for="url in aiImageList"
        class="ai-generate"
        :class="{ 'is-active': url === iconUrl }"
        @click="onChangeGeneratedIcon(url)"
      >
        <van-image
          class="ai-generate-img page-list-img"
          fit="cover"
          :src="url"
        >
          <template #error>
            <div class="page-list-img__error">
              <van-icon name="photo" />
            </div>
          </template>
        </van-image>
      </div>
      <van-popover
        v-model:show="isShowToolTip"
        class="cover-popover"
        placement="top"
        theme="dark"
        trigger="manual"
        :disabled="isAIloading || !!name || !disabledTooltipText"
      >
        <div class="cover-popover-content">
          {{ disabledTooltipText }}
        </div>
        <template #reference>
          <button
            v-if="aiImageList.length < 3"
            type="button"
            class="ai-generate"
            :class="{ 'is-disabled': isAIloading || !name }"
            @click="_generateKnowledgeIcon"
          >
            <template v-if="isAIloading">
              <van-loading />
            </template>
            <template v-else>
              <svg-icon
                class="text-xl"
                name="ai"
              />
              Generate
            </template>
          </button>
        </template>
      </van-popover>
    </div>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { generateKnowledgeIcon } from '@gptx/base/api/knowledge';

const props = defineProps({
  customStyle: {
    type: Object,
    default: () => ({})
  },
  name: {
    type: String,
    require: true,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  defaultAvatar: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: t('bots.botAvatar')
  },
  disabledTooltipText: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['before-generate', 'after-generate', 'change']);
const aiImageList = reactive([]);
const iconUrl = ref(props.defaultAvatar);
const isAIloading = ref(false);
const isShowToolTip = ref(false);

//generate icon
const _generateKnowledgeIcon = async () => {
  if (isAIloading.value || !props.name) {
    isShowToolTip.value = true;
    return;
  }
  try {
    isAIloading.value = true;
    emits('before-generate');
    const {
      code,
      data: { icon_url, remaining }
    } = await generateKnowledgeIcon({
      bot_name: props.name,
      description: props.description
    });
    if (code === 200) {
      if (remaining <= 0) {
        return showConfirmDialog({
          title: '',
          message: t('common.aiGenerateMaxLength'),
          confirmButtonText: t('common.ok'),
          showConfirmButton: true,
          showCancelButton: false
        })
      }
      iconUrl.value = icon_url;
      aiImageList.push(icon_url);
      emits('change', icon_url);
    }
    isAIloading.value = false;
    emits('after-generate');
  } catch (e) {
    console.log(e);
    isAIloading.value = false;
    emits('after-generate');
  }
};

const onChangeGeneratedIcon = (url) => {
  iconUrl.value = url;
  emits('change', url);
};
</script>

<style lang="scss" scoped>
.ai-icon-list {
  display: flex;
  align-items: center;
  flex: 1;
  height: 80px;
  width: 224px;
  padding: 0 8px;
  margin-left: 18px;
  background-color: rgba(#000, 0.5);
  border-radius: 8px;
  backdrop-filter: var(--backdrop-blur);
}

.ai-generate {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 64px;
  width: 64px;
  font-size: 0.8em;
  line-height: 1.4;
  color: var(--h5-text-color-placeholder);
  background-color: var(--h5-fill-color-light);
  border-radius: 8px;
  border: 1px solid var(--van-border-color);
  cursor: pointer;
  overflow: hidden;
  backdrop-filter: var(--backdrop-blur);

  &::after {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    inset: -1px;
    color: #fff;
    font-size: 16px;
    background: rgba(#000, 0.4) no-repeat center / 24px;
  }

  &:hover {
    &:not(:has(.page-list-img)) {
      color: var(--van-blue);
      border-color: var(--van-blue);
    }
  }

  &.is-active {
    &::after {
      content: '';
      background-image: url('@/assets/svg/check.svg');
    }
  }

  &.is-disabled {
    opacity: 0.8;

    &:hover {
      color: var(--h5-text-color-placeholder);
      border-color: var(--van-border-color);
      cursor: not-allowed;
    }
  }

  & + & {
    margin-left: 7px;
  }
}

:deep(.van-popover__wrapper) {
  margin-left: 7px;
}
</style>
