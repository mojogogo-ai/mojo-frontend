<template>
  <div class="app-wrapper">
    <!-- <Sidebar class="sidebar-container" /> -->
    <TobBar />
    <div class="main-container">
      <app-main />
    </div>
  </div>
</template>

<script setup name="LayOut">
// import Sidebar from './components/Sidebar/Sidebar.vue'
import TobBar from './components/TobBar/index.vue'
import { AppMain } from './components'

</script>

<style lang="scss" scoped>
  @import "@/assets/styles/variables.module.scss";

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
