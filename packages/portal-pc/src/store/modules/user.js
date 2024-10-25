import { getUserInfo } from '@gptx/base/api/user';
import { getIsLogin, removeToken, setToken, setTokenExpire } from '@gptx/base/utils/auth';
import defAva from '@/assets/logo/avatar-default.svg';

export const useUserStore = defineStore('user', {
  state: () => ({
    nickName: '',
    avatar: '',
    email: '',
    uid: '',
    points: 0,
    referalCode: '',
    isLoggedIn: false // 新增用于统一管理登录状态
  }),
  actions: {
    loginOthers(authUserInfo) {
      return new Promise((resolve, reject) => {
        try {
          setToken(authUserInfo.accessToken);
          setTokenExpire(authUserInfo.stsTokenManager.expirationTime);
          this.isLoggedIn = true; // 更新登录状态
          console.log(authUserInfo, 'loginOthers');
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    updateUserInfo(key, value) {
      this[key] = value;
    },
    logOut() {
      return new Promise((resolve) => {
        removeToken();
        localStorage.removeItem('user');
        localStorage.removeItem('humanVerified');
        this.$reset(); // 重置用户信息，清空状态
        resolve();
      });
    },
    async updateSysInfo() {
      try {
        const isLogin = await getIsLogin();
        this.isLoggedIn = isLogin; // 更新登录状态
        if (isLogin) {
          const { code, data } = await getUserInfo();
          if (code === 200 && data) {
            const avatar = data.avatar === '' || data.avatar == null ? defAva : data.avatar;
            this.nickName = data.nickname;
            this.avatar = avatar;
            this.uid = data.uid || '';
            this.email = data.email || '';
            this.points = data.points || 0;
            this.referalCode = data.referral_code || '';
            localStorage.setItem('user', JSON.stringify(data));
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
});

export default useUserStore;
