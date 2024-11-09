<template>
  <div class="avatar-container">
    <el-popover
      popper-class="user-popover"
      placement="bottom-end"
      :offset="15"
      :width="400"
      trigger="hover"
    >
      <template #reference>
        <div class="avatar-wrapper">
          <el-avatar
            :size="42"
            :src="user.avatar"
          />

          <div class="flex flex-col">
            <div>
              <div class="user-code">{{ user.nickName }}</div>
            </div>
            <div class="flex items-center">
              <div>
                <div class="nick-name-out">@{{ user.nickName }}</div>
              </div>
              <div
                style="border: 2px solid rgba(224, 255, 49, 0.5)"
                class="rounded-full
                flex items-center
                 px-[12px]
                 py-[1px]
                 font-[500]
                  mx-[6px]
                   text-[11px]
                   text-[#e1ff01]"
              >
                <span>{{ user.points }} pts</span>
                <!-- <CountTo
                  suffix="pts"
                  :decimals="0"
                  :end-val="user.points"
                /> -->
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #default>
        <div class="p-[12px]">
          <div class="flex items-center flex-wrap p-[4px] avatar-wrapper2">
            <el-avatar
              :size="80"
              :src="user.avatar"
            />

            <div class="flex flex-col ml-[20px] ">
              <div class="w-[194px] mb-[6px]">
                <div class="user-code">{{ user.nickName }}</div>
              </div>
              <div class="flex items-center">
                <div
                  class="nick-name-inside"
                  :title="`@${user.nickName}`"
                >
                  @{{ user.nickName }}
                </div>
              </div>
            </div>
          </div>
          <el-divider style="border-color: rgba(0, 0, 0, 0.3);" class="my-[18px]" />
          <div>
            <div
              v-for="(item, index) in infoList"
              :key="index"
              class="mb-[12px] flex cursor-pointer items-center pl-[4px] text-[16px] font-semibold text-[var(--el-text-color-primary)] hover:opacity-75"
              @click="toPage(item)"
            >
              <svg-icon
                :name="item.icon"
                class="mr-[8px] text-[24px]"
              />
              <span class="leading-[23px] text-[16px]">
                {{ item.text }}
              </span>
              <div
                v-if="item.id === 2"
                @click.stop="goPointsHistory"
                class="ml-[40px] h-[29px] rounded-full bg-black px-[12px] text-[15px] leading-[29px] text-[var(--el-text-color-regular)] font-[600] "
              >
                {{ user.points }} pts
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { getAuth, signOut } from 'firebase/auth';
import useUserStore from '@/store/modules/user.js';
const router = useRouter();
const user = useUserStore();

import useLoginStore from '@/store/modules/login';
import { useRouter } from 'vue-router';
const useLogin = useLoginStore();

const infoList = ref([
  {
    id: 1,
    icon: 'profile',
    text: 'View Profile',
    path: '/user'
  },
  {
    id: 2,
    icon: 'point',
    text: 'MojoGogo Points',
    path: '/tasks'
  },
  {
    id: 3,
    icon: 'refer',
    text: 'Refer friends',
    path: '/refer'
  },
  {
    id: 4,
    icon: 'logout',
    text: 'Log out',
    path: ''
  }
]);

// skip page
const toPage = (item) => {
  console.log(item, 'item999');
  if (item.id === 4) {
    logoutHandle();
  } else {
    router.push({ path: item.path });
  }
};

const goPointsHistory = () => {
  router.push({ path: '/pointsHistory' });
};

const logoutHandle = async () => {
  try {
    const action = await ElMessageBox.confirm(t('user.c'), '', {
      confirmButtonText: t('user.b'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
      customClass: 'customize-message-box'
    });
    if (action === 'confirm') {
      const auth = getAuth();
      await signOut(auth);
      await user.logOut();
      useLogin.toLoginOut();
      router.push({ path: '/home' });
    }
  } catch (e) {
    console.log(e);
  }
};
</script>

<style lang="scss" scoped>
.avatar-wrapper {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 10px;
  border-radius: 8px;
  cursor: pointer;
 .nick-name-out{
   margin-left: 12px;
   color: rgba(255, 255, 255, 0.70);
   font-feature-settings: 'dlig' on;
   font-family: Inter;
   font-size: 13px;
   font-style: normal;
   font-weight: 500;
   //line-height: 19px; /* 146.154% */
 }

  .user-code {
    max-width: 200px;
    //margin: 0 10px 6px 10px;
    margin-left: 12px;
    font-size: 15px;
    font-style: normal;
    line-height: 23px;
    font-weight: 600;
    overflow: hidden;
    color: var(--Style, #E1FF01);
    font-feature-settings: 'dlig' on;
    font-family: Inter;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  i {
    cursor: pointer;
    font-size: 14px;
  }
}
.avatar-wrapper2 {
  align-items: center;
  border-radius: 8px;


  .nick-name {
    margin: 0 0 6px 0;
    color: var(--el-text-color-secondary);
    font-size: 15px;
  }
  .nick-name-inside {
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.70);
    font-feature-settings: 'dlig' on;
    font-family: Inter;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
  }
  .user-code {
    max-width: 194px;
    //margin: 0 0 0 10px;
    font-size: 19px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    overflow: hidden;
    font-feature-settings: 'dlig' on;
    font-family: Inter;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  i {
    cursor: pointer;
    font-size: 14px;
  }
}
</style>

<style lang="scss">
.user-popover {
  width: 360px !important;
  border: none !important;
  border-radius: 20px !important;
  box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.3) !important;
}
</style>
