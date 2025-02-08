<template>
  <div class="relative w-full h-full app-wrapper">
    <div v-if="pageType === '/home'" class="video-bg-index">
      <video
        :src="videobg"
        autoplay
        loop
        muted
        playsinline
        class="object-cover w-full h-full"
      />
    </div>
    <div v-if="pageType === '/memebot' || pageType === '/memebotDetail'" class="edit-bg"></div>
    <TopBar />
    <div class="main-container">
      <app-main />
    </div>
  </div>
</template>

<script setup name="LayOut">
import TopBar from './components/TopBar/index.vue'
import AppMain from './components/AppMain.vue'
import videobg from '@/assets/video/mojogogo_animation.mp4'
const pageType = ref('')
import router from '@/router'
watchEffect(() => {
  // 监听router变化 路径为/home
  pageType.value = router.currentRoute.value.path;
})
</script>

<style lang="scss" scoped>
.video-bg-index{
  position: fixed;
  z-index: 0;
  width: 100%;
  height: auto;
  top: 0;
}

</style>
