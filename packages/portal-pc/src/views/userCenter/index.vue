<template>
  <div class="app-page">
    <!--    <div class="app-page-top">-->
    <!--      <div class="text-lg font-black">-->
    <!--        {{ t('user.a') }}-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="app-page-content">
      <div class="profile-settings">
        <div class="profile-header">
          <div class="profile-header-text">My Profile</div>
          <div class="profile-content h-[103px] w-full">
            <img :src="user.avatar" alt="User Profile" class="profile-image block">
            <div class="user-info w-full">
              <div class="flex  justify-between">
                <div class="user-points">{{ user.points }} pts</div>
                <button class="edit-button" @click="editProfile">
                  Edit <i><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                    <path d="M2.69922 16.25H16.1992" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.69922 13.25V10.25L13.1992 2.75L16.1992 5.75L8.69922 13.25H5.69922Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M10.9492 5L13.9492 8" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg></i>
                </button>
              </div>
              <div class="flex gap-32">
                <div>
                  <div class="user-nickname">{{ user.nickname }}</div>
                  <div class="alias">@{{ user.nickname }}</div>
                </div>
                <div class="socials">
                  <div class="socials-text">
                    Socials
                  </div>
                  <div class="socials-icons">
                    <i
                      class="fa fa-facebook social-icon"
                      @click="openSocialLink(user.facebook_link)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <path d="M22.9492 12C22.9492 6.48 18.4692 2 12.9492 2C7.42922 2 2.94922 6.48 2.94922 12C2.94922 16.84 6.38922 20.87 10.9492 21.8V15H8.94922V12H10.9492V9.5C10.9492 7.57 12.5192 6 14.4492 6H16.9492V9H14.9492C14.3992 9 13.9492 9.45 13.9492 10V12H16.9492V15H13.9492V21.95C18.9992 21.45 22.9492 17.19 22.9492 12Z" fill="white" />
                      </svg>
                    </i>
                    <i
                      class="fa fa-twitter social-icon"
                      @click="openSocialLink(user.twitter_link)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 19" fill="none">
                        <g clip-path="url(#clip0_843_496)">
                          <mask id="mask0_843_496" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="19">
                            <path d="M0.949219 0H19.9492V19H0.949219V0Z" fill="white" />
                          </mask>
                          <g mask="url(#mask0_843_496)">
                            <path d="M15.9117 0.890625H18.8255L12.4605 8.18391L19.9492 18.1101H14.0864L9.49108 12.0911L4.23893 18.1101H1.32243L8.12986 10.3065L0.949219 0.891982H6.96136L11.1088 6.39248L15.9117 0.890625ZM14.8871 16.3621H16.5021L6.07922 2.5477H4.3475L14.8871 16.3621Z" fill="white" />
                          </g>
                        </g>
                        <defs>
                          <clipPath id="clip0_843_496">
                            <rect width="19" height="19" fill="white" transform="translate(0.949219)" />
                          </clipPath>
                        </defs>
                      </svg>
                    </i>
                    <i
                      class="fa fa-instagram social-icon"
                      @click="openSocialLink(user.instagram_link)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <path d="M8.74922 2H17.1492C20.3492 2 22.9492 4.6 22.9492 7.8V16.2C22.9492 17.7383 22.3382 19.2135 21.2504 20.3012C20.1627 21.3889 18.6875 22 17.1492 22H8.74922C5.54922 22 2.94922 19.4 2.94922 16.2V7.8C2.94922 6.26174 3.56029 4.78649 4.648 3.69878C5.73571 2.61107 7.21096 2 8.74922 2ZM8.54922 4C7.59444 4 6.67877 4.37928 6.00363 5.05442C5.3285 5.72955 4.94922 6.64522 4.94922 7.6V16.4C4.94922 18.39 6.55922 20 8.54922 20H17.3492C18.304 20 19.2197 19.6207 19.8948 18.9456C20.5699 18.2705 20.9492 17.3548 20.9492 16.4V7.6C20.9492 5.61 19.3392 4 17.3492 4H8.54922ZM18.1992 5.5C18.5307 5.5 18.8487 5.6317 19.0831 5.86612C19.3175 6.10054 19.4492 6.41848 19.4492 6.75C19.4492 7.08152 19.3175 7.39946 19.0831 7.63388C18.8487 7.8683 18.5307 8 18.1992 8C17.8677 8 17.5498 7.8683 17.3153 7.63388C17.0809 7.39946 16.9492 7.08152 16.9492 6.75C16.9492 6.41848 17.0809 6.10054 17.3153 5.86612C17.5498 5.6317 17.8677 5.5 18.1992 5.5ZM12.9492 7C14.2753 7 15.5471 7.52678 16.4848 8.46447C17.4224 9.40215 17.9492 10.6739 17.9492 12C17.9492 13.3261 17.4224 14.5979 16.4848 15.5355C15.5471 16.4732 14.2753 17 12.9492 17C11.6231 17 10.3514 16.4732 9.41368 15.5355C8.476 14.5979 7.94922 13.3261 7.94922 12C7.94922 10.6739 8.476 9.40215 9.41368 8.46447C10.3514 7.52678 11.6231 7 12.9492 7ZM12.9492 9C12.1536 9 11.3905 9.31607 10.8279 9.87868C10.2653 10.4413 9.94922 11.2044 9.94922 12C9.94922 12.7956 10.2653 13.5587 10.8279 14.1213C11.3905 14.6839 12.1536 15 12.9492 15C13.7449 15 14.5079 14.6839 15.0705 14.1213C15.6331 13.5587 15.9492 12.7956 15.9492 12C15.9492 11.2044 15.6331 10.4413 15.0705 9.87868C14.5079 9.31607 13.7449 9 12.9492 9Z" fill="white" />
                      </svg>
                    </i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="profile-divider" />
        <div class="personal-info">
          <div class="personal-info-header">
            <div class="personal-info-header-text">Personal Information</div>
            <button class="edit-button" @click="editPersonalInfo">
              Edit <i><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                <path d="M2.69922 16.25H16.1992" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.69922 13.25V10.25L13.1992 2.75L16.1992 5.75L8.69922 13.25H5.69922Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10.9492 5L13.9492 8" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg></i>
            </button>
          </div>
          <div class="personal-info-items">
            <div v-for="info in personalInfo" :key="info.label" class="info-item">
              <div>{{ info.label }}:</div>
              <div>{{ info.value }}</div>
            </div>
          </div>
        </div>
        <div class="profile-divider" />
        <div class="profile-actions">
          <div class="actions">
            <button class="delete-button" @click="deleteAccount">Delete Account</button>
            <button class="logout-button" @click="logout">Logout</button>
          </div>
        </div>

      </div>

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
    <EditPersonalInfo ref="editPersonalInfoRef" />
    <EditProfile ref="editProfileRef" />
  </div>
