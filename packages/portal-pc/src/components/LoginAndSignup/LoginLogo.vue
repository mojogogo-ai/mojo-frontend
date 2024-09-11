<template>
  <div class="login-logo">
    <a
      class="login-logo__link"
    >
      <svg-icon
        class="mr-4"
        name="logo"
      />
      {{ $t('common.productName') }}
    </a>
    <div v-if="title" class="my-8">
      {{ title }}
    </div>
    <div v-else class="my-8">
      {{ isLoginForm? 'Login' :'Sign up' }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  isLoginForm: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
});
</script>
<style lang="scss" scoped>
.login-logo {
  position: relative;
  background: transparent !important;
  text-align: center;
  overflow: hidden;
  color: #000;

  a {
    font-family: "Druk Wide Bold", monospace;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 4px 0 0;
    font-size: 30px;
    font-weight: 700;
    color: #000;
  }
  > div{
    font-family: Inter;
    font-size: 26px;
    font-weight: 600;
    line-height: 31.47px;
    text-align: center;

  }
}
</style>
