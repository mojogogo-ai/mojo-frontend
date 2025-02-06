<template>
  <div class="login-item-menu">
    <el-link type="primary" @click="loginORsignup(true)">{{$t("menu.button.login")}}</el-link>
    <div class="line"></div>
    <el-link type="primary" @click="loginORsignup(false)">{{$t("menu.button.singUp")}}</el-link>
  </div>
</template>

<script setup>
import useLoginStore from '@/store/modules/login.js';
const useLogin = useLoginStore();
const loginORsignup = (bol)=>{
  if(bol){
    useLogin.setLoginDialogVisible(true, 'login');
  }else{
    useLogin.setLoginDialogVisible(true, 'signup');
  }
}
</script>

<style lang="scss" scoped>
.login-item-menu{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  .line{
    height: 30px;
    width: 1px;
    background: rgba(224, 255, 49, 0.20);
  }
  :deep(.el-link){
    cursor: pointer;
    color: rgba(255, 255, 255, 0.70);
    text-align: center;
    font-feature-settings: 'dlig' on;
    font-family: Inter;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 23px; /* 127.778% */
    &:hover{
      color: #E0FF31;
    }
  }
}
</style>