</template>
<script setup>
import { t } from '@gptx/base/i18n';
// import { getCurLang, supportLang } from '@gptx/base';
import { ElMessageBox } from 'element-plus';
import { getAuth, signOut } from 'firebase/auth';
import useUserStore from '@/store/modules/user.js';
import useLoginStore from '@/store/modules/login'
import BaseInfo from './components/BaseInfo';
import { useRouter } from 'vue-router';
import EditPersonalInfo from './components/EditPersonalInfo';
import EditProfile from './components/EditProfile';

const router = useRouter();
const user = useUserStore();
const useLogin = useLoginStore();
console.log(user)

// const curLang = getCurLang();
// const langList = supportLang(); // 支持切换的语言
// const language = computed(() => {
//   return langList.find((i) => {
//     return i.value === curLang;
//   }).value;
// });

/* ref dom */
const baseInfoRef = ref(null);
const editPersonalInfoRef = ref(null);
const editProfileRef = ref(null);


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
      const auth = getAuth();
      await signOut(auth);
      await user.logOut();
      useLogin.toLoginOut()
      router.push({ path: '/home' });
    }
  } catch (e) {
    console.log(e);
  }
};
const onEditClick = () => {
  baseInfoRef.value.open();
};


const personalInfo = computed(() => [
  { label: 'Username', value: user.nickname || '' },
  { label: 'Alias', value:  ('@' + user.nickname) || '' },
  { label: 'Email', value: user.email || '' },
]);


