<template>
  <section class="app-main">
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
  height: 100%;
  width: 100%;
  position: relative;
  overflow: auto hidden;
  font-size: var(--font-base);
}
</style>
