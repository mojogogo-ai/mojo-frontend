<template>
  <div class="relative w-full h-full app-wrapper">
    <div class="app-wrapper-bg"></div>
    <div v-if="pageType === '/home'" class="app-home-bg"></div>
    <div class="bg-animation">
      <div class="dragon"></div>
      <div class="melting-face"></div>
      <div class="melting-pink-face"></div>
      <div class="ufo"></div>
    </div>
    <TopBar />
    <div class="main-container">
      <app-main />
    </div>
  </div>
</template>

<script setup name="LayOut">
import TopBar from './components/TopBar/index.vue'
import AppMain from './components/AppMain.vue'
const pageType = ref('')
import router from '@/router'
watchEffect(() => {
  // 监听router变化 路径为/home
  pageType.value = router.currentRoute.value.path;
})
</script>

<style lang="scss" scoped>
</style>
