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
          <div
            class="mt-2 line-clamp-2 h-[40px] w-[350px] text-[var(--el-text-color-placeholder)]"
            :title="appInfo.app_description"
          >
            {{ appInfo.app_description }}
          </div>
          <div class="mt-2">
            <el-tag type="info" round>
              <span class="text-[var(--el-color-primary)]">{{ appInfo.points }}</span>
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import defaultBotImage from '@/assets/logo/bot-default-logo.svg';

const props = defineProps({
  appInfo: {
    type: Object,
    default: () => ({})
  }
});

watch(
  () => props.appInfo,
  ({}) => {},
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped></style>
