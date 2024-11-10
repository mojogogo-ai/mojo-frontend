<template>
  <div class="app-page">
    <page-header :title="t('menu.d')" />
    <div class="app-page-content">
      <div class="profile-settings">
        <div class="profile-header">
          <div class="profile-header-text">My Profile</div>
          <div class="profile-content">
            <van-image
              :src="user.avatar"
              fit="cover" shape="square"
              :size="103" alt="User Profile" class="profile-image"
            />
            <div class="user-info">
              <div class="flex justify-between">
                <div class="user-points">{{ user.points }} pts</div>
                <div class="user-info-btn" @click="editProfile">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2.50049 17.4995H17.5005" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.83374 14.1662V10.8328L14.1671 2.49951L17.5004 5.83285L9.16707 14.1662H5.83374Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M11.6672 4.99951L15.0006 8.33284" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
              <div class="">
                <div>
                  <div class="user-nickname">{{ user.username || '-' }}</div>
                  <div class="alias">@{{ user.nickname }}</div>
                </div>
                <div class="socials">
                  <div class="socials-text">Socials</div>
                  <div class="socials-icons">
                    <i class="fa fa-facebook" @click="openSocialLink(user.facebook_link)" >
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path d="M14.8333 8.83341C14.8333 5.15341 11.8467 2.16675 8.16667 2.16675C4.48667 2.16675 1.5 5.15341 1.5 8.83341C1.5 12.0601 3.79333 14.7467 6.83333 15.3667V10.8334H5.5V8.83341H6.83333V7.16675C6.83333 5.88008 7.88 4.83341 9.16667 4.83341H10.8333V6.83341H9.5C9.13333 6.83341 8.83333 7.13341 8.83333 7.50008V8.83341H10.8333V10.8334H8.83333V15.4667C12.2 15.1334 14.8333 12.2934 14.8333 8.83341Z" fill="white"/>
                      </svg>
                    </i>
                    <i class="fa fa-twitter" @click="openSocialLink(user.twitter_link)" >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                        <g clip-path="url(#clip0_897_102077)">
                          <mask id="mask0_897_102077" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="13" height="14">
                            <path d="M0.166504 0.833496H12.8332V13.5002H0.166504V0.833496Z" fill="white"/>
                          </mask>
                          <g mask="url(#mask0_897_102077)">
                            <path d="M10.1415 1.42725H12.084L7.84069 6.28944L12.8332 12.9069H8.9246L5.86107 8.89425L2.35965 12.9069H0.415313L4.9536 7.70448L0.166504 1.42815H4.1746L6.93955 5.09515L10.1415 1.42725ZM9.45841 11.7415H10.5351L3.5865 2.53196H2.43203L9.45841 11.7415Z" fill="white"/>
                          </g>
                        </g>
                        <defs>
                          <clipPath id="clip0_897_102077">
                            <rect width="12.6667" height="12.6667" fill="white" transform="translate(0.166504 0.833496)"/>
                          </clipPath>
                        </defs>
                      </svg>
                    </i>
                    <i class="fa fa-instagram" @click="openSocialLink(user.instagram_link)" >
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path d="M5.36667 2.16675H10.9667C13.1 2.16675 14.8333 3.90008 14.8333 6.03341V11.6334C14.8333 12.6589 14.426 13.6424 13.7008 14.3676C12.9757 15.0927 11.9922 15.5001 10.9667 15.5001H5.36667C3.23333 15.5001 1.5 13.7667 1.5 11.6334V6.03341C1.5 5.00791 1.90738 4.02441 2.63252 3.29927C3.35766 2.57413 4.34116 2.16675 5.36667 2.16675ZM5.23333 3.50008C4.59681 3.50008 3.98636 3.75294 3.53628 4.20303C3.08619 4.65311 2.83333 5.26356 2.83333 5.90008V11.7667C2.83333 13.0934 3.90667 14.1667 5.23333 14.1667H11.1C11.7365 14.1667 12.347 13.9139 12.7971 13.4638C13.2471 13.0137 13.5 12.4033 13.5 11.7667V5.90008C13.5 4.57341 12.4267 3.50008 11.1 3.50008H5.23333ZM11.6667 4.50008C11.8877 4.50008 12.0996 4.58788 12.2559 4.74416C12.4122 4.90044 12.5 5.1124 12.5 5.33341C12.5 5.55443 12.4122 5.76639 12.2559 5.92267C12.0996 6.07895 11.8877 6.16675 11.6667 6.16675C11.4457 6.16675 11.2337 6.07895 11.0774 5.92267C10.9211 5.76639 10.8333 5.55443 10.8333 5.33341C10.8333 5.1124 10.9211 4.90044 11.0774 4.74416C11.2337 4.58788 11.4457 4.50008 11.6667 4.50008ZM8.16667 5.50008C9.05072 5.50008 9.89857 5.85127 10.5237 6.47639C11.1488 7.10151 11.5 7.94936 11.5 8.83341C11.5 9.71747 11.1488 10.5653 10.5237 11.1904C9.89857 11.8156 9.05072 12.1667 8.16667 12.1667C7.28261 12.1667 6.43476 11.8156 5.80964 11.1904C5.18452 10.5653 4.83333 9.71747 4.83333 8.83341C4.83333 7.94936 5.18452 7.10151 5.80964 6.47639C6.43476 5.85127 7.28261 5.50008 8.16667 5.50008ZM8.16667 6.83341C7.63623 6.83341 7.12753 7.04413 6.75245 7.4192C6.37738 7.79427 6.16667 8.30298 6.16667 8.83341C6.16667 9.36385 6.37738 9.87256 6.75245 10.2476C7.12753 10.6227 7.63623 10.8334 8.16667 10.8334C8.6971 10.8334 9.20581 10.6227 9.58088 10.2476C9.95595 9.87256 10.1667 9.36385 10.1667 8.83341C10.1667 8.30298 9.95595 7.79427 9.58088 7.4192C9.20581 7.04413 8.6971 6.83341 8.16667 6.83341Z" fill="white"/>
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
            <div class="user-info-btn" @click="editPersonalInfo">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.50049 17.4995H17.5005" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.83374 14.1662V10.8328L14.1671 2.49951L17.5004 5.83285L9.16707 14.1662H5.83374Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M11.6672 4.99951L15.0006 8.33284" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
          <div class="personal-info-items">
            <div v-for="info in personalInfo" :key="info.label" class="info-item">
              <div>{{ info.label }}:</div>
              <div>{{ info.value }}</div>
            </div>
          </div>
        </div>
