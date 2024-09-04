<template>
  <el-header class="flex justify-center h-[80px]">
    <div class="flex items-center justify-between w-full min-w-[800px] max-w-[1200px]">
      <div class="flex items-center">
        <logo
          class="flex-none mr-12"
        />
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          :ellipsis="false"
          :router="true"
          @select="handleSelect"
        >
          <el-menu-item style="margin-right:8px;" index="/home">Home</el-menu-item>
          <el-sub-menu index="" :popper-offset="15" popper-class="customs-sub-menu">
            <template #title>Explore</template>
            <el-menu-item style="min-width: 240px;" index="/assistant">
              <div class="flex">
                <div class="flex items-center justify-center mr-2 bg-black rounded-full w-9 h-9">
                  <svg-icon
                    style="color: rgba(225, 255, 1, 1);font-size: 24px;"
                    name="bot-store"
                  />
                </div>
                <div class="flex flex-col">
                  <div class="text-black text-xl font-bold font-['Inter'] mb-3">{{ $t('menu.ass') }}</div>
                  <span class="text-sm font-medium text-black ">Offer daily clothing inspirations for you every day.</span>
                </div>
              </div>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>

      <div class="flex items-center">
        <el-button
          style="margin-right: 10px;"
          type="primary"
          round            
          @click="onCreateClick()"
        >
          + Create Bot
        </el-button>
        <user v-if="isLogin" class="flex-none" />
        <NoLogin v-else @login-signup="onCreateClick" />
      </div>
    </div>
  </el-header>

  <!-- login or sign up -->
  <LoginAndSignup ref="loginRef" />
</template>

<script setup>
import Logo from './Logo';
import User from './User';
import NoLogin from './NoLogin';
import { getToken } from '@gptx/base/utils/auth'
const route = useRoute();

const loginRef = ref(null);
const isLogin = ref(false);

const activeIndex = ref('/home')
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
onBeforeMount(async () => {
  let curToken = await getToken() 
  if (curToken) { 
    const storageUserInfo = JSON.parse(localStorage.getItem('userInfo'))
    const isAnonymous = storageUserInfo&&storageUserInfo.data.isAnonymous
    if (!isAnonymous) {//
      // isLogin.value = false
      isLogin.value = true
    }
  }
});
const onCreateClick = (isLoginForm = true) => {
  // to  login
  loginRef.value.open(isLoginForm);
};

watch(() => route.path,(newPath, oldPath) => { 
  let routeList =['/home','/assistant']
  console.log(newPath, oldPath,'oldPath') 
  
  if (routeList.indexOf(newPath)===-1) {
    activeIndex.value = ''
  } else {
    activeIndex.value = newPath
  }

},{ immediate: true });
  </script>

<style lang="scss">
.customs-sub-menu{
  border-radius: 20px;
  padding: 15px;
  &:hover {
      background-color: none !important;
    }
  .el-menu{
    box-shadow: none !important;
  }
  .el-menu-item{
    height: 70px !important;
    line-height: none !important;
  }
}

.el-popper .el-menu--horizontal .el-menu .el-menu-item:not(.is-disabled):focus, .el-popper .el-menu--horizontal .el-menu .el-menu-item:not(.is-disabled):hover {
  background-color: transparent !important;
  opacity: 0.75;
}
</style>
