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
  /* 65= navbar  65  */
  /* 40= bottom  40  */
  // height: calc(100% - 105px);
  // height: calc(100% - 50px);
  height: 100%;
  width: 100%;
  position: relative;
  overflow: auto hidden;
  font-size: var(--font-base);
}

.bottom-text {
  font-size: 12px;
  color: #999;
  text-align: center;
  padding: 12px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  background-color: #fcfcfc;
}
</style>