<!--        <div class="profile-divider" />-->
        <div class="profile-actions">
          <van-button type="danger" @click="deleteAccount">Delete Account</van-button>
          <van-button type="warning" @click="logout">{{ t('user.b') }}</van-button>
        </div>
      </div>
    </div>
    <EditPersonalInfo ref="editPersonalInfoRef" />
    <EditProfile ref="editProfileRef" />
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import useUserStore from '@/store/modules/user.js';
import { getAuth, signOut } from 'firebase/auth';
import { ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import EditPersonalInfo from './components/EditPersonalInfo';
import EditProfile from './components/EditProfile';
import { cancelUser } from '@gptx/base/api/user.js';
import { Dialog, showConfirmDialog } from 'vant';
import useLoginStore from '@/store/modules/login.js';

const router = useRouter();
const user = useUserStore();

const personalInfo = computed(() => [
  { label: 'Username', value: user.username || '-' },
  { label: 'Alias', value:  ('@' + user.nickname) || '' },
  { label: 'Email', value: user.email || '' },
]);

const openSocialLink = (link) => {
  window.open(link, '_blank');
};

const editPersonalInfoRef = ref(null);
const editProfileRef = ref(null);

const editProfile = () => {
  editProfileRef.value.open();
};

const editPersonalInfo = () => {
  editPersonalInfoRef.value.open();
};

const logout = async () => {
  const useLogin = useLoginStore();
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

const deleteAccount = () => {
  showConfirmDialog({
    title: 'Warning',
    message: 'Are you sure you want to delete your account?',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
  })
    .then(() => {
      cancelUser().then(() => {
        Dialog.alert({
          title: 'Success',
          message: 'Account deleted',
          confirmButtonText: 'OK',
        });
      }).catch(() => {
        Dialog.alert({
          title: 'Error',
          message: 'Failed to delete account',
          confirmButtonText: 'OK',
        });
      });
    })
    .catch(() => {});
};
</script>

<style scoped lang="scss">
.app-page-content {
  padding: 16px;
}
.profile-settings {
  color: #ffffff;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(50px);
}
.profile-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.10);
  margin: 28px 0;
}
.profile-header {
  //display: flex;
  //justify-content: space-between;
  //align-items: center;
  //padding: 10px 0;
}
.profile-header-text {
  color: #FFF;
  font-feature-settings: 'dlig' on;
  font-family: "TT Norms Pro";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 23px; /* 115% */
  margin-bottom: 20px;
}
.profile-content{
  display: flex;
  gap: 20px;
  .user-info{
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    .user-points{
      color: #E1FF01;
      font-feature-settings: 'dlig' on;
      font-family: Inter;
      font-size: 22px;
      font-style: normal;
      font-weight: 600;
      line-height: 19px; /* 86.364% */
    }
    .user-info-btn{
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      color: #ffffff;
      font-size: 20px;
    }
    .user-nickname{
      color: var(--Style, #E1FF01);
      font-feature-settings: 'dlig' on;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 23px; /* 143.75% */
    }
    .alias{
      color: rgba(255, 255, 255, 0.70);
      font-feature-settings: 'dlig' on;
      font-family: Inter;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: 19px; /* 146.154% */
    }
    .socials{
      display: flex;
      gap: 12px;
      .socials-text{
        color: #B3B3B3;
        font-feature-settings: 'dlig' on;
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 23px; /* 191.667% */
      }
      .socials-icons{
        display: flex;
        gap: 10px;
        i{
          cursor: pointer;
          font-size: 20px;
        }
      }
    }
  }
}
.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.user-nickname {
  font-size: 18px;
  font-weight: bold;
}
.socials-icons i {
  font-size: 20px;
  margin-right: 10px;
}
.personal-info-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 57px;
}
.profile-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 180px;
  :deep(.van-button) {
    width: 48%;
    &:first-child{
      border-radius: 12px;
      background: #760000;
      backdrop-filter: blur(25px);
      border-color: #760000;
      color: #FFF;
      font-feature-settings: 'dlig' on;
      font-family: "TT Norms Pro";
      font-size: 18px;
      font-style: normal;
      font-weight: 500;
      line-height: 23px; /* 127.778% */
    }
    &:last-child{
      border-radius: 12px;
      background: var(--Style, #E1FF01);
      backdrop-filter: blur(25px);
      border-color: #E1FF01;
      color: #000;
      font-feature-settings: 'dlig' on;
      font-family: "TT Norms Pro";
      font-size: 18px;
      font-style: normal;
      font-weight: 500;
      line-height: 23px; /* 127.778% */
    }
  }
}
.personal-info-header-text{
  color: #FFF;
  font-feature-settings: 'dlig' on;
  font-family: "TT Norms Pro";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 23px; /* 143.75% */
}
.personal-info-items{
  display: flex;
  flex-direction: column;
  gap:24px;
    .info-item{
    display: flex;
      flex-direction: column;
      gap:8px;
      div:first-child{
        color: #B3B3B3;
        font-feature-settings: 'dlig' on;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 23px; /* 164.286% */
      }
      div:last-child{
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
</style>

