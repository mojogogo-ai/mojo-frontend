<template>
  <section class="relative w-full h-full app-main">
    <router-view v-slot="{ Component, route }">
      <component
        :is="Component"
        :key="route.path"
      />
    </router-view>
  </section>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.app-main {
  overflow: auto hidden;
  font-size: var(--font-base);
}
</style>
