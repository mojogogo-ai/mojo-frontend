<template>
  <div class="app-page">
    <div class="app-page-top">
      <div class="text-lg font-black">
        {{ t('user.a') }}
      </div>
    </div>
    <div class="app-page-content">
      <div class="user-center">
        <el-divider border-style="hidden" />
        <el-card shadow="never">
          <div class="text-base">
            <div class="mb-4">{{ t('user.b1') }}</div>
            <div class="px-8">
              <div class="flex items-center mb-2">
                <div class="mr-3">{{ t('user.d') }}:</div>
                <div class="w-fit">
                  <el-avatar
                    :size="60"
                    :src="user.avatar"
                  />
                </div>
              </div>
              <div class="flex mb-2">
                <div class="mr-3">{{ t('user.nickName') }}:</div>
                <div class="w-fit">@{{ user.nickName }}</div>
              </div>
              <div class="flex mb-8">
                <div class="mr-3">{{ t('user.account') }}:</div>
                <div class="w-fit">{{ user.email || user.phoneNumber }}</div>
              </div>
              <div class="flex mb-4">
                <el-button @click="onEditClick">{{ t('user.edit') }}</el-button>
                <el-button
                  type="primary"
                  linear
                  @click="logout"
                >
                  {{ t('user.b') }}
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
        <!-- <el-divider border-style="hidden" />
        <el-card
          v-model="language"
          shadow="never"
        >
          <div class="text-base">
            <div class="mb-4">{{ t('user.usualSetting') }}</div>
            <div class="px-8">
              <div class="mb-2">{{ t('user.performanceLanguage') }}</div>
              <div class="mb-4 w-fit">
                <el-select
                  v-model="language"
                  style="width: 338px"
                  @change="changeLangCommand"
                >
                  <el-option
                    v-for="{ value, lable } in langList"
                    :value="value"
                    :label="lable"
                  />
                </el-select>
              </div>
            </div>
          </div>
        </el-card> -->
      </div>
    </div>
    <base-info ref="baseInfoRef" />
  </div>
</template>
<script setup>
import { t } from '@gptx/base/i18n';
// import { getCurLang, supportLang } from '@gptx/base';
import { ElMessageBox } from 'element-plus';
import { getAuth, signOut } from 'firebase/auth';
import useUserStore from '@/store/modules/user.js';
import BaseInfo from './components/BaseInfo';

const router = useRouter();
const user = useUserStore();
// const curLang = getCurLang();
// const langList = supportLang(); // 支持切换的语言
// const language = computed(() => {
//   return langList.find((i) => {
//     return i.value === curLang;
//   }).value;
// });
// const isCn = computed(() => {
//   return  window.SITE_TYPE && window.SITE_TYPE === '2'
// });

/* ref dom */
const baseInfoRef = ref(null);

// const changeLangCommand = (command) => {
//   localStorage.setItem('lang', command);
//   window.location.reload();
// };
const logout = async () => {
  try {
    const action = await ElMessageBox.confirm(t('user.c'), '', {
      confirmButtonText: t('user.b'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
      customClass: 'customize-message-box'
    });
    if (action === 'confirm') {
      if (window.SITE_TYPE === '1') { // firebase
        const auth = getAuth();
        await signOut(auth);
      } else { //sms
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
</script>

<style lang="scss" scoped>
.app-page-content {
  padding: 16px;
}

.user-center {
  width: 800px;
  margin: 0 auto;
}
</style>
