<template>
  <div class="app-page">
    <page-header class="shrink-0" />
    <div class="flex flex-col items-center">
      <div class="mb-8 mt-16 shrink-0">
<!--        <van-image-->
<!--          class="h-[320px] w-[320px]"-->
<!--          fit="contain"-->
<!--          :src="SocialMedia"-->
<!--        />-->
        <svg-icon
          name="social-media"
          class="icon-img  h-[320px] w-[320px]"
        />
      </div>
      <div class="homepage-title mb-6">Refer Friends</div>
      <div class="homepage-subtitle">
        Earn 30 points for each successful referral! You and your friend will both receive 30 points when they register and successfully launch a meme coin.
      </div>
      <div class="invites-info-wrap mx-auto mt-[36px] p-6">
        <div class="invites-info">
          <div class="invites-info-part">
            <div>Total invites</div>
            <div>{{ user.invite_nums }}</div>
          </div>
          <div class="invites-info-dl" />
          <div class="invites-info-part">
            <div>Total registered</div>
            <div>{{ user.invite_nums }}</div>
          </div>
        </div>
      </div>
      <div class="mb-6 mt-7 flex flex-col items-center justify-center">
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
    showToast("Copied successfully");
  } else {
    showToast("Copy failed");
  }
};
</script>
<style scoped lang="scss">
.invites-info-wrap {
  display: flex;
  //width: 280px;
  padding: 17px;
  justify-content: center;
  align-items: center;
  gap: 22px;
  border-radius: 11.374px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(35.543304443359375px);
}
.invites-info {
  gap: 22px;
  //width: 246px;
  display: flex;
  height: 100%;
  align-items: center;
  .invites-info-part {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
    width: 106px;
    div:first-child {
      color: var(--Style, #E1FF01);
      text-align: center;
      font-feature-settings: 'dlig' on;
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 18.483px; /* 132.018% */
    }
    div:last-child {
      color: #FFF;
      text-align: center;
      font-feature-settings: 'dlig' on;
      font-family: Inter;
      font-size: 24px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px; /* 100% */
    }
  }
  .invites-info-dl {
    width: 2px;
    height: 73px;
    background: rgba(225, 255, 1, 0.5);
  }
}
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
  margin: 0 20px 24px;
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
.icon-img{
  height: 320px !important;
  width: 320px !important;
}
</style>
