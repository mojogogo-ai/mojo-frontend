<template>
  <div class="app-page">
    <page-header :title="t('menu.d')" />
    <div class="app-page-content">
      <div class="user-center">
        <div class="user-center-title">{{ t('user.b1') }}</div>
        <van-list @click="onEditClick">
          <van-cell>
            <div class="flex items-center text-base">
              <div class="mr-3">{{ t('user.d') }}</div>
              <div class="flex justify-end flex-1 mr-3">
                <van-image
                  width="32px"
                  height="32px"
                  round
                  :src="user.avatar"
                />
              </div>
              <van-icon
                name="arrow"
                color="#7a7a7a"
              />
            </div>
          </van-cell>
          <van-cell>
            <div class="flex items-center w-full text-base">
              <div class="mr-3">{{ t('user.nickName') }}</div>
              <div class="flex-1 mr-3 overflow-hidden text-right">
                <div class="w-full line-clamp-1">@{{ user.nickName }}</div>
              </div>
              <van-icon
                name="arrow"
                color="#7a7a7a"
              />
            </div>
          </van-cell>
          <van-cell>
            <div class="flex items-center w-full text-base">
              <div class="mr-3">{{ t('user.account') }}</div>
              <div class="flex-1 mr-3 overflow-hidden text-right">
                <div class="w-full line-clamp-1">{{ user.email || user.phoneNumber }}</div>
              </div>
              <van-icon
                name="arrow"
                color="#7a7a7a"
              />
            </div>
          </van-cell>
        </van-list>
        <div
          class="user-center-title"
        >
          <div>{{ t('user.usualSetting') }}</div>
          <div class="text-xs">{{ t('user.performanceLanguage') }}</div>
        </div>
        <van-list>
          <van-cell>
            <selector
              v-model="curLang"
              :columns="langList"
              :columns-field-names="{ text: 'lable' }"
              @update:model-value="changeLangCommand"
            >
              <div class="flex items-center w-full text-base">
                <div class="mr-3">{{ t('user.preferredLanguage') }}</div>
                <div class="flex-1 mr-3 overflow-hidden text-right">
                  <div class="w-full line-clamp-1">
                    <div class="text-base">{{ language }}</div>
                  </div>
                </div>
                <van-icon
                  name="arrow"
                  color="#7a7a7a"
                />
              </div>
            </selector>
          </van-cell>
        </van-list>
        <div class="option-ctrl">
          <van-button
            size="large"
            type="primary"
            linear
            round
            @click="logout"
          >
            {{ t('user.b') }}
          </van-button>
        </div>
      </div>
    </div>
    <base-info ref="baseInfoRef" />
  </div>
</template>
<script setup>
import { t } from '@gptx/base/i18n';
import { getCurLang, supportLang } from '@gptx/base';
import { getAuth, signOut } from 'firebase/auth';
import useUserStore from '@/store/modules/user.js';
import BaseInfo from './components/BaseInfo';

const router = useRouter();
const user = useUserStore();
const curLang = ref(getCurLang());
const langList = supportLang(); // 支持切换的语言
const language = computed(() => {
  return langList.find((i) => {
    return i.value === curLang.value;
  }).lable;
});
// const isCn = computed(() => {
//   return window.SITE_TYPE && window.SITE_TYPE === '2';
// });

/* ref dom */
const baseInfoRef = ref(null);

const changeLangCommand = (command) => {
  if (command === curLang) return;
  localStorage.setItem('lang', command);
  window.location.reload();
};
const logout = async () => {
  try {
    const action = await showConfirmDialog({
      title: t('user.c'),
      confirmButtonText: t('user.b'),
      cancelButtonText: t('common.cancel'),
      showConfirmButton: true
    });
    if (action === 'confirm') {
      if (window.SITE_TYPE === '1') {
        // firebase
        const auth = getAuth();
        await signOut(auth);
      } else {
        //sms
        //
      }
      await user.logOut();
      router.push({ path: '/login' });
    }
  } catch (e) {
    console.log(e);
  }
};
const onEditClick = () => {
  baseInfoRef.value.open();
};
onMounted(() => {
  useUserStore().updateSysInfo();
});
</script>

<style lang="scss" scoped>
.app-page-content {
  padding: 12px;
}

.user-center {
  width: 100%;
}

.user-center-title {
  padding: 0 12px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #7a7a7a;

  .text-xs {
    color: #aeaeae;
  }
}

.option-ctrl {
  padding: 12px 16px 8px;
}

:deep(.van-list) {
  margin-bottom: 32px;
  border-radius: 10px;
  overflow: hidden;
}

:deep(.van-cell) {
  padding: 12px;

  &::after {
    bottom: unset;
    top: 0;
  }

  &:first-child {
    &::after {
      opacity: 0;
    }
  }

  &:active {
    background-color: rgba(#000, 0.06);
  }

  .text-base {
    line-height: 2em;
  }

  .van-cell__value {
    --van-cell-value-color: #36353a;
  }
}

</style>
