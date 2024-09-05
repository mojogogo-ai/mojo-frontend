<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <!-- <transition name="fade-transform" mode="out-in"> -->
      <component
        :is="Component"
        :key="route.path"
      />
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
  height: 100%;
  width: 100%;
  position: relative;
  overflow: auto hidden;
  font-size: var(--font-base);
}
</style>
