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
        Earn 50 points for each successful referral! You will both get 50 points when your friend successfully create an
        account with us.
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

const user = useUserStore();

const copyReferralCode = (isWithLink) => {
  console.log('copyReferralCode', isWithLink)
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
</script>
<style scoped lang="scss">
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
