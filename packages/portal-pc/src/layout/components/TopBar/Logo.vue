<template>
  <div class="sidebar-logo">
    <a
      class="sidebar-logo__link"
      @click="toPage()"
    >
      <svg-icon
        class="mr-2"
        name="logo"
      />
      {{ $t('common.productName') }}
    </a>
  </div>
</template>

<script setup>
const router = useRouter();

// skip page
const toPage = () => {
    router.push({ path: '/home' })
};
</script>
