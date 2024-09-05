<template>
  <div class="flex">
    <user-avatar
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
    <!-- <div class="ai-icon-list">
      <div
        v-for="url in aiImageList"
        class="ai-generate"
        :class="{ 'is-active': url === iconUrl }"
        @click="onChangeGeneratedIcon(url)"
      >
        <el-image
          class="ai-generate-img page-list-img"
          fit="cover"
          :src="url"
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
      <el-tooltip
        placement="top"
        popper-class="custom-tooltip-popper"
        :disabled="isAIloading || !!name || !disabledTooltipText"
      >
        <template #default>
          <button
            v-if="aiImageList.length < 3"
            v-loading="isAIloading"
            type="button"
            class="ai-generate"
            :class="{ 'is-disabled': isAIloading || !name }"
            :disabled="isAIloading || !name"
            @click="_generateKnowledgeIcon"
          >
            <svg-icon
              class="text-xl"
              name="ai"
            />
            {{ t('base.ai_generate') }}
          </button>
        </template>
        <template #content>
          {{ disabledTooltipText }}
        </template>
      </el-tooltip>
    </div> -->
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
// import { ElMessageBox } from 'element-plus';
// import { generateKnowledgeIcon } from '@gptx/base/api/knowledge';

// eslint-disable-next-line no-unused-vars
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
// const aiImageList = reactive([]);
const iconUrl = ref('');
// const isAIloading = ref(false);
//generate icon
// const _generateKnowledgeIcon = async () => {
//   if (isAIloading.value) return;
//   try {
//     isAIloading.value = true;
//     emits('before-generate');
//     const {
//       code,
//       data: { icon_url, remaining }
//     } = await generateKnowledgeIcon({
//       bot_name: props.name,
//       description: props.description
//     });
//     if (code === 200) {
//       if (remaining <= 0) return ElMessageBox({ title: t('common.c'), message: t('common.aiGenerateMaxLength') });
//       iconUrl.value = icon_url;
//       aiImageList.push(icon_url);
//       emits('change', icon_url);
//     }
//     isAIloading.value = false;
//     emits('after-generate');
//   } catch (e) {
//     console.log(e)
//     isAIloading.value = false;
//     emits('after-generate');
//   }
// };
const onAvatarUpload = (url) => {
  iconUrl.value = url;
  emits('change', url);
};
// const onChangeGeneratedIcon = (url) => {
//   iconUrl.value = url;
//   emits('change', url);
// };
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
  background-color: #ebebeb;
  border-radius: 8px;
}

.ai-generate {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 64px;
  width: 64px;
  font-size: 12px;
  line-height: 1.4;
  color: #a4a4a4;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  border: 1px solid #ebebeb;
  cursor: pointer;
  overflow: hidden;

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
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
    }
  }

  &.is-active {
    &::after {
      content: "";
      background-image: url("@/assets/svg/check.svg");
    }
  }

  &.is-disabled {
    color: #a4a4a4;
    border-color: #ebebeb;
    opacity: 0.8;

    &:hover {
      color: #a4a4a4;
      border-color: #ebebeb;
      cursor: not-allowed;
    }
  }

  & + & {
    margin-left: 7px;
  }
}
</style>
