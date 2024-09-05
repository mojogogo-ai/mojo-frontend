<template>
  <div class="app-wrapper">
    <TopBar />
    <div class="main-container">
      <app-main />
    </div>
  </div>
</template>

<script setup name="LayOut">
import TopBar from './components/TopBar/index.vue'
import { AppMain } from './components'
</script>

<style lang="scss" scoped>

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
