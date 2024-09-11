import { welcomeAccess } from '@gptx/base/api/login';
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
    updateSysInfo() {
      welcomeAccess()
        .then((res) => {
          console.log(res, 'res999');
          if (res.data && res.data.user) {
            const user = res.data.user;
            const avatar = user.avatar === '' || user.avatar == null ? defAva : user.avatar;
            this.nickName = user.nickname; // 昵称
            this.avatar = avatar; // 头像
            this.uid = user.uid || ''
            this.email = user.email || '';
            this.points = user.points || 0;
            this.referalCode = user.referral_code || '';
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        })
        .catch((err) => {
          console.log(err, 'err');
        });
    }
  }
});

export default useUserStore;
