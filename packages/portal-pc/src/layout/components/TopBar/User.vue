<template>
  <div
    class="avatar-container"
  >
    <el-popover popper-class="user-popover" :offset="15" placement="bottom-end" :width="400" trigger="hover">
      <template #reference>
        <div
          class="avatar-wrapper"
        >
          <el-avatar
            :size="38"
            :src="user.avatar"
          />

          <div class="flex flex-col">
            <div>
              <div
                class="user-code"
              >
                user2024090411548745
              </div>
            </div>
            <div class="flex items-center">
              <div
                class="nick-name"         
                :title="`@${user.nickName}`"
              >
                @{{ user.nickName }}
              </div>
              <div style="border:1px solid rgba(224, 255, 49, 0.5)" class="px-3 py-1 text-[#e1ff01] rounded-full text-xs">
                <CountTo
                  suffix="pts"
                  :decimals="0"
                  :end-val="25500"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #default>
        <div>
          <div
            class="flex items-center p-5 avatar-wrapper2"
          >
            <el-avatar
              :size="70"
              :src="user.avatar"
            />

            <div class="flex flex-col">
              <div>
                <div
                  class="user-code"
                >
                  user2024090411548745
                </div>
              </div>
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
          <el-divider style="border-color: rgba(0, 0, 0, 0.3);" />
          <div>
            <div 
              v-for="(item, index) in infoList" 
              :key="index" 
              class="text-[#000] text-[16px] font-semibold flex items-center mt-2 pl-5 hover:opacity-75 cursor-pointer"
              @click="toPage(item)"
            >
              <svg-icon
                :name="item.icon"
                class="mr-2 text-[24px] "
              />
              <span>
                {{ item.text }}
              </span>
              <div 
                v-if="item.id===2"
                class="px-3 text-[#fff] bg-black rounded-full text-xs ml-4 h-7 leading-7"
              >
                {{ 25500 }} pts
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

import useLoginStore from '@/store/modules/login'
const useLogin = useLoginStore();

const infoList =ref([
  {
    id:1,
    icon:'profile',
    text: 'View Profile',
    path: '/user'
  },{
    id:2,
    icon:'point',
    text: 'MojoGogo Points',
    path: '/tasks'
  },{
    id:3,
    icon:'refer',
    text: 'Refer friends',
    path: '/refer'
  },
  {
    id:4,
    icon:'logout',
    text: 'Log out',
    path: ''
  }
])

onBeforeMount(() => {
  useUserStore().updateSysInfo();
});


// skip page
const toPage = (item) => {
  console.log(item,'item999')
   if(item.id===4){
    logoutHandle()
  } else {
    router.push({ path: item.path })
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
      if (window.SITE_TYPE === '1') { // firebase
        const auth = getAuth();
        await signOut(auth);
      }
      await user.logOut();
      useLogin.toLoginOut()
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

    .user-avatar {
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }

    .nick-name {
      margin: 0 10px;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: rgba(255, 255, 255, 0.70);

    }
    .user-code {
      // width: 144px;
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
    height: 70px;
    border-radius: 8px;

    .user-avatar {
      cursor: pointer;
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }

    .nick-name {
      margin: 0 0 6px 10px;
      color: rgba(0, 0, 0, 0.70);
      font-family: Inter;
      font-size: 15px;
      font-style: normal;
      font-weight: 500;

    }
    .user-code {
      margin: 0 0 0 10px;
      font-size: 19px;
      font-style: normal;
      font-weight: 600;
      overflow: hidden;
      color: #1C1C21;
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
.user-popover{
  width: 360px !important;
  border: none !important;
  border-radius: 20px !important;
  box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.30) !important;
} 
</style>
