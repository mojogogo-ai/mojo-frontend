<template>
  <div class="relative w-full h-full app-wrapper">
    <div v-if="isHome" class="video-bg-index">
      <video
        :src="videobg"
        autoplay
        loop
        muted
        playsinline
        class="w-full  h-full object-cover"
      />
    </div>
    <TopBar />
    <div class="main-container">
      <app-main />
    </div>
  </div>
</template>

<script setup name="LayOut">
import TopBar from './components/TopBar/index.vue'
import { AppMain } from './components'
import videobg from '@/assets/video/mojogogo_animation.mp4'
const isHome = ref(true)
import router from '@/router'
watchEffect(() => {
  // if (window.location.pathname === '/home') {
  //   isHome.value = true
  // } else {
  //   isHome.value = false
  // }
  // 监听router变化 路径为/home
  isHome.value = router.currentRoute.value.path === '/home';

})
</script>

<style lang="scss" scoped>
.video-bg-index{
  position: fixed;
  z-index: 0;
  width: 100%;
  height: auto;
  top: 0;
  //left: 0;
  //right: 0;
  //bottom: 0;
  //object-fit: cover;
  //object-position: center;
  //filter: blur(10px);
  //opacity: 0.5;
}

</style>
