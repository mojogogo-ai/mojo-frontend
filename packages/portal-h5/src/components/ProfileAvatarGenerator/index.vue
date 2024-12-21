<template>
  <div class="flex items-end">
    <div class="px-[16px] py-[10px]" style="border: 1px dashed #C5C5C5;border-radius: 12px;">
      <userAvatarOss
        :avatar="iconUrl || defaultAvatar"
        :custom-style="{
          height: '80px',
          width: '80px',
          borderRadius: '8px',
          ...customStyle
        }"
        :title="title"
        @update-avatar="onAvatarUpload"
      />
    </div>

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
        :disabled="isAIloading || !disabledTooltipText"
      >
        <div class="cover-popover-content">
          {{ disabledTooltipText }}
        </div>
        <template #reference>
          <button
            v-if="aiImageList.length < 3"
            type="button"
            class="ai-generate"
            :class="{ 'is-disabled': isAIloading }"
            :disabled="isAIloading"
            @click="_generateKnowledgeIcon"
          >
            <template v-if="isAIloading">
              <van-loading />
            </template>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" width="43" height="42" viewBox="0 0 43 42" fill="none">
                <path d="M10.1362 2.62598L11.9087 7.41601L16.6987 9.18848L11.9087 10.9609L10.1362 15.751L8.36376 10.9609L3.57373 9.18848L8.36376 7.41601L10.1362 2.62598Z" fill="#E1FF01" fill-opacity="0.7" />
                <path d="M27.1987 11.8135L30.2119 19.9565L38.355 22.9697L30.2119 25.9829L27.1987 34.126L24.1855 25.9829L16.0425 22.9697L24.1855 19.9565L27.1987 11.8135Z" fill="#E1FF01" fill-opacity="0.7" />
              </svg>
              <span>{{ t('base.ai_generate_0') }}</span>
            </template>
          </button>
        </template>
      </van-popover>
    </div>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { ElMessageBox } from 'element-plus';
import { generateAvatarIcon } from '@gptx/base/api/user.js';
import userAvatarOss   from '@/components/userAvatarOss/index.vue';

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
  gender: {
    type: Number,
    default: 0
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
const iconUrl = ref('');
const isAIloading = ref(false);
const isShowToolTip = ref(false);
const is_personalize_image_icon = ref(false);

//generate icon
const _generateKnowledgeIcon = async () => {
  if (isAIloading.value) return;
  try {
    isAIloading.value = true;
    emits('before-generate');
    const {
      code,
      data: { url, remaining }
    } = await generateAvatarIcon({
      gender: props.gender
      // bot_name: props.name,
      // description: props.description
    });
    if (code === 200) {
      if (remaining <= 0) return ElMessageBox({ title: t('common.c'), message: t('common.aiGenerateMaxLength') });
      iconUrl.value = url;
      // // TODO:
      // iconUrl.value  = 'http://localhost:9004/src/assets/images/homepage/pic1.png'
      if(aiImageList.length > 3) aiImageList.shift();
      aiImageList.push(url);
      emits('change', url);
    }
    isAIloading.value = false;
    emits('after-generate');
  } catch (e) {
    console.log(e);
    isAIloading.value = false;
    emits('after-generate');
  }
};
const onAvatarUpload = (url) => {
  iconUrl.value = url;
  is_personalize_image_icon.value = true;
  emits('change', url, is_personalize_image_icon.value);
};
const onChangeGeneratedIcon = (url) => {
  iconUrl.value = url;
  is_personalize_image_icon.value = false;
  emits('change', url, is_personalize_image_icon.value);
};
</script>

<style lang="scss" scoped>
.ai-icon-list {
  display: flex;
  align-items: center;
  flex: 1;
  //height: 80px;
  //width: 224px;
  //padding: 0 8px;
  margin-left: 16px;
  //background-color: var(--el-input-bg-color);
  //border-radius: 8px;
  //backdrop-filter: var(--backdrop-blur);
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
