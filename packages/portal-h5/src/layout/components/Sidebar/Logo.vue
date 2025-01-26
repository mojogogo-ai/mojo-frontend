<template>
  <div class="sidebar-logo">
    <div class="w-full flex justify-between align-center px-4 pt-4">
      <a
        key="collapse"
        class="sidebar-logo__link mt-0"

        :href="WEBSITE_HOME"
        @click.prevent
      >
        <svg-icon
          name="logo"
          class="sidebar-logo__icon"
        />
        {{ isCn ? $t('common.productName_Cn') : $t('common.productName') }}
      </a>
      <div @click="closeTopbar">
        <IconClose/>
      </div>
    </div>
    <van-divider class="sidebar-divider mb-0" />
  </div>
</template>

<script setup>

import { useLayoutStore } from '@/store/modules/layout';
import IconClose from '@/assets/svg/close.svg';

defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
});
const storeLayout = useLayoutStore();

const isCn = computed(() => {
  return window.SITE_TYPE && window.SITE_TYPE === '2';
});
const closeTopbar = () => {
  storeLayout.setSidebarVisible(false);
};
const WEBSITE_HOME = window.WEBSITE_HOME;
</script>
