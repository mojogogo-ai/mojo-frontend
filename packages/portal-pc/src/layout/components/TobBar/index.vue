<template>
  <el-header>
    <div class="flex items-center justify-center w-full">
      <logo
        class="flex-none"
        :collapse="false"
      />
      <el-menu
        class="mx-20"
        :default-active="activeIndex"
        mode="horizontal"
        :ellipsis="false"
        :router="true"
        @select="handleSelect"
      >
        <el-menu-item index="/chat">Home</el-menu-item>
        <el-sub-menu index="">
          <template #title>Explore</template>
          <el-menu-item index="/assistant">{{ $t('menu.ass') }}</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/application">{{ $t('menu.c') }}</el-menu-item>
        <el-menu-item index="/base">{{ $t('menu.b') }}</el-menu-item>
        <!-- <el-menu-item index="/assistant">{{ $t('menu.ass') }}</el-menu-item> -->
      </el-menu>
      <user class="flex-none" />
    </div>
  </el-header>
</template>
  
<script setup>
import Logo from './Logo';
import User from './User';


const activeIndex = ref('/chat')
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
  
  </script>
  