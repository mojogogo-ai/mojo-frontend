<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <!-- <transition name="fade-transform" mode="out-in"> -->
      <component :is="Component" :key="route.path" />
      <!-- </transition> -->
    </router-view>
  </section>
</template>

<script setup>
onMounted(() => {
});
</script>

<style lang="scss" scoped>
.app-main {
  /* 65= navbar  65  */
  /* 40= bottom  40  */
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  font-size: var(--font-base);
}
</style>
