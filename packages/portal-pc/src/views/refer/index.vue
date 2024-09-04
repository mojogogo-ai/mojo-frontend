<template>
  <div class="app-page">
    <div class="flex flex-col items-center">
      <div class="mt-[120px] mb-4 homepage-title"> Refer Friends</div>
      <div class="homepage-subtitle">
        Earn 50 points for each successful referral! You will both get 50 points when your friend successfully create an account with us.
      </div>
      <div class="flex flex-col items-center justify-center mt-8 mb-24">
        <div class="pb-4 homepage-code"> Referral code:</div>
        <div class="mb-10 px-4 text-[32px]">23102455 </div>
        <el-button class="w-[490px]" type="primary"> Invite </el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
</script>
<style scoped lang="scss">
.homepage-title {
  color:  #E1FF01;
  font-family: Inter;
  font-size: 36px;
  font-style: normal;
  font-weight: 500;
}

.homepage-subtitle {
  color: rgba(255, 255, 255, 0.70);
  width: 742px;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  text-align: center;
}
.homepage-code{
  color:  #E1FF01;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  text-align: center;
}
</style>
