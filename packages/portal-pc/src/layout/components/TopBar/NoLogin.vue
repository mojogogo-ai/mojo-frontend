<template>
  <div class="mr-[16px] rounded-[40px] px-[20px] h-[40px] leading-[40px] flex justify-center items-center cursor-pointer user" @click="loginHadle(true)">
    <!-- <el-link type="primary" style="margin:0 26px 0 20px;" @click="loginHadle(true)"> Log in</el-link>  -->
    <svg-icon name="user-login" style="height: 24px; width: 24px; margin-right: 8px; color: #e1ff01"/>
    <span class="text-[#e1ff01]"> Log in</span>
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
.user{
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.10);
}
</style>
