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
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" fill="white" fill-opacity="0.1" />
          <path d="M0.5 20C0.5 9.23045 9.23045 0.5 20 0.5C30.7696 0.5 39.5 9.23045 39.5 20C39.5 30.7696 30.7696 39.5 20 39.5C9.23045 39.5 0.5 30.7696 0.5 20Z" stroke="white" stroke-opacity="0.1" />
          <path d="M14 14L26 26" stroke="#E1FF01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M14 26L26 14" stroke="#E1FF01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
    <van-divider class="sidebar-divider mb-0" />
  </div>
</template>

<script setup>

import { useLayoutStore } from '@/store/modules/layout';

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
