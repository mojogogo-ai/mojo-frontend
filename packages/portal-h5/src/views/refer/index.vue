<template>
  <div class="app-page">
    <page-header class="shrink-0" />
    <div class="flex flex-col items-center">
      <div class="mb-8 mt-16 shrink-0">
        <van-image
          class="h-[320px] w-[320px]"
          fit="contain"
          :src="SocialMedia"
        />
      </div>
      <div class="homepage-title mb-6">Refer Friends</div>
      <div class="homepage-subtitle">
        Earn 50 points for each successful referral! You will both get 50 points when your friend successfully create an
        account with us.
      </div>
      <div class="mb-24 mt-8 flex w-full flex-col items-center justify-center px-8">
        <div class="homepage-code pb-4">Referral code:</div>
        <div class="refer-code">
          23102455
          <div class="refer-code-icon">
            <el-icon>
              <CopyDocument />
            </el-icon>
          </div>
        </div>
        <van-button
          type="primary"
          size="large"
        >
          Invite
        </van-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import SocialMedia from '@/assets/images/refer/social-media.svg';
</script>
<style scoped lang="scss">
.homepage-title {
  color: var(--van-blue);
  font-size: 24px;
}

.homepage-subtitle {
  padding: 0 16px;
  color: var(--h5-text-color-placeholder);
  font-size: 16px;
  text-align: center;
}

.homepage-code {
  color: var(--van-blue);
  font-size: 16px;
  text-align: center;
}

.refer-code {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  margin: 0 20px 50px;
  padding: 8px 10px 8px 24px;
  font-size: 18px;
  color: var(--h5-text-color-secondary);
  background-color: var(--van-white);
  border-radius: 44px;

  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 8px;
    margin-left: 60px;
    color: var(--van-blue);
    font-size: 16px;
    background-color: var(--van-black);
    border-radius: 50%;
  }
}
</style>
