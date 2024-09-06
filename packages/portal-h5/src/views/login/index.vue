<template>
  <component
    :is="loginComponent"
  />
</template>

<script setup>
import login from "./login.vue";

const loginComponent = computed(() => {
  // 1:firebase,2:sms
  return  login
});

</script>
