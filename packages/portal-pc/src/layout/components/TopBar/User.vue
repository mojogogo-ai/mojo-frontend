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
            :size="38"
            :src="user.avatar"
          />

          <div class="flex flex-col">
            <div>
              <div class="user-code">@{{ user.nickName }}</div>
            </div>
            <div class="flex items-center">
              <div
                style="border: 1px solid rgba(224, 255, 49, 0.5)"
                class="rounded-full px-3 py-1 mx-2 text-xs text-[#e1ff01]"
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
        <div>
          <div class="flex items-center px-5 avatar-wrapper2">
            <el-avatar
              :size="70"
              :src="user.avatar"
            />

            <div class="flex flex-col">
              <!-- <div>
                <div class="user-code">{{ user.uid }}</div>
              </div> -->
              <div class="flex items-center">
                <div
                  class="nick-name"
                  :title="`@${user.nickName}`"
                >
                  @{{ user.nickName }}
                </div>
              </div>
            </div>
          </div>
          <el-divider style="border-color: rgba(0, 0, 0, 0.3)" />
          <div>
            <div
              v-for="(item, index) in infoList"
              :key="index"
              class="mt-2 flex cursor-pointer items-center pl-5 text-[16px] font-semibold text-[var(--el-text-color-primary)] hover:opacity-75"
              @click="toPage(item)"
            >
              <svg-icon
                :name="item.icon"
                class="mr-2 text-[24px]"
              />
              <span>
                {{ item.text }}
              </span>
              <div
                v-if="item.id === 2"
                class="ml-4 h-7 rounded-full bg-black px-3 text-xs leading-7 text-[var(--el-text-color-regular)]"
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

  .nick-name {
    margin: 0 10px;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgba(255, 255, 255, 0.7);
  }
  .user-code {
    max-width: 200px;
    margin: 0 10px 6px 10px;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    overflow: hidden;
    color: var(--el-color-primary);
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
    margin: 0 0 6px 10px;
    color: var(--el-text-color-secondary);
    font-size: 15px;
  }
  .user-code {
    max-width: 216px;
    margin: 0 0 0 10px;
    font-size: 19px;
    font-weight: 600;
    color: var(--el-text-color-primary);
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
