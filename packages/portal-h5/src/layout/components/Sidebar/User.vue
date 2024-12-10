<template>
  <div>
    <van-collapse v-model="activeNames">
      <van-collapse-item name="1">
        <template #title>
          <div
            class="avatar-container"
          >
            <div
              class="avatar-wrapper"
              :class="{ 'is-active': isActive() }"
            >
              <van-image
                width="48"
                height="48"
                round
                :src="user.avatar"
                @click.stop="goUserCenter"
              />
              <div>
                <div
                  class="nick-name"
                  :title="`@${user.nickName}`"
                >
                  {{ user.nickName || '-' }}
                </div>
                <div class="nick-name-bottom">
                  <div class="n-n-b-u">
                    @{{ user.nickName }}
                  </div>
                  <div class="n-n-b-d" @click.stop="goPage(4)">
                    {{ user.points + 'pts' || '-' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="v-c-i-list">
          <div class="v-c-i-l-item" @click.stop="goPage(1)">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
              <path d="M12.3218 17L13.8818 13.58L17.3218 12L13.8818 10.44L12.3218 7L10.7518 10.44L7.32178 12L10.7518 13.58L12.3218 17ZM8.49178 2.76C9.70686 2.25995 11.0078 2.00179 12.3218 2C13.6318 2 14.9318 2.26 16.1518 2.76C17.3618 3.26 18.4618 4 19.3918 4.93C20.3218 5.86 21.0618 6.96 21.5618 8.17C22.0618 9.39 22.3218 10.69 22.3218 12C22.3218 14.65 21.2718 17.2 19.3918 19.07C18.4644 20 17.3624 20.7376 16.1491 21.2404C14.9358 21.7432 13.6351 22.0014 12.3218 22C11.0078 21.9982 9.70686 21.7401 8.49178 21.24C7.27985 20.7363 6.17892 19.9989 5.25178 19.07C4.3218 18.1426 3.58422 17.0406 3.08139 15.8273C2.57857 14.614 2.32043 13.3134 2.32178 12C2.32178 9.35 3.37178 6.8 5.25178 4.93C6.18178 4 7.28178 3.26 8.49178 2.76ZM6.66178 17.66C8.16178 19.16 10.2018 20 12.3218 20C14.4418 20 16.4818 19.16 17.9818 17.66C19.4818 16.16 20.3218 14.12 20.3218 12C20.3218 9.88 19.4818 7.84 17.9818 6.34C17.2383 5.59733 16.3557 5.00841 15.3846 4.60691C14.4134 4.2054 13.3727 3.99917 12.3218 4C10.2018 4 8.16178 4.84 6.66178 6.34C5.91911 7.0835 5.3302 7.96604 4.92869 8.9372C4.52719 9.90836 4.32096 10.9491 4.32178 12C4.32178 14.12 5.16178 16.16 6.66178 17.66Z" fill="white" fill-opacity="0.7" />
            </svg>
            <span>MojoGogo Points</span>
          </div>
          <div class="v-c-i-l-item" @click.stop="goPage(2)">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
              <g clip-path="url(#clip0_827_57881)">
                <path d="M8.32178 10H5.32178V7H3.32178V10H0.321777V12H3.32178V15H5.32178V12H8.32178V10Z" fill="white" fill-opacity="0.7" />
                <path d="M21.708 17.3914V18.7159H15.708H9.70801V17.3914L9.70847 17.3801C9.70929 17.3636 9.7113 17.3324 9.71599 17.2886C9.72541 17.2007 9.74542 17.0643 9.78753 16.8959C9.872 16.558 10.042 16.1039 10.383 15.6492C11.0304 14.7861 12.452 13.7159 15.708 13.7159C18.964 13.7159 20.3856 14.7861 21.033 15.6492C21.374 16.1039 21.544 16.558 21.6285 16.8959C21.6706 17.0643 21.6906 17.2007 21.7 17.2886C21.7047 17.3324 21.7067 17.3636 21.7075 17.3801L21.708 17.3914ZM17.7867 5.49364C18.0614 5.90477 18.208 6.38812 18.208 6.88257C18.208 7.54561 17.9446 8.1815 17.4758 8.65034C17.0069 9.11918 16.371 9.38257 15.708 9.38257C15.2136 9.38257 14.7302 9.23595 14.3191 8.96124C13.908 8.68654 13.5875 8.29609 13.3983 7.83928C13.2091 7.38246 13.1596 6.8798 13.256 6.39484C13.3525 5.90989 13.5906 5.46443 13.9402 5.1148C14.2899 4.76517 14.7353 4.52707 15.2203 4.43061C15.7052 4.33414 16.2079 4.38365 16.6647 4.57287C17.1215 4.76209 17.512 5.08252 17.7867 5.49364Z" stroke="white" stroke-opacity="0.7" stroke-width="2" />
              </g>
              <defs>
                <clipPath id="clip0_827_57881">
                  <rect width="24" height="24" fill="white" transform="translate(0.321777)" />
                </clipPath>
              </defs>
            </svg>
            <span>Refer friends</span>
          </div>
          <div class="v-c-i-l-item" @click.stop="goPage(3)">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
              <path d="M17.3218 7L15.9118 8.41L18.4918 11H8.32178V13H18.4918L15.9118 15.58L17.3218 17L22.3218 12M4.32178 5H12.3218V3H4.32178C3.22178 3 2.32178 3.9 2.32178 5V19C2.32178 20.1 3.22178 21 4.32178 21H12.3218V19H4.32178V5Z" fill="white" fill-opacity="0.7" />
            </svg>
            <span>Log out</span>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup>
import useUserStore from '@/store/modules/user.js';
import { t } from '@gptx/base/i18n/index.js';
import { getAuth, signOut } from 'firebase/auth';
import { showConfirmDialog } from 'vant';
import useLoginStore from '@/store/modules/login';
const useLogin = useLoginStore();

const user = useUserStore();
const router = useRouter();
const activeNames = ref([]);
onBeforeMount(() => {
  useUserStore().updateSysInfo();
});
// to user center page
const goUserCenter = () => {
  router.push({ path: '/user' });
};
// get active status
const isActive = () => {
  return router?.currentRoute?.value?.path?.includes('/user') ?? false;
};
const goPage = (index) => {
  switch (index) {
    case 1:
      router.push({ path: '/tasks' });
      break;
    case 2:
      router.push({ path: '/refer' });
      break;
    case 3:
      logout();
      break;
    case 4:
      router.push({ path: '/pointsHistory' });
      break;
    default:
      break;
  }
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
.v-c-i-list{
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 30px 20px;

  .v-c-i-l-item{
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    //border-radius: 8px;
    //background-color: var(--h5-fill-color-light);
    //backdrop-filter: blur(20px);
    span{
      color: rgba(255, 255, 255, 0.70);
      font-feature-settings: 'dlig' on;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 23px; /* 143.75% */
    }
  }

}
:deep(.van-collapse-item__title) {
  align-items: center;
  width: 100%;
  background-color: transparent!important;
  backdrop-filter: none
}
:deep(.van-collapse-item__content) {
  padding: 0;
  background-color: transparent!important;
  backdrop-filter: none
}
.avatar-container {
  .avatar-wrapper {
    display: flex;
    align-items: center;
    gap:14px;
    padding: 32px 10px;
    //border-radius: 8px;
    cursor: pointer;
    &.is-active {
      //background-color: var(--h5-fill-color-light);
    }

    .user-avatar {
      cursor: pointer;
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }

    .nick-name {
      color: var(--Style, #E1FF01);
      font-feature-settings: 'dlig' on;
      font-family: Inter;
      text-align: left;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 23px; /* 143.75% */
      max-width: 280px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .nick-name-bottom{
      display: flex;
      align-items: center;
      gap: 6px;
      .n-n-b-u{
        color: rgba(255, 255, 255, 0.70);
        font-feature-settings: 'dlig' on;
        font-family: Inter;
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: 19px; /* 146.154% */
      }
      .n-n-b-d{
        display: flex;
        padding: 1px 12px;
        justify-content: center;
        align-items: baseline;
        gap: 10px;
        border-radius: 20px;
        border: 1px solid var(--neon-green-50, rgba(224, 255, 49, 0.50));
        color: var(--Style, #E1FF01);
        font-feature-settings: 'dlig' on;
        font-family: Inter;
        font-size: 11px;
        font-style: normal;
        font-weight: 500;
        line-height: 19px; /* 172.727% */
      }
    }
    i {
      cursor: pointer;
      font-size: 14px;
    }
  }
}
</style>
