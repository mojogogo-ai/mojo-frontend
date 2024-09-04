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
        <div class="flex-1 app-page-col">
          <div class="flex items-center">
            <div
              class="line-clamp-1 h-[20px] flex-1"
              :title="appInfo.app_name"
            >
              {{ appInfo.app_name }}
            </div>
          </div>
          <div
            class="mt-2 line-clamp-2 h-[40px] text-[#7a7a7a]"
            :title="appInfo.app_description"
          >
            {{ appInfo.app_description }}
          </div>
          <div class="my-1">
            <span class="text-xs text-[#7a7a7a]"> @{{ appInfo.author_name }} </span>
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
  ({  }) => {
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped></style>
