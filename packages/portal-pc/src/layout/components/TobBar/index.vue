<template>
  <el-header class="flex justify-center h-[80px]">
    <div class="flex items-center justify-between w-full min-w-[800px] max-w-[1200px]">
      <div class="flex items-center">
        <logo
          class="flex-none mr-12"
          :collapse="false"
        />
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          :ellipsis="false"
          :router="true"
          @select="handleSelect"
        >
          <el-menu-item index="/homepage">Home</el-menu-item>
          <el-sub-menu index="">
            <template #title>Explore</template>
            <el-menu-item index="/assistant">{{ $t('menu.ass') }}</el-menu-item>
          </el-sub-menu>

        <!-- <el-menu-item index="/application">{{ $t('menu.c') }}</el-menu-item>
        <el-menu-item index="/base">{{ $t('menu.b') }}</el-menu-item> -->
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

  <LoginDialog ref="loginRef" />
</template>

<script setup>
import Logo from './Logo';
import User from './User';
import NoLogin from './NoLogin';
import { getToken } from '@gptx/base/utils/auth'

const loginRef = ref(null);
const isLogin = ref(false);

const activeIndex = ref('/homepage')
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
  </script>
