<template>
  <div>
    <!-- <el-link type="primary" style="margin:0 26px 0 20px;" @click="loginHadle(true)"> Log in</el-link>  -->
    <el-link type="primary" @click="loginHadle(true)"> Log in   </el-link>

    <el-link type="primary" style="margin:0 0 0 20px;" @click="loginHadle(false)">Sign up   <el-icon><ArrowRightBold /></el-icon></el-link>
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
