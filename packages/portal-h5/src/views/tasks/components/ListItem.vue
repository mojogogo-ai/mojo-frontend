<template>
  <div class="page-list">
    <van-cell
      class="page-list__inner"
      shadow="hover"
    >
      <div class="flex">
        <div class="app-page-col">
          <svg-icon
            :name="appInfo.app_icon"
            class="h-[120px] w-[120px] task-img"
          />
<!--          <el-image-->
<!--            class="page-list-img"-->
<!--            fit="cover"-->
<!--            :src="appInfo.app_icon || defaultBotImage"-->
<!--          >-->
<!--            <template #error>-->
<!--              <div class="page-list-img__error">-->
<!--                <el-icon>-->
<!--                  <Picture />-->
<!--                </el-icon>-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-image>-->
        </div>
        <div class="app-page-col flex-1">
          <div class="flex items-center">
            <div
              class="line-clamp-1 flex-1 text-xl text-highlight"
              :title="appInfo.app_name"
            >
              {{ appInfo.app_name }}
            </div>
          </div>
          <div
            class="mt-2 text-placeholder"
            :title="appInfo.app_description"
          >
            {{ appInfo.app_description }}
          </div>
          <div class="mt-2">
            <van-tag size="large" round>{{ appInfo.points }}</van-tag>
          </div>
        </div>
      </div>
    </van-cell>
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

<style lang="scss" scoped>
.task-img {
  width: 120px !important;
  height: 120px !important;
}
</style>
