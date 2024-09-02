<template>
  <div class="sidebar-logo">
    <a
      key="collapse"
      class="sidebar-logo__link"
      :href="WEBSITE_HOME"
    >
      <img
        :src="logo"
        class="sidebar-logo__icon"
      >
      {{ isCn? $t('common.productName_Cn') :$t('common.productName') }}
    </a>
  </div>
</template>

<script setup>
import logo from '@/assets/logo/safe-gen-ai.svg';

defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
});
const isCn = computed(() => {
  return  window.SITE_TYPE && window.SITE_TYPE === '2'
});
const WEBSITE_HOME = window.WEBSITE_HOME;
</script>
