<template>
  <div class="mr-[16px] rounded-[40px] border border-white/10 bg-white/10 px-[20px] h-[40px] leading-[40px]">
    <!-- <el-link type="primary" style="margin:0 26px 0 20px;" @click="loginHadle(true)"> Log in</el-link>  -->
    <el-link type="primary" @click="loginHadle(true)">
      <svg-icon name="user-login" style="height: 24px; width: 24px; margin-right: 8px;"/>

      Log in   </el-link>
    <!-- <el-link type="primary" style="margin:0 0 0 20px;" @click="loginHadle(false)">Sign up   <el-icon class="mt-[2px]"><ArrowRightBold /></el-icon></el-link> -->
  </div>
</template>

<script setup>
const emits = defineEmits(['login']);

const loginHadle = (bol)=>{
  emits('login', bol);
}
</script>

<style lang="scss" scoped>
</style>
