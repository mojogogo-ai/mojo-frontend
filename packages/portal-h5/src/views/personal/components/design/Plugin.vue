<template>
  <div class="design-form">
    <div class="design-form-item">
      <div class="design-form-title">
        {{ t('bots.label.plugin') }}
        <div class="">
          <svg-icon
            class="text-[var(--h5-color-primary)] cursor-pointer text-xl ml-2"
            name="auto"
          />
          <svg-icon
            class="text-[var(--h5-color-primary)] cursor-pointer text-xl ml-2"
            name="plus-circle-fill"
          />
        </div>
      </div>
      <div class="design-form-content">
        <div class="page-list">
          <van-cell
            class="page-list__inner"
            shadow="hover"
          >
            <div class="relative flex items-center mb-2">
              <van-image
                class="page-list-img"
                fit="cover"
                src="https://img.yzcdn.cn/vant/cat.jpeg"
              >
                <template #error>
                  <div class="page-list-img__error">
                    <van-icon name="photo" />
                  </div>
                </template>
              </van-image>
              <div class="flex-1 pl-2 pr-3 text-base line-clamp-1">插件名称</div>
              <div
                class="absolute top-0 right-[-6px] cursor-pointer text-[#7a7a7a]]"
              >
                <svg-icon
                  name="delete"
                  class="text-base"
                  @click="deletePlugin"
                />
              </div>
            </div>
            <div class="text-[#7a7a7a] line-clamp-2">根据文本描述生成图像，可指定图像数量和大小</div>
          </van-cell>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { t } from '@gptx/base/i18n';

const deletePlugin = () => {
  console.log('delete plugin');
};
</script>
<style lang="scss" scoped>
:deep(.page-list) {
  padding: 0;
  min-width: unset;
  width: 288px;
  &:not(:nth-child(2n-1)) {
    margin-left: 16px;
  }
}
:deep(.page-list-img) {
  width: 30px;
  height: 30px;
  .page-list-img__error {
    font-size: 15px;
  }
}
</style>
