<template>
  <component
    :is="loginComponent"
  />
</template>

<script setup>
import login from "./login.vue";
import loginCn from "./loginCn.vue";

const loginComponent = computed(() => {
  // 1:firebase,2:sms
  return window.SITE_TYPE === '1'? login : loginCn;
});

</script>
