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
              <div class="mr-3 flex flex-1 justify-end">
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
            <div class="flex w-full items-center text-base">
              <div class="mr-3">{{ t('user.nickName') }}</div>
              <div class="mr-3 flex-1 overflow-hidden text-right">
                <div class="line-clamp-1 w-full">@{{ user.nickName }}</div>
              </div>
              <van-icon
                name="arrow"
                color="#7a7a7a"
              />
            </div>
          </van-cell>
          <van-cell>
            <div class="flex w-full items-center text-base">
              <div class="mr-3">{{ t('user.account') }}</div>
              <div class="mr-3 flex-1 overflow-hidden text-right">
                <div class="line-clamp-1 w-full">{{ user.email || user.phoneNumber }}</div>
              </div>
              <van-icon
                name="arrow"
                color="#7a7a7a"
              />
            </div>
          </van-cell>
        </van-list>
        <!--
        <div class="user-center-title">{{ t('user.b1') }}</div>
        -->
        <van-list>
          <van-cell @click="toInnerPage('/tasks')">
            <div class="flex items-center text-base">
              <div class="mr-3">MojoGogo Point</div>
              <div class="mr-3 flex flex-1 justify-end">
                <van-tag size="large">25,500 pts</van-tag>
              </div>
              <van-icon
                name="arrow"
                color="#7a7a7a"
              />
            </div>
          </van-cell>
          <van-cell @click="toInnerPage('/refer')">
            <div class="flex items-center text-base">
              <div class="mr-3">Refer friends</div>
              <div class="mr-3 flex flex-1 justify-end" />
              <van-icon
                name="arrow"
                color="#7a7a7a"
              />
            </div>
          </van-cell>
        </van-list>
        <!--
        <div class="user-center-title">
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
              <div class="flex w-full items-center text-base">
                <div class="mr-3">{{ t('user.preferredLanguage') }}</div>
                <div class="mr-3 flex-1 overflow-hidden text-right">
                  <div class="line-clamp-1 w-full">
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
        -->
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
import useLoginStore from '@/store/modules/login';
import BaseInfo from './components/BaseInfo';

const router = useRouter();
const user = useUserStore();
const useLogin = useLoginStore();

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
      }
      await user.logOut();
      useLogin.toLoginOut();
      router.push({ path: '/home' });
    }
  } catch (e) {
    console.log(e);
  }
};
const toInnerPage = (path) => {
  router.push({ path });
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
  color: var(--h5-text-color-regular);

  .text-xs {
    color: var(--h5-text-color-placeholder);
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

  .text-base {
    line-height: 2em;
  }
}
</style>
