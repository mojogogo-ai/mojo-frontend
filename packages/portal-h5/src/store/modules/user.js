import { welcomeAccess } from '@gptx/base/api/login'
import { setToken, removeToken, setTokenExpire} from '@gptx/base/utils/auth'
import defAva from '@/assets/logo/avatar-default.svg'

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      nickName: '',
      avatar: '',
      email: '',
      phoneNumber: '',
    }),
    actions: {
      loginOthers(authUserInfo) {
        setToken(authUserInfo.accessToken)
        setTokenExpire(authUserInfo.stsTokenManager.expirationTime)
        console.log(authUserInfo,'loginOthers')
        return Promise.resolve()
      },
      updateUserInfo (key, value) {
        this[key] = value
      },
      logOut () {
        return new Promise((resolve) => {
          removeToken()
          localStorage.removeItem('user')
          localStorage.removeItem('humanVerified')
          resolve()
        })
      },
      updateSysInfo () {
          welcomeAccess().then((res) => {
              console.log(res,'res999')
              if (res.data && res.data.user_info) {
                const user = res.data.user_info
                const avatar = (user.photo_url === '' || user.photo_url == null) ? defAva : user.photo_url
                this.nickName = user.nick_name || user.nickname// 昵称
                this.avatar = avatar // 头像
                this.phoneNumber = user.phone_number || ''
                this.email = user.email || ''
                localStorage.setItem('user', JSON.stringify(res.data.user_info));
              }
            }
          ).catch((err) => {
            console.log(err,'err')
          });
      }
    }
  }
)

export default useUserStore
