import { getUserInfo } from '@gptx/base/api/user';
import { removeToken, setToken, setTokenExpire } from '@gptx/base/utils/auth';
import defAva from '@/assets/logo/avatar-default.svg';

const useUserStore = defineStore('user', {
  state: () => ({
    nickName: '',
    avatar: '',
    email: '',
    uid: '',
    points: 0,
    referalCode: ''
  }),
  actions: {
    loginOthers(authUserInfo) {
      setToken(authUserInfo.accessToken);
      setTokenExpire(authUserInfo.stsTokenManager.expirationTime);
      console.log(authUserInfo, 'loginOthers');
      return Promise.resolve();
    },
    updateUserInfo(key, value) {
      this[key] = value;
    },
    logOut() {
      return new Promise((resolve) => {
        removeToken();
        localStorage.removeItem('user');
        localStorage.removeItem('humanVerified');
        resolve();
      });
    },
    async updateSysInfo() {
      try {
        const { code, data } = await getUserInfo();
        if (code === 200 && data) {
          const avatar = data.avatar === '' || data.avatar == null ? defAva : data.avatar;
          this.nickName = data.nickname; // 昵称
          this.avatar = avatar; // 头像
          this.uid = data.uid || '';
          this.email = data.email || '';
          this.points = data.points || 0;
          this.referalCode = data.referral_code || '';
          localStorage.setItem('user', JSON.stringify(data));
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
});

export default useUserStore;
