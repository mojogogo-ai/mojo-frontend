<template>
  <div class="app-wrapper">
    <van-popup
      v-model:show="storeLayout.isSHowSidebar"
      position="left"
      class="sidebar-popup"
    >
      <Sidebar class="sidebar-container" />
    </van-popup>
    <div class="main-container">
      <app-main />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar/Sidebar.vue';
import { AppMain } from './components';
import { useLayoutStore } from '@/store/modules/layout';

const storeLayout = useLayoutStore();
const route = useRoute();

// 路由变化，关闭侧边栏
watch(
  () => route.path,
  () => {
    storeLayout.setSidebarVisible(false);
  }
);
</script>

<style lang="scss" scoped>

.px-6 {
  padding: 0 24px;
}
</style>
<style lang="scss">
.sidebar-popup{
  width: 210px;
  height: 100%;
}
</style>
