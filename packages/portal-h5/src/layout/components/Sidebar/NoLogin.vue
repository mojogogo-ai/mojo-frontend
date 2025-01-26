<template>
  <div class="login-item-menu">
    <el-link type="primary" @click="loginORsignup(true)"> Log in</el-link>
    <svg xmlns="http://www.w3.org/2000/svg" width="1" height="30" viewBox="0 0 1 30" fill="none">
      <path d="M0.5 29.5V0.5" stroke="#E0FF31" stroke-opacity="0.2" />
    </svg>
    <el-link type="primary" @click="loginORsignup(false)">Sign up </el-link>
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
  //margin: 20px 0;
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
