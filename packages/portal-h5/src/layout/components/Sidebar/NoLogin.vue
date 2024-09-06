<template>
  <div>
    <!-- <el-link type="primary" style="margin:0 26px 0 20px;" @click="loginORsignup(true)"> Log in</el-link>
    <el-link type="primary" @click="loginORsignup(false)">Sign up   <el-icon><ArrowRightBold /></el-icon></el-link> -->
    <el-link type="primary" style="margin:0 0 0 20px;" @click="loginORsignup(true)"> Log in   <el-icon><ArrowRightBold /></el-icon></el-link>
  </div>
</template>

<script setup>
const emits = defineEmits(['login-signup']);

const loginORsignup = (bol)=>{
  emits('login-signup', bol);
}
</script>

<style lang="scss" scoped>
</style>