const openSocialLink = (link) => {
  window.open(link, '_blank');
};

const editProfile = () => {
  // Add logic to edit profile
  //
  editProfileRef.value.open();
  
};

const editPersonalInfo = () => {
  // Add logic to edit personal info
  editPersonalInfoRef.value.open();
};

const deleteAccount = () => {
  if (confirm('Are you sure you want to delete your account?')) {
    // Add logic to delete account
    alert('Account deleted');
  }
};


onMounted(() => {
  // Add logic to fetch user data

  console.log('User data fetched');
});

</script>

<style lang="scss" scoped>
.app-page-content {
  padding: 16px;
}
.edit-button{
  border-radius: 65px;
  border: 1px solid #FFF;
  backdrop-filter: blur(25px);
  display: flex;
  width: 76px;
  height: 31px;
  color: #FFF;
  font-feature-settings: 'dlig' on;
  font-family: "TT Norms Pro";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  justify-content: center;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  i{
    width: 18px;
    height: 18px;
  }
}
.user-center {
  width: 800px;
  margin: 0 auto;
}
.profile-settings {
  color: #ffffff;
  margin: 0 auto;
  width: 800px;
  height: 589px;
  flex-shrink: 0;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(50px);
}
.profile-divider{
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.10);
}
.profile-header {
  padding: 24px 24px 45px;
  .profile-header-text{
    color: #FFF;
    font-feature-settings: 'dlig' on;
    font-family: "TT Norms Pro";
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    margin-bottom: 30px;
  }
  .profile-content{
    display: flex;
    align-items: center;
  }
}
.profile-image {
  width: 103px;
  height: 103px;
  border-radius: 12px;
  margin-right: 47px;
}
.user-info .user-points {
  color: var(--Style, #E1FF01);
  font-feature-settings: 'dlig' on;
  font-family: Inter;
  font-size: 28px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 8px;
}
.user-info .user-nickname {
  color: var(--Style, #E1FF01);
  font-feature-settings: 'dlig' on;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 10px;
}
.user-info .alias {
  color: rgba(255, 255, 255, 0.70);
  font-feature-settings: 'dlig' on;
  font-family: Inter;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
}


.user-info .alias {
  color: #ccc;
}
.socials {
  .socials-text{
    color: #B3B3B3;
    font-feature-settings: 'dlig' on;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    margin-bottom: 10px;
  }
  .socials-icons{
    display: flex;
    gap: 10px;
    .social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      width: 25px;
      height: 25px;
      line-height: 25px;
      ////margin-right: 10px;
      cursor: pointer;
    }
  }
}

.edit-button {
  background: none;
  border: 1px solid #fff;
  color: #fff;
  padding: 5px 10px;
  cursor: pointer;
}
.edit-button:hover {
  background-color: #333;
}
.personal-info {
  padding: 24px 24px 48px;
  .personal-info-header{
    height: 30px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
    &-text{
      color: #FFF;
      font-feature-settings: 'dlig' on;
      font-family: "TT Norms Pro";
      font-size: 18px;
      font-style: normal;
      font-weight: 500;
    }
  }
  .personal-info-items{
    display: flex;
    gap: 90px;
    .info-item{
      div:nth-child(1){
        color: #B3B3B3;
        font-feature-settings: 'dlig' on;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        margin-bottom: 8px;
    }
      div:nth-child(2){
        color: #FFF;
        font-feature-settings: 'dlig' on;
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 23px; /* 143.75% */
      }
    }
  }
}
.info-item {
  margin-bottom: 10px;
}
.profile-actions {

  padding: 24px 24px 8px;
  .actions{
    display: flex;
    justify-content: flex-end;
    margin-top: 80px;
    gap: 16px;
  }

}
.delete-button {
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 12px;
  background: #760000;
  backdrop-filter: blur(25px);

}
.logout-button {
  border-radius: 12px;
  background: var(--Style, #E1FF01);
  backdrop-filter: blur(25px);  color: #000;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
}
</style>
