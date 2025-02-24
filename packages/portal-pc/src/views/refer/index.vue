<template>
  <div class="app-page">
    <div class="flex flex-col items-center">
      <div class="mb-8 mt-[110px] shrink-0">
        <el-image
          class="h-[320px] w-[320px]"
          fit="contain"
          :src="SocialMedia"
        />
      </div>
      <div class="homepage-title mb-6">Refer Friends</div>
      <div class="homepage-subtitle">
        Earn 30 points for each successful referral! You will both get 30 points when your friend successfully create an
        account with us.
      </div>
      <div class="invites-info-wrap mx-auto mt-[48px] p-6">
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
      <div class="mb-24 mt-8 flex flex-col items-center justify-center">
        <div class="homepage-code pb-4">Referral code:</div>
        <div class="refer-code font-[TTNormsPro]">
          {{ user.referalCode }}
          <div
            class="refer-code-icon cursor-pointer"
            @click="copyReferralCode(false)"
          >
            <el-icon>
              <CopyDocument />
            </el-icon>
          </div>
        </div>
        <el-button
          class="w-[490px]"
          type="primary"
          @click="copyReferralCode(true)"
        >
          Invite
        </el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import SocialMedia from '@/assets/images/refer/social-media.svg';
import useUserStore from '@/store/modules/user.js';
import { useClipboard } from '@vueuse/core';
import { t } from '@gptx/base/i18n/index.js';
import { ElMessage } from 'element-plus';

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
    ElMessage.success(t('bots.bb'));
  } else {
    ElMessage.error(t('chat.copy2'));
  }
};


onMounted(() => {});
</script>
<style scoped lang="scss">
.invites-info-wrap {
  display: flex;
  width: 393.886px;
  padding: 24px;
  justify-content: center;
  align-items: center;
  gap: 31px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(50px);
}
.invites-info {
  gap: 31px;
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
    width: 136px;
    div:first-child {
      color: var(--Style, #e1ff01);
      text-align: center;
      font-feature-settings: 'dlig' on;
      font-family: Inter;
      font-size: 18px;
      font-style: normal;
      font-weight: 500;
      line-height: 26px; /* 144.444% */
    }
    div:last-child {
      color: #fff;
      text-align: center;
      font-feature-settings: 'dlig' on;
      font-family: Inter;
      font-size: 32px;
      font-style: normal;
      font-weight: 400;
      line-height: 26px; /* 81.25% */
    }
  }
  .invites-info-dl {
    width: 2px;
    height: 73px;
    background: rgba(225, 255, 1, 0.5);
  }
}
.homepage-title {
  color: var(--el-color-primary);
  font-size: 36px;
}

.homepage-subtitle {
  color: var(--el-text-color-placeholder);
  width: 742px;
  font-size: 18px;
  text-align: center;
}

.homepage-code {
  color: var(--el-color-primary);
  font-size: 18px;
  text-align: center;
}

.refer-code {
  display: flex;
  align-items: center;
  margin: 0 0 50px;
  padding: 8px 10px 8px 24px;
  font-size: 24px;
  color: var(--el-text-color-secondary);
  background-color: var(--el-color-black);
  border-radius: 44px;

  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 8px;
    margin-left: 10px;
    color: var(--el-color-primary);
    font-size: 16px;
    background-color: var(--el-color-white);
    border-radius: 50%;
  }
}
</style>
