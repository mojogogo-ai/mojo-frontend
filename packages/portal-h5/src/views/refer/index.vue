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
          {{ user.referalCode }}
          <div class="refer-code-icon">
            <svg-icon
              name="copy"
              @click="copyReferralCode(false)"
            />
          </div>
        </div>
        <van-button
          type="primary"
          size="large"
          @click="copyReferralCode(true)"
        >
          Invite
        </van-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import SocialMedia from '@/assets/images/refer/social-media.svg';
import useUserStore from '@/store/modules/user.js';
import { useClipboard } from '@vueuse/core';
import { t } from '@gptx/base/i18n/index.js';
import { showToast } from 'vant';

const user = useUserStore();

const copyReferralCode = (isWithLink) => {
  console.log('copyReferralCode', isWithLink);
  let copyText = user.referalCode;
  if (isWithLink) {
    const { origin, pathname } = window.location;
    copyText = `${origin}${pathname}#/home?referral_code=${user.referalCode}`;
  }
  const { copy, copied } = useClipboard({ copyText, legacy: true });
  copy(copyText);
  if (copied) {
    showToast(t('bots.bb'));
  } else {
    showToast(t('chat.copy2'));
  }
};
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
