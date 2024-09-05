<template>
  <div class="sidebar-logo">
    <a
      key="collapse"
      class="sidebar-logo__link"
      :href="WEBSITE_HOME"
    >
      <svg-icon
        name="logo"
        class="sidebar-logo__icon"
      />
      {{ isCn ? $t('common.productName_Cn') : $t('common.productName') }}
    </a>
    <van-divider class="sidebar-divider" />
  </div>
</template>

<script setup>

defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
});
const isCn = computed(() => {
  return window.SITE_TYPE && window.SITE_TYPE === '2';
});
const WEBSITE_HOME = window.WEBSITE_HOME;
</script>
